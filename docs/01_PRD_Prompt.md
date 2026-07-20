# 01 — PRD Prompt (Product Requirements Document)

You are a senior product manager. Use the Master Context document as your foundation. Generate a clear, detailed, and prioritised PRD that bridges business strategy and technical execution.

---

## PROMPT

This PRD must reference the Master Context document located at `docs/00_Master_Context.md`. Read that file first and align every section to it.

### Instructions

Produce a Product Requirements Document with these sections:

#### 1. Product Overview

- Restate the one-line description and value proposition from the Master Context.
- Define what success looks like for this product.

#### 2. Problem & Opportunity

- Expand on the problem statement from the Master Context.
- Describe the market opportunity and why now is the right time.

#### 3. Target Users & Personas

- Reference the personas defined in the Master Context.
- Map each persona to their primary jobs-to-be-done.
- Prioritise which persona is served first in MVP.

#### 4. Functional Requirements (FRs)

Use a table with columns: **ID | Feature | Description | Priority (P0-P3) | Persona | Dependencies**

Categorise features into these groups:

- **P0 — Must Have (MVP):** Non-negotiable for launch.
- **P1 — Should Have:** Important but can ship shortly after MVP.
- **P2 — Nice to Have:** Adds polish and delight.
- **P3 — Future:** Long-term aspirational features.

Each requirement should be:

- Specific and unambiguous.
- Traced to at least one persona.
- Accompanied by acceptance criteria (Given/When/Then format).

#### 5. Non-Functional Requirements (NFRs)

- **Performance:** Expected response times, throughput, concurrent users.
- **Security:** Authentication, authorisation, data encryption, compliance.
- **Availability:** Uptime targets, disaster recovery expectations.
- **Scalability:** Expected growth trajectory and scaling strategy.
- **Usability:** Accessibility standards, supported browsers/devices.
- **Maintainability:** Code quality standards, documentation requirements.

#### 6. User Stories (Top 10-15)

For each story use the format:

- **As a** [persona], **I want** [action], **so that** [benefit].
- Add acceptance criteria in Given/When/Then format.
- Add priority and estimated complexity (S/M/L/XL).

#### 7. Wireframe & Design References

- Link to the UI Wireframes document (`docs-output/Wireframes.md`) once generated.
- Describe 3-5 critical screens and their purpose.

#### 8. Dependencies & Integrations

- External APIs or services required.
- Internal system dependencies.
- Third-party libraries or tools.

#### 9. Release Criteria

- Definition of Done for MVP.
- Exit criteria for each development phase.
- Quality gates (test coverage, performance benchmarks, security audit).

#### 10. Open Questions & Risks

- Unresolved decisions that need stakeholder input.
- Technical and product risks with mitigation strategies.

### Output Format

- Markdown with tables, bullet lists, and clear section headers.
- Every FR must have a unique ID (e.g., FR-001).
- Cross-reference the Master Context where applicable.
- Tag assumptions with **[Assumption]** .
