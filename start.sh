#!/bin/sh
echo "[startup] Running database initialization..."
node init-db.mjs
echo "[startup] Starting Next.js server..."
exec node node_modules/.bin/next start
