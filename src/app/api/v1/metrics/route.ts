import { NextResponse } from "next/server";
import { getMetrics, getLogs } from "@/lib/observability";

export const runtime = "nodejs";

/**
 * GET /api/v1/metrics — dashboard interno: métricas de geração
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    metrics: getMetrics(),
    logs: getLogs(30),
  });
}
