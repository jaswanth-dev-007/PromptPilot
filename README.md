# PromptPilot

AI-powered SaaS platform that transforms product ideas into complete specification suites — PRD, SRS, architecture, database schema, API spec, user flows, wireframes, and roadmap — in minutes.

## Quick Start

```bash
git clone https://github.com/promptpilot/promptpilot.git
cd promptpilot

# Install dependencies and setup environment
pnpm install
cp .env.example .env

# Build and run
pnpm run build
pnpm dev
```

- Frontend → http://localhost:3000
- Backend health → http://localhost:3001/health
- Full setup guide → [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Architecture

```
apps/
├── frontend/    Next.js 15 (App Router) + React 19 + TypeScript
├── api/         Express REST API
└── backend/     Express API server

packages/
├── shared/      Error classes, logger, token counting
├── config/      Zod schema, env validation, feature flags
├── auth/        JWT + bcrypt authentication
├── db/          Mongoose connection + models
├── ui/          Shared React components
├── types/       Shared TypeScript types
├── validation/  Zod schemas + validators
├── core/        Pipeline orchestration engine
├── adapters/    LLM provider adapters (OpenAI, Anthropic)
├── cli/         Commander CLI
├── ai/          AI provider layer
├── database/    Prisma layer
└── editor/      Collaborative editor
```

## Commands

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start all services        |
| `pnpm dev:frontend` | Frontend only (port 3000) |
| `pnpm dev:backend`  | Backend only (port 3001)  |
| `pnpm build`        | Build all packages        |
| `pnpm test`         | Run all tests             |
| `pnpm lint`         | Lint all packages         |
| `pnpm format`       | Prettier check            |
| `pnpm typecheck`    | TypeScript check          |
| `pnpm ci`           | Full CI pipeline          |

## Tech Stack

**Frontend:** Next.js 15 • React 19 • TypeScript • Tailwind CSS
**Backend:** Express • TypeScript • Mongoose • Prisma • Zod
**Infrastructure:** pnpm workspaces • TurboRepo • Docker • GitHub Actions
**Auth:** JWT (access + refresh tokens) • bcrypt (12 rounds)

## Documentation

- [Development Guide](docs/DEVELOPMENT.md) — setup, project structure, troubleshooting
- [Product Requirements](docs/PRD.md) — feature overview, technical requirements
- [Observations](docs/Observations.md) — architecture notes, known limitations

## License

MIT © PromptPilot
