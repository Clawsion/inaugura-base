// ============================================================================
// observability/index.ts — Logging estruturado + métricas
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
  const colors = { info: "\x1b[36m", warn: "\x1b[33m", error: "\x1b[31m" };
  const reset = "\x1b[0m";
  const color = colors[entry.level];
  console.log(
    `${color}[${fullEntry.timestamp}] ${entry.level.toUpperCase()} ${entry.step}${reset}: ${entry.message}`,
    entry.data ? JSON.stringify(entry.data) : ""
  );
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
}

const metricsBuffer: Array<{
  provider: string; model: string; success: boolean; latencyMs: number; validateOk: boolean; attempts: number;
}> = [];

export function recordGenerationMetric(m: {
  provider: string; model: string; success: boolean; latencyMs: number; validateOk: boolean; attempts: number;
}) {
  metricsBuffer.push(m);
  if (metricsBuffer.length > 500) metricsBuffer.shift();
}

export function getMetrics(): GenerationMetrics {
  const total = metricsBuffer.length;
  if (total === 0) {
    return { total: 0, success: 0, failed: 0, successRate: 0, avgLatencyMs: 0, byProvider: {}, validateFailRate: 0 };
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
  };
}
