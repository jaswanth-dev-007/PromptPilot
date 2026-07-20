import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.ts'],
      thresholds: {
        lines: 85,
        branches: 80,
        functions: 85,
        statements: 85,
      },
    },
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@promptpilot/shared': resolve(__dirname, 'packages/shared/src'),
      '@promptpilot/config': resolve(__dirname, 'packages/config/src'),
      '@promptpilot/fs': resolve(__dirname, 'packages/fs/src'),
      '@promptpilot/adapters': resolve(__dirname, 'packages/adapters/src'),
      '@promptpilot/validators': resolve(__dirname, 'packages/validators/src'),
      '@promptpilot/core': resolve(__dirname, 'packages/core/src'),
    },
  },
})
