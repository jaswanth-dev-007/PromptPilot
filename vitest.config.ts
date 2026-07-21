import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/test/**/*.test.ts', 'apps/api/test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.ts'],
      thresholds: {
        lines: 50,
        branches: 30,
        functions: 40,
        statements: 50,
      },
      exclude: ['packages/*/src/index.ts', 'packages/*/src/**/index.ts'],
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
      '@promptpilot/db': resolve(__dirname, 'packages/db/src'),
      '@promptpilot/auth': resolve(__dirname, 'packages/auth/src'),
    },
  },
})
