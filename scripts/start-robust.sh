#!/bin/bash
cd /home/z/my-project

# Espera que a porta 3000 esteja livre (mata processos antigos)
for i in $(seq 1 5); do
  if curl -s -o /dev/null http://localhost:3000/ --max-time 1 2>/dev/null; then
    echo "[ROBUST] Porta 3000 ocupada — espera..."
    sleep 2
  else
    break
  fi
done

# Loop infinito — se o servidor cair, reinicia
while true; do
  if [ -f .next/standalone/server.js ]; then
    echo "[ROBUST] A iniciar production build..."
    NODE_ENV=production node .next/standalone/server.js
    echo "[ROBUST] Servidor parou (exit $?) — a reiniciar em 2s..."
  else
    echo "[ROBUST] Sem build — a iniciar dev mode..."
    npx next dev -p 3000
    echo "[ROBUST] Dev parou — a reiniciar em 2s..."
  fi
  sleep 2
done
