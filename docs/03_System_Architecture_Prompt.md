# 03 — System Architecture Prompt

You are a principal software architect. Design a production-ready system architecture based on the SRS (`docs-output/SRS.md`), PRD (`docs-output/PRD.md`), and Master Context (`docs/00_Master_Context.md`).

---

## PROMPT

Read `docs-output/SRS.md`, `docs-output/PRD.md`, and `docs/00_Master_Context.md` before designing. Your architecture must be detailed enough for a senior engineering team to begin implementation immediately.

### Instructions

Produce a System Architecture document with these sections:

#### 1. Architecture Overview

- **Architecture Style:** (Microservices, Monolith, Serverless, Event-Driven, etc.) and rationale.
- **Architecture Diagram:** Describe using text — use layered or C4 model notation (Context, Container, Component).
- **Key Design Decisions:** Top 5-7 architectural decisions with trade-off analysis (use Architecture Decision Records format).

#### 2. Technology Stack

Present as a table with columns: **Layer | Technology | Version | Rationale | Alternatives Considered**

Cover these layers:

- Frontend framework
- Backend runtime & framework
- Database (primary, cache, search)
- Message queue / event bus
- API gateway / proxy
- Authentication & authorisation
- Observability (logging, monitoring, tracing)
- CI/CD & infrastructure
- Testing frameworks at each level

#### 3. Component Architecture

For each major component provide:

- **Component Name & Purpose.**
- **Responsibilities:** What it owns and what it delegates.
- **Interfaces:** APIs it exposes and APIs it consumes.
- **Data Storage:** What data it persists and where.
- **Deployment:** How it's packaged and deployed.
- **Scaling Strategy:** How to scale this component independently.

#### 4. Data Architecture

- **Data Flow Diagram:** Describe the flow of data through the system.
- **Data Storage Strategy:** Polyglot persistence decisions.
- **Caching Strategy:** What to cache, where, and invalidation rules.
- **Data Consistency Model:** Strong vs eventual consistency per data domain.

#### 5. API Architecture

- **API Style:** REST, GraphQL, gRPC, WebSocket — and rationale per use case.
- **API Gateway Design:** Routing, rate limiting, authentication.
- **Versioning Strategy.**
- **Error Handling Standards:** Consistent error response format.

#### 6. Security Architecture

- **Authentication Flow:** Detailed step-by-step auth flow (login, token refresh, logout).
- **Authorisation Model:** RBAC/ABAC/ReBAC with role hierarchy.
- **Network Security:** VPC design, firewall rules, service-to-service communication.
- **Data Security:** Encryption at rest and in transit, secrets management.
- **Threat Mitigations:** OWASP Top 10 countermeasures.

#### 7. Infrastructure & Deployment

- **Cloud Provider & Services** (or self-hosted equivalent).
- **Environment Strategy:** Dev, staging, production — differences and promotion flow.
- **CI/CD Pipeline:** Build, test, deploy stages.
- **Containerisation & Orchestration.**
- **Disaster Recovery:** Backup strategy, RPO/RTO targets, failover plan.

#### 8. Resilience & Reliability

- **Fault Tolerance:** Circuit breakers, retries, timeouts, bulkheads.
- **Graceful Degradation:** What features degrade and how.
- **Monitoring & Alerting:** Key metrics, alert thresholds, dashboards.
- **Incident Response:** On-call rotation, runbooks, post-mortem process.

#### 9. Cost Estimation

- Rough monthly infrastructure cost breakdown.
- Cost optimisation strategies.

#### 10. Architecture Runway

- Technical spikes needed before implementation.
- Known technical debt items to watch.
- Future architecture evolution plan.

### Output Format

- Markdown with architecture decision records in table format.
- Component descriptions should be thorough — think like documentation for a new team member.
- Use mermaid-compatible notation for describing diagrams.
- Every decision must include the trade-off considered.
