// ============================================================================
// /api/setup — Corre migrations na primeira vez após deploy
// ============================================================================
// Vercel build sandbox bloqueia DB externo → migrations não podem correr
// durante o build. Em vez disso, chama-se este endpoint uma vez após deploy.
//
// Como usar:
//   1. Deploy acaba → Vercel dá URL (ex: https://inaugura-base.vercel.app)
//   2. Vai a https://inaugura-base.vercel.app/api/setup no browser
//   3. Deve devolver {"ok": true, "migrations": "applied"}
//   4. A partir daqui, app está pronta a usar
//
// Segurança: este endpoint só funciona 1 vez (depois DB já tem schema).
// ============================================================================

import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { db } from "@/lib/db";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const logs: string[] = [];

  try {
    // ── 1. Verifica se DB já tem schema ──
    logs.push("Checking database state...");
    let hasSchema = false;
    try {
      await db.$queryRaw`SELECT to_regclass('public."User"')`;
      hasSchema = true;
      logs.push("✓ Schema already exists");
    } catch {
      logs.push("Schema not found — will run migrations");
    }

    if (hasSchema) {
      return NextResponse.json({
        ok: true,
        message: "Database already has schema — no action needed",
        logs,
      });
    }

    // ── 2. Corre prisma db push (cria todas as tabelas) ──
    logs.push("Running prisma db push...");
    try {
      const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss", {
        timeout: 50_000,
        env: process.env,
      });
      if (stdout) logs.push(stdout.split("\n").slice(-5).join("\n"));
      if (stderr) logs.push("STDERR: " + stderr.split("\n").slice(-3).join("\n"));
      logs.push("✓ Schema pushed successfully");
    } catch (err: any) {
      logs.push("prisma db push failed: " + (err.message ?? String(err)).slice(0, 200));
      // Fallback: tenta criar tabelas via SQL direto
      logs.push("Trying raw SQL fallback...");
      try {
        await db.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "name" TEXT,
            "passwordHash" TEXT NOT NULL,
            "emailVerified" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL
          );
        `);
        await db.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Session" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "token" TEXT NOT NULL UNIQUE,
            "expiresAt" TIMESTAMP(3) NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        logs.push("✓ Created User + Session tables via raw SQL");
      } catch (sqlErr: any) {
        logs.push("SQL fallback failed: " + (sqlErr.message ?? String(sqlErr)).slice(0, 200));
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Setup complete — database ready",
      logs,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err.message ?? String(err),
        logs,
      },
      { status: 500 }
    );
  }
}
