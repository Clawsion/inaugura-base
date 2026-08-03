import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-engine";
import { callCompilerWithFallback } from "@/lib/resilience";
import { GenerateInputSchema } from "@/lib/schema/inaugura-pack";
import { inauguraPackToJsonSchema } from "@/lib/schema/inaugura-pack";
import { normalizeBrief, recommend } from "@/lib/router";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  // Rate limit
  const rl = await withRateLimit(req);
  if (rl) return rl;

  const raw = await req.json();
  const result = GenerateInputSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json({ ok: false, error: result.error.issues }, { status: 400 });
  }

  const input = result.data;
  const norm = normalizeBrief(input);
  const rec = recommend(input);

  const systemPrompt = buildSystemPrompt(input.locale);
  const userPrompt = buildUserPrompt(input, rec, norm);

  // Usa o resilience layer (GLM→DeepSeek fallback, retry, circuit breaker)
  const compileResult = await callCompilerWithFallback({
    systemPrompt,
    userPrompt,
    toolName: "emitInauguraPack",
    toolSchema: inauguraPackToJsonSchema(),
    temperature: 0.2,
    maxTokens: 12000,
  });
  if (!compileResult.ok) {
    return NextResponse.json({ ok: false, error: compileResult.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, pack: compileResult.pack, rec });
}
