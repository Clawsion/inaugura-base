import { NextRequest, NextResponse } from "next/server";
import { InauguraPackSchema, type Recommendation } from "@/lib/schema/inaugura-pack";
import { validatePack } from "@/lib/router";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Rate limit
  const rl = withRateLimit(req);
  if (rl) return rl;

  const { pack, rec } = await req.json() as { pack: unknown; rec: Recommendation };

  // Validação estrutural (código)
  const structValidation = validatePack(pack, rec);
  if (!structValidation.ok) {
    return NextResponse.json({ ok: false, errors: structValidation.errors }, { status: 400 });
  }

  // Validação de schema (Zod)
  const zodResult = InauguraPackSchema.safeParse(pack);
  if (!zodResult.success) {
    return NextResponse.json({ ok: false, errors: zodResult.error.issues }, { status: 400 });
  }

  return NextResponse.json({ ok: true, pack: zodResult.data });
}
