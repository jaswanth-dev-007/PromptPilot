#!/usr/bin/env bash
set -euo pipefail

VERSION=$(node -p "require('./package.json').version")
echo "Releasing PromptPilot v${VERSION}..."

# Run full CI
npm run ci

# Build
npm run build

# Publish
npm publish --access public

echo "v${VERSION} published to npm."
echo "Create GitHub release at: https://github.com/promptpilot/promptpilot/releases/new?tag=v${VERSION}"
