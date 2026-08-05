#!/bin/bash
# Alterna entre SQLite (dev local) e PostgreSQL (deploy)
# Uso: bash scripts/dev-db.sh

cd /home/z/my-project

if [ "$1" = "prod" ]; then
    echo "Switching to PostgreSQL (production)..."
    cp prisma/schema.dev.prisma prisma/schema.dev.prisma.bak 2>/dev/null
    # Restaurar schema original (postgresql)
    sed 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.dev.prisma > /tmp/schema_prod.prisma
    cp /tmp/schema_prod.prisma prisma/schema.prisma
    echo "✓ Schema = PostgreSQL"
    echo "  DATABASE_URL deve ser: postgresql://..."
else
    echo "Switching to SQLite (dev local)..."
    cp prisma/schema.dev.prisma prisma/schema.prisma
    echo "✓ Schema = SQLite"
    echo "  DATABASE_URL = file:/home/z/my-project/db/custom.db"
    
    # Garantir que o DB existe
    mkdir -p db
    npx prisma db push --accept-data-loss
    echo "✓ Database criado/atualizado"
fi

npx prisma generate
echo "✓ Prisma Client gerado"
