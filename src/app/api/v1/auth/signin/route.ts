import { NextRequest, NextResponse } from "next/server";
import { signIn, setSessionCookie } from "@/lib/auth";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rl = withRateLimit(req);
  if (rl) return rl;

  try {
    const { email, password } = await req.json() as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email e password obrigatórios" }, { status: 400 });
    }
    const result = await signIn(email, password);
    if (!result.ok || !result.token) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 401 });
    }
    await setSessionCookie(result.token);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "Erro interno no signin" }, { status: 500 });
  }
}
