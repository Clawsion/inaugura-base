#!/bin/sh
set -e

echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Inaugura-Base — Container startup                          │"
echo "└─────────────────────────────────────────────────────────────┘"

# ── 1. Garantir que DATABASE_URL está definida ──
if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="file:/app/data/inaugura.db"
    echo "[startup] DATABASE_URL not set — using default SQLite: $DATABASE_URL"
fi

DB_SCHEME=$(echo "$DATABASE_URL" | sed 's/:.*//')
echo "[startup] Database provider: $DB_SCHEME"

# ── 2. Criar diretório de dados se não existir (para SQLite) ──
if echo "$DATABASE_URL" | grep -q "^file:"; then
    DB_PATH=$(echo "$DATABASE_URL" | sed 's/^file://')
    DB_DIR=$(dirname "$DB_PATH")
    mkdir -p "$DB_DIR" 2>/dev/null || true
    echo "[startup] SQLite dir: $DB_DIR"
fi

# ── 3. Aplicar schema (db push — funciona com SQLite e PostgreSQL) ──
echo "[startup] Running prisma db push..."
npx prisma db push --accept-data-loss 2>&1 || {
    echo "[startup] ERROR: Could not initialize database"
    exit 1
}
echo "[startup] ✓ Schema pushed"

# ── 4. Mostra config ──
echo ""
echo "[startup] Configuration:"
echo "  - NODE_ENV:        $NODE_ENV"
echo "  - PORT:            ${PORT:-3000}"
echo "  - DATABASE_URL:    ${DATABASE_URL%%:*}:***"
echo ""

# ── 5. Arranca servidor ──
echo "[startup] Starting Next.js standalone server..."
exec node server.js
