// ============================================================================
// /api/health — Health check para Coolify/Docker
// ============================================================================
// Endpoint público (sem auth, sem rate limit) para orquestradores saberem
// se a app está pronta a receber tráfego.
// Retorna 200 se OK, 503 se houver problema com DB.
// ============================================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, { ok: boolean; latencyMs?: number; error?: string }> = {};

  // ── 1. DB health ──
  try {
    const start = Date.now();
    // Query simples para verificar conexão
    await db.$queryRaw`SELECT 1`;
    checks.database = { ok: true, latencyMs: Date.now() - start };
  } catch (err) {
    checks.database = {
      ok: false,
      error: err instanceof Error ? err.message.slice(0, 100) : "DB error",
    };
  }

  // ── 2. Verifica features opcionais ──
  checks.features = {
    ok: true,
  };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      ok: allOk,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
