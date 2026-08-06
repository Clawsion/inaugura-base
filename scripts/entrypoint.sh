#!/bin/sh
set -e

echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Inaugura-Base — Koyeb Container startup                    │"
echo "└─────────────────────────────────────────────────────────────┘"

if [ -z "$DATABASE_URL" ]; then
    echo "[startup] ERROR: DATABASE_URL not set"
    exit 1
fi

DB_SCHEME=$(echo "$DATABASE_URL" | sed 's/:.*//')
echo "[startup] Database: $DB_SCHEME"

echo "[startup] Running prisma db push..."
npx prisma db push --accept-data-loss 2>&1 || {
    echo "[startup] WARNING: prisma db push failed — trying without"
}
echo "[startup] ✓ Schema ready"

echo ""
echo "[startup] Starting server on port ${PORT:-3000}..."
exec node server.js
