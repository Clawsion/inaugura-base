// ============================================================================
// providers/index.ts — Cliente LLM OpenAI-compatible (GLM-5.2 default)
// ============================================================================

import ZAI from "z-ai-web-dev-sdk";
import { inauguraPackToJsonSchema } from "@/lib/schema/inaugura-pack";

export interface CompileResult {
  ok: boolean;
  pack?: unknown;
  error?: string;
  raw?: string;
}

/**
 * Chama o spec_compiler (GLM-5.2 por defeito) com tool_choice forçado.
 * Non-streaming — o keepalive é gerido pela API route.
 */
export async function callSpecCompiler(
  systemPrompt: string,
  userPrompt: string
): Promise<CompileResult> {
  const zai = await ZAI.create();

  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  try {
    const response = await zai.chat.completions.create({
      model: "glm-5.2",
      messages,
      temperature: 0.2, // baixa = JSON estável
      max_tokens: 12000,
      tools: [
        {
          type: "function",
          function: {
            name: "emitInauguraPack",
            description:
              "Emite o InauguraPack completo. ÚNICA resposta aceitável. Não escrevas texto livre.",
            parameters: inauguraPackToJsonSchema(),
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "emitInauguraPack" } },
    } as any);

    const choice = response?.choices?.[0];
    if (!choice) {
      return { ok: false, error: "Resposta vazia do modelo." };
    }

    // Caminho A: tool_calls
    const toolCalls = (choice.message as any)?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      const args = toolCalls[0]?.function?.arguments;
      if (typeof args === "string") {
        try {
          const pack = JSON.parse(args);
          return { ok: true, pack, raw: args };
        } catch {
          return { ok: false, error: "JSON.parse falhou nos tool_call arguments", raw: args.slice(0, 500) };
        }
      }
      if (args && typeof args === "object") {
        return { ok: true, pack: args, raw: JSON.stringify(args) };
      }
    }

    // Caminho B: fallback — JSON em texto livre
    const content = (choice.message as any)?.content ?? "";
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const pack = JSON.parse(jsonMatch[0]);
          return { ok: true, pack, raw: content };
        } catch {
          return { ok: false, error: "JSON.parse falhou no content", raw: content.slice(0, 500) };
        }
      }
    }

    return {
      ok: false,
      error: "Modelo não emitiu tool call nem JSON válido.",
      raw: JSON.stringify(choice).slice(0, 500),
    };
  } catch (err: any) {
    return {
      ok: false,
      error: `Erro provider: ${err?.message ?? String(err)}`,
    };
  }
}
