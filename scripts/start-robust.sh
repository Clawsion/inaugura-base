#!/bin/bash
cd /home/z/my-project

# Watchdog embutido — reinicia o servidor se cair
while true; do
  if [ -f .next/standalone/server.js ]; then
    NODE_ENV=production exec node .next/standalone/server.js
  else
    exec npx next dev -p 3000
  fi
done
