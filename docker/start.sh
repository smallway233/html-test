#!/bin/sh
set -e
python3 /app/server.py &
exec nginx -g "daemon off;"
