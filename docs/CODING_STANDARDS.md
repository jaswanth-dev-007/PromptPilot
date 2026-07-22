# Coding Standards — PromptPilot

## TypeScript

- **Strict mode** enabled in all `tsconfig.json` files
- Use `const` instead of `let` unless reassignment is required
- Prefer explicit return types on exported functions
- Use path aliases (`@/*`, `@components/*`, etc.) for internal imports
- Import from packages using their namespace (`@promptpilot/shared`, `@promptpilot/ui`)

```typescript
// ✅ Good
import { Button } from '@promptpilot/ui'
import type { TokenPayload } from '@promptpilot/auth'

// ❌ Avoid
import { Button } from '../../packages/ui/src/components/Button'
```

## React / Next.js

- Use **App Router** with file-based routing
- Pages are `'use client'` when they use hooks or browser APIs
- Layouts export `Metadata` for SEO
- Components in `packages/ui` should be framework-agnostic (no Next.js imports)

```tsx
// ✅ Good
export const metadata: Metadata = { title: 'Dashboard' }
export default function DashboardPage() {
  return <main>...</main>
}

// ❌ Avoid
export default function DashboardPage() {
  return <div>...</div>
}
```

## Error Handling

- All custom errors extend `PromptPilotError` (from `@promptpilot/shared`)
- Each error has a unique `code`, HTTP `statusCode`, and optional `suggestion`
- Use `toApiResponse()` to convert errors into standardized API responses
- Catch unknown errors with `InternalError`

```typescript
// ✅ Good
throw new NotFoundError('User not found', 'Check the user ID and try again.')

// ❌ Avoid
throw new Error('User not found')
```

## Logging

- Use `logger` from `@promptpilot/shared` (Pino)
- Generate request IDs with `generateRequestId()`
- Redact sensitive data with `redactSensitive()` before logging
- Log levels: `trace` → `debug` → `info` → `warn` → `error` → `fatal`

## Testing

- Framework: Vitest
- Test files: `*.test.ts` or `*.test.tsx` in `test/` directories
- Backend tests use `MongoMemoryServer` for isolated DB
- Frontend integration via `next build`
- One `describe` per feature, one `it` per behavior

## Formatting

- Prettier with `printWidth: 100`, `singleQuote: true`, `semi: false`, `trailingComma: all`
- ESLint with TypeScript recommended rules
- No unused variables (allow `_` prefix)
- `no-console` warn (except `error` and `warn`)

## Git

- Branches: `feature/<desc>`, `fix/<desc>`, `chore/<desc>`
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Pre-commit: lint-staged runs ESLint + Prettier
- Pre-push: typecheck runs on backend packages
