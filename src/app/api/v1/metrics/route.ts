import { NextResponse } from "next/server";
import { getMetrics, getLogs } from "@/lib/observability";

export const runtime = "nodejs";

/**
 * GET /api/v1/metrics — dashboard interno: métricas de geração (persistidas no DB)
 */
export async function GET() {
  const metrics = await getMetrics();
  return NextResponse.json({
    ok: true,
    metrics,
    logs: getLogs(30),
  });
}
