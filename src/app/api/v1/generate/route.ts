import { NextRequest } from "next/server";
import {
  GenerateInputSchema,
  InauguraPackSchema,
  type GenerateInput,
  type InauguraPack,
} from "@/lib/schema/inaugura-pack";
import { normalizeBrief, recommend, validatePack } from "@/lib/router";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-engine";
import { callSpecCompiler } from "@/lib/providers";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const MAX_TENTATIVAS = 3;

/**
 * POST /api/v1/generate
 * Orquestra: normalize → recommend → buildPrompt → compile → validate → return
 * Usa SSE (text/event-stream) com keepalive a cada 2s para manter conexão ativa.
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          // stream closed
        }
      }, 2000);

      try {
        const rawInput = await req.json();

        // 1. Valida input com Zod
        const inputResult = GenerateInputSchema.safeParse(rawInput);
        if (!inputResult.success) {
          send("error", {
            ok: false,
            error: "Input inválido: " + inputResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
          });
          return;
        }
        const input = inputResult.data as GenerateInput;

        send("progress", { step: "normalize", message: "A analisar briefing..." });

        // 2. Normalize brief
        const norm = normalizeBrief(input);

        // 3. Recommend (router determinístico)
        send("progress", { step: "recommend", message: "A recomendar skills/MCPs/secções..." });
        const rec = recommend(input);

        send("recommendation", { rec, norm });

        // 4. Build prompts
        send("progress", { step: "compile", message: "A chamar spec_compiler (GLM-5.2)..." });
        const systemPrompt = buildSystemPrompt(input.locale);
        const userPrompt = buildUserPrompt(input, rec, norm);

        // 5. Compile (LLM) com retries
        let lastError = "";
        let validatedPack: InauguraPack | null = null;

        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
          send("progress", {
            step: "compile",
            message: `Tentativa ${tentativa}/${MAX_TENTATIVAS} — a gerar InauguraPack...`,
          });

          const extraMsg = tentativa > 1 && lastError
            ? `\n\nNOTA: A tua resposta anterior falhou validação. Erros:\n${lastError}\nCorrige e re-emite.`
            : "";

          const result = await callSpecCompiler(systemPrompt, userPrompt + extraMsg);

          if (!result.ok) {
            lastError = result.error ?? "Erro desconhecido";
            send("progress", { step: "compile", message: `Tentativa ${tentativa} falhou: ${lastError.slice(0, 100)}` });
            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Compiler falhou após ${MAX_TENTATIVAS} tentativas: ${lastError}`,
              });
              return;
            }
            continue;
          }

          // 6. Validate (código)
          send("progress", { step: "validate", message: "A validar pack..." });
          const validation = validatePack(result.pack, rec);

          if (!validation.ok) {
            lastError = validation.errors.join("\n");
            send("progress", {
              step: "validate",
              message: `Validação falhou (tentativa ${tentativa}). ${validation.errors.length} erros.`,
            });
            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Validação falhou após ${MAX_TENTATIVAS} tentativas:\n${lastError}`,
              });
              return;
            }
            continue;
          }

          // Valida com Zod (schema completo)
          const zodResult = InauguraPackSchema.safeParse(result.pack);
          if (!zodResult.success) {
            lastError = zodResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
            send("progress", { step: "validate", message: `Schema falhou (tentativa ${tentativa})` });
            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Schema inválido após ${MAX_TENTATIVAS} tentativas:\n${lastError}`,
              });
              return;
            }
            continue;
          }

          validatedPack = zodResult.data;
          break;
        }

        if (!validatedPack) {
          send("error", { ok: false, error: "Pack não foi gerado." });
          return;
        }

        // 7. Return success
        send("result", {
          ok: true,
          pack: validatedPack,
          rec,
          tentativas: MAX_TENTATIVAS,
        });
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
    },
  });
}
