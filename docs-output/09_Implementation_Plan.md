# Engineering Implementation Plan · PromptPilot

**Version:** 1.0.0
**Status:** Approved — Blueprint for Development
**Author:** Chief Software Architect & Engineering Manager
**Last Updated:** 2026-07-19
**Source of Truth:** `docs/00_Master_Context.md` v1.0.0, `docs-output/PRD.md` v1.0.0

---

## 1. Development Strategy

### 1.1 Strategy Overview

PromptPilot follows an **Open-Core, CLI-First, Incremental Delivery** development strategy. The open-source CLI is the foundation. Every feature ships there first. Commercial tiers (Pro, Enterprise) layer hosted services on top of the same codebase. The development philosophy mirrors the product philosophy: start minimal, prove value, then expand.

### 1.2 Key Strategic Decisions

| Decision                                                       | Rationale                                                                                                        | Reference                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **CLI-first, not web-first**                                   | The CLI is the product for MVP. A web UI is P3. Resources focus on CLI excellence.                               | Master Context §8 (Design Philosophy), PRD §15.1 |
| **TypeScript monolith for CLI, microservices for hosted tier** | The CLI is a single stateless process. The hosted tier adds a web server, database, and background workers.      | Master Context §14 (Architecture Principles)     |
| **npm as the distribution channel**                            | No custom installer. `npm install -g promptpilot` is the only installation method.                               | PRD §15.1, US-001                                |
| **Markdown as the universal format**                           | All prompts and all generated artifacts are markdown. No proprietary formats in v1.                              | Master Context §10 (UI Standards), PRD §16       |
| **Pluggable LLM adapters from day one**                        | The adapter interface is designed before any adapter is implemented. Every adapter implements the same contract. | PRD FR-051, FR-052, FR-053                       |
| **File-system as state**                                       | The pipeline has no database. File existence and modification timestamps encode pipeline state.                  | Master Context §14.3                             |

### 1.3 Development Methodology

- **Methodology:** Scrum with 2-week sprints.
- **Sprint Ceremonies:** Daily standup (15 min), Sprint Planning (2 hours, first day), Sprint Review + Retro (1.5 hours, last day), Backlog Refinement (1 hour, mid-sprint).
- **Definition of Ready:** Story has acceptance criteria, FR ID reference, complexity estimate (S/M/L/XL), and no external blockers.
- **Definition of Done:** See §18.

### 1.4 Branching Strategy

- **Main branch:** `main` — always deployable. Protected. Requires PR + 1 review + passing CI.
- **Feature branches:** `feature/<short-description>` — branched from `main`, merged back via PR.
- **Release branches:** `release/v<major>.<minor>` — created from `main` for stabilization before publish.
- **Commit convention:** `<type>(<scope>): <description>` where type is `feat`, `fix`, `docs`, `test`, `refactor`, `chore`. Example: `feat(cli): add validate command with structural checks`.
- **PR naming:** `[FR-XXX] Brief description of change`.

---

## 2. Monorepo Structure

```
promptpilot/
├── packages/
│   ├── cli/                    # CLI entry point, command handlers, formatters
│   │   ├── src/
│   │   │   ├── commands/       # One file per command (init.ts, run.ts, validate.ts, etc.)
│   │   │   ├── formatters/     # Output formatting (color, plain, json)
│   │   │   ├── middleware/     # Pre-flight checks, version check, config loading
│   │   │   ├── cli.ts          # Entry point — argument parsing via Commander.js
│   │   │   └── types.ts        # CLI-specific types
│   │   ├── test/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   └── package.json
│   │
│   ├── core/                   # Pipeline engine, context assembly, prompt manager
│   │   ├── src/
│   │   │   ├── pipeline/       # Pipeline orchestrator, step detection, parallel runner
│   │   │   ├── context/        # Context assembly, truncation, window management
│   │   │   ├── prompts/        # Template loader, variable injection, validation
│   │   │   ├── manifest/       # promptpilot.json parser and validator
│   │   │   └── types.ts        # Core types (PipelineStep, Artifact, Manifest, etc.)
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── adapters/               # LLM provider adapters
│   │   ├── src/
│   │   │   ├── base.ts         # Abstract Adapter interface + BaseAdapter class
│   │   │   ├── openai.ts       # OpenAI adapter
│   │   │   ├── anthropic.ts    # Anthropic adapter
│   │   │   ├── google.ts       # Google AI adapter (P2)
│   │   │   ├── ollama.ts       # Ollama adapter (P1)
│   │   │   ├── factory.ts      # Adapter factory — selects adapter by provider name
│   │   │   ├── retry.ts        # Retry logic with exponential backoff
│   │   │   └── types.ts        # Adapter types (ModelOptions, GenerationResult)
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── validators/             # Validation engine
│   │   ├── src/
│   │   │   ├── structural.ts   # Structural validation (section presence, headers)
│   │   │   ├── markdown.ts     # Markdown syntax validation
│   │   │   ├── cross-ref.ts    # Cross-reference validation
│   │   │   ├── quality.ts      # Quality scoring heuristics
│   │   │   ├── rules/          # Per-artifact validation rules
│   │   │   │   ├── prd.ts
│   │   │   │   ├── srs.ts
│   │   │   │   ├── architecture.ts
│   │   │   │   └── ...
│   │   │   └── types.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── fs/                     # File system operations
│   │   ├── src/
│   │   │   ├── scaffold.ts     # Directory scaffolding (promptpilot init)
│   │   │   ├── reader.ts       # File reading with caching
│   │   │   ├── writer.ts       # Atomic file writing (temp + rename)
│   │   │   ├── watcher.ts      # File watcher (for --watch command)
│   │   │   └── types.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── config/                 # Configuration management
│   │   ├── src/
│   │   │   ├── loader.ts       # Load config from promptpilot.json + .env + env vars
│   │   │   ├── schema.ts       # Zod schema for config validation
│   │   │   ├── defaults.ts     # Default configuration values
│   │   │   └── types.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   └── shared/                 # Shared utilities and types
│       ├── src/
│       │   ├── errors.ts       # Typed error classes (PromptPilotError, ValidationError, etc.)
│       │   ├── logger.ts       # Structured logger (pino or winston)
│       │   ├── tokens.ts       # Token counting utilities (tiktoken or equivalent)
│       │   └── types.ts        # Shared types used across packages
│       └── package.json
│
├── bin/
│   └── promptpilot.js          # npm bin entry point (#!/usr/bin/env node)
│
├── docs/                       # Prompt templates (shipped with CLI, read-only)
│   ├── 00_Master_Context.md
│   ├── 01_PRD_Prompt.md
│   ├── 02_SRS_Prompt.md
│   ├── 03_System_Architecture_Prompt.md
│   ├── 04_Database_Schema_Prompt.md
│   ├── 05_API_Specification_Prompt.md
│   ├── 06_User_Flow_Prompt.md
│   ├── 07_UI_Wireframes_Prompt.md
│   └── 08_Feature_Roadmap_Prompt.md
│
├── templates/                  # Default pipeline scaffold (copied on `promptpilot init`)
│   ├── docs/
│   │   └── 00_Master_Context.md
│   ├── docs-output/
│   │   ├── .gitkeep
│   │   ├── PRD.md
│   │   ├── SRS.md
│   │   ├── Architecture.md
│   │   ├── Database.md
│   │   ├── API.md
│   │   ├── UserFlow.md
│   │   ├── Wireframes.md
│   │   └── Roadmap.md
│   └── promptpilot.json
│
├── scripts/
│   ├── build.sh
│   ├── release.sh
│   └── test-all.sh
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI pipeline (lint, typecheck, test, build)
│   │   ├── release.yml         # npm publish workflow
│   │   └── prompt-validate.yml # Prompt validation regression suite
│   └── ISSUE_TEMPLATE/
│
├── .editorconfig
├── .eslintrc.json
├── .prettierrc
├── tsconfig.base.json
├── tsconfig.json
├── package.json                # Root package.json (workspaces)
├── README.md
├── LICENSE                     # MIT
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## 3. Folder Structure

### 3.1 Package Dependency Graph

```
┌──────────┐
│   cli    │  → depends on: core, adapters, validators, fs, config, shared
└────┬─────┘
     │
┌────▼─────┐
│   core   │  → depends on: adapters, validators, fs, config, shared
└────┬─────┘
     │
┌────▼──────┐
│ validators│  → depends on: fs, shared
└───────────┘

┌──────────┐
│ adapters │  → depends on: config, shared
└──────────┘

┌──────────┐
│    fs    │  → depends on: shared
└──────────┘

┌──────────┐
│  config  │  → depends on: fs, shared
└──────────┘

┌──────────┐
│  shared  │  → depends on: nothing (leaf package)
└──────────┘
```

The dependency graph is strictly acyclic. `shared` is the leaf — every package depends on it. `cli` is the root — nothing depends on it.

### 3.2 npm Workspaces Configuration

Root `package.json`:

```json
{
  "name": "promptpilot",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "tsc -b",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint packages --ext .ts",
    "format": "prettier --check packages",
    "format:fix": "prettier --write packages",
    "typecheck": "tsc -b --noEmit",
    "clean": "rimraf packages/*/dist",
    "dev": "tsx watch packages/cli/src/cli.ts",
    "release": "bash scripts/release.sh"
  }
}
```

Each package has its own `package.json` with:

- `"name": "@promptpilot/<package-name>"`
- `"main": "./dist/index.js"`
- `"types": "./dist/index.d.ts"`
- Scripts: `build`, `test`, `clean`

### 3.3 TypeScript Configuration

`tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

Each package extends `tsconfig.base.json` with its own `rootDir` and `outDir`. Strict mode is enabled. No exceptions.

---

## 4. Backend Module Breakdown

> Note: PromptPilot's "backend" in the OSS tier is the CLI itself — a stateless Node.js process. The "backend" for the hosted tier (P3) is a separate web service. This section covers the CLI backend modules.

### 4.1 CLI Layer (`packages/cli`)

| Aspect               | Detail                                                                                                                                                                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**          | Parse user input, dispatch to the correct command handler, format output, manage the user interaction loop.                                                                                                                                                           |
| **FR IDs**           | FR-001 through FR-025 (all CLI commands)                                                                                                                                                                                                                              |
| **Key Dependencies** | Commander.js (argument parsing), chalk (color output), ora (spinners), inquirer (interactive prompts)                                                                                                                                                                 |
| **Entry Point**      | `src/cli.ts` — registers all commands and subcommands with Commander.js                                                                                                                                                                                               |
| **Key Files**        | `commands/init.ts`, `commands/run.ts`, `commands/validate.ts`, `commands/config.ts`, `commands/status.ts`, `commands/diff.ts`, `commands/watch.ts`, `commands/export.ts`, `commands/prompt.ts`, `formatters/pretty.ts`, `formatters/plain.ts`, `middleware/checks.ts` |

**Command Handler Pattern (every command follows this):**

```typescript
import { Command } from 'commander'
import { loadConfig } from '@promptpilot/config'

export function registerInitCommand(program: Command): void {
  program
    .command('init [project-name]')
    .description('Scaffold a new PromptPilot project')
    .option('--description <desc>', 'One-line product description')
    .option('--audience <audience>', 'Target audience')
    .option('--platform <platform>', 'Target platform')
    .option('--domain <domain>', 'Industry domain')
    .action(async (projectName, options) => {
      // 1. Validate inputs
      // 2. Load/merge config
      // 3. Delegate to core/scaffold
      // 4. Format and display output
      // 5. Show next step hint
    })
}
```

### 4.2 Pipeline Engine (`packages/core/src/pipeline`)

| Aspect             | Detail                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Purpose**        | Orchestrate prompt execution: determine what to run next, assemble context, execute prompts, manage state. |
| **FR IDs**         | FR-003, FR-004, FR-101, FR-102, FR-103, FR-108                                                             |
| **Key Interfaces** | `PipelineEngine`, `StepResolver`, `ContextAssembler`, `ParallelRunner`                                     |

**Key Types:**

```typescript
interface PipelineStep {
  id: string
  name: string
  promptPath: string
  outputPath: string
  dependencies: string[]
  parallelSafe: boolean
  recommendedModels: string[]
}

interface Artifact {
  path: string
  exists: boolean
  lastModified: Date
  stale: boolean
  validationScore?: number
}

interface PipelineState {
  steps: Map<string, PipelineStep>
  artifacts: Map<string, Artifact>
  completedSteps: string[]
  nextStep: PipelineStep | null
  staleArtifacts: string[]
}
```

**Core Functions:**

| Function           | Signature                                                                                        | Purpose                                                | FR ID          |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | -------------- |
| `getPipelineState` | `(manifest: Manifest, outputDir: string) => PipelineState`                                       | Scan filesystem, determine pipeline state              | FR-101         |
| `getNextStep`      | `(state: PipelineState) => PipelineStep \| null`                                                 | Find the next uncompleted step with all deps satisfied | FR-101         |
| `assembleContext`  | `(step: PipelineStep, artifacts: Map<string, Artifact>, promptManager: PromptManager) => string` | Read upstream artifacts, inject into prompt template   | FR-102         |
| `runStep`          | `(step: PipelineStep, context: string, adapter: Adapter) => Promise<GenerationResult>`           | Execute a single prompt step                           | FR-002         |
| `runPipeline`      | `(manifest: Manifest, adapter: Adapter, options: RunOptions) => Promise<PipelineResult>`         | Execute sequential or parallel pipeline                | FR-003, FR-004 |
| `runParallel`      | `(steps: PipelineStep[], adapter: Adapter) => Promise<GenerationResult[]>`                       | Execute independent steps concurrently                 | FR-004         |

### 4.3 Prompt Manager (`packages/core/src/prompts`)

| Aspect        | Detail                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------- |
| **Purpose**   | Load prompt templates, inject variables, validate prompt structure, manage template versions. |
| **FR IDs**    | FR-013, FR-014, FR-015, FR-105, FR-106                                                        |
| **Key Files** | `loader.ts`, `injector.ts`, `validator.ts`, `versioner.ts`                                    |

**Template Loading Flow:**

```
User Project (docs/01_PRD_Prompt.md)
  OR
Built-in Template (promptpilot/docs/01_PRD_Prompt.md)
    ↓
Prompt Loader (reads file)
    ↓
Variable Injector (replaces {PRODUCT_NAME}, {ONE_LINE_DESCRIPTION}, etc.)
    ↓
Context Assembler (injects upstream artifacts)
    ↓
Final Prompt String → LLM Adapter
```

**Variable Injection Rules:**

- Variables are defined as `{VARIABLE_NAME}` in templates.
- User-provided values are sanitized: HTML entities escaped, no markdown injection.
- Unknown variables trigger a warning, not an error — the LLM can often infer defaults.
- Variables are resolved from: CLI flags → `promptpilot.json` → environment variables → interactive prompt.

### 4.4 LLM Adapters (`packages/adapters`)

| Aspect        | Detail                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Purpose**   | Abstract all LLM API calls behind a consistent interface. Handle rate limiting, retries, streaming, and token counting. |
| **FR IDs**    | FR-051 through FR-063                                                                                                   |
| **Key Files** | `base.ts` (Adapter interface), `openai.ts`, `anthropic.ts`, `google.ts`, `ollama.ts`, `factory.ts`, `retry.ts`          |

**Adapter Interface:**

```typescript
interface Adapter {
  readonly provider: string
  readonly model: string

  generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>
  generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>
  countTokens(text: string): number
  healthCheck(): Promise<HealthCheckResult>
  readonly maxContextTokens: number
}

interface GenerateOptions {
  temperature: number
  maxTokens: number
  stream: boolean
  signal?: AbortSignal
}

interface GenerationResult {
  content: string
  inputTokens: number
  outputTokens: number
  model: string
  duration: number
  cost: number
}
```

**Adapter Implementation Priority:**

1. `openai.ts` — First adapter built. Used for all initial development and testing. (FR-052, P0)
2. `anthropic.ts` — Second adapter. Built immediately after OpenAI. (FR-053, P0)
3. `ollama.ts` — Third adapter. Built during Post-MVP phase. (FR-055, P1)
4. `google.ts` — Fourth adapter. Built during Enhancement phase. (FR-054, P2)

**Retry Strategy (implemented once, used by all adapters):**

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = { maxRetries: 3, baseDelay: 1000 },
): Promise<T> {
  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === options.maxRetries || !isRetryable(error)) throw error
      await sleep(options.baseDelay * Math.pow(2, attempt))
    }
  }
  throw new Error('unreachable')
}

function isRetryable(error: unknown): boolean {
  // Retry on: 429 (rate limit), 5xx (server error), network errors
  // Don't retry on: 4xx (auth, bad request)
}
```

### 4.5 Validation Engine (`packages/validators`)

| Aspect        | Detail                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**   | Validate generated artifacts for structural completeness, markdown syntax, and cross-reference integrity. Assign quality scores. |
| **FR IDs**    | FR-005, FR-006, FR-081 through FR-088                                                                                            |
| **Key Files** | `structural.ts`, `markdown.ts`, `cross-ref.ts`, `quality.ts`, `rules/prd.ts`, `rules/srs.ts`, etc.                               |

**Validation Pipeline (runs in order):**

```
Generated Artifact (docs-output/PRD.md)
    ↓
1. Markdown Syntax Validation — checks CommonMark compliance
    ↓
2. Structural Validation — checks required sections exist, headers are correct level
    ↓
3. Cross-Reference Validation (--strict only) — checks FR IDs, API IDs, persona names
    ↓
4. Quality Scoring — heuristic scoring based on completeness
    ↓
ValidationReport { errors[], warnings[], info[], score }
```

**Per-Artifact Validation Rules:**

```typescript
interface ValidationRule {
  artifactType: string
  requiredSections: string[]
  requiredHeaders: { level: number; text: string }[]
  minSectionLength: Record<string, number>
  forbiddenPatterns: RegExp[] // e.g., /TODO|TBD|Lorem ipsum/
  crossReferencePatterns: RegExp[] // e.g., /FR-\d{3}/
}
```

### 4.6 File System (`packages/fs`)

| Aspect        | Detail                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| **Purpose**   | All file I/O: scaffolding, reading, writing, watching, atomic operations. |
| **FR IDs**    | FR-001 (scaffolding), FR-108 (atomic writes)                              |
| **Key Files** | `scaffold.ts`, `reader.ts`, `writer.ts`, `watcher.ts`                     |

**Atomic Write Pattern:**

```typescript
async function atomicWrite(filePath: string, content: string): Promise<void> {
  const tmpPath = `${filePath}.tmp.${Date.now()}`
  await fs.writeFile(tmpPath, content, 'utf-8')
  await fs.rename(tmpPath, filePath) // Atomic on same filesystem
}
```

This prevents corruption if the process is killed mid-write (NFR-R04).

### 4.7 Configuration (`packages/config`)

| Aspect        | Detail                                                         |
| ------------- | -------------------------------------------------------------- |
| **Purpose**   | Load, validate, and merge configuration from multiple sources. |
| **FR IDs**    | FR-007, FR-008                                                 |
| **Key Files** | `loader.ts`, `schema.ts`, `defaults.ts`                        |

**Config Resolution Order (later overrides earlier):**

1. Hardcoded defaults (`defaults.ts`)
2. Global config (`~/.promptpilot/config.json`)
3. Project config (`./promptpilot.json`)
4. Environment variables (`OPENAI_API_KEY`, etc.)
5. CLI flags (`--model`, `--temperature`, etc.)

**Zod Schema:**

```typescript
const ConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'ollama']).default('openai'),
  model: z.string().default('gpt-4o'),
  temperature: z.number().min(0).max(2).default(0.2),
  maxTokens: z.number().min(100).max(200000).default(16000),
  outputDir: z.string().default('./docs-output'),
  promptDir: z.string().default('./docs'),
  parallel: z.boolean().default(false),
  stream: z.boolean().default(true),
  verbose: z.boolean().default(false),
  providers: z
    .object({
      openai: z.object({ apiKey: z.string().optional() }).optional(),
      anthropic: z.object({ apiKey: z.string().optional() }).optional(),
      ollama: z.object({ baseUrl: z.string().default('http://localhost:11434') }).optional(),
    })
    .default({}),
})
```

### 4.8 Shared (`packages/shared`)

| Aspect        | Detail                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| **Purpose**   | Shared utilities: typed errors, logging, token counting. Every package depends on this. |
| **Key Files** | `errors.ts`, `logger.ts`, `tokens.ts`                                                   |

**Error Hierarchy:**

```typescript
class PromptPilotError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestion?: string,
  ) {
    super(message)
  }
}

class ConfigError extends PromptPilotError {
  /* ... */
}
class ValidationError extends PromptPilotError {
  /* ... */
}
class AdapterError extends PromptPilotError {
  /* ... */
}
class PipelineError extends PromptPilotError {
  /* ... */
}
class FileSystemError extends PromptPilotError {
  /* ... */
}
```

Every error thrown by PromptPilot extends `PromptPilotError` and includes a user-facing suggestion when possible (NFR-U04).

---

## 5. Frontend Module Breakdown

> Note: PromptPilot MVP is CLI-only. There is no frontend in Phase 0-2. This section defines the frontend modules that will be built in Phase 6 (Growth, P3). All frontend work is post-MVP.

### 5.1 Web Dashboard (P3)

| Aspect         | Detail                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Purpose**    | Hosted web UI for team workspaces, analytics, billing, and marketplace browsing.                |
| **FR IDs**     | FR-131 through FR-135 (Collaboration), FR-201 through FR-205 (Analytics), FR-234 (Subscription) |
| **Tech Stack** | React 19, TypeScript, Tailwind CSS, React Router, TanStack Query, Zustand (state)               |
| **Deployment** | Vercel or Cloudflare Pages. Static site with API calls to hosted backend.                       |

**Module Breakdown:**

| Module                 | Purpose                                                 | Key Screens                                         |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| **Auth Module**        | Sign up, login, SSO, password reset, email verification | Login, Register, Forgot Password, SSO Callback      |
| **Workspace Module**   | Project listing, member management, role assignment     | Workspace List, Workspace Detail, Members, Settings |
| **Artifact Viewer**    | View, search, and navigate generated artifacts          | Artifact List, Artifact Detail, Diff View           |
| **Review Module**      | Review workflow: submit, comment, approve/reject        | Review Queue, Review Detail, Comment Thread         |
| **Analytics Module**   | Dashboards for usage, cost, and quality metrics         | Usage Dashboard, Cost Breakdown, Quality Trends     |
| **Marketplace Module** | Browse, search, install prompt packs                    | Marketplace Browse, Pack Detail, My Packs           |
| **Billing Module**     | Subscription management, invoices, payment methods      | Plans, Billing, Invoice History                     |
| **Admin Module**       | Workspace settings, audit logs, SSO configuration       | Admin Settings, Audit Log, Team Settings            |

### 5.2 VS Code Extension (P3)

| Aspect           | Detail                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| **Purpose**      | In-editor artifact preview, one-click prompt execution, diff view.                                       |
| **FR IDs**       | FR-253                                                                                                   |
| **Tech Stack**   | TypeScript, VS Code Extension API                                                                        |
| **Key Features** | Sidebar with pipeline status, inline artifact preview, command palette integration, status bar indicator |

---

## 6. Database Migration Order

> Note: The OSS CLI is stateless — no database. The hosted tier (P3) requires a database for workspaces, users, prompt packs, and analytics. This section defines the migration plan for the hosted tier.

### 6.1 Database Technology

| Layer              | Technology                  | Version | Purpose                                                                    |
| ------------------ | --------------------------- | ------- | -------------------------------------------------------------------------- |
| **Primary DB**     | PostgreSQL                  | 16.x    | Users, workspaces, prompt packs, reviews, billing                          |
| **Cache**          | Redis                       | 7.x     | Session storage, rate limiting, analytics cache                            |
| **Search**         | PostgreSQL full-text search | —       | Prompt pack search (sufficient for v1; Elasticsearch considered for scale) |
| **Object Storage** | S3 / Cloudflare R2          | —       | Prompt pack file storage, generated artifact backups                       |

### 6.2 Migration Order

Migrations are numbered sequentially. Each migration is a single SQL file with `UP` and `DOWN` sections.

| Order    | Migration            | Tables Created                                        | FR IDs                 | Dependencies |
| -------- | -------------------- | ----------------------------------------------------- | ---------------------- | ------------ |
| **M001** | Initial schema       | `users`, `sessions`                                   | FR-131 (auth)          | None         |
| **M002** | Workspaces           | `workspaces`, `workspace_members`                     | FR-131                 | M001         |
| **M003** | Projects & artifacts | `projects`, `artifacts`, `artifact_versions`          | FR-131, FR-201         | M002         |
| **M004** | Prompt packs         | `prompt_packs`, `pack_versions`, `pack_tags`          | FR-171                 | M002         |
| **M005** | Reviews              | `reviews`, `review_comments`                          | FR-133                 | M003         |
| **M006** | Analytics            | `pipeline_runs`, `token_usage`, `cost_events`         | FR-201, FR-203, FR-204 | M003         |
| **M007** | Marketplace          | `pack_ratings`, `pack_downloads`, `pack_dependencies` | FR-175                 | M004         |
| **M008** | Billing              | `subscriptions`, `invoices`, `payment_methods`        | FR-234                 | M001         |
| **M009** | Notifications        | `notifications`, `notification_preferences`           | FR-285                 | M001         |
| **M010** | Audit                | `audit_logs`, `api_keys`                              | FR-233 (Enterprise)    | M001         |

### 6.3 Migration Tooling

- **Tool:** `node-pg-migrate` or `knex` migrations.
- **Naming:** `YYYYMMDDHHMMSS_description.js` (timestamped).
- **Execution:** Run in CI before deploy. Rollback available via `DOWN` script.
- **Zero-Downtime:** Additive changes only (no column drops in production). Deprecate columns over 2 releases before dropping.

---

## 7. API Development Order

> Note: The OSS CLI has no API server. The API Specification (`docs-output/API.md`) will define endpoints for the hosted tier. This section defines the implementation order for those endpoints when Phase 6 begins. In the interim, the CLI's internal module interfaces serve as the "API."

### 7.1 Development Order (By Dependency Chain)

APIs are built in dependency order: endpoints with no dependencies first, then those that depend on them.

| Order  | Endpoint Group    | Endpoints                                                                                                       | FR IDs                 | Depends On          |
| ------ | ----------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------- |
| **1**  | Auth              | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`                            | User management        | None (foundational) |
| **2**  | User Profile      | `GET /users/me`, `PATCH /users/me`, `DELETE /users/me`                                                          | User CRUD              | Auth (1)            |
| **3**  | Workspaces        | `POST /workspaces`, `GET /workspaces`, `GET /workspaces/:id`, `PATCH /workspaces/:id`, `DELETE /workspaces/:id` | FR-131                 | Auth (1)            |
| **4**  | Workspace Members | `GET /workspaces/:id/members`, `POST /workspaces/:id/invites`, `DELETE /workspaces/:id/members/:userId`         | FR-131                 | Workspaces (3)      |
| **5**  | Projects          | `POST /workspaces/:id/projects`, `GET /workspaces/:id/projects`, `GET /projects/:id`                            | FR-131                 | Workspaces (3)      |
| **6**  | Artifacts         | `GET /projects/:id/artifacts`, `GET /artifacts/:id`, `POST /projects/:id/generate`                              | FR-131, FR-201         | Projects (5)        |
| **7**  | Reviews           | `POST /artifacts/:id/reviews`, `GET /artifacts/:id/reviews`, `POST /reviews/:id/comments`                       | FR-133                 | Artifacts (6)       |
| **8**  | Prompt Packs      | `GET /packs`, `GET /packs/:name`, `POST /packs`, `POST /workspaces/:id/packs/install`                           | FR-171, FR-173         | Workspaces (3)      |
| **9**  | Analytics         | `GET /workspaces/:id/analytics/usage`, `GET /workspaces/:id/analytics/costs`                                    | FR-201, FR-203, FR-204 | Artifacts (6)       |
| **10** | Billing           | `GET /billing/plans`, `POST /billing/subscribe`, `GET /billing/invoices`                                        | FR-234                 | Auth (1)            |

### 7.2 API Implementation Guidelines

- Every endpoint is implemented as a thin handler that validates input, calls a service, and returns formatted output.
- Service layer contains all business logic. Controllers are stateless.
- Request/response validation uses Zod schemas shared between frontend and backend.
- Every endpoint has an integration test that tests the full request → response cycle with a real database (test container).

---

## 8. Authentication Implementation Order

### 8.1 Authentication Architecture

The OSS CLI has no authentication. Users bring their own LLM API keys. The hosted tier (P3) adds authentication.

| Component            | Technology                                     | FR IDs                      |
| -------------------- | ---------------------------------------------- | --------------------------- |
| **Password Hashing** | bcrypt or argon2                               | NFR-S02                     |
| **JWT Tokens**       | Access token (15 min) + Refresh token (7 days) | Auth API                    |
| **Session Storage**  | Redis (refresh tokens)                         | Auth API                    |
| **OAuth / SSO**      | OpenID Connect (Google, GitHub, SAML)          | FR-233 (Enterprise)         |
| **API Key Auth**     | For CLI-to-hosted-API communication            | Marketplace, CI integration |

### 8.2 Implementation Order

| Step    | Task                                                             | Depends On |
| ------- | ---------------------------------------------------------------- | ---------- |
| **A1**  | Implement password hashing utilities (bcrypt wrapper)            | None       |
| **A2**  | Implement JWT generation and verification                        | A1         |
| **A3**  | Build `/auth/register` endpoint — email + password registration  | A1, A2     |
| **A4**  | Build `/auth/login` endpoint — returns access + refresh tokens   | A1, A2     |
| **A5**  | Build `/auth/refresh` endpoint — refresh token rotation          | A2         |
| **A6**  | Build `/auth/logout` — invalidates refresh token                 | A2         |
| **A7**  | Implement session middleware (validates JWT on protected routes) | A2, A3     |
| **A8**  | Build email verification flow (send email, verify token)         | A3         |
| **A9**  | Build password reset flow                                        | A3, A8     |
| **A10** | Implement RBAC middleware (Admin, Editor, Viewer)                | A7         |
| **A11** | Build OAuth / SSO integration (Google, GitHub)                   | A10        |
| **A12** | Build SAML integration (Enterprise)                              | A10        |

---

## 9. AI Pipeline Implementation

The AI Pipeline is the core of PromptPilot. This is built first, before any other feature.

### 9.1 Pipeline Architecture

```
User Input → promptpilot run
    ↓
Pipeline Engine (packages/core)
    ├── 1. Load Manifest (promptpilot.json)
    ├── 2. Detect State (which artifacts exist)
    ├── 3. Determine Next Step
    ├── 4. Assemble Context (read upstream artifacts)
    ├── 5. Inject Variables (from config, env, CLI flags)
    ├── 6. Select Adapter (provider + model)
    ├── 7. Execute (call LLM API)
    ├── 8. Validate Output (structural + markdown)
    ├── 9. Write Artifact (atomic write to docs-output/)
    └── 10. Report (display token usage, cost, next step)
```

### 9.2 Implementation Sequence

| Step    | Task                                                                                  | Module   | FR IDs | Effort |
| ------- | ------------------------------------------------------------------------------------- | -------- | ------ | ------ |
| **P1**  | Define `PipelineStep`, `Artifact`, `PipelineState` types                              | core     | —      | S      |
| **P2**  | Implement `ManifestLoader` — reads and validates `promptpilot.json`                   | core     | FR-104 | S      |
| **P3**  | Implement `StateDetector` — scans `docs-output/` for existing artifacts               | core     | FR-101 | M      |
| **P4**  | Implement `StepResolver` — finds next incomplete step with satisfied deps             | core     | FR-101 | S      |
| **P5**  | Implement `ContextAssembler` — reads upstream artifacts and constructs prompt context | core     | FR-102 | L      |
| **P6**  | Implement `ContextTruncator` — handles context windows that exceed model limits       | core     | FR-103 | M      |
| **P7**  | Build OpenAI adapter                                                                  | adapters | FR-052 | M      |
| **P8**  | Build `PipelineRunner` — sequential execution of pipeline steps                       | core     | FR-003 | L      |
| **P9**  | Build the `run` command in CLI — wires everything together                            | cli      | FR-002 | M      |
| **P10** | Build the `run --all` command                                                         | cli      | FR-003 | S      |
| **P11** | Build Anthropic adapter                                                               | adapters | FR-053 | M      |
| **P12** | Build `ParallelRunner` — concurrent execution of independent steps                    | core     | FR-004 | L      |
| **P13** | Build `run --parallel` command                                                        | cli      | FR-004 | M      |
| **P14** | Build Ollama adapter                                                                  | adapters | FR-055 | M      |
| **P15** | Build Google AI adapter                                                               | adapters | FR-054 | M      |

### 9.3 Pipeline Manifest (`promptpilot.json`)

```json
{
  "version": "1.0.0",
  "pipeline": [
    {
      "id": "master-context",
      "name": "Master Context",
      "prompt": "docs/00_Master_Context.md",
      "output": "docs-output/MasterContext.md",
      "dependencies": [],
      "parallelSafe": false,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "prd",
      "name": "Product Requirements Document",
      "prompt": "docs/01_PRD_Prompt.md",
      "output": "docs-output/PRD.md",
      "dependencies": ["master-context"],
      "parallelSafe": false,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "srs",
      "name": "Software Requirements Specification",
      "prompt": "docs/02_SRS_Prompt.md",
      "output": "docs-output/SRS.md",
      "dependencies": ["prd"],
      "parallelSafe": false,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "architecture",
      "name": "System Architecture",
      "prompt": "docs/03_System_Architecture_Prompt.md",
      "output": "docs-output/Architecture.md",
      "dependencies": ["srs"],
      "parallelSafe": false,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "database",
      "name": "Database Schema",
      "prompt": "docs/04_Database_Schema_Prompt.md",
      "output": "docs-output/Database.md",
      "dependencies": ["architecture"],
      "parallelSafe": true,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "api-spec",
      "name": "API Specification",
      "prompt": "docs/05_API_Specification_Prompt.md",
      "output": "docs-output/API.md",
      "dependencies": ["architecture"],
      "parallelSafe": true,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "user-flows",
      "name": "User Flows",
      "prompt": "docs/06_User_Flow_Prompt.md",
      "output": "docs-output/UserFlow.md",
      "dependencies": ["prd"],
      "parallelSafe": true,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "wireframes",
      "name": "UI Wireframes",
      "prompt": "docs/07_UI_Wireframes_Prompt.md",
      "output": "docs-output/Wireframes.md",
      "dependencies": ["user-flows"],
      "parallelSafe": false,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    },
    {
      "id": "roadmap",
      "name": "Feature Roadmap",
      "prompt": "docs/08_Feature_Roadmap_Prompt.md",
      "output": "docs-output/Roadmap.md",
      "dependencies": ["prd", "architecture"],
      "parallelSafe": false,
      "recommendedModels": ["claude-3-5-sonnet", "gpt-4o"]
    }
  ]
}
```

**Notes on parallelSafe:**

- `database` and `api-spec` both depend on `architecture` and are independent of each other → can run in parallel. (PRD §15.2, FR-004)
- `user-flows` depends only on `prd` → can run in parallel with `srs` and `architecture`. (PRD §20.1)

---

## 10. Prompt Engine Implementation

The Prompt Engine is the prompt template management system. It loads, validates, injects variables, and manages versions of prompt templates.

### 10.1 Prompt Engine Architecture

```
Prompt Templates (built-in docs/ or user docs/)
    ↓
Prompt Loader → reads markdown file
    ↓
Variable Injector → replaces {VARIABLES} with user values
    ↓
Prompt Validator → checks required sections exist
    ↓
Prompt (ready for context assembly)
```

### 10.2 Implementation Sequence

| Step    | Task                                                                  | Module | FR IDs | Effort |
| ------- | --------------------------------------------------------------------- | ------ | ------ | ------ |
| **PE1** | Define `PromptTemplate` type and `PromptLoader` class                 | core   | FR-013 | S      |
| **PE2** | Implement `VariableInjector` with sanitization                        | core   | FR-102 | M      |
| **PE3** | Implement `PromptValidator` — checks sections, placeholders, markdown | core   | FR-015 | M      |
| **PE4** | Implement `build prompt validate` CLI command                         | cli    | FR-015 | S      |
| **PE5** | Implement `build prompt edit` CLI command                             | cli    | FR-013 | M      |
| **PE6** | Implement `build prompt reset` CLI command                            | cli    | FR-014 | S      |
| **PE7** | Implement template inheritance (extends keyword in manifest)          | core   | FR-106 | L      |

### 10.3 Variable Injection Implementation

```typescript
interface VariableMap {
  PRODUCT_NAME: string
  ONE_LINE_DESCRIPTION: string
  TARGET_AUDIENCE: string
  PLATFORM: string
  INDUSTRY_DOMAIN: string
}

function injectVariables(template: string, variables: VariableMap): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const sanitized = sanitizeValue(value)
    result = result.replaceAll(`{${key}}`, sanitized)
  }
  // Warn about any remaining unresolved placeholders
  const unresolved = result.match(/\{([A-Z_]+)\}/g)
  if (unresolved) {
    logger.warn(`Unresolved placeholders: ${unresolved.join(', ')}`)
  }
  return result
}

function sanitizeValue(value: string): string {
  // Prevent markdown injection by escaping backticks and template syntax
  return value.replace(/`/g, '\\`').replace(/\{/g, '\\{').replace(/\}/g, '\\}')
}
```

---

## 11. Marketplace Implementation

> All marketplace work is P3. This section defines the plan for when Phase 6 begins.

### 11.1 Marketplace Architecture

```
Prompt Pack Author → promptpilot publish → Registry API → PostgreSQL
                                                    ↓
Prompt Pack Consumer → promptpilot search → Registry API → PostgreSQL
                   → promptpilot install → Download → S3/R2
```

### 11.2 Implementation Sequence

| Step   | Task                                                             | FR IDs         | Effort |
| ------ | ---------------------------------------------------------------- | -------------- | ------ |
| **M1** | Define `PromptPack` schema (name, version, author, dependencies) | FR-171         | M      |
| **M2** | Build Registry API: pack CRUD, search, version management        | FR-171         | L      |
| **M3** | Build `promptpilot publish` CLI command                          | FR-172         | L      |
| **M4** | Build `promptpilot search` CLI command                           | FR-174         | M      |
| **M5** | Build `promptpilot install` CLI command                          | FR-173         | M      |
| **M6** | Build ratings and reviews API                                    | FR-175         | M      |
| **M7** | Build marketplace web UI (browse, search, detail, install)       | FR-171, FR-175 | L      |

---

## 12. Analytics Implementation

> All analytics work is P3. Local analytics (token count, timing) are built into the CLI from Phase 1.

### 12.1 Local Analytics (P0, built into CLI)

- Token usage: counted by the adapter after each LLM call. Displayed in the completion banner. (FR-059, P1)
- Timing: wall-clock time per prompt and total pipeline. Displayed after each run. (FR-059)
- No data persistence. No telemetry. (NFR-S01)

### 12.2 Hosted Analytics (P3)

| Step    | Task                                                                           | FR IDs | Effort |
| ------- | ------------------------------------------------------------------------------ | ------ | ------ |
| **AN1** | Define analytics event schema (event type, project, user, timestamp, metadata) | FR-201 | M      |
| **AN2** | Build analytics ingestion API                                                  | FR-201 | M      |
| **AN3** | Build analytics aggregation pipeline (hourly/daily rollups)                    | FR-203 | L      |
| **AN4** | Build Usage Dashboard web UI                                                   | FR-201 | L      |
| **AN5** | Build Cost Analytics view                                                      | FR-204 | M      |
| **AN6** | Build Team Analytics view                                                      | FR-202 | M      |
| **AN7** | Build Export Analytics (CSV/JSON download)                                     | FR-205 | M      |

---

## 13. Notification Implementation

### 13.1 CLI Notifications (P0, built into CLI)

CLI notifications are implemented as formatted console output. No external notification system.

| Notification               | Implementation                                                               | FR ID  |
| -------------------------- | ---------------------------------------------------------------------------- | ------ |
| **Generation Complete**    | Green banner with artifact path + token count + cost + next step             | FR-281 |
| **Generation Failed**      | Red banner with error type + message + suggested fix + resume command        | FR-282 |
| **Stale Artifact Warning** | Yellow banner before proceeding, with confirmation prompt                    | FR-283 |
| **Update Available**       | Blue info on `promptpilot status` only                                       | FR-284 |
| **Validation Results**     | Errors in red, warnings in yellow, info in blue, file paths and line numbers | FR-005 |

### 13.2 Email Notifications (P3)

| Step   | Task                                                                     | FR IDs | Effort |
| ------ | ------------------------------------------------------------------------ | ------ | ------ |
| **N1** | Integrate email service (Resend, SendGrid, or AWS SES)                   | FR-285 | M      |
| **N2** | Implement email templates (invitation, review, approval, trial, payment) | FR-285 | M      |
| **N3** | Implement notification preference management API                         | FR-285 | S      |
| **N4** | Implement Slack webhook notifications                                    | FR-257 | M      |
| **N5** | Implement Teams webhook notifications                                    | FR-257 | M      |

---

## 14. Settings Module

### 14.1 CLI Configuration (`promptpilot config`)

The settings module is implemented in `packages/config` and exposed via the `config` command.

| Feature                    | Implementation                                                                                     | FR ID  |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ------ |
| `config set <key> <value>` | Writes to `promptpilot.json` in project root. Validates against Zod schema.                        | FR-007 |
| `config get <key>`         | Reads from resolved config (all sources merged). Displays value and source.                        | FR-007 |
| `config list`              | Displays all config values with sources, defaults, and current effective values.                   | FR-007 |
| `config init`              | Interactive wizard. Prompts for provider, model, API keys. Writes to `~/.promptpilot/config.json`. | FR-008 |
| `config unset <key>`       | Removes a config value, reverting to the default.                                                  | FR-007 |

### 14.2 Web Settings (P3)

| Feature                      | Implementation                                          | FR ID           |
| ---------------------------- | ------------------------------------------------------- | --------------- |
| **Profile Settings**         | Name, email, avatar, password change, email preferences | User management |
| **Workspace Settings**       | Name, description, member management, billing           | FR-131          |
| **Notification Preferences** | Per-category email/Slack/Teams toggles                  | FR-285          |
| **API Keys**                 | Generate and manage CLI API keys for CI/CD use          | FR-233          |

---

## 15. Admin Panel

> All admin panel work is P3 (Enterprise tier).

### 15.1 Admin Features

| Feature                    | FR IDs         | Effort |
| -------------------------- | -------------- | ------ |
| **Workspace Management**   | FR-131         | M      |
| **Member Management**      | FR-131         | M      |
| **Role Assignment**        | FR-131         | S      |
| **Audit Logs**             | FR-233         | L      |
| **SSO/SAML Configuration** | FR-233         | L      |
| **Billing Management**     | FR-234         | M      |
| **Usage Reports**          | FR-202, FR-203 | M      |
| **API Key Management**     | FR-233         | M      |

---

## 16. Testing Strategy

### 16.1 Testing Pyramid

```
       ╱  E2E  ╲          ← Few: full pipeline execution with mock LLM
      ╱──────────╲
     ╱Integration ╲       ← Medium: module interactions, file I/O
    ╱──────────────╲
   ╱   Unit Tests   ╲     ← Many: individual functions, classes
  ╱──────────────────╲
```

### 16.2 Testing Matrix

| Level                 | Framework               | Scope                                                              | Target Coverage                             | CI Stage         | FR IDs  |
| --------------------- | ----------------------- | ------------------------------------------------------------------ | ------------------------------------------- | ---------------- | ------- |
| **Unit**              | Vitest                  | Individual functions, classes, pure logic                          | ≥ 85% lines, ≥ 80% branches                 | Pre-commit / PR  | NFR-M02 |
| **Integration**       | Vitest + memfs          | Module interactions, file I/O, config loading, validation pipeline | ≥ 70%                                       | PR               | NFR-M02 |
| **E2E**               | Vitest + execa          | Full CLI commands with mock LLM adapter                            | 1 test per command + 1 full pipeline test   | Merge to main    | —       |
| **Prompt Validation** | Vitest + custom harness | Every prompt template against mock inputs                          | 100% of templates, ≥ 10 inputs per template | PR               | FR-081  |
| **Performance**       | Vitest + bench          | CLI startup, context assembly, pipeline execution                  | Assert all targets from NFR-P01 through P08 | Weekly scheduled | NFR-P01 |

### 16.3 Mock LLM Adapter for Testing

```typescript
class MockAdapter implements Adapter {
  readonly provider = 'mock'
  readonly model = 'mock-model'
  readonly maxContextTokens = 200000

  async generate(prompt: string, options: GenerateOptions): Promise<GenerationResult> {
    // Return a pre-defined response based on which prompt template is being tested
    const promptType = detectPromptType(prompt)
    const response = getCannedResponse(promptType)
    return {
      content: response,
      inputTokens: prompt.length / 4,
      outputTokens: response.length / 4,
      model: 'mock-model',
      duration: 50,
      cost: 0,
    }
  }
}
```

Canned responses are pre-written, realistic markdown artifacts stored in `test/fixtures/`. They contain all required sections and cross-references so validation passes.

### 16.4 Snapshot Testing for Prompt Templates

Every prompt template has a snapshot test that verifies its structure hasn't changed unexpectedly:

```typescript
test('01_PRD_Prompt matches snapshot', async () => {
  const template = await loadPrompt('docs/01_PRD_Prompt.md')
  expect(template).toMatchSnapshot()
})
```

### 16.5 Accessibility Testing

```typescript
test('--plain output contains no unicode', async () => {
  const result = await runCommand('promptpilot run 1 --plain --model mock')
  // Assert no unicode characters (spinners, emoji, box-drawing)
  expect(result.stdout).not.toMatch(/[\u{1F000}-\u{1FFFF}]/u)
  expect(result.stdout).not.toMatch(/[✓✗●○◉◎◉]/)
  expect(result.stdout).toMatch(/\[SUCCESS\]/)
  expect(result.stdout).toMatch(/\[ERROR\]/)
})
```

---

## 17. CI/CD Plan

### 17.1 CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push to `main` and every PR.

| Stage                 | Command                                  | Timeout |
| --------------------- | ---------------------------------------- | ------- |
| **Checkout**          | `actions/checkout@v4`                    | —       |
| **Setup Node**        | `actions/setup-node@v4` with Node 20, 22 | —       |
| **Install**           | `npm ci`                                 | 3 min   |
| **Lint**              | `npm run lint`                           | 2 min   |
| **Format Check**      | `npm run format`                         | 1 min   |
| **Type Check**        | `npm run typecheck`                      | 3 min   |
| **Unit Tests**        | `npm test -- --coverage`                 | 5 min   |
| **Integration Tests** | `npm run test:integration`               | 5 min   |
| **Prompt Validation** | `npm run test:prompts`                   | 3 min   |
| **Build**             | `npm run build`                          | 2 min   |
| **Audit**             | `npm audit --audit-level=high`           | 1 min   |
| **Bundle Size**       | `npx size-limit`                         | 1 min   |

### 17.2 Environment Matrix

| OS             | Node.js | Arch  | Runs              |
| -------------- | ------- | ----- | ----------------- |
| Ubuntu Latest  | 20.x    | x64   | Lint, Test, Build |
| Ubuntu Latest  | 22.x    | x64   | Lint, Test, Build |
| macOS Latest   | 20.x    | arm64 | Test, Build       |
| Windows Latest | 20.x    | x64   | Test, Build       |

### 17.3 Release Pipeline (`.github/workflows/release.yml`)

Triggered by pushing a tag matching `v*.*.*`.

| Stage              | Action                                                   |
| ------------------ | -------------------------------------------------------- |
| **Version Check**  | Verify tag matches `package.json` version                |
| **CI**             | Run full CI pipeline (all stages above)                  |
| **Build**          | Build all packages                                       |
| **E2E Tests**      | Run full pipeline E2E test suite                         |
| **Changelog**      | Generate changelog from conventional commits             |
| **npm Publish**    | `npm publish --access public`                            |
| **GitHub Release** | Create release with changelog                            |
| **Post to CDN**    | Upload prompt templates to CDN for `promptpilot upgrade` |

---

## 18. Definition of Done

A user story or task is **Done** when ALL of the following are true:

### 18.1 Code Quality

- [ ] Code passes ESLint with 0 errors and 0 warnings.
- [ ] Code passes Prettier format check.
- [ ] Code passes TypeScript strict mode type check.
- [ ] Code follows naming conventions (Master Context §13).
- [ ] No `any` types without documented justification.
- [ ] No commented-out code.
- [ ] Imports follow the path alias convention.

### 18.2 Testing

- [ ] Unit tests written for all new functions/classes (≥ 85% coverage for new code).
- [ ] Integration tests written for module interactions.
- [ ] Edge cases covered (empty input, null, error states, max values).
- [ ] All existing tests pass.

### 18.3 Functionality

- [ ] Feature works as described in the user story acceptance criteria.
- [ ] Feature works on macOS, Linux, and Windows (verified in CI).
- [ ] Feature works with `--no-color` and `--plain` flags.
- [ ] Error states produce actionable error messages (NFR-U04).
- [ ] No console.log statements in production code (use `logger` package).

### 18.4 Documentation

- [ ] CLI `--help` output updated if new commands/flags added.
- [ ] README updated if user-facing behavior changed (README-Driven Development, Master Context §18).
- [ ] Inline JSDoc on public APIs.
- [ ] CHANGELOG entry added (under Unreleased).

### 18.5 Review

- [ ] PR reviewed by at least 1 other developer.
- [ ] All review comments resolved.
- [ ] PR description references FR IDs and user story IDs.

---

## 19. Sprint Planning

### 19.1 Sprint Allocation

Each sprint is 2 weeks (10 working days).

### 19.2 Sprint 1: Foundation

| Goal          | Set up the monorepo, CI/CD, and build the first end-to-end flow (`init` → `run` with OpenAI). |
| ------------- | --------------------------------------------------------------------------------------------- |
| **Duration**  | Weeks 1-2                                                                                     |
| **Reference** | PRD §30.1 Phase 0                                                                             |

| Task ID | Task                                                                  | FR IDs | Effort | Dependencies        |
| ------- | --------------------------------------------------------------------- | ------ | ------ | ------------------- |
| T-001   | Initialize monorepo with npm workspaces, TypeScript, ESLint, Prettier | —      | 4h     | None                |
| T-002   | Set up CI/CD pipeline (GitHub Actions)                                | —      | 4h     | T-001               |
| T-003   | Implement `shared` package: errors, logger, types                     | —      | 6h     | T-001               |
| T-004   | Implement `fs` package: reader, writer, atomic writes                 | —      | 8h     | T-003               |
| T-005   | Implement `config` package: loader, schema, defaults                  | FR-007 | 10h    | T-003, T-004        |
| T-006   | Define `Adapter` interface in `adapters/base.ts`                      | FR-051 | 4h     | T-003               |
| T-007   | Implement OpenAI adapter (`adapters/openai.ts`)                       | FR-052 | 12h    | T-006               |
| T-008   | Implement `PipelineStep`, `Artifact` types                            | —      | 2h     | T-003               |
| T-009   | Implement `ManifestLoader`                                            | FR-104 | 4h     | T-004               |
| T-010   | Implement `init` command (CLI + scaffold)                             | FR-001 | 10h    | T-004, T-005        |
| T-011   | Implement `StateDetector` and `StepResolver`                          | FR-101 | 8h     | T-004, T-008, T-009 |
| T-012   | Implement `ContextAssembler` (basic version)                          | FR-102 | 10h    | T-004, T-009        |
| T-013   | Implement `run` command (single step, OpenAI only)                    | FR-002 | 8h     | T-007, T-011, T-012 |

**Sprint 1 Exit Criteria:**

- `promptpilot init` scaffolds a project.
- `promptpilot run 1` generates a PRD using OpenAI.
- CI pipeline passes (lint, typecheck, test, build) on every push.

### 19.3 Sprint 2: MVP Pipeline Complete

| Goal          | Complete the full 9-prompt pipeline, add Anthropic adapter, add `validate` command. |
| ------------- | ----------------------------------------------------------------------------------- |
| **Duration**  | Weeks 3-4                                                                           |
| **Reference** | PRD §30.1 Phase 1                                                                   |

| Task ID | Task                                                      | FR IDs           | Effort | Dependencies |
| ------- | --------------------------------------------------------- | ---------------- | ------ | ------------ |
| T-014   | Implement Anthropic adapter                               | FR-053           | 10h    | T-006        |
| T-015   | Implement `PipelineRunner` (sequential, `run --all`)      | FR-003           | 12h    | T-013        |
| T-016   | Implement Adapter Factory (auto-detect provider)          | FR-056           | 4h     | T-007, T-014 |
| T-017   | Implement markdown validation                             | FR-082           | 8h     | T-003        |
| T-018   | Implement structural validation with per-artifact rules   | FR-081           | 12h    | T-017        |
| T-019   | Implement `validate` command                              | FR-005           | 6h     | T-018        |
| T-020   | Implement `config` command (set, get, list)               | FR-007           | 8h     | T-005        |
| T-021   | Implement `config init` interactive wizard                | FR-008           | 8h     | T-020        |
| T-022   | Implement `help` command system                           | FR-016           | 6h     | T-003        |
| T-023   | Implement `--no-color` and `--plain` flags                | FR-017, FR-018   | 4h     | —            |
| T-024   | Implement pipeline notifications (success/error banners)  | FR-281, FR-282   | 4h     | T-015        |
| T-025   | Write prompt validation tests for all 9 templates         | FR-081           | 10h    | T-018        |
| T-026   | Write E2E test: full 9-prompt pipeline with mock adapter  | —                | 6h     | T-015        |
| T-027   | Write accessibility tests (`--plain` output verification) | NFR-U01, NFR-U03 | 4h     | T-023        |

**Sprint 2 Exit Criteria:**

- Full 9-prompt pipeline runs successfully with both OpenAI and Anthropic.
- `promptpilot validate` reports 0 errors on generated output.
- CI tests pass on macOS, Linux, and Windows.
- Coverage ≥ 85% lines, ≥ 80% branches.

### 19.3 Sprint 3: Beta Polish & Release

| Goal          | Polish CLI output, write comprehensive documentation, prepare for npm publish. |
| ------------- | ------------------------------------------------------------------------------ |
| **Duration**  | Weeks 5-6                                                                      |
| **Reference** | PRD §30.1 Phase 2                                                              |

| Task ID | Task                                                    | FR IDs  | Effort | Dependencies |
| ------- | ------------------------------------------------------- | ------- | ------ | ------------ |
| T-028   | Write README.md with installation, usage, examples, FAQ | —       | 12h    | T-027        |
| T-029   | Write CONTRIBUTING.md                                   | —       | 4h     | —            |
| T-030   | Write CHANGELOG.md (initial)                            | —       | 2h     | —            |
| T-031   | Polish CLI output: colors, spinners, formatting         | FR-281  | 6h     | —            |
| T-032   | Add `promptpilot --version`                             | —       | 1h     | —            |
| T-033   | Add `promptpilot help pipeline`                         | FR-016  | 3h     | —            |
| T-034   | Performance optimization: CLI startup < 500ms           | NFR-P01 | 6h     | —            |
| T-035   | Bundle size optimization: < 20MB                        | NFR-P05 | 4h     | —            |
| T-036   | Set up release pipeline (`release.yml`)                 | —       | 4h     | —            |
| T-037   | Smoke test on clean macOS, Linux, Windows VMs           | NFR-C02 | 6h     | T-036        |
| T-038   | Publish `promptpilot@0.1.0` to npm                      | —       | 2h     | T-037        |
| T-039   | Make GitHub repository public                           | —       | 1h     | T-038        |

**Sprint 3 Exit Criteria:**

- `promptpilot@0.1.0` published on npm.
- GitHub repository public with complete README.
- `npm install -g promptpilot && promptpilot init` works on a clean machine.

### 19.4 Sprint 4-6: Post-MVP Features (P1)

| Goal         | Ollama adapter, parallel execution, custom prompts, streaming, token tracking, retry, stale detection, dry-run, status command. |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Duration** | Weeks 7-12                                                                                                                      |

| Task ID | Task                                                   | FR IDs         | Effort | Sprint          |
| ------- | ------------------------------------------------------ | -------------- | ------ | --------------- |
| T-040   | Implement Ollama adapter                               | FR-055         | 12h    | Sprint 4        |
| T-041   | Implement streaming output (`generateStream`)          | FR-058         | 10h    | Sprint 4        |
| T-042   | Implement retry logic with exponential backoff         | FR-061         | 6h     | Sprint 4        |
| T-043   | Implement `ParallelRunner` and `run --parallel`        | FR-004         | 14h    | Sprint 5        |
| T-044   | Implement token counting and cost tracking             | FR-059         | 8h     | Sprint 5        |
| T-045   | Implement `--dry-run` flag                             | FR-020         | 4h     | Sprint 5        |
| T-046   | Implement `--verbose` flag                             | FR-019         | 4h     | Sprint 5        |
| T-047   | Implement `status` command with pipeline visualization | FR-009         | 12h    | Sprint 6        |
| T-048   | Implement stale artifact detection                     | FR-084, FR-283 | 8h     | Sprint 6        |
| T-049   | Implement custom prompt support (`promptpilot.json`)   | FR-105         | 12h    | Sprint 6        |
| T-050   | Implement `prompt validate` command                    | FR-015         | 6h     | Sprint 6        |
| T-051   | Implement model recommendation display                 | FR-057         | 4h     | Sprint 6        |
| T-052   | Publish `promptpilot@0.2.0`                            | —              | 2h     | End of Sprint 6 |

### 19.5 Sprints 7-10: Enhancement Features (P2)

| Goal         | Google AI, GitHub Action, OpenAPI export, quality scoring, diff, watch, pipeline templates, multi-provider fallback, etc. |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Duration** | Weeks 13-20                                                                                                               |

| Task ID | Task                                                              | FR IDs         | Effort | Sprint           |
| ------- | ----------------------------------------------------------------- | -------------- | ------ | ---------------- |
| T-053   | Implement Google AI adapter                                       | FR-054         | 10h    | Sprint 7         |
| T-054   | Implement multi-provider fallback                                 | FR-062         | 10h    | Sprint 7         |
| T-055   | Implement `diff` command                                          | FR-010         | 14h    | Sprint 7         |
| T-056   | Implement `watch` command                                         | FR-011         | 12h    | Sprint 8         |
| T-057   | Implement quality scoring                                         | FR-085         | 8h     | Sprint 8         |
| T-058   | Implement content linting (placeholder detection)                 | FR-086         | 8h     | Sprint 8         |
| T-059   | Implement OpenAPI export (`export --format openapi`)              | FR-012, FR-254 | 16h    | Sprint 9         |
| T-060   | Build GitHub Action (`promptpilot/generate-action`)               | FR-251         | 14h    | Sprint 9         |
| T-061   | Build git pre-commit hook                                         | FR-252         | 6h     | Sprint 9         |
| T-062   | Implement pipeline hooks                                          | FR-109         | 10h    | Sprint 9         |
| T-063   | Implement pipeline templates (Web App, Mobile, API Service, etc.) | FR-110         | 12h    | Sprint 10        |
| T-064   | Implement `init --from-existing`                                  | FR-024         | 14h    | Sprint 10        |
| T-065   | Implement prompt template inheritance                             | FR-106         | 10h    | Sprint 10        |
| T-066   | Implement pipeline versioning (`promptpilot upgrade`)             | FR-107         | 8h     | Sprint 10        |
| T-067   | Implement `promptpilot doctor` (provider health check)            | FR-063         | 6h     | Sprint 10        |
| T-068   | Publish `promptpilot@1.0.0` (stable)                              | —              | 4h     | End of Sprint 10 |

### 19.6 Sprints 11+: Growth Features (P3)

| Goal         | Hosted tier, team workspaces, marketplace, integrations, billing. |
| ------------ | ----------------------------------------------------------------- |
| **Duration** | Months 7-18                                                       |

These sprints are defined at a feature level (detailed task breakdown happens closer to implementation):

| Feature                             | FR IDs                    | Estimated Sprints |
| ----------------------------------- | ------------------------- | ----------------- |
| Hosted backend + user auth          | User management, Auth API | 3 sprints         |
| Team workspaces + RBAC              | FR-131                    | 2 sprints         |
| Web dashboard (React)               | FR-201, FR-234            | 3 sprints         |
| Prompt pack registry + marketplace  | FR-171 through FR-175     | 3 sprints         |
| Billing + subscription management   | FR-232 through FR-235     | 2 sprints         |
| Analytics dashboard                 | FR-201 through FR-205     | 2 sprints         |
| Review workflow                     | FR-133, FR-134            | 2 sprints         |
| VS Code extension                   | FR-253                    | 2 sprints         |
| Jira / Linear / Notion integrations | FR-255, FR-256            | 2 sprints         |
| Slack / Teams notifications         | FR-257                    | 1 sprint          |
| SSO / SAML (Enterprise)             | FR-233                    | 2 sprints         |

---

## 20. Development Milestones

| Milestone            | Week       | Deliverable                                                             | Exit Criteria                          |
| -------------------- | ---------- | ----------------------------------------------------------------------- | -------------------------------------- |
| **M0: Foundation**   | Week 2     | Monorepo, CI/CD, OpenAI adapter, `init` + `run` working                 | `promptpilot run 1` generates PRD      |
| **M1: MVP**          | Week 4     | Full 9-prompt pipeline, Anthropic adapter, `validate`, `config`, `help` | Full pipeline runs. Validation passes. |
| **M2: Beta Release** | Week 6     | `promptpilot@0.1.0` on npm, public GitHub, complete docs                | npm publish successful                 |
| **M3: Post-MVP**     | Week 12    | P1 features: Ollama, parallel, custom prompts, streaming, status        | All P1 features tested and documented  |
| **M4: Enhancement**  | Week 20    | P2 features: Google AI, GitHub Action, export, diff, watch, quality     | All P2 features shipped                |
| **M5: v1.0 Launch**  | Week 22    | `promptpilot@1.0.0` stable release, press kit, community launch         | v1.0.0 published. 500+ stars.          |
| **M6: Growth**       | Month 7-18 | Hosted tier, marketplace, integrations, billing                         | Paying customers. Marketplace live.    |

---

## 21. Task Dependencies

### 21.1 Critical Path (Must Complete in Order)

```
Monorepo Setup → Shared Package → FS Package → Config Package
                                              ↓
                                      Adapter Interface
                                      ↓
                              OpenAI Adapter → Pipeline Types
                              ↓                    ↓
                         Manifest Loader    State Detector
                              ↓                    ↓
                         Context Assembler    Step Resolver
                              ↓                    ↓
                         `run` Command ←──────────┘
                              ↓
                         Anthropic Adapter
                              ↓
                         Pipeline Runner (`run --all`)
                              ↓
                         Validation Engine → `validate` Command
                              ↓
                         All 9 Prompt Templates Integration
                              ↓
                         Beta Release
```

### 21.2 Parallelizable Work (Can Happen Simultaneously)

- OpenAI and Anthropic adapters can be built in parallel once the interface is defined.
- Validation engine and `config` command can be built in parallel with pipeline work.
- `help`, `--no-color`, `--plain` can be built by a separate developer alongside pipeline work.
- In later phases: Google AI adapter, GitHub Action, and OpenAPI export are fully independent.
- Frontend (web dashboard) and backend API can be built in parallel once API contracts are defined.

---

## 22. Risk Register

| ID    | Risk                                   | Likelihood | Impact | Mitigation Implementation                                                                                                                                                   | Reference              |
| ----- | -------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| R-001 | **LLM Quality Degradation**            | Medium     | High   | Regression test suite with 10 canned inputs per prompt. Run weekly in CI. Alert Slack on regression. Pin model versions.                                                    | PRD §28 R-001          |
| R-002 | **Prompt Injection**                   | Low        | High   | `sanitizeValue()` function that escapes backticks, braces, and markdown syntax. Template-based injection only — never concatenate raw user input. Unit tests for sanitizer. | PRD §28 R-002, NFR-S04 |
| R-003 | **Scope Creep on Prompts**             | High       | Medium | Prompt length budget per template. CI check: prompt templates must be < 8KB. Snapshot tests catch unexpected changes. PR review required for prompt changes.                | PRD §28 R-003          |
| R-004 | **API Cost Barrier**                   | Medium     | Medium | Support Ollama (P1, Sprint 4). Display cost estimates before execution (P2, Sprint 10). Token usage tracking built from Phase 1.                                            | PRD §28 R-004          |
| R-005 | **Output Inconsistency Across Models** | High       | Medium | Model-specific temperature recommendations in manifest. Validation layer catches structural issues regardless of model. Cross-model regression tests.                       | PRD §28 R-005          |
| R-006 | **Fragmented Ecosystem**               | Medium     | Low    | Curation guidelines for marketplace. Verified author program. Prompt pack quality checklist and automated validation before publish.                                        | PRD §28 R-006          |
| R-007 | **Too Niche**                          | Low        | High   | Architecture supports general prompt pipelines, not just planning. `promptpilot.json` manifest is domain-agnostic. Can add any prompt sequence.                             | PRD §28 R-007          |
| R-008 | **Competitor Entry**                   | Medium     | High   | Open-source core ensures survival. Community prompt packs create network effects. Focus on being best-in-class, not broadest.                                               | PRD §28 R-008          |
| R-009 | **User Adoption Friction**             | Medium     | High   | "Immediate value" UX: first artifact must be impressive. Benchmark: PRD quality ≥ 4.2/5. Clear README with screenshots. Interactive onboarding wizard.                      | PRD §28 R-009          |
| R-010 | **Node.js Ecosystem Churn**            | Low        | Low    | Minimal dependencies. CI tests against Node 20, 22, 24. Dependabot for security updates. Pinned dependency versions.                                                        | PRD §28 R-010          |

---

## 23. Code Review Checklist

Every PR must pass this checklist before merge:

### 23.1 Correctness

- [ ] Does the code do what the FR/user story requires?
- [ ] Are edge cases handled (empty input, null, error states, max values)?
- [ ] Are there any race conditions or timing issues?
- [ ] Does it work across platforms (macOS, Linux, Windows)?

### 23.2 Code Style

- [ ] Follows naming conventions (Master Context §13)?
- [ ] No semicolons, single quotes, trailing commas (Prettier)?
- [ ] Functions ≤ 30 lines?
- [ ] No `any` types without documented justification?
- [ ] No commented-out code?
- [ ] Imports use path aliases, not deep relative paths?

### 23.3 Error Handling

- [ ] All errors extend `PromptPilotError`?
- [ ] Error messages are actionable (tell the user what to do)?
- [ ] Errors are never silently swallowed?
- [ ] Network errors have retry logic (if applicable)?

### 23.4 Testing

- [ ] Unit tests for new functions/classes?
- [ ] Integration tests for module interactions?
- [ ] Edge case tests?
- [ ] Do existing tests still pass?
- [ ] Coverage thresholds maintained?

### 23.5 Documentation

- [ ] CLI `--help` updated?
- [ ] README updated (if user-facing)?
- [ ] JSDoc on public APIs?
- [ ] CHANGELOG entry added?

### 23.6 Performance

- [ ] CLI startup time unchanged (< 500ms)?
- [ ] No unnecessary file I/O in hot paths?
- [ ] No synchronous operations on the main thread?
- [ ] Dependencies audited for size impact?

---

## 24. Security Checklist

Every PR and every release must pass this checklist:

### 24.1 Data Security

- [ ] No API keys in code, config files, or logs? (NFR-S02)
- [ ] No telemetry or analytics code? (NFR-S01)
- [ ] All LLM API calls use HTTPS? (NFR-S07)
- [ ] No user data persisted outside the project directory?
- [ ] `.env` is in `.gitignore`?

### 24.2 Input Validation

- [ ] All user-provided values sanitized before prompt injection? (NFR-S04)
- [ ] File paths validated to prevent directory traversal?
- [ ] Config values validated against Zod schema?
- [ ] No `eval()`, `Function()`, or dynamic code execution?
- [ ] No shell command injection in CLI flag parsing?

### 24.3 Dependencies

- [ ] `npm audit` passes with 0 critical/high vulnerabilities? (NFR-S05)
- [ ] New dependency approved and justified?
- [ ] License of new dependency compatible with MIT?

### 24.4 Output Safety

- [ ] Generated artifacts are markdown only, no executable code? (NFR-S06)
- [ ] No user input echoed unsanitized in CLI output?

---

## 25. Performance Checklist

### 25.1 Benchmarks (Must Pass)

| Metric                         | Target              | Measured By                              | NFR ID  |
| ------------------------------ | ------------------- | ---------------------------------------- | ------- |
| CLI startup (cold)             | < 500ms             | `time promptpilot --version`             | NFR-P01 |
| CLI startup (warm)             | < 200ms             | Second invocation within same minute     | NFR-P01 |
| Context assembly (9 artifacts) | < 2s                | Unit benchmark                           | NFR-P07 |
| Single prompt (mock)           | < 2s (CLI overhead) | E2E test with mock adapter               | NFR-P02 |
| Memory (full pipeline)         | < 100MB             | `process.memoryUsage().rss`              | NFR-P04 |
| Disk footprint (installed)     | < 20MB              | `du -sh` of package (excl. node_modules) | NFR-P05 |

### 25.2 Performance Regressions

- Performance benchmarks run in CI on every PR.
- A regression of > 20% on any metric fails the build.
- Startup time is measured with `hyperfine` (or Node.js `perf_hooks`).
- Memory is measured with `process.memoryUsage()` at the end of pipeline execution.

---

## 26. Accessibility Checklist

### 26.1 CLI Accessibility

- [ ] `--no-color` flag works on every command.
- [ ] `--plain` flag removes all unicode characters (spinners, emoji, box-drawing).
- [ ] All output readable by screen readers (tested with VoiceOver).
- [ ] Color is never the sole differentiator — text labels always accompany colored output.
- [ ] Interactive prompts are navigable with keyboard only (arrow keys + Enter).
- [ ] Error messages include actionable recovery instructions (NFR-U04).
- [ ] Help output uses plain text descriptions, not just argument syntax.

### 26.2 Generated Artifact Accessibility

- [ ] Heading hierarchy is never skipped (H1 → H2 → H3, no jumps).
- [ ] All tables have header rows.
- [ ] Links have descriptive text (no "click here").
- [ ] Images (if any) have alt text.

---

## 27. Production Readiness Checklist

Before any release (beta or stable):

### 27.1 Code Readiness

- [ ] All tests pass on all platforms (macOS, Linux, Windows).
- [ ] No known bugs tagged `release-blocker`.
- [ ] TypeScript compiles with strict mode, 0 errors.
- [ ] ESLint: 0 errors, 0 warnings.
- [ ] `npm audit`: 0 critical/high vulnerabilities.
- [ ] Bundle size within limits (< 20MB).
- [ ] All performance benchmarks pass.

### 27.2 Documentation Readiness

- [ ] README.md is accurate and complete.
- [ ] All commands have `--help` documentation.
- [ ] CHANGELOG.md has release notes.
- [ ] Installation instructions tested on clean machine.
- [ ] API documentation (for hosted tier) is complete.

### 27.3 Release Readiness

- [ ] Version bumped in all `package.json` files.
- [ ] Git tag created and pushed.
- [ ] npm publish successful.
- [ ] GitHub Release created with changelog.
- [ ] Post-install smoke test passes (`npm install -g promptpilot && promptpilot --version`).

---

## 28. Development Timeline

```
Week 1-2:   ████████  Foundation (Sprint 1)
Week 3-4:   ████████  MVP Pipeline (Sprint 2)
Week 5-6:   ████████  Beta Polish & Release (Sprint 3)
            ─────────  BETA RELEASE (v0.1.0)
Week 7-8:   ████████  P1: Ollama, Streaming, Retry (Sprint 4)
Week 9-10:  ████████  P1: Parallel, Tokens, Dry-Run (Sprint 5)
Week 11-12: ████████  P1: Status, Stale Detection, Custom Prompts (Sprint 6)
            ─────────  POST-MVP RELEASE (v0.2.0)
Week 13-14: ████████  P2: Google AI, Fallback, Diff (Sprint 7)
Week 15-16: ████████  P2: Watch, Quality, Content Linting (Sprint 8)
Week 17-18: ████████  P2: OpenAPI Export, GitHub Action (Sprint 9)
Week 19-20: ████████  P2: Pipeline Templates, Upgrade, Doctor (Sprint 10)
            ─────────  STABLE RELEASE (v1.0.0)
Month 5-6:  ████████  Polish, Community Building, Bug Fixes
Month 7-18: ████████  Growth (P3): Hosted Tier, Marketplace, Integrations
```

---

## 29. Team Responsibilities

### 29.1 Phase 0-2 (Team of 3-5)

| Role                               | Responsibilities                                                  | Key Deliverables                             |
| ---------------------------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **Tech Lead / Architect**          | Architecture decisions, code review, adapter design, performance  | Adapter interface, pipeline engine, CI/CD    |
| **Backend Engineer 1**             | Core pipeline, context assembly, prompt manager                   | Pipeline engine, manifest, context assembly  |
| **Backend Engineer 2**             | CLI commands, config, validation, file system                     | All CLI commands, validation engine, config  |
| **QA Engineer**                    | Test strategy, E2E tests, prompt validation tests, CI integration | Test suite, mock adapter, regression tests   |
| **Developer Advocate (part-time)** | README, docs, examples, community guidelines                      | Documentation, CONTRIBUTING.md, landing page |

### 29.2 Phase 3-4 (Team of 6-8)

Add:

- **Frontend Engineer:** Web dashboard (React).
- **DevOps Engineer:** Hosted infrastructure, deployment, monitoring.
- **Security Engineer (part-time):** Security review, penetration testing, compliance.

### 29.3 Phase 5+ (Team of 10-15)

Add:

- **2nd Frontend Engineer:** VS Code extension, integrations UI.
- **2nd Backend Engineer:** Marketplace, billing, notifications.
- **Data Engineer:** Analytics pipeline, dashboards.
- **Community Manager:** Prompt pack ecosystem, community support.

---

## 30. Final Development Roadmap

### 30.1 Development Principles (Repeated for Emphasis)

1. **Ship the CLI first.** Every feature ships in the open-source CLI before any hosted tier.
2. **Test the prompts.** Prompt quality is the product. Every prompt change has a regression test.
3. **No telemetry, ever.** The CLI sends zero data anywhere. This is non-negotiable (NFR-S01).
4. **Accessibility from day one.** `--no-color` and `--plain` are not afterthoughts — they're built with every command.
5. **Documentation is development.** The README is updated in the same PR as the code change.
6. **Human in the loop.** AI generates, humans review. PromptPilot accelerates, never replaces.

### 30.2 Key References

Every task in this Implementation Plan traces back to:

| Source             | Reference                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Master Context** | `docs/00_Master_Context.md` — All principles, standards, and constraints                                  |
| **PRD**            | `docs-output/PRD.md` — All FR IDs, user stories, acceptance criteria                                      |
| **SRS**            | `docs-output/SRS.md` — Detailed functional and non-functional requirements (to be generated)              |
| **Architecture**   | `docs-output/Architecture.md` — System design, technology stack, component architecture (to be generated) |
| **Database**       | `docs-output/Database.md` — Database schema, migrations, seed data (to be generated)                      |
| **API**            | `docs-output/API.md` — API endpoints, request/response formats (to be generated)                          |
| **Roadmap**        | `docs-output/Roadmap.md` — Phased release plan with timelines (to be generated)                           |

### 30.3 Immediate Next Steps

1. **Today:** Review this Implementation Plan with the team. Resolve any open questions in §28 (Risks).
2. **This Week:** Set up the monorepo. Begin Sprint 1 tasks T-001 through T-005.
3. **Next Week:** Complete the OpenAI adapter and `run` command (T-006 through T-013).
4. **Week 4:** Full pipeline functional. `promptpilot@0.1.0` on npm.

---

**End of Engineering Implementation Plan**
