# PromptPilot — Enterprise Project Module Specification

## Complete UX, UI, Engineering & Architecture Design
### Version 1.0 — Production-Ready Build Document

---

## Design System Reference

All components reference the PromptPilot Design System (`docs/DESIGN_SYSTEM.md`), Tailwind token config (`tailwind.config.js`), and the Product UX Specification (`docs/PRODUCT_UX_SPECIFICATION.md`).

### Existing Foundation (Already Built)

| Component | Status | Location |
|-----------|--------|----------|
| Project Prisma model | ✅ Built | `prisma/schema.prisma` |
| Document model (9 doc types) | ✅ Built | `prisma/schema.prisma` |
| DocumentVersion model | ✅ Built | `prisma/schema.prisma` |
| AIConversation model | ✅ Built | `prisma/schema.prisma` |
| Message model | ✅ Built | `prisma/schema.prisma` |
| Generation model | ✅ Built | `prisma/schema.prisma` |
| Export model | ✅ Built | `prisma/schema.prisma` |
| ProjectRepository (CRUD) | ✅ Built | `packages/database/src/repositories/` |
| DocumentRepository | ✅ Built | `packages/database/src/repositories/` |
| DocumentVersionRepository | ✅ Built | `packages/database/src/repositories/` |
| AIConversationRepository | ✅ Built | `packages/database/src/repositories/` |
| MessageRepository | ✅ Built | `packages/database/src/repositories/` |
| GenerationRepository | ✅ Built | `packages/database/src/repositories/` |
| Express project routes | ✅ Built | `apps/api/src/routes/projects.ts` |
| Pipeline API routes | ✅ Built | `apps/api/src/routes/pipeline.ts` |
| GenerationService | ✅ Built | `packages/ai/src/engine/generationService.ts` |
| PromptEngine | ✅ Built | `packages/ai/src/engine/promptEngine.ts` |
| LLM Adapters (OpenAI + Anthropic, streaming) | ✅ Built | `packages/adapters/` |
| Design System | ✅ Built | `tailwind.config.js` + `DESIGN_SYSTEM.md` |

### Design Tokens

- **Typography:** Inter (headings + body), JetBrains Mono (code). Scale 12–72px, weights 400/500/600/700
- **Primary:** Indigo-600 (#4F46E5), **Neutral:** Slate 50–950
- **Spacing:** 4px base unit, **Radii:** sm/md/lg/xl
- **Shadows:** sm/md/lg/xl + glow-primary
- **Motion:** 150ms fast, 250ms normal, 400ms slow, Framer Motion spring
- **Breakpoints:** sm:640, md:768, lg:1024, xl:1280, 2xl:1536

---

## 1. Purpose

### Business Objective

The Project is the primary execution environment inside a Workspace. It is where users create, generate, manage, version, collaborate on, and export specification documents. The Project is the core revenue driver — every AI generation, every export, every collaboration moment happens here. Its objectives are:

1. **Deliver core value**: The 9-step pipeline from Master Context to Roadmap is PromptPilot's primary value proposition
2. **Drive AI consumption**: Each generation consumes tokens → drives usage → drives upgrades
3. **Enable collaboration**: Multiple editors working on the same project, commenting, reviewing
4. **Demonstrate completeness**: Pipeline progress bar gives users visible progress and satisfaction
5. **Anchor retention**: Projects accumulate documents, versions, conversations — making the platform sticky

### User Objective

Users enter a project to:

1. **Run the pipeline**: Generate all 9 specification documents in sequence
2. **Manage documents**: View, edit, regenerate, compare, and export individual documents
3. **Use AI**: Chat with AI about the project, ask questions, brainstorm alternatives
4. **Track progress**: See pipeline completion status, document staleness, and generation history
5. **Collaborate**: Invite comments, request reviews, share exports (future)
6. **Export**: Download individual documents or the complete specification suite

### Project Lifecycle

```
CREATED      (user creates project from workspace or dashboard)
    │
    ▼
DRAFT        (project exists, no documents generated yet)
    │
    ├──▶ Pipeline started (documents being generated)
    │
    ▼
ACTIVE       (at least one document generated, pipeline in progress)
    │
    ├──▶ Documents generated (individual or batch via Run Full Pipeline)
    ├──▶ Documents edited (manual edits via Editor)
    ├──▶ Documents regenerated (AI regeneration creates new version)
    ├──▶ Documents exported (single or suite)
    ├──▶ Team collaboration (comments, reviews — future)
    │
    ▼
COMPLETED    (all 9 documents generated, pipeline finished)
    │         (can still edit, regenerate, export)
    │
    ▼
ARCHIVED     (project hidden. Recoverable within 30 days.)
    │
    └──▶ DELETED (permanent after 30 days or manual hard delete)
```

---

## 2. User Flow

```
Dashboard / Workspace
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  PROJECT PAGE (landing on project overview)                 │
│                                                             │
│  ENTRY POINTS:                                              │
│  • Dashboard → Click project card                          │
│  • Workspace → Projects tab → Click project row            │
│  • ⌘K → Search project name → Enter                       │
│  • Direct URL: /project/[slug]                             │
│  • Continue Working widget on dashboard                    │
│                                                             │
│  EXIT POINTS:                                               │
│  • Document page (click document card)                     │
│  • AI Chat (click "AI Chat" button)                        │
│  • Editor (click "Edit" on document)                       │
│  • Export (click "Export" button)                          │
│  • Version History (click version link)                    │
│  • Back to Workspace (breadcrumb)                          │
│  • Back to Dashboard (sidebar)                             │
│                                                             │
│  USER ACTIONS:                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. View project overview + pipeline progress         │  │
│  │ 2. Generate documents (individual or full pipeline)  │  │
│  │ 3. Regenerate documents                              │  │
│  │ 4. View document content (click card)                │  │
│  │ 5. Edit documents (open in editor)                   │  │
│  │ 6. Chat with AI about the project                    │  │
│  │ 7. Track streaming generation progress               │  │
│  │ 8. Export individual documents or full suite         │  │
│  │ 9. Compare document versions                         │  │
│  │ 10. Rename, archive, duplicate project               │  │
│  │ 11. Favorite / pin project                           │  │
│  │ 12. View generation history / AI activity            │  │
│  │ 13. Invite collaborators (future)                    │  │
│  │ 14. Comment on documents (future)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
    │
    ├──▶ AI Chat        (/project/[slug]/chat)
    ├──▶ Document Page  (/project/[slug]/documents/[stepId])
    ├──▶ Editor         (/project/[slug]/documents/[stepId]/edit)
    ├──▶ Version History(/project/[slug]/documents/[stepId]/versions)
    ├──▶ Export         (/project/[slug]/export)
    └──▶ Workspace      (/workspace/[slug])
```

---

## 3. Information Architecture

### Complete Hierarchy

```
Project (e.g., "Mobile App Redesign")
│
├── Project Header (sticky)
│   ├── Project Name + Description
│   ├── Status Badge (Draft/Active/Generating/Completed/Archived)
│   ├── Workspace Context (breadcrumb)
│   ├── Action Buttons (Run Full Pipeline, AI Chat, Export, •••)
│   └── Pipeline Progress Bar (9-step visual indicator)
│
├── Left Sidebar (optional, collapsible)
│   ├── Pipeline Steps (vertical nav — click to jump to document)
│   │   ├── 💡 Master Context
│   │   ├── 📋 PRD
│   │   ├── 📐 SRS
│   │   ├── 🏗️ Architecture
│   │   ├── 🗄️ Database Schema
│   │   ├── 📡 API Spec
│   │   ├── 🔄 User Flows
│   │   ├── 🎨 Wireframes
│   │   └── 🗺️ Roadmap
│   ├── Quick Links
│   │   ├── 💬 AI Chat
│   │   ├── 📦 Exports
│   │   └── 📜 Generation History
│   └── Project Actions
│       ├── ⚙️ Settings
│       └── 📋 Duplicate
│
├── Main Content Area (tabbed or scrollable)
│   ├── Tab: Overview (default)
│   │   ├── Document Grid (3×3 — 9 pipeline documents)
│   │   ├── Streaming Panel (when generation is active)
│   │   ├── Quick Stats (tokens used, cost, generation count)
│   │   └── Recent Activity (generations, edits, exports)
│   │
│   ├── Tab: Documents (list view)
│   │   └── Document list with status, version, actions
│   │
│   ├── Tab: Conversations
│   │   └── AI conversation history for this project
│   │
│   ├── Tab: Exports
│   │   └── Export history + new export flow
│   │
│   └── Tab: Settings
│       └── Project name, description, status, danger zone
│
└── Right Context Panel (conditional, slide-in)
    ├── Streaming Panel (during AI generation)
    │   ├── Live generation output (Markdown rendered)
    │   ├── Progress indicator + step name
    │   ├── Token counter + cost estimate
    │   └── Cancel button
    ├── Document Preview (when document selected)
    │   ├── Rendered Markdown (read-only)
    │   ├── Document metadata (version, tokens, model, date)
    │   └── Actions (Edit, Regenerate, Export, Versions)
    └── AI Chat Panel (minimized chat within project context)
```

---

## 4. Complete Page Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  PROJECT PAGE LAYOUT                                                          │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  NAVBAR (56px)                                                            │ │
│  │  🏠 Home > Workspaces > Acme Corp > Mobile App Redesign    ⌘K  🔔  👤 ▾ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  PROJECT HEADER (sticky, bg-white, border-b, z-10, pt-4 pb-3 px-6)       │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 📋  Mobile App Redesign                          [ACTIVE] badge      │  │ │
│  │  │     A complete redesign of our iOS and Android applications        │  │ │
│  │  │     Workspace: Acme Corp · Created Jul 15, 2026 · Owner: Jane      │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  ┌──────────────────────┐  ┌──────────────────────────────────────────┐  │ │
│  │  │ [Run Full Pipeline]  │  │ ●━●━●━◐━○━○━○━○━○  4/9 steps complete │  │ │
│  │  │ [AI Chat] [Export]   │  │ MC→PRD→SRS→ARCH→DB→API→FLOW→WIRE→MAP  │  │ │
│  │  │ [•••]                │  │  ✓   ✓   ✓   ⟳   ○   ○   ○    ○    ○  │  │ │
│  │  └──────────────────────┘  └──────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────┐ ┌────────────────────────────────────────────────────────────┐ │
│  │ PIPELINE │ │  DOCUMENT GRID (3 columns × 3 rows, gap-5, p-6)            │ │
│  │ STEPS    │ │                                                             │ │
│  │ (sidebar)│ │  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ │ │
│  │          │ │  │ 💡 Master Context│ │ 📋 PRD           │ │ 📐 SRS      │ │ │
│  │ 💡 MC ◀  │ │  │ ────────────────│ │ ──────────────── │ │ ─────────── │ │ │
│  │ 📋 PRD   │ │  │ ✓ Generated     │ │ ✓ Generated      │ │ ✓ Generated │ │ │
│  │ 📐 SRS   │ │  │ v3 · 2.4K tokens│ │ v2 · 8.2K tokens │ │ v1 · 12K t  │ │ │
│  │ 🏗️ Arch  │ │  │ 2h ago          │ │ 1d ago           │ │ 1d ago      │ │ │
│  │ 🗄️ DB    │ │  │ [View] [Edit]   │ │ [View] [Regen]   │ │ [View] [•••]│ │ │
│  │ 📡 API   │ │  └──────────────────┘ └──────────────────┘ └─────────────┘ │ │
│  │ 🔄 Flow  │ │                                                             │ │
│  │ 🎨 Wire  │ │  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ │ │
│  │ 🗺️ Map   │ │  │ 🏗️ Architecture  │ │ 🗄️ DB Schema     │ │ 📡 API Spec │ │ │
│  │          │ │  │ ────────────────│ │ ──────────────── │ │ ─────────── │ │ │
│  │ ──────── │ │  │ ⟳ Generating... │ │ ○ Not started    │ │ ○ Not start │ │ │
│  │ 💬 Chat  │ │  │ 34% · 1.2K/16K  │ │ [Generate]       │ │ [Generate]  │ │ │
│  │ 📦 Export│ │  │ [Cancel]        │ │                  │ │             │ │ │
│  │ ⚙️ Sett  │ │  └──────────────────┘ └──────────────────┘ └─────────────┘ │ │
│  └──────────┘ │                                                             │ │
│               │  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ │ │
│               │  │ 🔄 User Flows    │ │ 🎨 Wireframes    │ │ 🗺️ Roadmap  │ │ │
│               │  │ ────────────────│ │ ──────────────── │ │ ─────────── │ │ │
│               │  │ ○ Not started    │ │ ○ Not started    │ │ ○ Not start │ │ │
│               │  │ [Generate]       │ │ [Generate]       │ │ [Generate]  │ │ │
│               │  └──────────────────┘ └──────────────────┘ └─────────────┘ │ │
│               └────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  STREAMING PANEL (right sidebar, slides in when generation active)        │ │
│  │  w-[420px], border-l, bg-white, h-full, overflow-y-auto                  │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  ⟳ Generating Architecture...                      [✕ Cancel]      │  │ │
│  │  │  ──────────────────────────────────────────────────────────────── │  │ │
│  │  │                                                                    │  │ │
│  │  │  # System Architecture                                             │  │ │
│  │  │                                                                    │  │ │
│  │  │  ## Overview                                                       │  │ │
│  │  │  The Mobile App Redesign follows a microservices architecture      │  │ │
│  │  │  with a React Native frontend, Node.js API gateway, and            │  │ │
│  │  │  PostgreSQL database. The system is designed to handle...          │  │ │
│  │  │                                                                    │  │ │
│  │  │  ## Component Architecture █                                       │  │ │
│  │  │  (blinking cursor — streaming in progress)                         │  │ │
│  │  │                                                                    │  │ │
│  │  │  ──────────────────────────────────────────────────────────────── │  │ │
│  │  │  Tokens: 1,247 / 16,000 · Cost: ~$0.03 · Elapsed: 4.2s           │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

```
DESKTOP (≥1280px):
  Pipeline steps sidebar: 200px (left)
  Document grid: 3 columns
  Streaming panel: 420px (right, slides in over content or pushes content)

TABLET (768–1023px):
  Pipeline steps: Hidden. Accessible via dropdown or horizontal bar above grid.
  Document grid: 2 columns
  Streaming panel: Full-width bottom drawer or right overlay

MOBILE (<768px):
  Pipeline steps: Horizontal scrollable bar (icon + number only) above grid.
  Document grid: 1 column
  Streaming panel: Full-screen overlay or bottom sheet
  Header: Compact. Pipeline progress as single bar "4/9 complete".
  Action buttons: Below header, stacked or horizontal scroll.
```

---

## 5. Header

### Layout & States

```
EXPANDED (default):
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  PROJECT HEADER (sticky top, z-10)                                        │
  │                                                                           │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  📋  Mobile App Redesign                                            │  │
  │  │      A complete redesign of our iOS and Android applications        │  │
  │  │      Workspace: Acme Corp · Created Jul 15, 2026 · Owner: Jane     │  │
  │  │                                                      ⭐  [•••]      │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                           │
  │  ┌────────────────────────┐  ┌────────────────────────────────────────┐  │
  │  │  ACTIONS               │  │  PIPELINE PROGRESS                      │  │
  │  │                        │  │                                         │  │
  │  │  [Run Full Pipeline]   │  │  ●━●━●━◐━○━○━○━○━○  4/9 complete     │  │
  │  │  [AI Chat] [Export]    │  │  MC→PRD→SRS→ARCH→DB→API→FLOW→WIRE→MAP │  │
  │  │  [••• More]            │  │   ✓   ✓   ✓   ⟳   ○   ○   ○    ○    ○ │  │
  │  └────────────────────────┘  └────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────────────────────┘

  STATE: GENERATING
    "Run Full Pipeline" button disabled. "Generating..." with spinner.
    Individual step shows pulsing dot + progress.

  STATE: COMPLETED
    All steps ✓. Progress bar shows "9/9 complete".
    "Run Full Pipeline" changes to "Regenerate All" with confirmation.

  STATE: ARCHIVED
    Header shows "ARCHIVED" badge. Actions hidden or disabled.
    "Restore Project" button visible.

MOBILE HEADER:
  ┌──────────────────────────────────────────┐
  │  📋 Mobile App Redesign    [ACTIVE] ⭐   │
  │  ●━━●━━●━━◐━━○  4/9 steps             │
  │  [Run Pipeline] [AI Chat] [•••]         │
  └──────────────────────────────────────────┘

COLLAPSED (scroll-down — future):
  ┌──────────────────────────────────────────┐
  │  📋 Mobile App Redesign   4/9  [ACTIVE] │
  │  [+ Gen] [Chat] [Export] [•••]          │
  └──────────────────────────────────────────┘
  (compact sticky bar, saves vertical space while scrolling)
```

### Pipeline Progress Bar — Detail

```
COMPONENT: PipelineProgress

LAYOUT:
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  ●━━━━●━━━━●━━━━◐━━━━○━━━━○━━━━○━━━━○━━━━○━━━━○   4/9 steps complete  │
  │  │    │    │    │    │    │    │    │    │    │                          │
  │  MC  PRD  SRS ARCH  DB  API  FLOW WIRE MAP                               │
  │  ✓    ✓    ✓   ⟳    ○    ○    ○    ○    ○                                │
  └──────────────────────────────────────────────────────────────────────────┘

STEP STATES:
  ✓  (completed):   Green dot + checkmark. Clickable → navigate to document.
  ⟳  (generating):  Pulsing indigo dot + spinner. Click → view streaming output.
  ○  (pending):     Empty circle, neutral-300. Click → triggers generation.
  ✕  (failed):      Red dot + X. Click → view error + retry option.
  ⚠  (stale):      Amber dot. Tooltip: "Upstream dependency changed. Regenerate?"

CONNECTORS:
  Between steps: horizontal line (h-0.5, rounded-full)
  Completed section: primary-600 (indigo fill)
  Active section: primary-300 with animated gradient (shimmer → indigo)
  Pending section: neutral-200

TOOLTIP (on hover):
  ┌──────────────────────────────────────┐
  │  Architecture                        │
  │  Status: Generating                  │
  │  Model: GPT-4o · 34% complete       │
  │  Tokens: 1.2K/16K · Cost: ~$0.03   │
  │  Started: 2 minutes ago             │
  │                         [View →]    │
  └──────────────────────────────────────┘

MOBILE:
  Simplified to single progress bar with "4/9 complete" text.
  Steps listed as horizontal scrollable pills below.
```

---

## 6. Left Sidebar (Pipeline Steps Nav)

```
┌──────────────────────────────┐
│  PIPELINE STEPS               │
│  w-[200px], border-r          │
│  bg-neutral-50                │
│  h-full, overflow-y-auto      │
│                               │
│  ┌──────────────────────────┐ │
│  │  💡 Master Context   ✓   │ │
│  │     v3 · 2.4K tokens    │ │
│  │     Generated 2h ago    │ │
│  │                          │ │
│  │  📋 PRD              ✓   │ │
│  │     v2 · 8.2K tokens    │ │
│  │     Generated 1d ago    │ │
│  │                          │ │
│  │  📐 SRS              ✓   │ │
│  │     v1 · 12K tokens     │ │
│  │     Generated 1d ago    │ │
│  │                          │ │
│  │  🏗️ Architecture     ⟳   │ │
│  │     Generating...       │ │
│  │     34% · 1.2K/16K     │ │
│  │                          │ │
│  │  🗄️ Database Schema  ○   │ │
│  │     Not started         │ │
│  │                          │ │
│  │  📡 API Spec         ○   │ │
│  │     Not started         │ │
│  │                          │ │
│  │  🔄 User Flows       ○   │ │
│  │     Not started         │ │
│  │                          │ │
│  │  🎨 Wireframes       ○   │ │
│  │     Not started         │ │
│  │                          │ │
│  │  🗺️ Roadmap          ○   │ │
│  │     Not started         │ │
│  └──────────────────────────┘ │
│                               │
│  ─────────────────────────── │
│                               │
│  QUICK LINKS                 │
│  💬 AI Chat                  │
│  📦 Exports (2)              │
│  📜 Generation History       │
│                               │
│  ─────────────────────────── │
│                               │
│  ⚙️ Project Settings          │
│  📋 Duplicate Project        │
└──────────────────────────────┘

EACH STEP ITEM:
  padding: py-3 px-4
  border-left: 2px solid
    Completed: primary-500
    Active:    primary-300 (with pulse animation)
    Pending:   transparent
  Hover: bg-neutral-100
  Current: bg-primary-50

  Content:
    Row 1: Icon + Step Name + Status Dot (right-aligned)
    Row 2: Version + tokens (if generated) OR "Not started" (if pending)
    Row 3: Relative timestamp (if generated)

  Click: Navigate to document detail OR trigger generation if pending

COLLAPSED (icon sidebar mode):
  Icons only in vertical stack (center-aligned)
  Status dots overlaid on icons
  Tooltip on hover: step name + status
  Width: 48px
```

---

## 7. Right Context Panel

### Panel Types

```
PANEL 1: STREAMING PANEL (during AI generation)
  ┌──────────────────────────────────────────────────┐
  │  ⟳ Generating Architecture...        [✕ Cancel]  │
  │  ─────────────────────────────────────────────── │
  │                                                   │
  │  [Live Markdown output streams token-by-token]   │
  │  [Blinking cursor at insertion point]            │
  │  [Auto-scroll follows new content]               │
  │                                                   │
  │  ─────────────────────────────────────────────── │
  │  Tokens: 1,247 / 16,000                            │
  │  Cost: ~$0.03                                      │
  │  Elapsed: 4.2s                                     │
  │  Model: GPT-4o                                      │
  └──────────────────────────────────────────────────┘
  Width: 420px (desktop), full-width (mobile)
  Slides in from right (250ms, [0.4, 0, 0.2, 1])

PANEL 2: DOCUMENT PREVIEW (read-only)
  ┌──────────────────────────────────────────────────┐
  │  📋 PRD — Mobile App Redesign    v2   [✕ Close]  │
  │  ─────────────────────────────────────────────── │
  │                                                   │
  │  [Rendered Markdown — scrollable]                │
  │                                                   │
  │  ─────────────────────────────────────────────── │
  │  Version 2 · 8,200 tokens · GPT-4o                │
  │  Generated 1 day ago                              │
  │                                                   │
  │  [Open in Editor] [Regenerate] [Export] [•••]    │
  └──────────────────────────────────────────────────┘

PANEL 3: AI CHAT (minimized, within project context)
  ┌──────────────────────────────────────────────────┐
  │  💬 Project Chat                    [↗ Expand]   │
  │  ─────────────────────────────────────────────── │
  │                                                   │
  │  You: Should we use microservices?               │
  │  AI: Given your team size...                     │
  │                                                   │
  │  ┌──────────────────────────────────────────────┐│
  │  │ Type a message...                    [Send →] ││
  │  └──────────────────────────────────────────────┘│
  └──────────────────────────────────────────────────┘

TOGGLE PANEL:
  Button in header or document grid: "Show Preview" / "Hide Preview"
  Panel slides in/out with animation
  Content area flexes to accommodate
  Panel state persisted per user (localStorage)
```

---

## 8. Project Overview (Document Grid)

### Document Card Specs

```
┌──────────────────────────────────────────────┐
│  DOCUMENT CARD (card variant)                 │
│  rounded-xl, border, p-5, bg-white            │
│                                               │
│  ┌──────────────────────────────────────────┐ │
│  │  💡  Master Context                      │ │
│  │  ─────────────────────────────────────── │ │
│  │                                          │ │
│  │  STATUS BADGE + VERSION                  │ │
│  │  ┌────────────────┐                     │ │
│  │  │ ✓ Generated    │  v3                 │ │
│  │  └────────────────┘                     │ │
│  │                                          │ │
│  │  2.4K tokens · GPT-4o                    │ │
│  │  Generated 2 hours ago                   │ │
│  │                                          │ │
│  │  ┌──────────────────────────────────────┐│ │
│  │  │ [View]  [Edit]  [Regen]  [•••]      ││ │
│  │  └──────────────────────────────────────┘│ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘

STATES PER CARD:
  DRAFT (not generated):
    ○ "Not started"
    Actions: [Generate]

  GENERATING:
    ⟳ "Generating..." with progress (34%)
    Spinner + progress bar inside card
    Actions: [Cancel]

  GENERATED:
    ✓ badge + version number
    Token count + model + timestamp
    Actions: [View] [Edit] [Regenerate] [•••]

  STALE (upstream dependency changed):
    ⚠ "Needs update" amber badge
    Tooltip: "Architecture changed — this document may be outdated"
    Actions: [Regenerate (recommended)] [View] [Edit]

  FAILED:
    ✕ "Generation failed" red badge
    Error message shown
    Actions: [Retry] [View Partial]

  ARCHIVED:
    Greyed out. "Archived" badge.
    Actions: [Restore]

CONTEXT MENU (•••):
  ┌──────────────────────────┐
  │  📋 View Document        │
  │  ✏️  Open in Editor       │
  │  🔄 Regenerate           │
  │  📜 Version History       │
  │  📦 Export this document  │
  │  ─────────────────────── │
  │  📋 Copy Content          │
  │  ⭐ Add to Favorites      │
  │  ─────────────────────── │
  │  🗑️  Delete (Archive)     │
  └──────────────────────────┘

HOVER:
  Card: translateY(-2px), shadow-md, border-primary-200
  Actions row: fades in (if hidden by default on mobile)
  Icon: slight scale up

ANIMATIONS:
  Status change: badge crossfade (200ms)
  Progress bar: width transition (500ms ease-out)
  New generation: Card border pulse indigo → solid (400ms)
```

---

## 9. Recent Activity (Project-Level)

```
┌──────────────────────────────────────────────────────────────┐
│  RECENT ACTIVITY (below document grid or separate tab)       │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  ACTIVITY TIMELINE                                        ││
│  │                                                           ││
│  │  ● 2:45 PM   Architecture generation started              ││
│  │              Model: GPT-4o                                ││
│  │  ● 2:30 PM   SRS generated (v1)                          ││
│  │              12,000 tokens · $0.31        [View]         ││
│  │  ● 1:15 PM   PRD regenerated (v2 → v3)                  ││
│  │              Manual edit by Jane          [View Diff]    ││
│  │  ● 11:00 AM  PRD generated (v2)                          ││
│  │              8,200 tokens · $0.21        [View]         ││
│  │  ● Jul 15    Project created                              ││
│  │              Workspace: Acme Corp                        ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
│  [View Full Activity →]                                       │
└──────────────────────────────────────────────────────────────┘

FILTERS:
  [All Activity ▾]  —  Generations, Edits, Exports, Comments (future)
  [Load More] for pagination (20 per page)
```

---

## 10. AI Status

```
AI STATUS INDICATOR (project-level):

IDLE:
  ○ "AI Ready" — shown in header or document grid
  All generation buttons active

GENERATING:
  ● "Generating Architecture..." — pulsing dot + step name
  Active generation card shows progress
  Other "Generate" buttons dimmed (only one generation at a time per project)

QUEUED:
  ◐ "Queued — will start after current generation"
  (future: when pipeline is running multiple steps)

ERROR:
  ✕ "Architecture generation failed — [Retry]"
  Red indicator. Failed card shows error details.
  Other steps can still be generated.

ALL COMPLETE:
  ✓ "Pipeline complete — 9/9 documents generated"
  Green indicator. Celebration animation (confetti? Or subtle checkmark pulse).

TOKEN/COST TRACKER:
  ┌─────────────────────────────────────────┐
  │  Project Total: 125,000 tokens · $3.42  │
  │  This session: 45,000 tokens · $1.21    │
  └─────────────────────────────────────────┘
  Shown in header or footer bar.
  Updates live during generation.
```

---

## 11. Team Collaboration (Future Phase 4-5)

```
PROJECT-LEVEL COLLABORATION:
  - Members inherited from workspace
  - Project owner: defaults to creator, can be transferred
  - Collaborators list (sidebar or tab): shows who has access
  - Presence indicators: green dot on avatar when viewing same project

COMMENTS (Phase 4):
  - Toggle comment panel in right sidebar
  - Anchored to document + specific text range (highlighted)
  - Threaded replies
  - @mentions notify the mentioned user
  - Resolve / reopen threads

REVIEWS (Phase 5):
  - Request review from specific members
  - Approve / Request Changes workflow
  - Review status shown on document card
```

---

## 12. Project Files

```
┌──────────────────────────────────────────────────────────────┐
│  TAB: FILES (future Phase 5)                                  │
│                                                               │
│  Upload supporting files for AI context or reference:         │
│  - Brand guidelines PDF                                       │
│  - Existing architecture diagrams                             │
│  - API documentation                                          │
│  - Code snippets                                              │
│  - Competitor analysis                                        │
│                                                               │
│  UPLOAD: Drag-and-drop zone. Max 50MB per file.              │
│  ORGANIZE: Folders, tags, search.                             │
│  AI CONTEXT: Toggle "Include in AI context" per file.        │
│  REFERENCE: Files appear in document editor sidebar.         │
└──────────────────────────────────────────────────────────────┘
```

---

## 13. Prompt Library (Project-Scoped)

```
PROJECT PROMPTS (vs. Workspace Prompts):
  - Prompts saved at project level (specific to this project)
  - Inherited prompts from workspace (read-only from project view)
  - Prompt usage tracked per project
  - "Save as Project Prompt" option in AI Chat

ACCESS:
  - Sidebar link or dropdown in AI Chat
  - Quick insert: type / in AI Chat to search prompts
  - Shows both workspace + project prompts (workspace ones marked with 🏢 badge)
```

---

## 17. Tasks

```
PROJECT TASKS (lightweight task tracking per project):

┌──────────────────────────────────────────┐
│  ✅ PROJECT TASKS          [Clear Done]  │
│                                           │
│  [+ Add task for this project...]  [Add] │
│                                           │
│  ☐ Define target audience section        │
│  ☑ Review PRD with stakeholders          │
│  ☐ Generate remaining pipeline steps     │
│  ☐ Export final specification suite      │
└──────────────────────────────────────────┘

PERSISTENCE:
  Stored in project.settings JSON (tasks array)
  Or separate project_tasks table (future)
  Only visible to project members
  Completed tasks: strikethrough, moved to bottom
```

---

## 20. Search

```
PROJECT-LEVEL SEARCH (⌘K or search bar in project header):

SCOPES:
  - Documents (full-text search within generated content)
  - Conversations (AI chat history)
  - Document versions
  - Exports
  - Project files (future)

RESULTS:
  ┌──────────────────────────────────────────┐
  │  "microservices"                          │
  │  ─────────────────────────────────────── │
  │                                           │
  │  DOCUMENTS                                │
  │  📋 Architecture — "...microservices..."  │
  │     Line 42 · 3 matches                  │
  │  📋 SRS — "...microservices..."           │
  │     Line 15 · 1 match                    │
  │                                           │
  │  CONVERSATIONS                            │
  │  💬 "Should we use microservices?"        │
  │     Architecture Discussion · 2d ago     │
  └──────────────────────────────────────────┘

IMPLEMENTATION:
  Future: PostgreSQL full-text search (tsvector on document content)
  MVP: Client-side search through loaded documents
```

---

## 21. Keyboard Shortcuts

```
PROJECT-LEVEL:
  G           Generate selected/highlighted document
  R           Regenerate selected document
  E           Open selected document in Editor
  V           View selected document (preview panel)
  F           Run Full Pipeline
  ⌘F          Search within project
  ⌘⇧F         Search across all documents
  Esc         Cancel generation / Close panel / Clear selection
  ← →         Move between pipeline steps / document cards (grid nav)
  ↑ ↓         Move between rows in document grid
  Enter       Open selected document
  Space       Preview selected document (right panel)
  ⌘[          Go back to previous page (workspace/dashboard)
  ⌘]          Go forward
  ⌘⇧E         Toggle export panel
  ⌘⇧G         Toggle AI chat panel
  ⌘⇧P         Toggle right preview panel
  ⌘S          Save current document (if in editor)
  N           Jump to next pipeline step (pending)
  P           Jump to previous pipeline step
  ⌘1-9        Jump to pipeline step 1-9
  ⌘E          Export project
  ⌘D          Duplicate project
  ⌘⇧A         Archive project
```

---

## 22. Permissions

```
ACTION                              OWNER   EDITOR  VIEWER
─────────────────────────────────────────────────────────────
View project                        ✅      ✅      ✅
View documents                      ✅      ✅      ✅
Run Full Pipeline                   ✅      ✅      ❌
Generate individual document        ✅      ✅      ❌
Cancel generation                   ✅      ✅      ❌
Regenerate document                 ✅      ✅      ❌
Edit document (open editor)         ✅      ✅      ❌
View document preview               ✅      ✅      ✅
View version history                ✅      ✅      ✅
Restore document version            ✅      ✅      ❌
Export document                     ✅      ✅      ✅
Export full project                 ✅      ✅      ✅
AI Chat                             ✅      ✅      ✅
View conversation history           ✅      ✅      ✅
Edit project settings               ✅      ✅(own)❌
Archive project                     ✅      ❌      ❌
Duplicate project                   ✅      ✅      ❌
Favorite project                    ✅      ✅      ✅
Pin project                         ✅      ✅      ✅
Comment on documents (future)       ✅      ✅      ✅
Request review (future)             ✅      ✅      ❌
Approve documents (future)          ✅      ✅      ❌
Manage project files (future)       ✅      ✅      ❌

VIEWER RESTRICTIONS:
  All "Generate" buttons hidden
  "Run Full Pipeline" hidden
  "Edit" action hidden
  "Regenerate" hidden
  Right-click context menu: limited to View, Export, Copy Content
  Editor opens in read-only mode
  AI Chat: can view, cannot send new messages (or: can send, AI responds but can't apply to docs)

OWNER vs EDITOR (on own projects):
  EDITORs can only archive/edit their OWN projects
  OWNERs (workspace) can archive/edit ANY project
  "You don't have permission" tooltip on disabled actions
```

---

## 23. Autosave

```
WHAT AUTOSAVES:
  Document edits (in Editor):  ✅  Debounced 2s after last keystroke
  Project settings:            ✅  On field blur or manual save
  Document content (if edited in preview panel):  ❌ (read-only preview)
  Pipeline progress:           ✅  Server-side (no client autosave needed)
  Tasks:                       ✅  Debounced 3s (localStorage or API)
  Favorites:                   ✅  Optimistic toggle + immediate API

AUTOSAVE INDICATOR:
  Status bar in editor (if open): "✓ Saved 3s ago"
  No indicator needed for project overview (no editable fields)

CONFLICT HANDLING:
  Server-side: Last-write-wins for document content
  Version increment: Each significant save (>50 char change) creates new version
  Concurrent warning: Future — "This document was modified by another user. [Reload]"
```

---

## 24. API Design

### Complete API Reference

```
PROJECT CRUD:
  GET    /api/v1/projects/:id                          Get project details
  PATCH  /api/v1/projects/:id                          Update project (name, description, settings)
  DELETE /api/v1/projects/:id                          Archive project (soft delete)
  POST   /api/v1/projects/:id/restore                  Restore archived project
  POST   /api/v1/projects/:id/duplicate                Duplicate project
  POST   /api/v1/projects/:id/move                     Move to different workspace

  Get Project:
    Response includes: project + document list + stats
    {
      "success": true,
      "data": {
        "id": "uuid",
        "name": "Mobile App Redesign",
        "status": "ACTIVE",
        "documents": [{ id, stepId, title, type, status, version, tokensUsed }],
        "stats": { totalDocuments: 4, completedSteps: 3, totalTokens: 45000, totalCost: 1.21 }
      }
    }

DOCUMENTS:
  GET    /api/v1/projects/:id/documents               List all documents for project
  GET    /api/v1/projects/:id/documents/:stepId       Get specific document
  PATCH  /api/v1/projects/:id/documents/:stepId       Update document content (from editor)
  POST   /api/v1/projects/:id/documents/:stepId/versions/:version/restore  Restore version

  List Documents:
    Response: { success: true, data: { documents: [Document[]] } }
    Documents include: stepId, title, type, status, version, content (truncated?),
                       tokensUsed, modelUsed, stale, createdAt, updatedAt

  Get Document:
    Response includes full content (Text field)
    { success: true, data: { ...document, content: "# Full content..." } }

  Update Document:
    Payload: { content: "# Updated content..." }
    Server: increments version, creates DocumentVersion, updates status to REVIEWED if manual edit
    Response: { success: true, data: Document }

GENERATION (Pipeline):
  POST   /api/v1/pipeline/generate                    Generate single document (non-streaming)
  POST   /api/v1/pipeline/generate/stream             Generate with SSE streaming
  POST   /api/v1/pipeline/run                         Run full pipeline (all 9 steps)
  POST   /api/v1/pipeline/generate/:id/cancel         Cancel active generation

  Generate:
    Payload: { projectId, stepId, userInput?, template?, regenerate?: boolean }
    Business logic:
      - Validates project exists + user has editor access
      - Checks no active generation for same step
      - Creates AIConversation (status: ACTIVE)
      - Calls GenerationService.generateDocument()
      - Returns document on completion (or SSE stream)
    Response (non-streaming):
      { success: true, data: { document: { id, title, stepId, status, version, content } } }

  Generate Stream (SSE):
    Same payload.
    Response: text/event-stream
    Events:
      data: {"content": "# System Architecture\n\n## Overview..."}
      data: {"content": "The system uses..."}
      data: {"progress": {"tokensUsed": 1200, "tokensTotal": 16000, "percentComplete": 7}}
      data: [DONE]
      data: {"error": "API rate limit exceeded"}

  Run Full Pipeline:
    Payload: { projectId, userInput? }
    Server: sequentially executes all 9 steps
    Response: { success: true, data: { results: [{ stepId, status, tokens? }] } }

CONVERSATIONS:
  GET    /api/v1/conversations?projectId=:id         List conversations for project
  POST   /api/v1/conversations                        Create new conversation
  GET    /api/v1/conversations/:id                    Get conversation with messages
  POST   /api/v1/conversations/:id/messages           Send message (streaming SSE)
  DELETE /api/v1/conversations/:id                    Archive conversation

EXPORTS:
  GET    /api/v1/exports?projectId=:id               List exports for project
  POST   /api/v1/exports                               Create export
  GET    /api/v1/exports/:id                           Get export status + download URL

ACTIVITY:
  GET    /api/v1/projects/:id/activity                Project activity feed

CACHING:
  Project details:         SWR, stale 30s
  Document list:           SWR, stale 30s
  Document content:        SWR, stale 60s (cached; editor bypasses cache)
  Active generations:      Poll every 3s (or SSE)
  Conversation list:       SWR, stale 30s
  Export list:             SWR, stale 60s

OPTIMISTIC UPDATES:
  Project rename:          ✅
  Favorite toggle:         ✅
  Archive project:         ✅ (optimistic hide + navigate to workspace)
  Document edit (editor):  ⚠️ Autosave. Not optimistic (content is critical).
  Task add/toggle/delete:  ✅

RETRY LOGIC:
  Generation failure:      Manual retry via UI. No automatic retry.
  SSE disconnect:          Auto-reconnect with 2s, 5s, 15s backoff. Max 3 attempts.
  CRUD failures:           SWR automatic retry (3 attempts, exponential backoff).
  Export failure:          Manual retry via UI.
```

---

## 25. Database Schema (Project-Related)

```
Project:
  id, name, slug, description, workspaceId (FK), ownerId (FK),
  status (DRAFT/ACTIVE/COMPLETED/ARCHIVED),
  settings (JSON: { pinnedDocuments, tags, tasks[], ... }),
  deletedAt
  Relations: workspace, owner, documents[], aiConversations[], exports[]
  Indexes: (workspaceId, slug) unique  ✅

Document:
  id, projectId (FK), stepId, title, type (9 enum values),
  content (Text), status (DRAFT/GENERATED/REVIEWED/STALE),
  version, conversationId (FK), tokensUsed, modelUsed,
  stale, staleReason, deletedAt
  Unique: (projectId, stepId)  ✅
  Indexes: (projectId, type), (conversationId), (status)  ✅

DocumentVersion:
  id, documentId (FK), versionNumber, content (Text — immutable),
  modelUsed, tokensUsed, createdAt
  Unique: (documentId, versionNumber)  ✅

AIConversation:
  id, projectId (FK), stepId, status (ACTIVE/COMPLETED/FAILED/CANCELLED),
  model, temperature, maxTokens, totalInputTokens, totalOutputTokens,
  totalCost, startedAt, completedAt, deletedAt
  Relations: messages[], generations[], documents[]
  Indexes: (projectId, stepId), (projectId, status)  ✅

Message:
  id, conversationId (FK), role (SYSTEM/USER/ASSISTANT),
  content (Text), tokens?, sequence
  Unique: (conversationId, sequence)  ✅

Generation:
  id, conversationId (FK), model, provider (OPENAI/ANTHROPIC/GOOGLE/OLLAMA),
  promptTokens, completionTokens, totalTokens, cost, durationMs,
  status (SUCCESS/FAILED/RETRIED), errorMessage?, createdAt
  Indexes: (conversationId), (createdAt)  ✅

Export:
  id, projectId (FK), format (PDF/MARKDOWN/HTML/DOCX),
  status (PENDING/PROCESSING/COMPLETED/FAILED),
  fileUrl?, fileSize?, documentIds (JSON), createdAt, expiresAt
  Indexes: (projectId), (status)  ✅

RELATIONSHIPS:
  Project ──1:N──▶ Document ──1:N──▶ DocumentVersion
  Project ──1:N──▶ AIConversation ──1:N──▶ Message
  AIConversation ──1:N──▶ Generation
  Project ──1:N──▶ Export
  Document ──1:1──▶ AIConversation (via conversationId)

STALENESS DETECTION:
  When upstream document is regenerated:
    - Check downstream documents (later pipeline steps)
    - Set stale = true, staleReason = "Upstream document '{stepId}' changed (vX → vY)"
    - Visual: Amber STALE badge on document card
  When stale document is regenerated:
    - Clear stale flag
    - Check its downstream documents for staleness
```

---

## 26. Security

```
PROJECT ACCESS:
  - User must be workspace member to access project
  - Project owner or workspace admin can manage project settings
  - Document generation requires EDITOR role or higher
  - Export requires at least VIEWER role

API AUTHORIZATION:
  - All project endpoints: verify JWT → check workspace membership → check project access
  - EDITOR can only modify own projects (unless workspace-wide editor permission is enabled)
  - VIEWER gets 403 on any mutation endpoint

DATA ISOLATION:
  - All queries scoped to projectId
  - Cross-project access blocked by workspace boundary
  - Export files: signed URLs with expiry (7 days default)

AUDIT TRAIL (future):
  - Project created/archived/restored/deleted
  - Document generated/regenerated/edited/exported
  - Pipeline run started/completed/failed
  - Settings changed
```

---

## 27. Performance

```
LAZY LOADING:
  Document content:     Only fetched when viewing/editing (document grid shows metadata only)
  Document grid:        First 9 render immediately. Content lazy-loaded on demand.
  Streaming panel:      Only mounted when generation is active.
  Version history:      Only fetched when navigating to versions page.
  Exports tab:          Only fetched when tab is selected.
  Activity feed:        Paginated (20 per page). "Load more" button.

VIRTUALIZATION:
  Document grid:        Not needed (max 9). All rendered.
  Activity feed:        Not needed for <100 items. Pagination sufficient.
  Version history:      Virtualization for 50+ versions.
  Conversation list:    Virtualization for 20+ conversations.

CACHING:
  SWR:                  Project data cached 30s. Document grid cached 30s.
  Active generation:    SSE preferred. Polling fallback every 3s.
  Document content:     Cache 60s. Editor bypasses cache.

REAL-TIME UPDATES:
  Generation progress:  SSE streaming for token output
  Generation status:    Polling every 3s for active conversations
  Staleness:            Recalculated on document regenerate

MEMOIZATION:
  Document cards:       React.memo with shallow comparison
  Pipeline progress:    React.memo — only re-renders on step status change
  Streaming output:     append-only rendering (no re-render of previous content)
```

---

## 28. Accessibility

```
WCAG 2.2 AA:
  Color contrast:       All text ≥ 4.5:1. Pipeline status uses text + color (not color-only).
  Keyboard:             Tab through document cards. Enter to open. Arrow keys to navigate grid.
                        All generation controls keyboard-accessible.
  Screen reader:        Document grid announced as grid with row/col info.
                        "4 of 9 steps complete" announced as progress.
                        Streaming content announced periodically via aria-live="polite".
  Focus management:     Focus moves to streaming panel when generation starts.
                        Focus returns to document card on generation complete.
  ARIA:                 Pipeline progress: role="progressbar", aria-valuenow, aria-valuemin=0, aria-valuemax=9.
                        Generate buttons: aria-label="Generate Architecture document"
                        Status badges: aria-label="Status: Generated, version 3"
  Reduced motion:       Pulsing dot becomes static. Progress bar: instant width.
                        Card hover lift disabled. Streaming: instant text (no typewriter).

KEYBOARD GRID NAVIGATION:
  Tab:     Move between document cards (left to right, top to bottom)
  Enter:   Open selected document
  Arrow keys: Move between cards (grid pattern)
  Home:    Jump to first card (Master Context)
  End:     Jump to last card (Roadmap)
  Ctrl+Enter: Generate selected card (if pending/not started)
```

---

## 29. Responsive Design

```
DESKTOP (≥1280px):
  Sidebar:        200px pipeline steps
  Content:        max-w-1200px
  Grid:           3 columns × 3 rows
  Streaming:      420px right panel
  Header:         Full, all actions visible

LAPTOP (1024–1279px):
  Sidebar:        200px (or collapsible to 48px icons)
  Grid:           3 columns
  Streaming:      380px right panel (or overlay)

TABLET (768–1023px):
  Sidebar:        Hidden. Pipeline steps as horizontal scrollable bar above grid.
  Grid:           2 columns
  Streaming:      Full-width bottom panel or full-screen overlay
  Header:         Compact. Progress bar condensed.

MOBILE (<768px):
  Sidebar:        None. Pipeline steps as horizontal scrollable pills (icon + number only).
  Grid:           1 column (cards stacked vertically)
  Streaming:      Full-screen overlay. "X" to close.
  Header:         Minimal. Name + status + progress bar (compact). Actions in dropdown.
  Document card:  Compact. Status icon + name + actions. Expand on tap for details.

  Bottom Nav:     🏠 Home · 📁 Workspaces · 🤖 AI · 👤 Profile
```

---

## 30. React Component Hierarchy

```
ProjectModule
│
├── ProjectShell (layout wrapper)
│   ├── ProjectHeader (sticky)
│   │   ├── ProjectInfo (name, description, workspace context, metadata)
│   │   ├── StatusBadge
│   │   ├── FavoriteToggle (⭐)
│   │   ├── ContextMenu (•••)
│   │   ├── ProjectActions (RunFullPipeline, AIChat, Export, More)
│   │   └── PipelineProgress
│   │       ├── ProgressBar (overall fill + "X/9 complete")
│   │       └── StepIndicator[]
│   │           ├── StepIcon
│   │           ├── StepLabel
│   │           ├── StepStatus (✓ / ⟳ / ○ / ✕ / ⚠)
│   │           └── StepTooltip (on hover)
│   │
│   ├── PipelineSidebar (left, collapsible)
│   │   ├── PipelineStepItem[] (9 steps)
│   │   │   ├── StepIcon + StepName
│   │   │   ├── StatusIndicator
│   │   │   ├── Metadata (version, tokens, timestamp)
│   │   │   └── onClick → navigate or generate
│   │   ├── QuickLinks (AI Chat, Exports, History)
│   │   └── ProjectActions (Settings, Duplicate)
│   │
│   └── ProjectContent (main area)
│       │
│       ├── DocumentGrid (Overview tab — default)
│       │   └── DocumentCard[] (9 cards)
│       │       ├── DocumentIcon + Title
│       │       ├── StatusBadge + VersionBadge
│       │       ├── DocumentMeta (tokens, model, timestamp)
│       │       ├── ActionButtons (View, Edit, Regenerate, •••)
│       │       ├── GenerationProgressBar (conditional — when GENERATING)
│       │       ├── StaleWarning (conditional — when STALE)
│       │       ├── ErrorMessage (conditional — when FAILED)
│       │       └── EmptyState (conditional — when DRAFT/not started)
│       │
│       ├── DocumentList (Documents tab)
│       │   ├── DocumentToolbar (search, filter by status)
│       │   └── DocumentRow[] (list variant of cards)
│       │
│       ├── ConversationList (Conversations tab)
│       │   └── ConversationItem[]
│       │
│       ├── ExportList (Exports tab)
│       │   ├── NewExportButton
│       │   └── ExportHistoryItem[]
│       │
│       ├── ProjectSettings (Settings tab)
│       │   ├── GeneralForm (name, description, status)
│       │   └── DangerZone (Archive, Delete)
│       │
│       └── ActivityFeed
│           ├── ActivityFilters
│           └── ActivityTimeline
│               └── ActivityItem[]
│
├── StreamingPanel (right, conditional)
│   ├── PanelHeader (step name + Cancel button)
│   ├── StreamingContent (Markdown rendered live)
│   │   ├── BlinkingCursor
│   │   └── AutoScrollContainer
│   └── PanelFooter (tokens, cost, elapsed, model)
│
├── DocumentPreview (right, conditional)
│   ├── PanelHeader (doc name + version + Close)
│   ├── MarkdownPreview (read-only)
│   ├── DocumentMeta (version, tokens, model, date)
│   └── ActionBar (Open in Editor, Regenerate, Export, Versions)
│
├── GenerateDialog (confirmation for regeneration)
│   └── "Regenerating will create version X. Upstream documents may become stale. Continue?"
│
├── RunPipelineDialog (confirmation for full pipeline)
│   └── "This will generate/regenerate all 9 documents. Estimated cost: $0.50-$2.00. Continue?"
│
├── ArchiveDialog
└── DuplicateDialog
```

---

*Document Version: 1.0 — PromptPilot Enterprise Project Module Specification*
*Last Updated: 2026-07-21*
*Status: Foundation built (models, repos, routes, generation engine). Ready for frontend UI implementation.*
