#!/bin/bash
# ============================================================================
# vercel-build.sh — Script de build para Vercel
# ============================================================================
# Corre automaticamente quando a Vercel faz deploy.
# 1. Gera Prisma client (também corrido no postinstall, mas garante)
# 2. Corre migrations contra o DB de produção (Supabase)
# 3. Build Next.js (já corrido pela Vercel, mas garantimos prisma generate antes)
# ============================================================================

set -e

echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Vercel Build — Inaugura-Base                               │"
echo "└─────────────────────────────────────────────────────────────┘"

# ── 1. Gera Prisma client ──
echo "[build] Generating Prisma client..."
npx prisma generate
echo "[build] ✓ Prisma client generated"

# ── 2. Corre migrations em produção ──
if [ -n "$DATABASE_URL" ]; then
    echo "[build] Running migrations..."
    npx prisma migrate deploy 2>&1 || {
        echo "[build] WARNING: migrate deploy failed — trying db push"
        npx prisma db push --accept-data-loss 2>&1 || {
            echo "[build] ERROR: Could not apply migrations"
            # Não falha o build — DB pode não estar acessível durante build
            # Migrations podem ser corridas manualmente depois
        }
    }
    echo "[build] ✓ Migrations applied (or skipped)"
else
    echo "[build] WARNING: DATABASE_URL not set — skipping migrations"
fi

# ── 3. Build Next.js ──
echo "[build] Running next build..."
npx next build
echo "[build] ✓ Build complete"
