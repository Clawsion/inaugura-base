#!/bin/bash
cd /home/z/my-project

# Se existir build de produção, usa-o (consome 10x menos memória)
if [ -f .next/standalone/server.js ]; then
  echo "[ROBUST] Usando production build (baixo consumo de memória)"
  NODE_ENV=production exec bun .next/standalone/server.js
else
  echo "[ROBUST] Sem build — usando dev mode"
  exec bun run next dev -p 3000
fi
