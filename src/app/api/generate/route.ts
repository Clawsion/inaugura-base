import { NextRequest } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import {
  ProjectSpecSchema,
  projectSpecToJsonSchema,
  type FormValues,
  type ProjectSpec,
} from "@/lib/schemas";
import { buildSystemPrompt } from "@/lib/prompts/system-prompt";
import { validarEAnalisarPaleta, type CorValidada } from "@/lib/color-utils";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const MAX_TENTATIVAS = 3;

/**
 * API route com STREAMING Server-Sent Events (SSE).
 * Usa text/event-stream (proxies respeitam melhor que x-ndjson).
 * Keepalive a cada 2s para manter a conexão ativa através de Caddy + space-z.ai.
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Helper: envia um evento SSE
      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      // Keepalive a cada 2s — previne timeout do gateway
      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          // stream closed
        }
      }, 2000);

      try {
        const input = (await req.json()) as FormValues;

        if (!input?.briefing || input.briefing.trim().length < 5) {
          send("error", { ok: false, error: "Briefing demasiado curto." });
          return;
        }

        send("progress", { message: "A analisar briefing..." });

        const systemPrompt = buildSystemPrompt(input);
        let lastError = "";

        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
          try {
            send("progress", { message: `Tentativa ${tentativa}/${MAX_TENTATIVAS}...` });

            const { arguments: argsJson, content } = await chamarModelo(
              systemPrompt,
              tentativa > 1 && lastError
                ? `Resposta anterior falhou. Erros:\n${lastError}`
                : undefined
            );

            let parsed: unknown;
            try {
              parsed = JSON.parse(argsJson);
            } catch {
              if (content) {
                const m = content.match(/\{[\s\S]*\}/);
                if (m) {
                  try { parsed = JSON.parse(m[0]); } catch { continue; }
                } else continue;
              } else continue;
            }

            const result = ProjectSpecSchema.safeParse(parsed);
            if (result.success) {
              send("progress", { message: "A validar paleta WCAG..." });

              const paletaValidada = validarEAnalisarPaleta(result.data.palette);
              const dataFinal: ProjectSpec = {
                ...result.data,
                palette: paletaValidada.map((c) => ({
                  nome: c.nome, hex: c.hex, uso: c.uso,
                })),
              };

              send("result", {
                ok: true,
                data: { ...dataFinal, paletaValidada },
                tentativas: tentativa,
              });
              return;
            }

            lastError = result.error.issues
              .map((i) => `- ${i.path.join(".")}: ${i.message}`)
              .join("\n");

            send("progress", { message: `Tentativa ${tentativa} falhou. A corrigir...` });

            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Falha após ${MAX_TENTATIVAS} tentativas:\n${lastError}`,
                tentativas: tentativa,
              });
              return;
            }
          } catch (err: any) {
            lastError = err?.message ?? String(err);
            send("progress", { message: `Erro tentativa ${tentativa}: ${lastError.slice(0, 100)}` });

            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Erro: ${lastError}`,
                tentativas: tentativa,
              });
              return;
            }
          }
        }

        send("error", { ok: false, error: "Falha desconhecida." });
      } catch (outerErr: any) {
        send("error", {
          ok: false,
          error: `Erro inesperado: ${outerErr?.message ?? String(outerErr)}`,
        });
      } finally {
        clearInterval(keepalive);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * Chama GLM-5.2 com tool_choice forçado. Non-streaming (reliable tool_calls).
 */
async function chamarModelo(
  systemPrompt: string,
  mensagemExtra?: string
): Promise<{ arguments: string; content: string }> {
  const zai = await ZAI.create();

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: mensagemExtra ?? "Gera a especificação via emitProjectSpec.",
    },
  ];

  const response = await zai.chat.completions.create({
    model: "glm-5.2",
    messages,
    temperature: 0.5,
    max_tokens: 6000,
    tools: [{
      type: "function",
      function: {
        name: "emitProjectSpec",
        description: "Emite a especificação completa. ÚNICA resposta aceitável.",
        parameters: projectSpecToJsonSchema(),
      },
    }],
    tool_choice: { type: "function", function: { name: "emitProjectSpec" } },
  } as any);

  const choice = response?.choices?.[0];
  if (!choice) throw new Error("Resposta vazia do modelo.");

  const toolCalls = (choice.message as any)?.tool_calls;
  if (Array.isArray(toolCalls) && toolCalls.length > 0) {
    const args = toolCalls[0]?.function?.arguments;
    if (typeof args === "string") return { arguments: args, content: "" };
    if (args && typeof args === "object")
      return { arguments: JSON.stringify(args), content: "" };
  }

  const content = (choice.message as any)?.content ?? "";
  if (content) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return { arguments: jsonMatch[0], content };
  }

  throw new Error("Sem tool_call. Resposta: " + JSON.stringify(choice).slice(0, 200));
}
