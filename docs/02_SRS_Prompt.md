# 02 — SRS Prompt (Software Requirements Specification)

You are a senior systems analyst. Transform the PRD (`docs-output/PRD.md`) and Master Context (`docs/00_Master_Context.md`) into a formal SRS that engineering teams can implement directly.

---

## PROMPT

Read `docs-output/PRD.md` and `docs/00_Master_Context.md` before proceeding. This SRS must be implementation-ready — every requirement should be specific enough for a developer to build without ambiguity.

### Instructions

Produce an SRS document with these sections:

#### 1. Introduction

- **Purpose:** What this document covers and who it serves.
- **Scope:** What the software will and will not do.
- **Definitions & Acronyms:** Key terms from the Master Context glossary plus any new technical terms.

#### 2. System Overview

- High-level description of the system.
- System context diagram (describe in text — what external entities interact with the system).
- Key architectural decisions already made.

#### 3. Functional Requirements (Detailed)

Expand each FR from the PRD. For every requirement provide:

- **ID:** Reference the PRD FR ID.
- **Title:** Short descriptive name.
- **Priority:** P0-P3 (inherited from PRD).
- **Description:** Detailed explanation of the feature.
- **Inputs:** Data, events, or user actions that trigger the feature.
- **Processing:** Step-by-step logic the system must perform.
- **Outputs:** What the system produces (UI changes, data persisted, notifications).
- **Error Handling:** Edge cases and error states.
- **Business Rules:** Constraints, validations, and policies.
- **Acceptance Criteria:** Given/When/Then format.

#### 4. System Features

Group related FRs into named system features. For each feature:

- Feature name and description.
- List of FRs belonging to this feature.
- Feature-level dependencies and integration points.

#### 5. External Interface Requirements

- **User Interfaces:** Screen-by-screen description of UI behaviour (reference wireframes).
- **API Interfaces:** High-level API contracts (details in `docs-output/API.md`).
- **Hardware Interfaces:** Any hardware the system must interact with.
- **Software Interfaces:** External systems, libraries, frameworks, and databases.

#### 6. Data Requirements

- Data entities and their relationships (details in `docs-output/Database.md`).
- Data retention policies.
- Data validation rules.
- Data migration requirements if applicable.

#### 7. Non-Functional Requirements (Detailed)

Expand NFRs from the PRD with measurable targets:

- **Performance:** P95 latency targets, throughput requirements, resource limits.
- **Security:** Threat model summary, authN/authZ flow, data classification, encryption standards.
- **Reliability:** Availability targets, RPO/RTO, fault tolerance strategy.
- **Scalability:** Horizontal/vertical scaling plan, expected load, caching strategy.
- **Compliance:** Regulatory requirements (GDPR, HIPAA, SOC2, etc.).
- **Observability:** Logging, monitoring, alerting, and tracing requirements.

#### 8. Constraints

- Technical constraints (language, framework, platform).
- Business constraints (time, budget, team).
- Regulatory and legal constraints.

#### 9. Assumptions & Dependencies

- Assumptions made during requirements gathering.
- External dependencies and their risk level.

#### 10. Traceability Matrix

A table mapping:

- PRD FR IDs → SRS requirement IDs → Architecture components → Test cases.

### Output Format

- Formal, precise language suitable for engineering teams.
- Tables for structured data (requirements, traceability).
- Unique IDs in the format SRS-XXX.
- Every processing description should use numbered steps.
