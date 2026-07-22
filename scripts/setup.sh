#!/usr/bin/env bash
set -euo pipefail

# PromptPilot — Project Setup Script
# Run this after cloning the repository.
#   chmod +x scripts/setup.sh && ./scripts/setup.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " PromptPilot — Project Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# --- Check prerequisites ---
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Install it from https://nodejs.org (>= 20)"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js >= 20 required. Current: $(node -v)"
  exit 1
fi
echo "   ✅ Node.js $(node -v)"

if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm@latest
fi
echo "   ✅ pnpm $(pnpm -v)"

# --- Install dependencies ---
echo ""
echo "📦 Installing dependencies..."
pnpm install

# --- Setup environment ---
echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   ✅ Created .env from .env.example"
  echo "   ⚠️  Edit .env with your local configuration"
else
  echo "   ✅ .env already exists (skipped)"
fi

# --- Build all packages ---
echo ""
echo "🏗️  Building all packages..."
pnpm run build

# --- Run checks ---
echo ""
echo "🧪 Running verification checks..."
pnpm run lint
pnpm run format
pnpm run typecheck
pnpm test

# --- Success ---
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Quick Start:"
echo "   pnpm dev               # Start frontend + backend + CLI"
echo "   pnpm dev:frontend      # Frontend only (http://localhost:3000)"
echo "   pnpm dev:backend       # Backend only  (http://localhost:3001/health)"
echo ""
echo "📚 Docs:   docs/"
echo "🐛 Issues: https://github.com/promptpilot/promptpilot/issues"
echo ""
