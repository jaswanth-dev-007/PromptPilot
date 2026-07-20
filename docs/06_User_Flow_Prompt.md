# 06 — User Flow Prompt

You are a senior UX designer. Based on the PRD (`docs-output/PRD.md`), SRS (`docs-output/SRS.md`), and Master Context (`docs/00_Master_Context.md`), map out every critical user journey through the product.

---

## PROMPT

Read `docs-output/PRD.md`, `docs-output/SRS.md`, and `docs/00_Master_Context.md` before designing. These flows must cover every P0 functional requirement from the PRD.

### Instructions

Produce a User Flow document with these sections:

#### 1. User Flow Overview

- **Scope:** Which journeys are covered and which are explicitly out of scope.
- **Entry Points:** Where users come from (direct URL, email link, push notification, search, app store).

#### 2. Core User Flows (Per Flow)

For each flow provide:

- **Flow ID & Name:** e.g., UF-001: User Registration.
- **Persona:** Which persona(s) this flow serves.
- **Trigger:** What initiates this flow.
- **Preconditions:** What must be true before the flow starts.
- **Step-by-Step Flow:**

Use a numbered list. For each step describe:

1. **Screen/State:** What the user sees.
2. **User Action:** What the user does.
3. **System Response:** What the system does in response.
4. **Next Step:** Where the user goes next.
5. **Error States:** What happens if something goes wrong at this step.

- **Happy Path Diagram:** Describe the ideal flow path.
- **Alternative Paths:** Common variations.
- **Error Paths:** How each error state is resolved.
- **Postconditions:** What is true after the flow completes.
- **Success Metrics:** How to measure if this flow is working well.

#### 3. Flows to Cover (Minimum)

Ensure these flows are fully mapped:

1. **Onboarding / Registration.** First-time user signup and initial setup.
2. **Authentication:** Login, password reset, MFA (if applicable).
3. **Core Feature Flow 1:** The primary "aha moment" flow — what makes the product valuable.
4. **Core Feature Flow 2:** The second most important user journey.
5. **Core Feature Flow 3:** The third most important user journey.
6. **Profile / Settings:** Account management, preferences, notifications.
7. **Search / Discovery:** Finding content or features.
8. **Notifications:** Receiving and acting on notifications.
9. **Error / Edge Cases:** What happens when things go wrong (network issues, expired sessions, validation errors).
10. **Logout / Session Expiry:** Graceful handling of session termination.

#### 4. Decision Trees

For 3-5 critical flows, provide a decision tree showing:

- Every branching point.
- The condition that determines which path is taken.
- The resulting action or screen.

#### 5. State Transitions

For key UI components describe state machines:

- States (loading, empty, error, success, etc.).
- Transitions between states.
- Triggers for each transition.

#### 6. Accessibility Considerations

- Keyboard navigation paths.
- Screen reader flow descriptions.
- Focus management during transitions.
- Colour contrast and text sizing considerations.

#### 7. Mobile Responsiveness (If applicable)

- How flows adapt for mobile vs desktop.
- Touch targets and gesture considerations.
- Offline behaviour.

### Output Format

- Each flow should be self-contained — a developer should be able to implement a flow by reading only its section.
- Use ASCII art or Mermaid-compatible notation for decision trees and state machines.
- Reference specific wireframe screen IDs from `docs-output/Wireframes.md`.
- Every flow step should reference the API endpoint it calls (from `docs-output/API.md`).
