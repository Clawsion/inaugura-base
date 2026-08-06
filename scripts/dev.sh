#!/bin/bash
cd /home/z/my-project

# Trocar schema para SQLite
sed -i 's/provider  = "postgresql"/provider  = "sqlite"/' prisma/schema.prisma

# Garantir que o DB existe
mkdir -p db
npx prisma db push --accept-data-loss 2>/dev/null
npx prisma generate 2>/dev/null

echo "✓ Dev mode: SQLite"
echo "✓ Starting dev server..."

# Iniciar dev server
npx next dev -p 3001 -H 0.0.0.0

# Quando o server para, restaurar PostgreSQL
sed -i 's/provider  = "sqlite"/provider  = "postgresql"/' prisma/schema.prisma
echo "✓ Restored to PostgreSQL"
