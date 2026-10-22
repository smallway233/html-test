#!/bin/sh
set -e
mkdir -p /app/data
if [ ! -s /app/data/report.json ] && [ -f /app/report.default.json ]; then
  cp /app/report.default.json /app/data/report.json
fi
python3 /app/server.py &
exec nginx -g "daemon off;"
