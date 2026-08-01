import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-engine";
import { callSpecCompiler } from "@/lib/providers";
import { GenerateInputSchema } from "@/lib/schema/inaugura-pack";
import { normalizeBrief, recommend } from "@/lib/router";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
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

  const compileResult = await callSpecCompiler(systemPrompt, userPrompt);
  if (!compileResult.ok) {
    return NextResponse.json({ ok: false, error: compileResult.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, pack: compileResult.pack, rec });
}
