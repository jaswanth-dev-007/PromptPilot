#!/bin/sh
set -e

# PromptPilot — Docker entrypoint
# Runs database migrations then starts the application

echo "PromptPilot — Starting..."

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy --schema=prisma/schema.prisma
  echo "Migrations complete."
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Seeding database..."
  npx tsx packages/database/src/seed/index.ts
  echo "Seed complete."
fi

echo "Starting PromptPilot API on port ${PORT:-3001}..."
exec node apps/api/dist/server.js
