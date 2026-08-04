#!/bin/bash
# Inicia o dev server de forma persistente
cd /home/z/my-project

# Mata processos anteriores
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 2

# Inicia em background com nohup + setsid (para sobreviver ao shell)
setsid nohup npx next dev -p 3001 -H 0.0.0.0 > /tmp/inaugura-dev.log 2>&1 &
DEV_PID=$!

# Espera até o servidor responder (max 60s)
for i in $(seq 1 60); do
  sleep 1
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ --max-time 5 2>/dev/null || echo "000")
  if [ "$CODE" = "200" ]; then
    echo "✓ Server ready at http://localhost:3001 (PID=$DEV_PID, after ${i}s)"
    exit 0
  fi
  if [ $i -eq 60 ]; then
    echo "✗ Server failed to start in 60s"
    echo "--- Last 30 lines of log: ---"
    tail -30 /tmp/inaugura-dev.log
    exit 1
  fi
done
