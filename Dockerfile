# ============================================================================
# Dockerfile — Inaugura-Base para Coolify
# ============================================================================
# Multi-stage build otimizado para Next.js 16 standalone
#   1. deps:    instala dependências com Bun (mais rápido que npm)
#   2. builder: compila Next.js + gera Prisma client
#   3. runner:  imagem final leve (~150MB) com standalone server
#
# Suporta:
#   - SQLite (default, com volume persistente em /app/data)
#   - PostgreSQL (definir DATABASE_URL=postgresql://... e rebuild)
# ============================================================================

# ─── Stage 1: deps ─────────────────────────────────────────────────────────
FROM oven/bun:1 AS deps
WORKDIR /app

# Copia apenas manifests para cache de layers
COPY package.json bun.lock* ./
COPY prisma ./prisma

# Instala dependências (incluindo devDeps para o build)
RUN bun install --frozen-lockfile

# ─── Stage 2: builder ──────────────────────────────────────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app

# Copia node_modules do stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de build (não ficam na imagem final)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Gera Prisma client (precisa do schema)
RUN bunx prisma generate

# Build Next.js (produz .next/standalone + .next/static)
RUN bun run build

# Copia static assets para standalone (necessário para servir CSS/JS/imagens)
RUN cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/

# ─── Stage 3: runner (imagem final leve) ───────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

# Instala apenas o necessário: openssl para Prisma + curl para healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Cria user não-root para segurança
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copia standalone build (já inclui node_modules produtivos)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copia Prisma schema + migrations para correr on startup
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Copia entrypoint script
COPY --chown=nextjs:nodejs scripts/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Switch para user não-root
USER nextjs

# Porta exposta
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# DATABASE_URL deve ser definido via env var (Supabase Postgres connection string)

# Healthcheck para Coolify/Render saber quando a app está pronta
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Entrypoint: corre migrations e arranca o servidor
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
