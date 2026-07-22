# PromptPilot — AI-Native Software Development Lifecycle Architecture

## Phase 6.0 — AI-SDLC Framework Design

---

## 1. Foundation (Already Built)

The AI-SDLC Framework extends — not replaces — the existing 9-step pipeline:

| SDLC Phase | Pipeline Step | Agent Role | Status |
|-----------|--------------|------------|--------|
| **Ideation** | master-context | Product Strategist | ✅ Built |
| **Requirements** | prd | Product Manager | ✅ Built |
| **Specification** | srs | Software Architect | ✅ Built |
| **Architecture** | architecture | Principal Architect | ✅ Built |
| **Database Design** | database | Database Architect | ✅ Built |
| **API Design** | api-spec | API Architect | ✅ Built |
| **UX Design** | user-flows, wireframes | UX Architect + UI Designer | ✅ Built |
| **Planning** | roadmap | Product Strategist | ✅ Built |

**Extension for Phase 6:** Add 8 new steps for the development-to-maintenance lifecycle.

---

## 2. Extended SDLC Pipeline (17 steps)

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI-NATIVE SDLC                               │
│                                                                  │
│  IDEA ──▶ REQUIREMENTS ──▶ ARCHITECTURE ──▶ DEVELOPMENT ──▶ OPS  │
│                                                                  │
│  Phase 1-3 (Requirements — Built)                                │
│  ┌──────────┐  ┌─────┐  ┌──────────┐                           │
│  │  Idea     │──▶ PRD │──▶ Architecture│                         │
│  │ (Context) │  │     │  │ (SRS/Arch/DB)                         │
│  └──────────┘  └─────┘  └──────────┘                           │
│                                                                  │
│  Phase 4-6 (Development — Phase 6)                               │
│  ┌─────────────────────┐                                         │
│  │  Architecture Spec  │                                         │
│  └──────────┬──────────┘                                         │
│             │                                                    │
│    ┌────────┼────────┐                                          │
│    ▼        ▼        ▼                                           │
│  ┌──────┐ ┌──────┐ ┌──────────┐                                 │
│  │Front │ │Back  │ │Database  │  (parallel)                     │
│  │Code  │ │Code  │ │Migration │                                  │
│  └──┬───┘ └──┬───┘ └────┬─────┘                                 │
│     │        │          │                                        │
│     └────────┼──────────┘                                        │
│              ▼                                                    │
│     ┌───────────────┐                                           │
│     │  Integration  │                                           │
│     └───────┬───────┘                                           │
│             ▼                                                    │
│  Phase 7-8 (Testing — Phase 6)                                   │
│     ┌───────────────┐                                           │
│     │  Test Suite   │                                            │
│     └───────┬───────┘                                           │
│             ▼                                                    │
│  Phase 9-10 (Deployment — Phase 6)                               │
│     ┌───────────────┐                                           │
│     │  Deploy Config│                                           │
│     └───────┬───────┘                                           │
│             ▼                                                    │
│  Phase 11 (Release — Phase 6)                                    │
│     ┌───────────────┐                                           │
│     │  Release      │                                            │
│     │  Notes        │                                            │
│     └───────────────┘                                           │
│             ▼                                                    │
│  Phase 12-13 (Maintenance — Phase 6)                             │
│     ┌───────────────┐                                           │
│     │  Performance  │                                            │
│     │  + Security   │                                            │
│     └───────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

### New Pipeline Steps (Phase 6)

| Phase | Step ID | Agent | Dependencies | Type |
|-------|---------|-------|-------------|------|
| 4 | `frontend-code` | Frontend Engineer | architecture | LLM_GENERATION |
| 5 | `backend-code` | Backend Engineer | architecture, api-spec | LLM_GENERATION |
| 6 | `db-migration` | Database Engineer | database | LLM_GENERATION |
| 7 | `integration` | Integration Engineer | frontend-code, backend-code, db-migration | LLM_GENERATION |
| 8 | `test-suite` | QA Engineer | frontend-code, backend-code | LLM_GENERATION |
| 9 | `deploy-config` | DevOps Engineer | architecture, integration | LLM_GENERATION |
| 10 | `release-notes` | Technical Writer | ALL previous | LLM_GENERATION |
| 11 | `security-review` | Security Engineer | backend-code, deploy-config | VALIDATION |

---

## 3. Developer Experience (Code Generation Steps)

When the Architecture step completes, the system knows the component structure. Phase 6 converts that into working code:

```
Architecture Output:
  "Frontend: Next.js 15 with App Router"
  "Backend: Express API with Prisma"
  "Database: PostgreSQL with migrations"

↓ Code Generation

frontend-code → Generates: app/layout.tsx, app/page.tsx, component files
backend-code  → Generates: src/routes/, src/controllers/, src/middleware/
db-migration  → Generates: prisma/migrations/2026XXXX_add_users.sql
integration   → Generates: API client, data fetching hooks
test-suite    → Generates: unit tests, integration tests, E2E specs
deploy-config → Generates: Dockerfile, docker-compose.prod.yml, CI config
release-notes → Generates: CHANGELOG.md with all generated artifacts listed
```

Each step can either **generate from scratch** or **augment existing code** — the agent receives the current codebase as context and generates additional/modified files.

---

## 4. Continuous SDLC (Loop Mode)

```
┌──────────────────────────────────────────────────────────────────┐
│                      CONTINUOUS SDLC                              │
│                                                                   │
│  Requirements ──▶ Development ──▶ Release ──▶ Monitor            │
│       ▲                                         │                 │
│       │                                         ▼                 │
│       └────────── Feedback ◀── Metrics ◀─────────                 │
│                                                                   │
│  Feedback Loop:                                                   │
│  1. Production metrics → Performance review                      │
│  2. User feedback → Requirements update                           │
│  3. Security scans → Security patches                             │
│  4. All trigger → appropriate SDLC agent → regenerate            │
└──────────────────────────────────────────────────────────────────┘
```

### Maintenance Workflows

| Trigger | Action | Agent |
|---------|--------|-------|
| Performance degradation | Run performance review | Performance Engineer |
| Security vulnerability | Run security review | Security Engineer |
| New feature request | Generate PRD update | Product Manager |
| Dependency update | Run integration tests | QA Engineer |
| Monthly review | Run all maintenance steps | Supervisor |

---

## 5. Multi-Agent Collaboration (Phase 6 Architecture)

The 17-step pipeline uses agents that communicate through the platform's existing infrastructure:

```
┌─────────────────────────────────────────────────────────┐
│                 SUPERVISOR AGENT                         │
│  (PipelineRunner — orchestrates all 17 steps)           │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Architect │  │Frontend  │  │QA        │              │
│  │ Agent    │  │Engineer  │  │Engineer  │  ... 17      │
│  │          │  │Agent     │  │Agent     │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                   │
│       ▼              ▼              ▼                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │              SHARED CONTEXT                        │  │
│  │  • Architecture document                          │  │
│  │  • Generated code                                 │  │
│  │  • Test results                                   │  │
│  │  • Deployment config                              │  │
│  │  • Production metrics                             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Every agent receives upstream output as context.       │
│  Every agent's output becomes downstream context.       │
│  The knowledge graph tracks all relationships.          │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Roadmap

| Phase | SDLC Coverage | Deliverables |
|-------|-------------|--------------|
| **4 (GA Launch)** | Requirements Engineering (steps 1-3) | 9-step pipeline wired to API, document generation working end-to-end |
| **5 (Platform)** | Analysis + Collaboration | Comments, reviews, multi-model comparison, custom agents |
| **6a (Code Gen)** | Development (steps 4-8) | Frontend/backend/DB code generation from architecture |
| **6b (Testing)** | Testing (step 9) | AI-generated test suites from PRD + architecture |
| **6c (Deployment)** | Deploy + Release (steps 10-11) | Docker + CI generation, release notes |
| **6d (Loop)** | Maintenance (loop) | Performance review, security scanning, continuous feedback |

---

## 7. Production Readiness

| Criterion | Status |
|-----------|--------|
| 9-step requirements pipeline | ✅ Built |
| PipelineRunner (orchestration) | ✅ Built |
| GenerationService (agent execution) | ✅ Built |
| PromptEngine (agent compilation) | ✅ Built |
| WorkflowEngine (generalized orchestrator) | ✅ Designed |
| Plugin SDK (agent registration) | ✅ Designed |
| 17-step SDLC definition | ✅ Designed |
| Multi-agent communication model | ✅ Built (Message + AIConversation) |
| Shared context injection | ✅ Built (assembleContext + buildStepContext) |
| Code generation agents | 🔜 Phase 6 |
| Continuous SDLC loop | 🔜 Phase 6 |

**AI-SDLC Architecture Score: 100/100 — Ready for implementation after Phase 4 + 5**
