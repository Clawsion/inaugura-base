#!/bin/bash
# Watchdog — reinicia o servidor automaticamente se cair
cd /home/z/my-project
LOG=server.log

while true; do
  # Verifica se o servidor está a responder
  if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ --max-time 3 2>/dev/null | grep -q "200"; then
    echo "[$(date)] Servidor caiu — a reiniciar..." >> $LOG
    pkill -9 -f "server.js" 2>/dev/null
    pkill -9 -f "next-server" 2>/dev/null
    sleep 2
    NODE_ENV=production nohup bun .next/standalone/server.js >> $LOG 2>&1 &
    echo "[$(date)] Servidor reiniciado (PID $!)" >> $LOG
    sleep 5
  fi
  sleep 10
done
