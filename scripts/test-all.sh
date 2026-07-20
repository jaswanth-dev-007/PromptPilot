#!/usr/bin/env bash
set -euo pipefail

echo "Running full test suite..."
npm run lint
npm run format
npm run typecheck
npm test -- --coverage
echo "All tests passed."
