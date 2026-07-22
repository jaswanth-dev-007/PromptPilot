# Quality Assurance Guide — PromptPilot

## Code Quality Gates

Every commit and PR is automatically validated by:

| Gate              | Tool                        | When                          |
| ----------------- | --------------------------- | ----------------------------- |
| Lint              | ESLint + TypeScript ESLint  | Pre-commit (lint-staged) + CI |
| Format            | Prettier                    | Pre-commit (lint-staged) + CI |
| Type Check        | TypeScript (`tsc --noEmit`) | Pre-push (Husky) + CI         |
| Unit Tests        | Vitest                      | CI                            |
| Integration Tests | Vitest + supertest          | CI                            |
| E2E Tests         | Playwright                  | CI                            |
| Security Audit    | `pnpm audit` + Gitleaks     | CI                            |
| Circular Deps     | `dpdm`                      | CI                            |
| Build             | Turbo                       | CI                            |
| Coverage          | Vitest v8                   | CI                            |

## ESLint Rules

```json
"@typescript-eslint/no-unused-vars": "error"       // No dead code
"@typescript-eslint/no-explicit-any": "warn"       // Prefer typed
"@typescript-eslint/consistent-type-imports": "warn" // type-imports
"no-console": "warn"                                // Use logger, not console
```

## Prettier Configuration

```json
{ "semi": false, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
```

## Git Hooks

| Hook         | Action                                            |
| ------------ | ------------------------------------------------- |
| `pre-commit` | `lint-staged` → ESLint + Prettier on staged files |
| `commit-msg` | `commitlint` → Conventional Commits enforced      |
| `pre-push`   | `turbo run typecheck` → No type errors pushed     |

## Testing Standards

- **One `describe` per file, one `it` per behavior**
- **No skipped tests (`it.skip`)** in production branches
- **No `.only`** in committed tests (CI enforces this via `forbidOnly`)
- **Test file naming:** `*.test.ts` or `*.test.tsx`
- **Mocks:** Use `vi.fn()` from Vitest for all mocking

## Coverage Enforcement

| Metric     | CI Threshold |
| ---------- | ------------ |
| Lines      | ≥ 50%        |
| Branches   | ≥ 30%        |
| Functions  | ≥ 40%        |
| Statements | ≥ 50%        |

Build fails if thresholds are not met.

## Security

- **Dependencies:** audited on every CI run (`pnpm audit --audit-level=high`)
- **Secrets:** Gitleaks scans history on every push
- **Licenses:** Only permissive open-source licenses allowed
- **Environment:** `.env` files in `.gitignore`; `.env.example` committed

## Performance Budgets (Future)

| Metric                 | Budget                    |
| ---------------------- | ------------------------- |
| First Load JS          | < 200 kB                  |
| Lighthouse Performance | ≥ 90                      |
| Bundle Size            | Monitored via CI artifact |
