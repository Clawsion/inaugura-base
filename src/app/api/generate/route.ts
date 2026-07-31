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
export const maxDuration = 300; // 5 minutes max

const MAX_TENTATIVAS = 3;

/**
 * API route com STREAMING — mantém a conexão viva enviando keepalive chunks
 * enquanto o GLM-5.2 processa. Isto previne "NetworkError" quando o gateway
 * (space-z.ai → Alibaba FC) corta conexões idle após ~60s.
 *
 * Fluxo:
 *  1. Recebe FormValues via POST body.
 *  2. Envia "keepalive" chunks (":\n\n") a cada 5s para manter a conexão.
 *  3. Chama GLM-5.2 com streaming nativo.
 *  4. Acumula os tool_call arguments.
 *  5. Valida com Zod. Se falhar, tenta novamente (até 3x).
 *  6. Envia o resultado final como JSON no stream.
 *  7. Cliente faz parse do último chunk JSON.
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      const keepalive = setInterval(() => {
        controller.enqueue(encoder.encode(":\n\n")); // SSE-style keepalive
      }, 5000);

      try {
        const input = (await req.json()) as FormValues;

        // Validação inicial
        if (!input || typeof input !== "object") {
          send({ ok: false, error: "Input inválido." });
          return;
        }

        if (!input.briefing || input.briefing.trim().length < 5) {
          send({
            ok: false,
            error: "Briefing demasiado curto. Escreve pelo menos uma frase.",
          });
          return;
        }

        send({ status: "processing", message: "A analisar briefing..." });

        const systemPrompt = buildSystemPrompt(input);
        let lastError = "";

        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
          try {
            send({
              status: "processing",
              message: `Tentativa ${tentativa}/${MAX_TENTATIVAS} — a chamar GLM-5.2...`,
            });

            const { arguments: argsJson, content } = await chamarModelo(
              systemPrompt,
              tentativa > 1 && lastError
                ? `A tua resposta anterior falhou validação. Corrige. Erros:\n${lastError}`
                : undefined
            );

            // Tenta fazer parse do JSON
            let parsed: unknown;
            try {
              parsed = JSON.parse(argsJson);
            } catch {
              if (content) {
                const m = content.match(/\{[\s\S]*\}/);
                if (m) {
                  try {
                    parsed = JSON.parse(m[0]);
                  } catch {
                    continue;
                  }
                } else continue;
              } else continue;
            }

            // Valida com Zod
            const result = ProjectSpecSchema.safeParse(parsed);
            if (result.success) {
              send({ status: "processing", message: "A validar paleta WCAG..." });

              const paletaValidada = validarEAnalisarPaleta(result.data.palette);
              const dataFinal: ProjectSpec = {
                ...result.data,
                palette: paletaValidada.map((c) => ({
                  nome: c.nome,
                  hex: c.hex,
                  uso: c.uso,
                })),
              };

              // Envia o resultado final
              send({
                ok: true,
                data: { ...dataFinal, paletaValidada },
                tentativas: tentativa,
              });
              return;
            }

            // Zod falhou
            lastError = result.error.issues
              .map((i) => `- ${i.path.join(".")}: ${i.message}`)
              .join("\n");

            send({
              status: "retrying",
              message: `Tentativa ${tentativa} falhou validação. A corrigir...`,
            });

            if (tentativa === MAX_TENTATIVAS) {
              send({
                ok: false,
                error: `Falha na validação após ${MAX_TENTATIVAS} tentativas:\n${lastError}`,
                tentativas: tentativa,
              });
              return;
            }
          } catch (err: any) {
            lastError = err?.message ?? String(err);
            send({
              status: "error",
              message: `Erro na tentativa ${tentativa}: ${lastError}`,
            });

            if (tentativa === MAX_TENTATIVAS) {
              send({
                ok: false,
                error: `Erro na geração: ${lastError}`,
                tentativas: tentativa,
              });
              return;
            }
          }
        }

        send({ ok: false, error: "Falha desconhecida.", tentativas: MAX_TENTATIVAS });
      } catch (outerErr: any) {
        send({
          ok: false,
          error: `Erro inesperado: ${outerErr?.message ?? String(outerErr)}`,
          tentativas: 0,
        });
      } finally {
        clearInterval(keepalive);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disable nginx buffering
    },
  });
}

/**
 * Helper: chama o GLM-5.2 (non-streaming, com tool_choice forçado).
 * O keepalive é enviado pela rota enquanto esta chamada decorre.
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
      content:
        mensagemExtra ??
        "Gera a especificação completa do projeto usando a tool emitProjectSpec.",
    },
  ];

  // Non-streaming: GLM-5.2 com tool_choice forçado retorna tool_calls no response final.
  // O keepalive é gerido pela rota (setInterval) que envia ":" a cada 5s.
  const response = await zai.chat.completions.create({
    model: "glm-5.2",
    messages,
    temperature: 0.6,
    max_tokens: 8000,
    tools: [
      {
        type: "function",
        function: {
          name: "emitProjectSpec",
          description:
            "Emite a especificação completa do projeto. ÚNICA forma aceitável de resposta.",
          parameters: projectSpecToJsonSchema(),
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "emitProjectSpec" } },
  } as any);

  const choice = response?.choices?.[0];
  if (!choice) {
    throw new Error("Resposta vazia do modelo.");
  }

  // Caminho A: tool_calls presente
  const toolCalls = (choice.message as any)?.tool_calls;
  if (Array.isArray(toolCalls) && toolCalls.length > 0) {
    const args = toolCalls[0]?.function?.arguments;
    if (typeof args === "string") {
      return { arguments: args, content: "" };
    }
    if (args && typeof args === "object") {
      return { arguments: JSON.stringify(args), content: "" };
    }
  }

  // Caminho B: fallback — JSON em texto livre
  const content = (choice.message as any)?.content ?? "";
  if (content) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { arguments: jsonMatch[0], content };
    }
  }

  throw new Error(
    "O modelo não emitiu uma tool call. Resposta: " +
      JSON.stringify(choice).slice(0, 300)
  );
}
