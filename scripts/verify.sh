#!/usr/bin/env bash
set -euo pipefail

# PromptPilot — Verification Script
# Run all validation checks to confirm the project is healthy.
#   chmod +x scripts/verify.sh && ./scripts/verify.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " PromptPilot — Verification Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

FAILURES=0
check() {
  local label="$1"
  shift
  echo -n "  ${label}..."
  if "$@" > /dev/null 2>&1; then
    echo " ✅"
  else
    echo " ❌"
    FAILURES=$((FAILURES + 1))
  fi
}

echo "📋 Code Quality"
check "Lint"            pnpm run lint
check "Format (Prettier)" pnpm run format

echo ""
echo "🔨 TypeScript"
check "Type check"      pnpm run typecheck

echo ""
echo "🏗️  Build"
check "Build"            pnpm run build

echo ""
echo "🧪 Tests"
check "Unit + Integration" pnpm run test

echo ""
echo "🌐 Services"
echo -n "  Frontend (port 3000)..."
npx tsx apps/backend/src/index.ts &
BACKEND_PID=$!
sleep 2

cd apps/frontend && npx next dev --port 3000 &
FRONTEND_PID=$!
sleep 4

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|304"; then
  echo " ✅"
else
  echo " ❌"
  FAILURES=$((FAILURES + 1))
fi

echo -n "  Backend health..."
if curl -s http://localhost:3001/health | grep -q '"status":"ok"'; then
  echo " ✅"
else
  echo " ❌"
  FAILURES=$((FAILURES + 1))
fi

kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true

echo ""
if [ "$FAILURES" -eq 0 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo " ✅ All checks passed!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo " ❌ ${FAILURES} check(s) failed."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
