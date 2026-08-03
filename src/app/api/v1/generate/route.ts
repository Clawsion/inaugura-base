import { NextRequest } from "next/server";
import { db as prisma } from "@/lib/db";
import {
  GenerateInputSchema,
  InauguraPackSchema,
  type GenerateInput,
  type InauguraPack,
} from "@/lib/schema/inaugura-pack";
import { normalizeBrief, recommend, validatePack } from "@/lib/router";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-engine";
import { callCompilerWithFallback, type LLMCallResult } from "@/lib/resilience";
import { inauguraPackToJsonSchema } from "@/lib/schema/inaugura-pack";
import {
  checkRateLimit,
  sanitizeBrief,
  checkIdempotency,
  generateIdempotencyKey,
  getClientIP,
} from "@/lib/security";
import { log, recordGenerationMetric } from "@/lib/observability";
import { CATALOG } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const MAX_TENTATIVAS = 3;

/**
 * POST /api/v1/generate
 * Pipeline robusto:
 *   rate limit → sanitize → idempotency → normalize → recommend →
 *   compile (GLM+fallback DeepSeek, retry, circuit breaker) →
 *   validate → persist DB → log metrics → return SSE
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const clientIP = getClientIP(req);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch { /* */ }
      }, 2000);

      try {
        // ── 1. Rate limiting ──
        const rl = checkRateLimit(clientIP);
        if (!rl.ok) {
          send("error", {
            ok: false,
            error: `Rate limit excedido. Tenta novamente em ${Math.ceil((rl.resetAt - Date.now()) / 1000)}s.`,
          });
          return;
        }
        log({ level: "info", step: "rate-limit", message: `IP ${clientIP} — ${rl.remaining} restantes` });

        // ── 2. Parse + validate input ──
        const rawInput = await req.json();
        const inputResult = GenerateInputSchema.safeParse(rawInput);
        if (!inputResult.success) {
          send("error", {
            ok: false,
            error: "Input inválido: " + inputResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
          });
          return;
        }
        const input = inputResult.data as GenerateInput;

        // ── 3. Sanitização do brief ──
        const sanitized = sanitizeBrief(input.brief);
        if (sanitized.rejected) {
          send("error", { ok: false, error: "Briefing demasiado curto (mínimo 20 caracteres)." });
          return;
        }
        input.brief = sanitized.clean;
        if (sanitized.warnings.length > 0) {
          log({ level: "warn", step: "sanitize", message: "Padrões suspeitos filtrados", data: { warnings: sanitized.warnings } });
        }

        // ── 4. Idempotency check ──
        const idemKey = generateIdempotencyKey(input);
        const idemCheck = checkIdempotency(idemKey);
        if (idemCheck.duplicate) {
          send("error", { ok: false, error: "Já existe uma geração em curso para este input. Aguarda." });
          return;
        }

        // ── 5. Normalize + Recommend ──
        send("progress", { step: "normalize", message: "A analisar briefing..." });
        const norm = normalizeBrief(input);

        send("progress", { step: "recommend", message: "A recomendar skills/MCPs/equipa..." });
        const rec = recommend(input);
        send("recommendation", { rec, norm });

        // ── 6. Build prompts ──
        const systemPrompt = buildSystemPrompt(input.locale);
        const userPrompt = buildUserPrompt(input, rec, norm);

        // ── 7. Criar Project + Pack placeholder no DB (associado ao user se logado) ──
        const currentUser = await getCurrentUser();
        const project = await prisma.project.create({
          data: {
            title: input.brief.slice(0, 60),
            brief: input.brief,
            projectType: input.project_type,
            level: input.level,
            mode: rec.mode,
            status: "generating",
            inputJson: JSON.stringify(input),
            userId: currentUser?.id ?? null,
          },
        });

        send("progress", { step: "compile", message: "A chamar spec_compiler (GLM-5.2 + fallback DeepSeek)..." });

        // ── 8. Compile com retry + fallback ──
        let lastError = "";
        let validatedPack: InauguraPack | null = null;
        let compileResult: LLMCallResult | null = null;

        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
          send("progress", { step: "compile", message: `Tentativa ${tentativa}/${MAX_TENTATIVAS}...` });

          const extraMsg = tentativa > 1 && lastError
            ? `\n\nNOTA: A tua resposta anterior falhou validação. Erros:\n${lastError}\nCorrige e re-emite.`
            : "";

          compileResult = await callCompilerWithFallback({
            systemPrompt,
            userPrompt: userPrompt + extraMsg,
            toolName: "emitInauguraPack",
            toolSchema: inauguraPackToJsonSchema(),
            temperature: 0.2,
            maxTokens: 12000,
            timeoutMs: 90000,
          });

          if (!compileResult.ok) {
            lastError = compileResult.error ?? "Erro desconhecido";
            log({ level: "warn", step: "compile", message: `Tentativa ${tentativa} falhou`, data: { provider: compileResult.provider, error: lastError } });

            // Log no DB
            await prisma.generationLog.create({
              data: {
                packId: "pending",
                step: "compile",
                provider: compileResult.provider,
                model: compileResult.model,
                latencyMs: compileResult.latencyMs,
                status: "failed",
                errorMessage: lastError,
                retryCount: tentativa,
              },
            }).catch(() => {}); // não bloqueia se falhar

            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Compiler falhou após ${MAX_TENTATIVAS} tentativas: ${lastError}`,
              });
              recordGenerationMetric({
                provider: compileResult.provider,
                model: compileResult.model,
                success: false,
                latencyMs: compileResult.latencyMs,
                validateOk: false,
                attempts: tentativa,
              });
              return;
            }
            continue;
          }

          // ── 9. Validate (código) ──
          send("progress", { step: "validate", message: "A validar pack (IDs, schema, limites)..." });
          const validation = validatePack(compileResult.pack, rec);

          if (!validation.ok) {
            lastError = validation.errors.join("\n");
            log({ level: "warn", step: "validate", message: `Validação falhou (tentativa ${tentativa})`, data: { errors: validation.errors } });
            if (tentativa === MAX_TENTATIVAS) {
              send("error", {
                ok: false,
                error: `Validação falhou após ${MAX_TENTATIVAS} tentativas:\n${lastError}`,
              });
              recordGenerationMetric({
                provider: compileResult.provider,
                model: compileResult.model,
                success: false,
                latencyMs: compileResult.latencyMs,
                validateOk: false,
                attempts: tentativa,
              });
              return;
            }
            continue;
          }

          // ── 10. Zod validation ──
          const zodResult = InauguraPackSchema.safeParse(compileResult.pack);
          if (!zodResult.success) {
            lastError = zodResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
            log({ level: "warn", step: "validate", message: `Schema falhou (tentativa ${tentativa})` });
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
          // Adiciona versionamento
          validatedPack.meta.catalog_version = CATALOG.version;
          validatedPack.meta.schema_version = "1.0.0";
          validatedPack.meta.compiler_model = compileResult.model;
          break;
        }

        if (!validatedPack || !compileResult) {
          send("error", { ok: false, error: "Pack não foi gerado." });
          return;
        }

        // ── 11. Persist no DB ──
        const pack = await prisma.pack.create({
          data: {
            projectId: project.id,
            packJson: JSON.stringify(validatedPack),
            catalogVersion: CATALOG.version,
            schemaVersion: "1.0.0",
            compilerModel: compileResult.model,
            compilerProvider: compileResult.provider,
            attempts: compileResult.attempts,
            latencyMs: compileResult.latencyMs,
          },
        });

        // Atualiza project status
        await prisma.project.update({
          where: { id: project.id },
          data: { status: "generated", title: validatedPack.meta.title },
        });

        // ── 12. Criar PromptExecutionState para cada prompt ──
        const prompts = validatedPack.prompts.individual ?? validatedPack.prompts.team ?? [];
        for (let i = 0; i < prompts.length; i++) {
          const p = prompts[i] as any;
          await prisma.promptExecutionState.create({
            data: {
              projectId: project.id,
              packId: pack.id,
              stepId: p.slot ?? p.function_id ?? `step-${i}`,
              stepIndex: i,
              status: "todo",
            },
          });
        }

        // ── 13. Log de métricas ──
        await prisma.generationLog.create({
          data: {
            packId: pack.id,
            step: "complete",
            provider: compileResult.provider,
            model: compileResult.model,
            latencyMs: compileResult.latencyMs,
            status: "success",
            retryCount: compileResult.attempts,
          },
        });

        recordGenerationMetric({
          provider: compileResult.provider,
          model: compileResult.model,
          success: true,
          latencyMs: compileResult.latencyMs,
          validateOk: true,
          attempts: compileResult.attempts,
        });

        log({ level: "info", step: "complete", message: `Pack gerado`, data: {
          projectId: project.id,
          packId: pack.id,
          provider: compileResult.provider,
          model: compileResult.model,
          latencyMs: compileResult.latencyMs,
          attempts: compileResult.attempts,
        }});

        // ── 14. Return success com projectId + packId ──
        send("result", {
          ok: true,
          pack: validatedPack,
          rec,
          projectId: project.id,
          packId: pack.id,
          tentativas: compileResult.attempts,
          provider: compileResult.provider,
          model: compileResult.model,
          latencyMs: compileResult.latencyMs,
        });
      } catch (outerErr: any) {
        log({ level: "error", step: "generate", message: `Erro inesperado: ${outerErr?.message ?? String(outerErr)}` });
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
