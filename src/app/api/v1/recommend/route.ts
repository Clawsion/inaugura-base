import { NextRequest, NextResponse } from "next/server";
import { GenerateInputSchema } from "@/lib/schema/inaugura-pack";
import { normalizeBrief, recommend } from "@/lib/router";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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
  return NextResponse.json({ ok: true, rec, norm });
}
