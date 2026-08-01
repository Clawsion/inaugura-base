// ============================================================================
// resilience/index.ts — Retry, fallback, circuit breaker, json-repair
// ============================================================================

import ZAI from "z-ai-web-dev-sdk";

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
    return false;
  }
  return true;
}

function recordSuccess(provider: string) {
  const c = getCircuit(provider);
  c.failures = 0;
  c.open = false;
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

async function callGLM(opts: LLMCallOptions): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const zai = await ZAI.create();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 90000);
  try {
    const response = await zai.chat.completions.create({
      model: "glm-5.2",
      messages: [
        { role: "system", content: opts.systemPrompt },
        { role: "user", content: opts.userPrompt },
      ],
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.maxTokens ?? 12000,
      tools: [{ type: "function", function: { name: opts.toolName, description: "Emite o resultado. ÚNICA resposta aceitável.", parameters: opts.toolSchema } }],
      tool_choice: { type: "function", function: { name: opts.toolName } },
    } as any);
    const choice = response?.choices?.[0];
    if (!choice) return { ok: false, error: "Resposta vazia do GLM-5.2" };
    const toolCalls = (choice.message as any)?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      const args = toolCalls[0]?.function?.arguments;
      if (typeof args === "string") {
        const repaired = repairJson(args);
        if (repaired) return { ok: true, pack: repaired, raw: args };
        return { ok: false, error: "JSON.parse falhou (GLM)", raw: args.slice(0, 500) };
      }
      if (args && typeof args === "object") return { ok: true, pack: args, raw: JSON.stringify(args) };
    }
    const content = (choice.message as any)?.content ?? "";
    if (content) {
      const repaired = repairJson(content);
      if (repaired) return { ok: true, pack: repaired, raw: content };
    }
    return { ok: false, error: "GLM não emitiu JSON válido", raw: JSON.stringify(choice).slice(0, 300) };
  } catch (err: any) {
    if (err?.name === "AbortError") return { ok: false, error: "GLM timeout (90s)" };
    return { ok: false, error: `GLM erro: ${err?.message ?? String(err)}` };
  } finally {
    clearTimeout(timeout);
  }
}

async function callDeepSeek(opts: LLMCallOptions): Promise<{ ok: boolean; pack?: unknown; raw?: string; error?: string }> {
  const baseUrl = process.env.SPEC_COMPILER_FALLBACK_BASE_URL;
  const apiKey = process.env.SPEC_COMPILER_FALLBACK_API_KEY;
  const model = process.env.SPEC_COMPILER_FALLBACK_MODEL ?? "deepseek-v4-pro";
  if (!baseUrl || !apiKey) return { ok: false, error: "DeepSeek fallback não configurado" };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 90000);
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: opts.systemPrompt }, { role: "user", content: opts.userPrompt }],
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 12000,
        tools: [{ type: "function", function: { name: opts.toolName, description: "Emite o resultado.", parameters: opts.toolSchema } }],
        tool_choice: { type: "function", function: { name: opts.toolName } },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const errBody = await response.text();
      return { ok: false, error: `DeepSeek HTTP ${response.status}: ${errBody.slice(0, 200)}` };
    }
    const data = await response.json();
    const choice = data?.choices?.[0];
    if (!choice) return { ok: false, error: "DeepSeek: resposta vazia" };
    const toolCalls = choice?.message?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      const args = toolCalls[0]?.function?.arguments;
      if (typeof args === "string") {
        const repaired = repairJson(args);
        if (repaired) return { ok: true, pack: repaired, raw: args };
        return { ok: false, error: "DeepSeek JSON parse falhou", raw: args.slice(0, 500) };
      }
    }
    const content = choice?.message?.content ?? "";
    if (content) {
      const repaired = repairJson(content);
      if (repaired) return { ok: true, pack: repaired, raw: content };
    }
    return { ok: false, error: "DeepSeek não emitiu JSON válido", raw: JSON.stringify(choice).slice(0, 300) };
  } catch (err: any) {
    if (err?.name === "AbortError") return { ok: false, error: "DeepSeek timeout (90s)" };
    return { ok: false, error: `DeepSeek erro: ${err?.message ?? String(err)}` };
  } finally {
    clearTimeout(timeout);
  }
}

export async function callCompilerWithFallback(opts: LLMCallOptions): Promise<LLMCallResult> {
  const startTime = Date.now();
  const providers = [
    { name: "glm", model: "glm-5.2", fn: () => callGLM(opts) },
    { name: "deepseek", model: process.env.SPEC_COMPILER_FALLBACK_MODEL ?? "deepseek-v4-pro", fn: () => callDeepSeek(opts) },
  ];
  let totalAttempts = 0;
  for (const provider of providers) {
    if (isCircuitOpen(provider.name)) {
      console.warn(`[CIRCUIT] Provider ${provider.name} OPEN, saltando`);
      continue;
    }
    const result = await callWithRetry(provider.fn, 2);
    totalAttempts += result.attempts;
    if (result.ok) {
      recordSuccess(provider.name);
      return { ok: true, pack: result.pack, raw: result.raw, provider: provider.name, model: provider.model, attempts: totalAttempts, latencyMs: Date.now() - startTime };
    }
    recordFailure(provider.name);
    console.warn(`[FALLBACK] ${provider.name} falhou: ${result.error}`);
  }
  return { ok: false, error: "Todos os providers falharam (GLM + DeepSeek)", provider: "none", model: "none", attempts: totalAttempts, latencyMs: Date.now() - startTime };
}
