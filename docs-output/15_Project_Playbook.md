# Project Playbook · PromptPilot

**Version:** 1.0.0
**Status:** Approved
**Author:** Engineering Manager
**Last Updated:** 2026-07-19
**Source of Truth:** `docs/00_Master_Context.md` v1.0.0, `docs-output/PRD.md` v1.0.0

---

## 1. What This Playbook Is

This is the operational manual for building PromptPilot. It's the document you reference when you need to know:

- How to set up your dev environment.
- How to pick up a task.
- How to submit code.
- How releases work.
- What to do when something breaks.
- How we communicate.
- How decisions get made.

Every team member should read this before writing any code.

---

## 2. Communication

### 2.1 Channels

| Channel                  | Purpose                                      | Frequency  |
| ------------------------ | -------------------------------------------- | ---------- |
| **GitHub Issues**        | Task tracking, bug reports, feature requests | Continuous |
| **GitHub Pull Requests** | Code review, technical discussion            | Continuous |
| **GitHub Discussions**   | Architecture decisions, RFCs, proposals      | As needed  |
| **Discord / Slack**      | Quick questions, standups, team chat         | Daily      |
| **Weekly Sync**          | Sprint review, retro, planning               | Weekly     |
| **Monthly All-Hands**    | Progress review, roadmap updates             | Monthly    |

### 2.2 Async-First Culture

PromptPilot is built by a distributed team. Async communication is the default:

- Write things down. If you have a conversation in chat that results in a decision, document it in a GitHub issue or discussion.
- Default to public channels. PMs in DMs are lost knowledge.
- Assume others are in different time zones. Don't expect immediate responses.

### 2.3 Decision Making

| Decision Type               | Process                                                     | Authority                |
| --------------------------- | ----------------------------------------------------------- | ------------------------ |
| **Architecture change**     | RFC in GitHub Discussions → 3-day comment period → Decision | Tech Lead                |
| **Prompt template change**  | PR → 2 approvals required → Merge                           | AI Architect + Tech Lead |
| **Feature priority change** | GitHub Issue → Discuss in weekly sync → Decision            | Product Owner            |
| **Bug fix (cosmetic)**      | PR → 1 approval → Merge                                     | Any engineer             |
| **Hotfix (critical bug)**   | PR → Fast-track review → Merge → Release                    | Tech Lead                |

---

## 3. Development Environment

### 3.1 Prerequisites

- Node.js ≥ 20.x (use `nvm`, `fnm`, or `volta`)
- npm ≥ 10.x
- Git ≥ 2.40
- VS Code (recommended) or any TypeScript IDE

### 3.2 One-Time Setup

```bash
# Clone the repository
git clone git@github.com:promptpilot/promptpilot.git
cd promptpilot

# Install Node.js (if needed)
nvm install 20
nvm use 20

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify everything works
npm test

# Try the CLI
node packages/cli/dist/cli.js --help
```

### 3.3 Daily Development

```bash
# Terminal 1: Watch mode (auto-rebuild on changes)
npm run dev

# Terminal 2: Run commands
node packages/cli/dist/cli.js init my-project

# Terminal 3: Tests in watch mode
npm run test:watch
```

### 3.4 Environment Variables

Create a `.env` file in the project root (never committed):

```bash
# For running real LLM tests (optional — mock adapter used in CI)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# For debugging
LOG_LEVEL=debug
```

### 3.5 VS Code Setup

Recommended extensions (add to `.vscode/extensions.json`):

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "vitest.explorer",
    "ms-vscode.vscode-typescript-next",
    "github.vscode-github-actions"
  ]
}
```

Recommended settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 4. Picking Up Work

### 4.1 Finding Tasks

1. Go to GitHub Issues → Filter by `good first issue` (if new) or your area.
2. Assign yourself to the issue.
3. Move it to "In Progress" on the project board.
4. Create a branch: `git checkout -b feature/<issue-number>-<short-description>`.

### 4.2 Task Types

| Type               | What It Means                                                     | Example                                           |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------- |
| `good first issue` | Small, well-defined, no deep context needed. Good for onboarding. | "Add `--version` flag to validate command."       |
| `bug`              | Something is broken. Includes steps to reproduce.                 | "Config list crashes with empty config file."     |
| `feature`          | New functionality. Has FR ID, user story, acceptance criteria.    | "FR-017: Implement --no-color flag."              |
| `tech-debt`        | Cleanup, refactoring, tooling improvements.                       | "Replace chalk with a lighter alternative."       |
| `docs`             | Documentation improvements.                                       | "Add examples to README for custom prompt setup." |

### 4.3 Task Workflow

```
Issue Assigned → Branch Created → Code Written → Tests Pass →
  PR Opened → CI Passes → Review Approved → Merged → Done
```

---

## 5. Submitting Code

### 5.1 Branch Naming

```
feature/FR-017-no-color-flag
fix/issue-42-config-crash
docs/add-deployment-examples
refactor/extract-adapter-interface
chore/update-dependencies
```

### 5.2 Commit Messages

Follow conventional commits:

```
feat(cli): add --no-color flag to all commands
FR-017, US-023

- Added --no-color flag to program options
- Applied to all command output via chalk Instance
- Added accessibility test verifying no ANSI codes
```

```
fix(config): handle empty config file without crashing
Fixes #42

- Added null check for empty config file in loadConfig
- Defaulted to DEFAULT_CONFIG when file is empty
- Added integration test for empty config scenario
```

### 5.3 Pull Request Template

```markdown
## What

Brief description of the change.

## Why

Why this change is needed. Reference FR IDs, user stories, or issues.

## References

- FR-XXX
- US-XXX
- Closes #XXX

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests pass
- [ ] Prompt validation tests pass
- [ ] Accessibility tests pass

## Checklist

- [ ] Code follows naming conventions (Master Context §13)
- [ ] No semicolons, single quotes, trailing commas
- [ ] Functions ≤ 30 lines
- [ ] No `any` types without justification
- [ ] Error messages are actionable
- [ ] CLI --help updated (if applicable)
- [ ] README updated (if user-facing change)
- [ ] CHANGELOG entry added
```

### 5.4 Code Review

- All PRs require at least 1 approval.
- Prompt template changes require 2 approvals.
- The author merges after approval (no "merge for me" requests).
- CI must be green before merge.
- Reviewers should respond within 1 business day.

**Review Guidelines for Reviewers:**

- Focus on correctness, not style (Prettier handles style).
- Check for edge cases in tests.
- Verify FR IDs and user story references.
- Run the code locally if it's a significant change.
- Be kind. Assume good intent. Ask questions, don't make demands.

---

## 6. Testing

### 6.1 Running Tests

```bash
# All tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Single file
npx vitest run packages/shared/test/unit/errors.test.ts

# With coverage
npm test -- --coverage

# E2E tests only
npm run test:e2e

# Performance benchmarks
npm run bench
```

### 6.2 Writing Tests

- Every new function gets unit tests.
- Every new command gets integration tests.
- Every prompt change gets a snapshot update.
- Bug fixes include a regression test.

### 6.3 Test Failure Protocol

If CI fails:

1. Check the CI logs for the specific failure.
2. If it's a flaky test, re-run CI. Flag flaky tests in #engineering for fixing.
3. If it's a legitimate failure, fix the code and push.
4. Never merge with failing CI.

---

## 7. Releases

### 7.1 Version Numbering

- `0.x.x` — Beta. Breaking changes allowed in minor versions.
- `1.x.x` — Stable. Semantic versioning strictly enforced.
- `x.0.0` — Major release. Breaking changes.
- `x.y.0` — Minor release. New features, backward compatible.
- `x.y.z` — Patch release. Bug fixes, backward compatible.

### 7.2 Release Cadence

- **Patch releases:** As needed for critical bugs. No fixed schedule.
- **Minor releases:** Every 2-4 weeks during active development.
- **Major releases:** Planned. Announced 4+ weeks in advance.

### 7.3 Release Checklist

- [ ] All tests pass on all platforms (macOS, Linux, Windows).
- [ ] `npm audit` passes.
- [ ] Performance benchmarks pass.
- [ ] CHANGELOG.md is up to date.
- [ ] Version bumped in `package.json`.
- [ ] Git tag created.
- [ ] npm publish successful.
- [ ] GitHub Release created.
- [ ] Post-install smoke test passes.
- [ ] Announcement posted in #releases.

---

## 8. Incident Response

### 8.1 Severity Levels

| Level             | Definition                                               | Response Time              | Example                                       |
| ----------------- | -------------------------------------------------------- | -------------------------- | --------------------------------------------- |
| **P0 — Critical** | CLI crashes on install or first use. npm package broken. | Immediate (any hour)       | `npm install -g promptpilot` fails            |
| **P1 — High**     | Core feature broken. Pipeline generation fails.          | < 4 hours (business hours) | `promptpilot run` crashes on step 3           |
| **P2 — Medium**   | Non-core feature broken. Validation false positives.     | < 24 hours                 | `validate --strict` warns on valid cross-refs |
| **P3 — Low**      | Cosmetic issue, typo, minor UX inconvenience.            | Next sprint                | Spinner doesn't stop on dry-run               |

### 8.2 Incident Process

1. **Detect:** User reports issue, automated alert fires, or team member notices.
2. **Triage:** Assign severity level. Create GitHub issue with `incident` label.
3. **Respond:** P0/P1: Drop everything. P2/P3: Add to current sprint.
4. **Fix:** Create PR with fix. Fast-track review for P0/P1.
5. **Release:** P0: Release immediately. P1: Release same day. P2/P3: Next scheduled release.
6. **Post-Mortem:** For P0/P1 incidents, write a brief post-mortem within 48 hours. What happened? Why? How will we prevent it?

---

## 9. Onboarding New Team Members

### 9.1 Week 1: Setup & Orientation

- [ ] Day 1: Read Master Context and PRD.
- [ ] Day 1: Set up dev environment. Run tests. Try the CLI.
- [ ] Day 2: Read Backend Development Guide (if backend) or Frontend Guide.
- [ ] Day 2: Pair with a mentor — walk through the codebase.
- [ ] Day 3: Pick up a `good first issue`. Submit a PR.
- [ ] Day 4-5: Work on a second `good first issue`. Attend sprint ceremonies.

### 9.2 Week 2: Deepening

- [ ] Pick up a medium-complexity feature or bug.
- [ ] Pair with a different team member — learn a different part of the codebase.
- [ ] Review at least 3 PRs from other team members.

### 9.3 Week 3-4: Ownership

- [ ] Own a feature from start to finish.
- [ ] Participate in code review as a reviewer (not just author).
- [ ] Join the on-call rotation (for hosted tier).

### 9.4 Mentor Assignment

Every new team member is paired with a mentor for their first month. The mentor:

- Is their first point of contact for questions.
- Reviews their first 5 PRs.
- Walks them through the codebase architecture.
- Introduces them to the team communication channels.

---

## 10. Documentation Standards

### 10.1 What to Document

- Every CLI command in `--help` and README.
- Every public API (function, class, interface) with JSDoc.
- Every architecture decision in an ADR (Architecture Decision Record) in `docs/adr/`.
- Every prompt template with inline comments explaining the purpose of each section.
- Every release in CHANGELOG.md.

### 10.2 ADR Format

```
docs/adr/001-use-commander-for-cli.md
docs/adr/002-adapter-interface-design.md
docs/adr/003-pipeline-state-in-filesystem.md
```

Template:

```markdown
# ADR-001: Use Commander.js for CLI Framework

**Status:** Accepted
**Date:** 2026-07-19
**Author:** Chief Software Architect

## Context

We need a CLI framework for parsing arguments, defining commands, and generating help text.

## Decision

Use Commander.js v13.

## Alternatives Considered

- **yargs:** More popular but heavier. Commander has cleaner API for subcommands.
- **oclif:** Overkill for our needs. Adds framework overhead.
- **Custom:** Reinventing argument parsing. Not worth it.

## Consequences

- Positive: Well-tested, widely used, good TypeScript support.
- Negative: Additional dependency (~50KB gzipped).
```

### 10.3 README Updates

The README is a living document. Update it in the same PR that changes user-facing behavior. Never leave the README stale.

---

## 11. Contributing Guidelines

### 11.1 External Contributors

PromptPilot is open source (MIT). External contributions are welcome.

1. Read CONTRIBUTING.md.
2. Find or create an issue describing what you want to work on.
3. Comment on the issue to say you're working on it.
4. Fork the repo, create a branch, make changes.
5. Follow the same PR process as internal contributors.
6. All contributions are licensed under MIT.

### 11.2 Prompt Pack Contributions

Community prompt packs are the heart of the ecosystem. To contribute a pack:

1. Create a repository with your prompt templates.
2. Add a `pack.json` manifest with metadata.
3. Publish to the registry: `promptpilot publish`.
4. Follow the prompt pack quality guidelines in `docs/guides/prompt-pack-quality.md`.

---

## 12. Quality Gates

Every release must pass all quality gates:

| Gate              | Tool       | Threshold            | Action on Failure      |
| ----------------- | ---------- | -------------------- | ---------------------- |
| Linting           | ESLint     | 0 errors, 0 warnings | Block merge            |
| Formatting        | Prettier   | No changes needed    | Auto-fix + block merge |
| Type Check        | tsc        | 0 errors             | Block merge            |
| Unit Tests        | Vitest     | All pass             | Block merge            |
| Coverage          | Vitest/c8  | ≥ 85% lines          | Block merge            |
| Integration       | Vitest     | All pass             | Block merge            |
| E2E               | Vitest     | All pass             | Block merge            |
| Prompt Validation | Custom     | All pass             | Block merge            |
| Performance       | Bench      | All targets met      | Block merge            |
| Security          | npm audit  | 0 critical/high      | Block merge            |
| Accessibility     | Custom     | All pass             | Block merge            |
| Bundle Size       | size-limit | < 500KB gzipped      | Warning                |

---

## 13. Glossary

| Term                 | Definition                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Artifact**         | A generated markdown document produced by a pipeline step (PRD, SRS, Architecture, etc.)        |
| **Pipeline**         | The sequence of 9 prompt steps that generate a complete specification suite                     |
| **Prompt Template**  | A markdown file containing instructions for the LLM on what artifact to generate                |
| **Adapter**          | A module that abstracts communication with a specific LLM provider (OpenAI, Anthropic, etc.)    |
| **Context Assembly** | The process of reading upstream artifacts and injecting them into a prompt                      |
| **Validation**       | Checking generated artifacts for structural completeness, markdown syntax, and cross-references |
| **Manifest**         | `promptpilot.json` — defines the pipeline structure, dependencies, and configuration            |
| **Prompt Pack**      | A collection of domain-specific prompt templates published by the community                     |
| **FR**               | Functional Requirement — an ID assigned in the PRD (e.g., FR-001)                               |
| **NFR**              | Non-Functional Requirement — an ID assigned in the PRD (e.g., NFR-P01)                          |
| **US**               | User Story — an ID assigned in the PRD (e.g., US-001)                                           |
| **P0/P1/P2/P3**      | Priority levels. P0 = MVP must-have. P1 = post-MVP. P2 = enhancement. P3 = future growth.       |

---

## 14. Team Roster & Roles

### 14.1 Core Team (Phase 0-2, 3-5 people)

| Role                               | Responsibilities                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| **Tech Lead / Architect**          | Architecture decisions, adapter design, performance, CI/CD, code review         |
| **Backend Engineer 1**             | Pipeline engine, context assembly, prompt manager, manifest                     |
| **Backend Engineer 2**             | CLI commands, config, validation engine, file system, formatters                |
| **QA Engineer**                    | Test strategy, mock adapter, E2E tests, prompt validation tests, CI integration |
| **Developer Advocate** (part-time) | README, docs, examples, community guidelines, landing page                      |

### 14.2 Extended Team (Phase 3+, 6-8+ people)

Add: Frontend Engineer, DevOps Engineer, Security Engineer (part-time), Community Manager.

---

## 15. Quick Reference

### 15.1 Essential Commands

```bash
npm install            # Install dependencies
npm run build          # Compile TypeScript
npm run dev            # Watch mode
npm test               # Run tests
npm run test:watch     # Tests in watch mode
npm run lint           # Run ESLint
npm run format:fix     # Auto-format with Prettier
npm run typecheck      # TypeScript type check
npm run ci:full        # Run full CI pipeline locally
node packages/cli/dist/cli.js --help  # Test the CLI
```

### 15.2 Key Files

| File                                    | Purpose                  |
| --------------------------------------- | ------------------------ |
| `packages/cli/src/cli.ts`               | CLI entry point          |
| `packages/core/src/pipeline/`           | Pipeline engine          |
| `packages/adapters/src/base.ts`         | Adapter interface        |
| `packages/validators/src/structural.ts` | Structural validation    |
| `packages/shared/src/errors.ts`         | Error hierarchy          |
| `docs/`                                 | Prompt templates         |
| `.github/workflows/ci.yml`              | CI pipeline              |
| `templates/`                            | Default project scaffold |

### 15.3 Key Links

- Repository: `github.com/promptpilot/promptpilot`
- npm: `npmjs.com/package/promptpilot`
- Documentation: `docs/`
- Issues: `github.com/promptpilot/promptpilot/issues`
- Discussions: `github.com/promptpilot/promptpilot/discussions`

---

**End of Project Playbook**
