# 07 — UI Wireframes Prompt

You are a senior UI/UX designer. Based on the PRD (`docs-output/PRD.md`), User Flows (`docs-output/UserFlow.md`), and Master Context (`docs/00_Master_Context.md`), design the complete UI wireframes for the product.

---

## PROMPT

Read `docs-output/PRD.md`, `docs-output/UserFlow.md`, and `docs/00_Master_Context.md` before designing. Every screen you describe must correspond to a step in at least one user flow.

### Instructions

Produce a UI Wireframes document with these sections:

#### 1. Design System

- **Colour Palette:** Primary, secondary, accent, success, warning, error, neutral — with hex codes.
- **Typography:** Font families, sizes (H1-H6, body, caption), weights, line heights.
- **Spacing Scale:** 4px base grid — define tokens (xs, sm, md, lg, xl, 2xl).
- **Border Radius:** Standard values for buttons, cards, modals.
- **Shadows:** Elevation tokens (none, sm, md, lg, xl).
- **Icon Set:** Preferred icon library and style.
- **Component Library:** Reusable components (buttons, inputs, cards, modals, toasts, tabs, etc.).

#### 2. Screen Inventory

List every screen as a table:

| Screen ID | Screen Name | User Flow(s) | Description |
| --------- | ----------- | ------------ | ----------- |

#### 3. Screen Wireframes (Per Screen)

For each screen provide:

- **Screen ID & Name:** e.g., SC-001: Login Screen.
- **User Flow Reference:** Which user flow step(s) this screen appears in.
- **Screen Purpose:** What the user should accomplish here.
- **Layout Description:**
  - **Header:** What's in the top bar (logo, navigation, user avatar, etc.).
  - **Primary Content Area:** Detailed description of the main content.
  - **Sidebar (if applicable):** Navigation structure.
  - **Footer:** What's at the bottom.
- **Components on Screen (listed top to bottom, left to right):**

For each component:

- Component type (button, input, card, etc.).
- Label / Placeholder text.
- State(s) shown (default, hover, focus, active, disabled, loading, error, success, empty).
- Validation rules if an input.
- Action (what happens on interaction).
- Keyboard shortcut (if applicable).

- **Responsive Behaviour:** How the layout changes at breakpoints (mobile < 768px, tablet 768-1024px, desktop > 1024px).
- **Accessibility Notes:** ARIA labels, focus order, screen reader description.
- **Empty State:** What appears when there's no data.
- **Loading State:** Skeleton screens, spinners, progress indicators.
- **Error State:** How errors are displayed on this screen.
- **Edge Cases:** Long text truncation, many items, no permission, etc.

#### 4. Screens to Cover (Minimum)

Ensure these screens are fully designed:

1. **Landing / Marketing Page.**
2. **Login Screen.**
3. **Registration Screen.**
4. **Password Reset Flow (3 screens: request, email sent, set new password).**
5. **Dashboard / Home Screen (post-login).**
6. **Core Feature Screen 1** (the primary user interaction).
7. **Core Feature Screen 2.**
8. **Core Feature Screen 3.**
9. **Detail / View Screen.**
10. **Create / Edit Screen.**
11. **Settings / Profile Screen.**
12. **404 / Error Page.**
13. **Loading States (per screen).**
14. **Empty States (per screen).**

#### 5. Component Patterns

For interactive patterns that span multiple screens:

- **Navigation Pattern:** Top nav, sidebar, breadcrumbs, tabs.
- **Data Entry Pattern:** Form layout, validation display, multi-step wizards.
- **Data Display Pattern:** Tables, cards, lists, grid layouts.
- **Feedback Pattern:** Toasts, modals, confirmation dialogs, tooltips.
- **Search Pattern:** Search bar behaviour, autocomplete, filters.

#### 6. Interaction Design

- **Micro-interactions:** Hover effects, click animations, transitions between screens.
- **Gestures (if mobile):** Swipe, pinch, long-press behaviours.
- **Drag & Drop (if applicable).**
- **Keyboard Shortcuts:** Global and contextual.

### Output Format

- Each screen should be described in enough detail that a frontend developer could build a high-fidelity implementation.
- Use text-based layouts with indentation to show visual hierarchy.
- Reference the design system tokens (colours, spacing) consistently.
- Indicate which components are reused across screens.
