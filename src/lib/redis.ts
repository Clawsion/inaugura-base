// ============================================================================
// lib/redis.ts — Wrapper Upstash Redis com fallback para memória
// ============================================================================
// Se UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN estão definidos:
//   → usa Redis partilhado (multi-replica, persistente)
// Senão:
//   → usa Map() em memória (single-instance, perde em restart)
// ============================================================================

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// ============================================================================
// Cliente Redis (null se não configurado)
// ============================================================================
export const redis: Redis | null = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

export const isRedisConfigured = redis !== null;

// ============================================================================
// Rate limiter partilhado (multi-replica quando Redis configurado)
// ============================================================================
export const ratelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 req / 60s — igual ao in-memory
      prefix: "inaugura:rl",
      analytics: true,
    })
  : null;

// ============================================================================
// Helper: check rate limit com fallback para memória
// ============================================================================
const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();
const MEMORY_WINDOW_MS = 60 * 1000;
const MEMORY_MAX_REQUESTS = 5;

export async function checkSharedRateLimit(
  identifier: string
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  // Se Redis configurado, usa partilhado
  if (ratelimit) {
    const result = await ratelimit.limit(identifier);
    return {
      ok: result.success,
      remaining: result.remaining,
      resetAt: Date.now() + result.reset,
    };
  }

  // Fallback: memória (single-instance)
  const now = Date.now();
  const entry = memoryRateLimits.get(identifier);
  if (!entry || now > entry.resetAt) {
    memoryRateLimits.set(identifier, {
      count: 1,
      resetAt: now + MEMORY_WINDOW_MS,
    });
    return {
      ok: true,
      remaining: MEMORY_MAX_REQUESTS - 1,
      resetAt: now + MEMORY_WINDOW_MS,
    };
  }
  if (entry.count >= MEMORY_MAX_REQUESTS) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return {
    ok: true,
    remaining: MEMORY_MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

// ============================================================================
// Helper: sessões persistentes (multi-replica quando Redis configurado)
// ============================================================================
const SESSION_PREFIX = "inaugura:session:";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 dias

export async function redisSetSession(
  token: string,
  userId: string
): Promise<boolean> {
  if (!redis) return false;
  await redis.set(SESSION_PREFIX + token, userId, { ex: SESSION_TTL_SECONDS });
  return true;
}

export async function redisGetSession(
  token: string
): Promise<string | null> {
  if (!redis) return null;
  return await redis.get<string>(SESSION_PREFIX + token);
}

export async function redisDeleteSession(token: string): Promise<boolean> {
  if (!redis) return false;
  await redis.del(SESSION_PREFIX + token);
  return true;
}
