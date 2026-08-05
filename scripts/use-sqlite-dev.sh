#!/bin/bash
# Troca schema para SQLite (dev local) e cria a base de dados
cd /home/z/my-project
cp prisma/schema.prisma prisma/schema.postgres.prisma.bak
sed 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.postgres.prisma.bak > prisma/schema.prisma
mkdir -p db
npx prisma db push --accept-data-loss
npx prisma generate
echo "✓ Dev mode: SQLite at file:db/custom.db"
