// ============================================================================
// observability/index.ts — Logging estruturado + métricas com persistência DB
// ============================================================================
// Logs em memória (buffer circular) para debug rápido.
// Métricas persistidas no DB (GenerationLog) via Prisma — sobrevivem a restarts.
// getMetrics() lê do DB, não do buffer — fonte única de verdade.
// ============================================================================

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  step: string;
  message: string;
  data?: Record<string, unknown>;
}

const logBuffer: LogEntry[] = [];
const MAX_BUFFER = 1000;

export function log(entry: Omit<LogEntry, "timestamp">) {
  const fullEntry: LogEntry = { ...entry, timestamp: new Date().toISOString() };
  logBuffer.push(fullEntry);
  if (logBuffer.length > MAX_BUFFER) logBuffer.shift();
  // Logs estruturados em JSON para fácil parsing (jq, Datadog, etc.)
  // em vez de ANSI colors que só funcionam em TTY
  const logLine = JSON.stringify({
    ts: fullEntry.timestamp,
    level: entry.level,
    step: entry.step,
    msg: entry.message,
    ...(entry.data ? { data: entry.data } : {}),
  });
  if (entry.level === "error") {
    console.error(logLine);
  } else if (entry.level === "warn") {
    console.warn(logLine);
  } else {
    console.log(logLine);
  }
}

export function getLogs(limit = 50): LogEntry[] {
  return logBuffer.slice(-limit).reverse();
}

export interface GenerationMetrics {
  total: number;
  success: number;
  failed: number;
  successRate: number;
  avgLatencyMs: number;
  byProvider: Record<string, { count: number; success: number; avgLatencyMs: number }>;
  validateFailRate: number;
  source: "db" | "memory";
}

// Buffer para fallback quando DB não está disponível
const metricsBuffer: Array<{
  provider: string; model: string; success: boolean; latencyMs: number; validateOk: boolean; attempts: number;
}> = [];

export function recordGenerationMetric(m: {
  provider: string; model: string; success: boolean; latencyMs: number; validateOk: boolean; attempts: number;
}) {
  metricsBuffer.push(m);
  if (metricsBuffer.length > 500) metricsBuffer.shift();
}

// getMetrics lê do DB (fonte única de verdade) com fallback para memória
export async function getMetrics(): Promise<GenerationMetrics> {
  try {
    // Import dinâmico para evitar circular dependency no boot
    const { db } = await import("@/lib/db");
    const logs = await db.generationLog.findMany({
      take: 500,
      orderBy: { createdAt: "desc" },
    });

    if (logs.length === 0) {
      return computeMetricsFromBuffer();
    }

    const total = logs.length;
    const success = logs.filter((l) => l.status === "success").length;
    const failed = total - success;
    const latencies = logs.filter((l) => l.latencyMs != null).map((l) => l.latencyMs as number);
    const avgLatency = latencies.length > 0 ? latencies.reduce((s, l) => s + l, 0) / latencies.length : 0;
    const validateFails = logs.filter((l) => l.status === "failed" && (l.errorMessage ?? "").includes("R9") || (l.errorMessage ?? "").includes("não existe")).length;

    const byProvider: GenerationMetrics["byProvider"] = {};
    for (const l of logs) {
      const provider = l.provider ?? "unknown";
      if (!byProvider[provider]) byProvider[provider] = { count: 0, success: 0, avgLatencyMs: 0 };
      byProvider[provider].count++;
      if (l.status === "success") byProvider[provider].success++;
      const lat = l.latencyMs ?? 0;
      byProvider[provider].avgLatencyMs =
        (byProvider[provider].avgLatencyMs * (byProvider[provider].count - 1) + lat) / byProvider[provider].count;
    }

    return {
      total, success, failed,
      successRate: (success / total) * 100,
      avgLatencyMs: Math.round(avgLatency),
      byProvider,
      validateFailRate: (validateFails / total) * 100,
      source: "db",
    };
  } catch {
    // Fallback para buffer em memória (DB indisponível)
    return computeMetricsFromBuffer();
  }
}

function computeMetricsFromBuffer(): GenerationMetrics {
  const total = metricsBuffer.length;
  if (total === 0) {
    return { total: 0, success: 0, failed: 0, successRate: 0, avgLatencyMs: 0, byProvider: {}, validateFailRate: 0, source: "memory" };
  }
  const success = metricsBuffer.filter((m) => m.success).length;
  const failed = total - success;
  const avgLatency = metricsBuffer.reduce((s, m) => s + m.latencyMs, 0) / total;
  const validateFails = metricsBuffer.filter((m) => !m.validateOk).length;
  const byProvider: GenerationMetrics["byProvider"] = {};
  for (const m of metricsBuffer) {
    if (!byProvider[m.provider]) byProvider[m.provider] = { count: 0, success: 0, avgLatencyMs: 0 };
    byProvider[m.provider].count++;
    if (m.success) byProvider[m.provider].success++;
    byProvider[m.provider].avgLatencyMs =
      (byProvider[m.provider].avgLatencyMs * (byProvider[m.provider].count - 1) + m.latencyMs) / byProvider[m.provider].count;
  }
  return {
    total, success, failed,
    successRate: (success / total) * 100,
    avgLatencyMs: Math.round(avgLatency),
    byProvider,
    validateFailRate: (validateFails / total) * 100,
    source: "memory",
  };
}
