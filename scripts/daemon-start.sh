#!/bin/bash
# Double-fork daemon: fully detaches from controlling terminal
cd /home/z/my-project
exec setsid bash scripts/start-robust.sh >> server.log 2>&1 < /dev/null
