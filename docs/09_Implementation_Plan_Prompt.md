# 09 — Implementation Plan Prompt

You are a senior engineering manager and technical program manager. Based on the PRD (`docs-output/PRD.md`), SRS (`docs-output/SRS.md`), System Architecture (`docs-output/Architecture.md`), Database Schema (`docs-output/Database.md`), API Specification (`docs-output/API.md`), and Feature Roadmap (`docs-output/Roadmap.md`), create a detailed, actionable implementation plan that translates the specification suite into developer-ready execution artifacts.

---

## PROMPT

Read `docs-output/PRD.md`, `docs-output/SRS.md`, `docs-output/Architecture.md`, `docs-output/Database.md`, `docs-output/API.md`, and `docs-output/Roadmap.md` before creating this plan. Every task must trace back to a functional requirement (FR ID) from the PRD and an architectural component from the Architecture document.

### Instructions

Produce an Implementation Plan document with these sections:

#### 1. Implementation Overview

- **Scope:** What is being built in this implementation phase. Reference the MVP scope and phase definitions from the Feature Roadmap.
- **Team Structure:** Recommended team composition — how many frontend, backend, DevOps, QA, and AI engineers are needed per phase.
- **Development Methodology:** Agile, Scrum, Kanban, or hybrid — with sprint cadence, ceremony schedule, and definition of done.
- **Branching Strategy:** Git flow, trunk-based, or GitHub flow — with naming conventions for branches, commits, and PRs.

#### 2. Technology Stack Implementation

Present as a table with columns: **Component | Technology | Version | Setup Instructions | Verification Command**

For each technology choice from the Architecture document provide:

- Installation and configuration steps.
- Environment setup (`.env` files, config files, secrets management).
- Local development setup instructions that work on macOS, Linux, and Windows.
- Docker setup if applicable (`Dockerfile`, `docker-compose.yml` structure).
- CI/CD pipeline integration steps.

#### 3. Project Structure

Define the complete directory tree for the codebase:

```
project-root/
├── src/
│   ├── cli/           # CLI argument parsing, command handlers
│   ├── pipeline/      # Pipeline engine, step ordering, context assembly
│   ├── adapters/      # LLM provider adapters (OpenAI, Anthropic, etc.)
│   ├── prompts/       # Prompt template loader, variable injection
│   ├── validators/    # Structural and cross-reference validation
│   ├── fs/            # File system operations, scaffolding
│   ├── config/        # Configuration management
│   ├── plugins/       # Plugin system, hooks
│   └── utils/         # Shared utilities
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/              # Prompt templates (shipped with CLI)
├── docs-output/       # Generated artifacts (user's project)
└── scripts/           # Build, release, CI scripts
```

For each directory describe:

- Purpose and responsibilities.
- Key files and their roles.
- Internal dependencies (what this module imports from other modules).

#### 4. Development Phases & Sprints

For each phase from the Feature Roadmap break it down into sprints with specific tasks:

##### Phase N: [Phase Name] — Sprint Breakdown

For each sprint provide:

- **Sprint Goal:** One sentence.
- **Duration:** e.g., 2 weeks.
- **Task Breakdown (as a table):**

| Task ID | Task | FR ID(s) | Estimated Hours | Assignee Role | Dependencies | Acceptance Criteria |
| ------- | ---- | -------- | --------------- | ------------- | ------------ | ------------------- |

- **Sprint Deliverables:** What is shippable at the end of this sprint.
- **Sprint Retrospective Focus:** Key questions to answer at the end of the sprint.

Cover these phases:

1. **Phase 0: Foundation** — Project setup, CI/CD, core scaffolding, configuration.
2. **Phase 1: MVP Core** — All P0 features from the PRD.
3. **Phase 2: Post-MVP** — All P1 features.
4. **Phase 3: Enhancement** — All P2 features.

#### 5. Module Implementation Details

For each module identified in the PRD (§17), provide:

- **Module Name & Purpose.**
- **Interface / API:** Public functions, classes, or commands the module exposes.
- **Internal Design:** Key classes, data flow, state management.
- **Pseudocode / TypeScript Stubs** for the 3-5 most critical functions:

```typescript
// Example stub
interface PipelineStep {
  id: string
  promptPath: string
  outputPath: string
  dependencies: string[]
  parallelSafe: boolean
}

function getNextStep(artifacts: Map<string, Artifact>): PipelineStep | null {
  // 1. Load pipeline manifest
  // 2. Filter completed steps
  // 3. Find first incomplete step with all dependencies satisfied
  // 4. Return step or null if pipeline complete
}
```

- **Error Handling Strategy:** What errors this module produces and how callers should handle them.
- **Testing Strategy:** Unit, integration, and edge cases specific to this module.

Modules to cover:

- CLI Layer
- Pipeline Engine
- LLM Adapters (one subsection per adapter)
- Prompt Manager
- Validation Engine
- File System
- Configuration
- Plugin System

#### 6. Database & Data Layer Implementation

- **Migration Scripts:** Order of execution, naming convention, rollback strategy.
- **Seed Data:** What data must exist before the app works. Include actual seed SQL or scripts.
- **Data Access Patterns:** How each module reads/writes data. Repository pattern, ORM, or direct queries.
- **Connection Management:** Pooling strategy, connection strings per environment, timeout settings.

#### 7. API Implementation Sequence

Order the API endpoints from the API Specification by implementation dependency:

1. Endpoints with no dependencies (auth, health).
2. Endpoints that depend on step 1.
3. Endpoints that depend on step 2.

For each endpoint provide:

- Implementation file path.
- Key middleware (auth, validation, rate limiting).
- Integration test approach.
- Mock strategy for dependencies.

#### 8. Testing Strategy

| Test Level            | Framework               | Scope                                     | Target Coverage     | CI Stage        |
| --------------------- | ----------------------- | ----------------------------------------- | ------------------- | --------------- |
| **Unit**              | Vitest                  | Individual functions and classes          | ≥ 85% line coverage | Pre-commit / PR |
| **Integration**       | Vitest + Testcontainers | Module interactions, file I/O             | ≥ 70%               | PR              |
| **E2E**               | Vitest + execa          | Full pipeline execution with mock LLM     | Critical paths only | Merge to main   |
| **Prompt Validation** | Custom test harness     | Every prompt template against mock inputs | 100% of templates   | PR              |

- **Mock LLM Strategy:** How to test prompt execution without calling real LLM APIs. A mock adapter that returns pre-defined responses based on prompt type.
- **Snapshot Testing:** For prompt templates — ensure prompt structure doesn't change unexpectedly.
- **Performance Testing:** Benchmarks for CLI startup, context assembly, and pipeline execution.
- **Accessibility Testing:** Verify `--plain` and `--no-color` output with automated checks.

#### 9. CI/CD Pipeline Definition

- **Pipeline Stages (as a sequence):**
  1. Install dependencies.
  2. Lint (ESLint + Prettier).
  3. Type check (TypeScript strict mode).
  4. Unit tests.
  5. Integration tests.
  6. Build (compile TypeScript).
  7. Prompt validation tests.
  8. E2E tests (on main branch only).
  9. Publish to npm (on tag/release).

- **Environment Matrix:** Node.js 20.x, 22.x on macOS, Linux, and Windows.
- **Secrets Management:** How LLM API keys are provided to CI (GitHub Secrets, environment variables).
- **Artifacts:** What is produced by CI (npm package tarball, test reports, coverage reports).
- **Release Process:** Steps to publish a new version to npm — version bump, changelog generation, git tag, npm publish, GitHub release.

#### 10. Development Environment Setup

Step-by-step instructions to go from zero to contributing. Include:

```bash
# 1. Clone the repository
git clone https://github.com/promptpilot/promptpilot.git
cd promptpilot

# 2. Install Node.js (if needed)
# Use nvm, fnm, or volta

# 3. Install dependencies
npm install

# 4. Set up environment
cp .env.example .env
# Edit .env with your LLM API keys

# 5. Build the project
npm run build

# 6. Run tests
npm test

# 7. Try the CLI
node dist/cli.js init --help
```

- **Required Tools:** Node.js version, npm version, git, optional tools (Docker for integration tests).
- **IDE Configuration:** VS Code settings, recommended extensions, launch configurations.
- **Debugging Setup:** How to attach a debugger to the CLI.
- **Hot Reload:** How to get fast feedback during development (tsx watch, nodemon, etc.).

#### 11. Code Quality Gates

Define automated gates enforced in CI and pre-commit hooks:

| Gate                   | Tool         | Threshold                       | Action on Failure             |
| ---------------------- | ------------ | ------------------------------- | ----------------------------- |
| **Linting**            | ESLint       | 0 errors, 0 warnings            | Block PR                      |
| **Formatting**         | Prettier     | No unformatted files            | Block PR (auto-fix available) |
| **Type Checking**      | tsc --noEmit | 0 errors                        | Block PR                      |
| **Unit Test Coverage** | Vitest / c8  | ≥ 85% lines, ≥ 80% branches     | Block PR                      |
| **Dependency Audit**   | npm audit    | 0 critical/high vulnerabilities | Block PR                      |
| **Bundle Size**        | size-limit   | CLI < 500KB gzipped             | Warning on PR                 |

#### 12. Monitoring & Observability Implementation

- **Logging:** Structured logging strategy (JSON format for production, pretty for development). Log levels (debug, info, warn, error). What to log and what NOT to log (never log API keys or prompt content in production).
- **Error Tracking:** How unhandled errors are captured and reported. Error boundary strategy.
- **Performance Monitoring:** Key metrics to instrument (CLI startup time, pipeline step duration, LLM API latency, context assembly time).
- **Health Checks:** How to verify the CLI is functioning correctly (`promptpilot doctor` implementation).

#### 13. Onboarding Plan for New Developers

- **Week 1:** Read the Master Context and PRD. Set up the development environment. Complete a "good first issue" — a small, well-defined task (e.g., add a new CLI flag, fix a validation rule).
- **Week 2:** Pair with a senior developer on a medium-complexity task. Understand the pipeline engine and context assembly.
- **Week 3:** Own a feature from start to finish — from implementation through testing to PR merge.
- **Resources:** Link to all relevant documentation, design decisions, and architecture records.

#### 14. Risk Mitigation Implementation

For each risk identified in the PRD (§28), provide the specific implementation that mitigates it:

| Risk ID | Risk | Implementation Mitigation |
| ------- | ---- | ------------------------- |

Example:

- **R-001 (LLM Quality Degradation):** Implement a regression test suite with 10 canned inputs and expected structural outputs for each prompt. Run in CI weekly. Alert on regression.

#### 15. Dependency & Package Management

- **Production Dependencies:** List every npm package with version, purpose, and justification.
- **Dev Dependencies:** List every dev tool with version and purpose.
- **Version Pinning Strategy:** Exact versions vs. caret ranges. When to update. How to handle security patches.
- **License Compliance:** Check that all dependency licenses are compatible with MIT.

### Output Format

- Every task must reference an FR ID from the PRD.
- Code stubs should use TypeScript syntax matching the project's coding standards (no semicolons, single quotes, trailing commas).
- Sprint breakdowns should be specific enough that a project manager can create Jira tickets directly from them.
- This document is the bridge between "what to build" (PRD/SRS) and "how to build it" (code). Every section should be actionable by a developer.
