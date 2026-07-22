# CI/CD Guide — PromptPilot

## Workflows

### `ci.yml` — Main CI Pipeline

**Triggers:** push/PR to `main`

**Matrix:** ubuntu-latest, macos-latest, windows-latest × Node 20, 22

**Steps:**

1. Checkout + pnpm setup
2. `pnpm install --frozen-lockfile`
3. `pnpm run lint` (18 packages)
4. `pnpm run format` (Prettier)
5. `pnpm run typecheck` (TypeScript)
6. `pnpm run test -- --coverage` (Vitest)
7. `pnpm run build` (Turbo)
8. `pnpm audit --audit-level=high`

### `security.yml` — Security Checks

**Triggers:** push/PR to `main`, weekly on Monday

**Jobs:**

- **Dependency Audit:** `pnpm audit --audit-level=high`
- **Secret Scanning:** Gitleaks scans entire Git history
- **License Check:** Ensures only permissive licenses (MIT, ISC, Apache-2.0, BSD)

### `quality.yml` — Quality Checks

**Triggers:** push/PR to `main`

**Jobs:**

- **Circular Deps:** `dpdm` detects import cycles
- **Coverage:** generates and uploads coverage artifact
- **Build Size:** reports dist size

### `release.yml` — Release Pipeline

**Triggers:** git tags matching `v*.*.*`

**Steps:**

1. Full CI run
2. Build
3. Publish to npm
4. Create GitHub Release with auto-generated notes

### `prompt-validate.yml` — Prompt Template Validation

**Triggers:** changes to `docs/**` or `templates/**`, weekly schedule

**Steps:** build + run validators tests + snapshot check

## Local Commands (matching CI)

```bash
pnpm run ci          # Full pipeline matching CI
pnpm run lint        # Lint all packages
pnpm run format      # Prettier check
pnpm run typecheck   # TypeScript check
pnpm run build       # Build all packages
pnpm test            # Run all tests
pnpm audit           # Security audit
```

## PR Checklist

- [ ] `pnpm run lint` passes
- [ ] `pnpm run format` is clean
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run build` succeeds
- [ ] `pnpm test` passes
- [ ] `pnpm audit` clean (or documented exceptions)
- [ ] New tests written for new code
