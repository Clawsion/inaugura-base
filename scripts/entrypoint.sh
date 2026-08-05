#!/bin/sh
set -e

echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Inaugura-Base — Container startup                          │"
echo "└─────────────────────────────────────────────────────────────┘"

if [ -z "$DATABASE_URL" ]; then
    echo "[startup] ERROR: DATABASE_URL not set"
    echo "[startup] For PostgreSQL: set DATABASE_URL=postgresql://user:pass@host:5432/db"
    exit 1
fi

DB_SCHEME=$(echo "$DATABASE_URL" | sed 's/:.*//')
echo "[startup] Database: $DB_SCHEME"

echo "[startup] Running prisma db push..."
npx prisma db push --accept-data-loss 2>&1 || {
    echo "[startup] ERROR: prisma db push failed"
    exit 1
}
echo "[startup] ✓ Schema pushed"

echo ""
echo "[startup] Starting server on port ${PORT:-3000}..."
exec node server.js
