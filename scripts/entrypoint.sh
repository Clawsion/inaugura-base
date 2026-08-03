# ============================================================================
# entrypoint.sh — corre Prisma migrations e arranca o servidor
# ============================================================================
# Executa como user nextjs (não-root).
# 1. Garante que /app/data existe e tem permissões
# 2. Corre `prisma migrate deploy` (aplica migrations pendentes)
# 3. Arranca o Next.js standalone server
# ============================================================================

#!/bin/sh
set -e

echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Inaugura-Base — Container startup                          │"
echo "└─────────────────────────────────────────────────────────────┘"

# ── 1. Verifica DB path (SQLite) ──
if echo "$DATABASE_URL" | grep -q "^file:"; then
    DB_PATH=$(echo "$DATABASE_URL" | sed 's/^file://')
    DB_DIR=$(dirname "$DB_PATH")
    echo "[startup] SQLite mode — ensuring directory exists: $DB_DIR"
    mkdir -p "$DB_DIR" 2>/dev/null || true
fi

# ── 2. Aplica migrations ──
echo "[startup] Running Prisma migrations..."
if [ -d "/app/prisma/migrations" ]; then
    npx prisma migrate deploy 2>&1 || {
        echo "[startup] WARNING: prisma migrate deploy failed — trying db push as fallback"
        npx prisma db push --accept-data-loss 2>&1 || {
            echo "[startup] ERROR: Could not initialize database"
            exit 1
        }
    }
    echo "[startup] ✓ Migrations applied"
else
    echo "[startup] No migrations dir found — running db push"
    npx prisma db push --accept-data-loss 2>&1 || {
        echo "[startup] ERROR: Could not initialize database"
        exit 1
    }
    echo "[startup] ✓ Schema pushed"
fi

# ── 3. Mostra config final ──
echo ""
echo "[startup] Configuration:"
echo "  - NODE_ENV:        $NODE_ENV"
echo "  - PORT:            $PORT"
echo "  - HOSTNAME:        $HOSTNAME"
echo "  - DATABASE_URL:    ${DATABASE_URL%%:*}://***"
if [ -n "$SENTRY_DSN" ]; then
    echo "  - Sentry:          ✓ enabled"
else
    echo "  - Sentry:          ✗ disabled (set SENTRY_DSN to enable)"
fi
if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
    echo "  - Redis:           ✓ enabled (shared rate limit)"
else
    echo "  - Redis:           ✗ disabled (in-memory fallback)"
fi
if [ -n "$SPEC_COMPILER_FALLBACK_API_KEY" ]; then
    echo "  - DeepSeek fallback: ✓ enabled"
else
    echo "  - DeepSeek fallback: ✗ disabled (GLM only)"
fi
echo ""

# ── 4. Arranca servidor ──
echo "[startup] Starting Next.js standalone server on port $PORT..."
exec node server.js
