#!/usr/bin/env bash
set -euo pipefail

echo "Building PromptPilot..."
npm run clean
npm run typecheck
npm run build
echo "Build complete."
