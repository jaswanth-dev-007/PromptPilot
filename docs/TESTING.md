# Testing Guide — PromptPilot

## Test Structure

```
tests/
├── unit/              # Pure logic, no I/O
├── integration/       # Multiple modules, DB, API
├── e2e/               # Full browser workflow (Playwright)
├── performance/       # Load and stress tests
└── helpers/           # DB setup, auth mocks, log mocks

packages/*/test/       # Package-level tests (Vitest)
apps/*/test/           # App-level integration tests
```

## Running Tests

```bash
pnpm test                  # All tests
pnpm test:watch            # Watch mode
pnpm test:coverage         # With coverage report
pnpm test:bench            # Benchmarks

# Run specific subsets
npx vitest run packages/shared/test/
npx vitest run apps/api/test/

# E2E tests (requires frontend running on port 3000)
npx playwright test
npx playwright test --ui
```

## Test Types

### Unit Tests

Isolated module tests in `test/` dirs alongside source code.

```typescript
// packages/shared/test/errors.test.ts
import { describe, it, expect } from 'vitest'
import { ConfigError } from '../src/errors'

describe('ConfigError', () => {
  it('has correct code', () => {
    const err = new ConfigError('bad config')
    expect(err.code).toBe('CONFIG_ERROR')
  })
})
```

### Integration Tests

Database and API integration using MongoMemoryServer.

```typescript
import { setupTestDb, teardownTestDb } from 'tests/helpers/db'

beforeAll(() => setupTestDb())
afterAll(() => teardownTestDb())
```

### E2E Tests

Full browser automation with Playwright, located in `tests/e2e/`.

```typescript
import { test, expect } from '@playwright/test'

test('renders home page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('PromptPilot')
})
```

## Test Helpers

| Helper                   | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `tests/helpers/db.ts`    | `setupTestDb()`, `teardownTestDb()`, `clearCollections()`          |
| `tests/helpers/auth.ts`  | `createTestConfig()`, `createAuthHeader()`, `mockAuthMiddleware()` |
| `tests/helpers/mocks.ts` | `mockLogger()`, `mockApiResponse()`, `withMockConsole()`           |

## Coverage

Thresholds enforced in CI (vitest.config.ts):

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 50%       |
| Branches   | 30%       |
| Functions  | 40%       |
| Statements | 50%       |

Excluded: barrel files (`index.ts`)

## CI Integration

Every PR runs:

1. Vitest with coverage (unit + integration)
2. Playwright E2E (chromium + firefox)
3. Coverage upload as artifact

All must pass before merge.
