# Contributing to PromptPilot

Thanks for your interest in contributing!

## Getting Started

1. Read [README.md](./README.md) for the product overview
2. Read [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for setup, architecture, and commands
3. Fork the repo and open a PR from your branch

## Development

```bash
pnpm install
cp .env.example .env
pnpm run build
pnpm test
pnpm dev
```

## Workflow

1. Create a branch: `feature/<description>`, `fix/<description>`, or `chore/<description>`
2. Write tests for your changes
3. Run `pnpm ci` before pushing
4. Open a PR referencing the issue or feature request

## Git Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow:

```
<type>: <description>

[optional body]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `ci`  
**Examples:** `feat: add password field component`, `fix: handle token expiry edge case`

Husky + Commitlint enforce this automatically on commit.

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
pnpm test:coverage # Coverage report
```

## Pull Request Checklist

- [ ] `pnpm lint` passes
- [ ] `pnpm format` is clean
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes (backend + API tests)

## Code of Conduct

Be kind. Assume good intent. Help others learn.
