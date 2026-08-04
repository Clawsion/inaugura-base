#!/bin/bash
# ============================================================================
# vercel-build.sh — Build script para Vercel (sem migrations)
# ============================================================================
# A Vercel NÃO deve correr migrations durante o build (bloqueia DB externo).
# Migrations são corridas via:
#   1. /api/setup endpoint (one-time após deploy)
#   2. Ou localmente: npx prisma migrate deploy --schema=prisma/schema.prisma
# ============================================================================

set -e

echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Vercel Build — Inaugura-Base                               │"
echo "└─────────────────────────────────────────────────────────────┘"

# ── 1. Gera Prisma client ──
echo "[build] Generating Prisma client..."
npx prisma generate
echo "[build] ✓ Prisma client generated"

# ── 2. Build Next.js ──
echo "[build] Running next build..."
npx next build
echo "[build] ✓ Build complete"

# NOTA: NÃO correr migrations aqui. Vercel build sandbox bloqueia DB externo.
# Migrations são aplicadas via /api/setup endpoint após deploy.
