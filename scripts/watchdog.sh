#!/bin/bash
cd /home/z/my-project
while true; do
  if ! curl -s -o /dev/null http://localhost:3000/ --max-time 3 2>/dev/null; then
    pkill -9 -f "server.js" 2>/dev/null
    sleep 1
    NODE_ENV=production nohup bun .next/standalone/server.js >> server.log 2>&1 &
    sleep 3
  fi
  sleep 5
done
