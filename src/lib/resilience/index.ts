// ============================================================================
// resilience/index.ts — Multi-provider LLM com fallback automático
// ============================================================================
// Providers suportados (por ordem de prioridade):
//   1. Custom API (CUSTOM_API_BASE_URL + CUSTOM_API_KEY + CUSTOM_API_MODEL)
//   2. NVIDIA NIM (NVIDIA_API_KEY) — DeepSeek V4 Pro
//   3. Google Gemini (GEMINI_API_KEY) — Gemini 3.1 Flash
//   4. GLM-5.2 (Z.AI) — sempre disponível (hardcoded, grátis)
//
// Se nenhuma API key estiver configurada, usa apenas GLM-5.2.
// ============================================================================

export interface LLMCallOptions {
  systemPrompt: string;
  userPrompt: string;
  toolName: string;
  toolSchema: unknown;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface LLMCallResult {
  ok: boolean;
  pack?: unknown;
  raw?: string;
  error?: string;
  provider: string;
  model: string;
  attempts: number;
  latencyMs: number;
}

interface CircuitState {
  failures: number;
  lastFailure: number;
  open: boolean;
  openUntil: number;
}

const circuits = new Map<string, CircuitState>();
const CIRCUIT_THRESHOLD = 5;
const CIRCUIT_RESET_MS = 5 * 60 * 1000;

function getCircuit(provider: string): CircuitState {
  if (!circuits.has(provider)) {
    circuits.set(provider, { failures: 0, lastFailure: 0, open: false, openUntil: 0 });
  }
  return circuits.get(provider)!;
}

function isCircuitOpen(provider: string): boolean {
  const c = getCircuit(provider);
  if (!c.open) return false;
  if (Date.now() > c.openUntil) {
    c.open = false;
    c.failures = 0;
  }
  return c.open;
}

function recordFailure(provider: string) {
  const c = getCircuit(provider);
  c.failures++;
  c.lastFailure = Date.now();
  if (c.failures >= CIRCUIT_THRESHOLD) {
    c.open = true;
    c.openUntil = Date.now() + CIRCUIT_RESET_MS;
    console.error(`[CIRCUIT] Provider ${provider} OPEN até ${new Date(c.openUntil).toISOString()}`);
  }
}

function recordSuccess(provider: string) {
  const c = getCircuit(provider);
  c.failures = 0;
  c.open = false;
}

export function repairJson(input: string): unknown | null {
  if (!input || typeof input !== "string") return null;
  let s = input.trim();
  const firstBrace = s.indexOf("{");
  if (firstBrace > 0) s = s.slice(firstBrace);
  const lastBrace = s.lastIndexOf("}");
  if (lastBrace >= 0 && lastBrace < s.length - 1) s = s.slice(0, lastBrace + 1);
  try { return JSON.parse(s); } catch { /* */ }
  s = s.replace(/,(\s*[}\]])/g, "$1");
  try { return JSON.parse(s); } catch { /* */ }
  s = s.replace(/'/g, '"');
  try { return JSON.parse(s); } catch { /* */ }
  s = s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  try { return JSON.parse(s); } catch { /* */ }
  const match = s.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch { /* */ } }
  return null;
}

async function callWithRetry(
  fn: () => Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }>,
  maxAttempts: number
): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string; attempts: number }> {
  let lastError = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (result.ok) return { ...result, attempts: attempt };
      lastError = result.error ?? "Erro desconhecido";
    } catch (err: any) {
      lastError = err?.message ?? String(err);
    }
    if (attempt < maxAttempts) {
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return { ok: false, error: lastError, attempts: maxAttempts };
}

// ─── Helper: fazer chamada HTTP genérica (formato OpenAI) ─────────────────
async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  opts: LLMCallOptions,
  extraHeaders?: Record<string, string>
): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 120000);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      ...extraHeaders,
    };

    const body: Record<string, unknown> = {
      model,
      messages: [
        { role: "system", content: opts.systemPrompt },
        { role: "user", content: opts.userPrompt },
      ],
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.maxTokens ?? 12000,
      tools: [{ type: "function", function: { name: opts.toolName, description: "Emite o resultado. ÚNICA resposta aceitável.", parameters: opts.toolSchema } }],
      tool_choice: { type: "function", function: { name: opts.toolName } },
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errBody = await response.text();
      return { ok: false, error: `API ${response.status}: ${errBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    if (!choice) return { ok: false, error: "Resposta vazia" };

    // Tentar tool_calls primeiro
    const toolCalls = (choice.message as any)?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      const args = toolCalls[0]?.function?.arguments;
      if (typeof args === "string") {
        const repaired = repairJson(args);
        if (repaired) return { ok: true, pack: repaired, raw: args };
        return { ok: false, error: "JSON.parse falhou", raw: args.slice(0, 500) };
      }
    }

    // Fallback: tentar content
    const content = choice?.message?.content ?? "";
    if (content) {
      const repaired = repairJson(content);
      if (repaired) return { ok: true, pack: repaired, raw: content };
    }

    return { ok: false, error: "Sem JSON válido", raw: JSON.stringify(choice).slice(0, 300) };
  } catch (err: any) {
    if (err?.name === "AbortError") return { ok: false, error: "Timeout" };
    return { ok: false, error: `Erro: ${err?.message ?? String(err)}` };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── 1. GLM-5.2 (Z.AI) — SEMPRE disponível (hardcoded, grátis) ────────────
async function callGLM(opts: LLMCallOptions): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const HARDCODED_CONFIG = {
    baseUrl: "https://internal-api.z.ai/v1",
    apiKey: "Z.ai",
    chatId: "chat-ce9c7347-e84c-4f4b-a9e8-b9c6b1ee749c",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmRiNTg1NjAtMzU3OS00YjA3LWIzZmQtZWE0ZDIyNGE5OTRlIiwiY2hhdF9pZCI6ImNoYXQtY2U5YzczNDctZTg0Yy00ZjRiLWE5ZTgtYjljNmIxZWU3NDljIiwicGxhdGZvcm0iOiJ6YWkifQ.k_Bafyqz5CEeR87gpmucZDu0frYHKjroDopo1Eum0ZM",
    userId: "bdb58560-3579-4b07-b3fd-ea4d224a994e",
  };

  const configJson = process.env.ZAI_CONFIG;
  let zaiConfig = HARDCODED_CONFIG;
  if (configJson) {
    try { zaiConfig = JSON.parse(configJson); } catch { /* usa hardcoded */ }
  }

  const extraHeaders: Record<string, string> = { "X-Z-AI-From": "Z" };
  if (zaiConfig.chatId) extraHeaders["X-Chat-Id"] = zaiConfig.chatId;
  if (zaiConfig.userId) extraHeaders["X-User-Id"] = zaiConfig.userId;
  if (zaiConfig.token) extraHeaders["X-Token"] = zaiConfig.token;

  // GLM precisa de thinking: disabled no body
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 120000);

  try {
    const response = await fetch(`${zaiConfig.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${zaiConfig.apiKey}`,
        ...extraHeaders,
      },
      body: JSON.stringify({
        model: "glm-5.2",
        messages: [
          { role: "system", content: opts.systemPrompt },
          { role: "user", content: opts.userPrompt },
        ],
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 12000,
        tools: [{ type: "function", function: { name: opts.toolName, description: "Emite o resultado. ÚNICA resposta aceitável.", parameters: opts.toolSchema } }],
        tool_choice: { type: "function", function: { name: opts.toolName } },
        thinking: { type: "disabled" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errBody = await response.text();
      return { ok: false, error: `GLM API ${response.status}: ${errBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    if (!choice) return { ok: false, error: "GLM: resposta vazia" };

    const toolCalls = (choice.message as any)?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      const args = toolCalls[0]?.function?.arguments;
      if (typeof args === "string") {
        const repaired = repairJson(args);
        if (repaired) return { ok: true, pack: repaired, raw: args };
        return { ok: false, error: "GLM JSON parse falhou", raw: args.slice(0, 500) };
      }
    }

    const content = choice?.message?.content ?? "";
    if (content) {
      const repaired = repairJson(content);
      if (repaired) return { ok: true, pack: repaired, raw: content };
    }

    return { ok: false, error: "GLM sem JSON válido", raw: JSON.stringify(choice).slice(0, 300) };
  } catch (err: any) {
    if (err?.name === "AbortError") return { ok: false, error: "GLM timeout" };
    return { ok: false, error: `GLM erro: ${err?.message ?? String(err)}` };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── 2. NVIDIA NIM (DeepSeek V4 Pro) — se NVIDIA_API_KEY definida ─────────
async function callNVIDIA(opts: LLMCallOptions): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return { ok: false, error: "NVIDIA_API_KEY not set" };
  return callOpenAICompatible(
    "https://integrate.api.nvidia.com/v1",
    apiKey,
    process.env.NVIDIA_MODEL ?? "deepseek-ai/deepseek-v4-pro",
    opts
  );
}

// ─── 3. Google Gemini — se GEMINI_API_KEY definida ────────────────────────
async function callGemini(opts: LLMCallOptions): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, error: "GEMINI_API_KEY not set" };
  return callOpenAICompatible(
    "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey,
    process.env.GEMINI_MODEL ?? "gemini-3.1-flash",
    opts
  );
}

// ─── 4. Custom API — se CUSTOM_API_BASE_URL + CUSTOM_API_KEY definidas ────
async function callCustom(opts: LLMCallOptions): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const baseUrl = process.env.CUSTOM_API_BASE_URL;
  const apiKey = process.env.CUSTOM_API_KEY;
  if (!baseUrl || !apiKey) return { ok: false, error: "CUSTOM_API not set" };
  return callOpenAICompatible(
    baseUrl,
    apiKey,
    process.env.CUSTOM_API_MODEL ?? "deepseek-v4-pro",
    opts
  );
}

// ─── ORQUESTRADOR: tenta providers por ordem de prioridade ────────────────
export async function callCompilerWithFallback(opts: LLMCallOptions): Promise<LLMCallResult> {
  const startTime = Date.now();

  // Construir lista de providers ativos (na ordem de prioridade)
  const providers: { name: string; model: string; fn: () => Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> }[] = [];

  // 1. Custom API (prioridade mais alta — user pode configurar qualquer API)
  if (process.env.CUSTOM_API_BASE_URL && process.env.CUSTOM_API_KEY) {
    providers.push({
      name: "custom",
      model: process.env.CUSTOM_API_MODEL ?? "custom-model",
      fn: () => callCustom(opts),
    });
  }

  // 2. NVIDIA NIM (DeepSeek V4 Pro)
  if (process.env.NVIDIA_API_KEY) {
    providers.push({
      name: "nvidia",
      model: process.env.NVIDIA_MODEL ?? "deepseek-v4-pro",
      fn: () => callNVIDIA(opts),
    });
  }

  // 3. Google Gemini
  if (process.env.GEMINI_API_KEY) {
    providers.push({
      name: "gemini",
      model: process.env.GEMINI_MODEL ?? "gemini-3.1-flash",
      fn: () => callGemini(opts),
    });
  }

  // 4. GLM-5.2 (SEMPRE adicionado como último fallback — é grátis e hardcoded)
  providers.push({
    name: "glm",
    model: "glm-5.2",
    fn: () => callGLM(opts),
  });

  let totalAttempts = 0;
  for (const provider of providers) {
    if (isCircuitOpen(provider.name)) {
      console.warn(`[CIRCUIT] Provider ${provider.name} OPEN, saltando`);
      continue;
    }
    console.log(`[LLM] Tentando provider: ${provider.name} (${provider.model})`);
    const result = await callWithRetry(provider.fn, 2);
    totalAttempts += result.attempts;
    if (result.ok) {
      recordSuccess(provider.name);
      console.log(`[LLM] ✓ ${provider.name} sucesso em ${result.attempts} tentativa(s)`);
      return {
        ok: true,
        pack: result.pack,
        raw: result.raw,
        provider: provider.name,
        model: provider.model,
        attempts: totalAttempts,
        latencyMs: Date.now() - startTime,
      };
    }
    recordFailure(provider.name);
    console.warn(`[FALLBACK] ${provider.name} falhou: ${result.error}`);
  }

  return {
    ok: false,
    error: `Todos os providers falharam: ${providers.map(p => p.name).join(", ")}`,
    provider: "none",
    model: "none",
    attempts: totalAttempts,
    latencyMs: Date.now() - startTime,
  };
}
