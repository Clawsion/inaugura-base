import { NextRequest, NextResponse } from "next/server";
import { signUp, createSession, setSessionCookie } from "@/lib/auth";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rl = withRateLimit(req);
  if (rl) return rl;

  try {
    const { email, password, name } = await req.json() as { email: string; password: string; name?: string };
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email e password obrigatórios" }, { status: 400 });
    }
    const result = await signUp(email, password, name);
    if (!result.ok || !result.userId) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    const token = await createSession(result.userId);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, userId: result.userId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "Erro interno no signup" }, { status: 500 });
  }
}
