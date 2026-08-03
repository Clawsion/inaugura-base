// ============================================================================
// lib/auth.ts — Auth simples mas real (sessions JWT no DB)
// ============================================================================
// Não usa next-auth (pesado para single-tenant prototype).
// - Password hasheada com PBKDF2 (Node crypto built-in, sem deps)
// - Session token random 32 bytes (crypto.randomBytes)
// - Persistida no DB com expiry 7 dias
// - Cookie httpOnly + SameSite=Strict
// ============================================================================

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "inaugura_session";
const SESSION_TTL_DAYS = 7;
const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

// ============================================================================
// Password hashing (PBKDF2 — built-in Node, sem deps externas)
// ============================================================================
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha512");
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1], 10);
  const salt = Buffer.from(parts[2], "hex");
  const hash = Buffer.from(parts[3], "hex");
  const test = crypto.pbkdf2Sync(password, salt, iterations, hash.length, "sha512");
  return crypto.timingSafeEqual(hash, test);
}

// ============================================================================
// Session management
// ============================================================================
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({
    data: { userId, token, expiresAt },
  });
  return token;
}

export async function validateSession(token: string): Promise<{ userId: string } | null> {
  if (!token || token.length !== 64) return null;
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }
  return { userId: session.userId };
}

export async function revokeSession(token: string): Promise<void> {
  try {
    await db.session.delete({ where: { token } });
  } catch { /* ignore if not exists */ }
}

// ============================================================================
// Cookie helpers (server-side only)
// ============================================================================
export async function setSessionCookie(token: string): Promise<void> {
  const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

// ============================================================================
// Current user helper — usado em server components / route handlers
// ============================================================================
export async function getCurrentUser(): Promise<{ id: string; email: string; name: string | null } | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const session = await validateSession(token);
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });
  return user;
}

export async function requireUser(): Promise<{ id: string; email: string; name: string | null }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

// ============================================================================
// Sign up / Sign in
// ============================================================================
export async function signUp(email: string, password: string, name?: string): Promise<{ ok: boolean; error?: string; userId?: string }> {
  email = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Email inválido" };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password deve ter pelo menos 8 caracteres" };
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Email já registado" };
  }
  const user = await db.user.create({
    data: {
      email,
      name: name?.trim() || null,
      passwordHash: hashPassword(password),
    },
  });
  return { ok: true, userId: user.id };
}

export async function signIn(email: string, password: string): Promise<{ ok: boolean; error?: string; token?: string }> {
  email = email.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Credenciais inválidas" };
  }
  const token = await createSession(user.id);
  return { ok: true, token };
}
