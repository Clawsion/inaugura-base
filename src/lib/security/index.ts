// ============================================================================
// security/index.ts — Rate limiting + sanitização + idempotency
// ============================================================================

interface RateLimitEntry { count: number; resetAt: number; }
const rateLimits = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

export function checkRateLimit(identifier: string): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimits.get(identifier);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return { ok: false, remaining: 0, resetAt: entry.resetAt };
  entry.count++;
  return { ok: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

const DANGEROUS_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions?/gi,
  /disregard\s+(previous|above|all)\s+instructions?/gi,
  /forget\s+(previous|above|all)\s+instructions?/gi,
  /you\s+are\s+now\s+(a|an)\s+/gi,
  /system\s*:\s*/gi,
  /<\|[^|]+\|>/g,
  /\[INST\]/gi,
  /\[\/INST\]/gi,
];

export interface SanitizeResult { clean: string; warnings: string[]; rejected: boolean; }

export function sanitizeBrief(input: string): SanitizeResult {
  const warnings: string[] = [];
  if (input.length > 10000) return { clean: input.slice(0, 10000), warnings: ["Brief truncado a 10000 chars"], rejected: false };
  if (input.trim().length < 20) return { clean: input, warnings: [], rejected: true };
  let clean = input;
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(clean)) {
      warnings.push(`Padrão suspeito removido: ${pattern.source}`);
      clean = clean.replace(pattern, "[FILTRADO]");
    }
  }
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return { clean, warnings, rejected: false };
}

const processedKeys = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

export function checkIdempotency(key: string): { duplicate: boolean } {
  const now = Date.now();
  // Limpa expiradas
  for (const [k, ts] of processedKeys) {
    if (now - ts > IDEMPOTENCY_TTL_MS) processedKeys.delete(k);
  }
  if (processedKeys.has(key)) return { duplicate: true };
  processedKeys.set(key, now);
  return { duplicate: false };
}

export function generateIdempotencyKey(input: unknown): string {
  const str = JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `idem_${Math.abs(hash).toString(36)}_${str.length}`;
}

// Extrai IP do request (através de proxy)
export function getClientIP(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
