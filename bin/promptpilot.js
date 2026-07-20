#!/usr/bin/env node
// This file is the npm bin entry point.
// It loads the compiled CLI and passes control.
import('../packages/cli/dist/cli.js').catch(err => {
  console.error('Failed to start PromptPilot:', err.message)
  process.exit(1)
})
