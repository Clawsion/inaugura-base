import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, revokeSession, clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = await getSessionToken();
    if (token) {
      await revokeSession(token);
    }
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "Erro interno no signout" }, { status: 500 });
  }
}
