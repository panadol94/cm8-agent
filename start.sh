#!/bin/sh
echo "[startup] Pushing database schema..."
cd /app/payload-src && node push-schema.mjs 2>&1 || echo "[startup] Schema push failed (may already exist)"
echo "[startup] Starting Next.js server..."
cd /app && HOSTNAME="0.0.0.0" node server.js
