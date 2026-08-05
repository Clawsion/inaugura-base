#!/bin/bash
# Restaura schema para PostgreSQL (deploy)
cd /home/z/my-project
if [ -f prisma/schema.postgres.prisma.bak ]; then
    cp prisma/schema.postgres.prisma.bak prisma/schema.prisma
    npx prisma generate
    echo "✓ Prod mode: PostgreSQL"
else
    echo "✗ No backup found. Schema already PostgreSQL?"
fi
