# PromptPilot — Development Guide

## Prerequisites

- **Node.js** >= 20 (install via [nvm](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org))
- **pnpm** >= 9 (installs automatically via corepack — `corepack enable pnpm`)
- **MongoDB** >= 7 (for local development: `brew install mongodb-community` or use Docker)
- **PostgreSQL** >= 15 (for Prisma — `brew install postgresql` or use Docker)
- **Docker** (optional — for running MongoDB)

## Quick Start

```bash
git clone https://github.com/promptpilot/promptpilot.git
cd promptpilot

# One-command setup
pnpm install
cp .env.example .env

# Build everything
pnpm run build

# Start development
pnpm dev
```

Or use the setup script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Project Structure

```
PromptPilot/
├── apps/
│   ├── api/          # REST API (Express + Mongoose)
│   ├── frontend/     # Next.js 15 (App Router)
│   └── backend/      # Express API server
├── packages/
│   ├── shared/       # Error classes, logger, API types
│   ├── config/       # Zod-based config with cascade resolution
│   ├── db/           # Mongoose models + connection
│   ├── auth/         # JWT + bcrypt auth service
│   ├── core/         # Pipeline engine
│   ├── cli/          # Commander CLI
│   ├── adapters/     # LLM provider adapters
│   ├── validators/   # Markdown + structural validation
│   ├── ai/           # AI provider layer (planned)
│   ├── ui/           # Shared React components
│   ├── types/        # Shared TypeScript types
│   ├── validation/   # Zod schemas + validators
│   ├── database/     # Prisma layer (planned)
│   └── editor/       # Collaborative editor (planned)
├── infrastructure/   # Docker, nginx, monitoring
├── docker/           # Docker compose + Dockerfiles
├── prisma/           # Prisma schema
├── docs/             # Product documentation
├── scripts/          # Build + CI scripts
└── tests/            # Unit, integration, e2e, performance
```

## Workspace Commands

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Start all services in parallel (Turbo)          |
| `pnpm dev:frontend`  | Frontend only → http://localhost:3000           |
| `pnpm dev:backend`   | Backend only → http://localhost:3001            |
| `pnpm dev:api`       | API server → http://localhost:3001              |
| `pnpm build`         | Build all packages + apps                       |
| `pnpm test`          | Run all tests                                   |
| `pnpm test:watch`    | Watch mode                                      |
| `pnpm test:coverage` | With coverage report                            |
| `pnpm lint`          | ESLint across all packages                      |
| `pnpm format`        | Prettier check                                  |
| `pnpm format:fix`    | Prettier auto-fix                               |
| `pnpm typecheck`     | TypeScript check all projects                   |
| `pnpm ci`            | Full CI pipeline (lint + format + build + test) |
| `pnpm clean`         | Remove all build artifacts                      |

## Environment Variables

See `.env.example` for the complete list. Key variables:

| Variable       | Default                                                     | Description                       |
| -------------- | ----------------------------------------------------------- | --------------------------------- |
| `NODE_ENV`     | `development`                                               | Environment mode                  |
| `PORT`         | `3001`                                                      | Backend port                      |
| `MONGODB_URI`  | `mongodb://localhost:27017/promptpilot`                     | MongoDB connection                |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/promptpilot` | PostgreSQL connection             |
| `JWT_SECRET`   | _required_                                                  | JWT signing secret (min 32 chars) |

## Docker (MongoDB)

```bash
# Start MongoDB + Mongo Express
docker compose -f docker/docker-compose.yml up -d

# Mongo Express UI → http://localhost:8081

# Stop
docker compose -f docker/docker-compose.yml down
```

## VS Code

Open the workspace directly — recommended extensions install automatically.

### Debug Configurations

- **Frontend (Next.js)** — launches dev server + opens browser
- **Backend (Express)** — attaches debugger
- **Both** — runs both in parallel
- **Run Current Test** — debug the current test file

## Git Workflow

- **Branch**: `feature/<description>` or `fix/<description>`
- **Commit**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
- **Pre-commit**: Husky runs lint-staged (ESLint + Prettier on staged files)
- **Pre-push**: Commitlint validates commit message format

## Architecture Notes

### Monorepo (Turborepo + pnpm)

- 18 workspace packages with dependency-aware build ordering
- Turbo caches build outputs across runs
- Shared TypeScript configs: `tsconfig.base.json`, `tsconfig.frontend.json`, `tsconfig.backend.json`

### Dependency Graph

```
shared
├── fs → shared
├── config → shared, fs
├── db → shared, config
├── auth → shared, db, config
├── adapters → shared, config
├── validators → shared, fs
├── core → shared, fs, adapters, validators, config
├── cli → shared, config, fs, adapters, validators, core
└── api/backend → shared, config, db, auth, core
```

## Troubleshooting

### Build fails with "Cannot find module"

```bash
pnpm install
pnpm run clean
pnpm run build
```

### Port already in use

```bash
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend
```

### Turbo cache issues

```bash
pnpm run clean
pnpm run build --force
```

### MongoDB connection refused

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start it if needed
brew services start mongodb-community
```

### pnpm not found

```bash
corepack enable pnpm
corepack prepare pnpm@latest --activate
```
