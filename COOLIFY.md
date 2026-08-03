# Inaugura-Base — Guia de Deploy no Coolify

Guia passo-a-passo para deploy desta app no teu servidor Coolify.

## Pré-requisitos

- Servidor Coolify a correr (v4.x)
- Repositório Git com o código (GitHub, GitLab, ou Bitbucket)
- (Opcional) Domínio próprio apontado para o servidor Coolify

---

## Passo 1 — Conectar repositório

1. No painel Coolify → **New Resource** → **Application**
2. Escolhe **GitHub/GitLab** e autentica
3. Seleciona o repositório da Inaugura-Base
4. Em **Build Pack** escolhe **Dockerfile** (já existe no repo)
5. Coolify detecta automaticamente o `Dockerfile` na root

---

## Passo 2 — Configurar Environment Variables

Em **Configuration** → **Environment Variables**, adiciona:

### Obrigatórias
```
DATABASE_URL=file:/app/data/inaugura.db
AUTH_SECRET=<gera com: openssl rand -base64 32>
ALLOWED_ORIGINS=teu-dominio.coolify.app,*.coolify.app
```

> Para gerar `AUTH_SECRET` localmente: `openssl rand -base64 32`

### Opcionais (recomendadas para produção)
```
# Sentry (error tracking externo — free tier em sentry.io)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Upstash Redis (rate limit partilhado multi-replica — free tier em upstash.com)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# DeepSeek fallback LLM (se não definido, só GLM-5.2 é usado)
SPEC_COMPILER_FALLBACK_BASE_URL=https://api.deepseek.com/v1
SPEC_COMPILER_FALLBACK_API_KEY=
SPEC_COMPILER_FALLBACK_MODEL=deepseek-v4-flash

# Versionamento (para Sentry releases)
NEXT_PUBLIC_APP_VERSION=0.3.0
```

---

## Passo 3 — Configurar Volume Persistente

Para o SQLite não perder dados em restart:

1. Vai a **Storages** → **Add Storage**
2. **Type**: `Volume` (ou `Bind Mount`)
3. **Name**: `inaugura-data`
4. **Mount Path**: `/app/data`
5. Salvar

Isto garante que a base de dados SQLite persiste entre deploys.

---

## Passo 4 — Configurar Health Check

1. Vai a **Healthcheck** (na secção de config)
2. **Port**: `3000`
3. **Path**: `/api/health`
4. **Interval**: `30s`
5. **Timeout**: `5s`
6. **Start Period**: `15s`

Coolify vai usar este endpoint para saber quando a app está pronta.

---

## Passo 5 — Deploy

1. Clica em **Deploy** 
2. Aguarda o build (5-10 min na primeira vez)
3. Coolify mostra logs em tempo real
4. Quando aparece `[startup] ✓ Migrations applied` — está pronto!

---

## Passo 6 — (Opcional) Configurar Domínio

1. Vai a **Domains**
2. Adiciona o teu domínio (ex: `inaugura.meudominio.com`)
3. Coolify gera automaticamente certificado SSL via Let's Encrypt
4. Atualiza `ALLOWED_ORIGINS` com o novo domínio:
   ```
   ALLOWED_ORIGINS=inaugura.meudominio.com,*.coolify.app
   ```

---

## Estrutura de ficheiros Docker

```
├── Dockerfile              ← multi-stage build (deps → builder → runner)
├── docker-compose.yml      ← para teste local ou Coolify compose stack
├── .dockerignore           ← otimiza build (ignora node_modules, .next, etc)
├── nixpacks.toml           ← alternativa ao Dockerfile (Coolify usa se não houver Dockerfile)
└── scripts/
    └── entrypoint.sh       ← corre prisma migrate deploy + arranca server
```

---

## Como funciona o Dockerfile

### Multi-stage build (3 etapas)

1. **`deps`** — instala dependências com Bun (cache de layers)
2. **`builder`** — compila Next.js + gera Prisma client
3. **`runner`** — imagem final leve (~150MB) com standalone server

### Imagem final usa user não-root

```dockerfile
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs
USER nextjs
```

Isto é boa prática de segurança — a app corre sem privilégios de root.

### Volume persistente

```
VOLUME ["/app/data"]
```

SQLite DB fica em `/app/data/inaugura.db` — persiste entre restarts.

### Entrypoint script

```bash
#!/bin/sh
npx prisma migrate deploy  # aplica migrations pendentes
exec node server.js         # arranca Next.js standalone
```

Garante que o schema está sempre atualizado antes de arrancar.

---

## Testar localmente com Docker

```bash
# Build + run (uma linha)
docker compose up --build

# Ou manualmente:
docker build -t inaugura-base .
docker run -p 3000:3000 -v inaugura-data:/app/data inaugura-base
```

App fica disponível em `http://localhost:3000`.

---

## Migrar para PostgreSQL (opcional)

Se precisares de multi-user concurrent (>50 users), migra para PostgreSQL:

1. **Descomenta o serviço `postgres` no `docker-compose.yml`**
2. **Muda o provider no Prisma schema**:
   ```prisma
   datasource db {
     provider = "postgresql"  # era "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. **Define `DATABASE_URL` no Coolify**:
   ```
   DATABASE_URL=postgresql://inaugura:inaugura@postgres:5432/inaugura
   ```
4. **Rebuild** — Coolify detecta a mudança e reconstrói

> Nota: migração de SQLite para Postgres requer export/import dos dados.
> Para um projeto novo, começa já com Postgres se prevês crescimento.

---

## Troubleshooting

### Build falha com "prisma generate" error
- Verifica que `prisma/schema.prisma` está no repositório
- Confirma que `prisma/migrations/` existe (corre `bunx prisma migrate dev` localmente primeiro)

### Container arranca mas DB não tem schema
- Verifica logs: deve aparecer `[startup] ✓ Migrations applied`
- Se não aparece, força re-deploy com "Clear Cache" no Coolify

### Server Actions não funcionam
- Verifica que `ALLOWED_ORIGINS` inclui o teu domínio Coolify
- Logs mostram `Invalid Server Actions request` se não estiver configurado

### Healthcheck falha
- Verifica que `curl` está instalado na imagem (já está no Dockerfile)
- Testa manualmente: `docker exec <container> curl http://localhost:3000/api/health`

### SQLite "database is locked"
- SQLite não suporta multi-replica. Se escalares para >1 container, migra para Postgres
- Em single-replica, este erro não deve aparecer

---

## Comandos úteis

```bash
# Ver logs do container
docker logs -f inaugura-base

# Entrar no container
docker exec -it inaugura-base sh

# Ver migrations aplicadas
docker exec inaugura-base npx prisma migrate status

# Reset DB (cuidado — apaga tudo)
docker exec inaugura-base npx prisma migrate reset --force
```

---

## Custo de hosting

- **VPS mínimo**: 1 vCPU, 1GB RAM, 10GB disk — suficiente para prototype
- **Recomendado**: 2 vCPU, 2GB RAM, 20GB disk — para 10-20 users concurrentes
- **Banda**: ~1GB/mês para 1000 visits/mês (página é leve, ~30KB gzipped)
