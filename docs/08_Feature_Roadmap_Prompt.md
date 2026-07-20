# 08 — Feature Roadmap Prompt

You are a senior product strategist and delivery manager. Based on the PRD (`docs-output/PRD.md`), SRS (`docs-output/SRS.md`), and System Architecture (`docs-output/Architecture.md`), create a phased, realistic feature roadmap.

---

## PROMPT

Read `docs-output/PRD.md`, `docs-output/SRS.md`, and `docs-output/Architecture.md` before creating the roadmap. The roadmap must be grounded in the priorities and dependencies defined in those documents.

### Instructions

Produce a Feature Roadmap document with these sections:

#### 1. Roadmap Overview

- **Timeline Philosophy:** Explanation of the time horizon and how estimates are derived.
- **Release Cadence:** How often releases ship (weekly, bi-weekly, monthly).
- **P0 Definition:** What constitutes a P0 and how priorities can change.

#### 2. Phased Release Plan

For each phase provide:

- **Phase Name & Number.**
- **Target Timeline:** e.g., Q1 2025, or Weeks 1-6.
- **Phase Goal:** One sentence describing what this phase achieves.
- **Phase Exit Criteria:** What must be true before moving to the next phase.
- **Features Included (as a table):**

| Feature ID | Feature Name | Priority | Estimated Effort | Dependencies | Owner |

#### 3. Phase Details

##### Phase 0: Foundation (Weeks 1-2)

Typically includes:

- Project setup, CI/CD, infrastructure provisioning.
- Database schema implementation and migrations.
- Authentication and authorisation system.
- Core shared components (design system, API client, error handling).
- Development environment and tooling.
- Exit criteria checklist.

##### Phase 1: MVP Core (Weeks 3-8)

- All P0 features from the PRD.
- Feature-by-feature breakdown with estimated effort (S/M/L/XL).
- Integration milestones.
- Weekly goals.
- Risk register for this phase.

##### Phase 2: Enhancement (Weeks 9-14)

- P1 features from the PRD.
- Performance optimisation based on MVP usage data.
- User feedback incorporation plan.
- Feature-by-feature breakdown.

##### Phase 3: Scale & Polish (Weeks 15-20)

- P2 features from the PRD.
- Infrastructure scaling.
- Advanced analytics and reporting.
- Internationalisation (if applicable).

##### Phase 4: Growth (Months 6-12)

- P3 features from the PRD.
- Platform plays (API for third parties, marketplace, etc.).
- New platform targets (mobile app, desktop app).

#### 4. Dependencies & Critical Path

- Identify the critical path — features that block the most other features.
- External dependency timeline (third-party integrations, vendor onboarding).
- Team dependency mapping.

#### 5. Risk Register

Table with columns: **Risk ID | Risk Description | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation | Owner**

Cover these categories:

- Technical risks (new technology, scalability concerns).
- Product risks (market fit, user adoption).
- Resource risks (team availability, key person dependency).
- Timeline risks (external blockers, scope creep).

#### 6. Resource Planning

- Team composition per phase (how many frontend, backend, DevOps, QA, designers).
- Key skills needed and any hiring/gap plan.
- Third-party costs (API fees, infrastructure, tools).

#### 7. Success Gates

Between each phase define a go/no-go gate:

- Metrics that must be met.
- Bugs/defects threshold.
- User feedback threshold.
- Performance benchmark.
- Stakeholder sign-off required.

#### 8. Communication Plan

- Sprint demos: frequency and audience.
- Status updates: format and cadence.
- Stakeholder review cadence.
- Escalation path for blockers.

#### 9. Change Management

- How feature requests are triaged and prioritised mid-roadmap.
- How scope changes affect the timeline.
- Emergency change process for critical bugs.

### Output Format

- Use Gantt-chart-compatible descriptions so this can be visualised in project management tools.
- Every feature must reference its PRD FR ID and SRS ID.
- Effort estimates should use t-shirt sizing (S/M/L/XL) with clear definitions:
  - **S (< 1 week):** Single developer, well-understood.
  - **M (1-2 weeks):** Full-stack feature, some uncertainty.
  - **L (2-4 weeks):** Multi-service feature, cross-team coordination.
  - **XL (4+ weeks):** Major architectural change or new service.
- The roadmap should be specific enough that a project manager could create a Jira board from it.
