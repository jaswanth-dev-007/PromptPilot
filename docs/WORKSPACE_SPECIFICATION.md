# PromptPilot — Enterprise Workspace Specification

## Complete UX, UI, Engineering, Security & Architecture Design

### Version 1.0 — Production-Ready Build Document

---

## Design System Reference

All components reference the PromptPilot Design System (`docs/DESIGN_SYSTEM.md`), Tailwind token config (`tailwind.config.js`), and the Product UX Specification (`docs/PRODUCT_UX_SPECIFICATION.md`).

### Existing Foundation (Already Built)

| Component                             | Status   | Location                                                   |
| ------------------------------------- | -------- | ---------------------------------------------------------- |
| Workspace Prisma model                | ✅ Built | `prisma/schema.prisma`                                     |
| WorkspaceMember model                 | ✅ Built | `prisma/schema.prisma`                                     |
| WorkspaceRepository (CRUD)            | ✅ Built | `packages/database/src/repositories/`                      |
| Express workspace routes              | ✅ Built | `apps/api/src/routes/workspaces.ts`                        |
| Workspace-scoped sidebar              | ✅ Built | `components/sidebar/Sidebar.tsx` + `NavigationContext.tsx` |
| Navigation routes (workspace section) | ✅ Built | `lib/navigation/routes.ts`                                 |
| Workspace list page scaffold          | ✅ Built | `apps/frontend/app/(app)/workspaces/page.tsx`              |
| Single workspace page scaffold        | ✅ Built | `apps/frontend/app/(app)/workspace/page.tsx`               |
| Dashboard API (workspace stats)       | ✅ Built | `apps/api/src/routes/dashboard.ts`                         |
| Design System                         | ✅ Built | `tailwind.config.js` + `DESIGN_SYSTEM.md`                  |

### Design Tokens

- **Typography:** Inter (headings + body), JetBrains Mono (code). Scale 12–72px, weights 400/500/600/700
- **Primary:** Indigo-600 (#4F46E5), **Neutral:** Slate 50–950
- **Spacing:** 4px base unit, **Radii:** sm 4px / md 8px / lg 12px / xl 16px
- **Shadows:** sm/md/lg/xl + glow-primary
- **Motion:** 150ms fast, 250ms normal, 400ms slow, Framer Motion spring
- **Breakpoints:** sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px

---

## 1. Purpose

### Business Objective

The Workspace is the primary organizational container in PromptPilot — it owns projects, manages team membership, controls permissions, stores shared resources, and anchors billing. Its business objectives are:

1. **Enable team collaboration**: Provide a shared space where multiple users can create, edit, review, and export projects together
2. **Drive team adoption**: Individual users invite colleagues → workspace becomes sticky → team converts to paid plan
3. **Support enterprise sales**: Workspace is the billing unit. Features like SSO, audit logs, and custom roles are workspace-scoped
4. **Organize at scale**: As users create dozens of projects, workspaces prevent chaos by grouping related work
5. **Manage resources**: Control AI provider configuration, API keys, templates, and shared assets at the workspace level

### User Objective

Users interact with workspaces to:

1. **Organize work**: Group related projects (e.g., "Mobile App", "Internal Tools", "Client Deliverables")
2. **Collaborate**: Invite team members, assign roles, review each other's documents
3. **Share resources**: Access workspace templates, prompt libraries, and knowledge bases
4. **Configure AI**: Set up AI providers and manage API keys for the team
5. **Monitor activity**: See what the team is working on, track project progress, review audit logs
6. **Manage billing**: Handle plan, seats, usage, and invoices

### Primary Use Cases

| Use Case                                   | Persona            | Workspace Feature         |
| ------------------------------------------ | ------------------ | ------------------------- |
| Create team workspace and invite engineers | Tech Lead          | Members, Invitations      |
| Organize 20+ client projects               | Consultant, Agency | Project Management, Tags  |
| Set up AI provider for the team            | Admin, Tech Lead   | AI Configuration          |
| Share prompt templates with team           | Prompt Engineer    | Prompt Library            |
| Review team's recent activity              | Manager            | Activity Feed, Audit Logs |
| Control who can edit vs. view documents    | Admin, Tech Lead   | Roles & Permissions       |
| Archive old projects to reduce clutter     | Any member         | Project Management        |
| Configure GitHub integration for spec sync | Developer          | Integrations              |

### Workspace Lifecycle

```
CREATED      (owner creates workspace via onboarding or "New Workspace")
    │
    ▼
ACTIVE       (normal state — projects, members, activity)
    │
    ├──▶ RENAMED       (name/slug change — PATCH)
    ├──▶ MEMBER_ADDED  (invitations sent and accepted)
    ├──▶ MEMBER_REMOVED (member leaves or is removed)
    ├──▶ OWNER_CHANGED (ownership transferred to another admin)
    │
    ▼
ARCHIVED     (soft delete — owner/admin archives workspace)
    │         (projects hidden, members cannot access)
    │         (recoverable within 30 days)
    ├──▶ RESTORED      (back to ACTIVE)
    │
    ▼
DELETED      (permanent after 30 days archival or manual hard delete)
              (all data permanently removed)
```

---

## 2. Information Architecture

### Complete Workspace Hierarchy

```
Workspace (e.g., "Acme Corp")
│
├── Workspace Overview (landing page for workspace context)
│   ├── Summary Statistics
│   ├── Recent Activity Feed
│   ├── Pinned Projects
│   ├── Quick Actions
│   ├── AI Usage Overview
│   └── Team Members (preview)
│
├── Projects (list + management)
│   ├── Project List (filterable, sortable, paginated)
│   ├── Project Cards / Rows
│   ├── Create Project (dialog)
│   ├── Bulk Actions (archive, export, move)
│   └── Project Details (navigates to Project module)
│
├── Members (user management)
│   ├── Member List (role, joined date, last active)
│   ├── Pending Invitations (resend, revoke)
│   ├── Invite Members (dialog: email + role + message)
│   ├── Role Management (change role per member)
│   ├── Remove Members (confirmation)
│   └── Transfer Ownership (confirmation + password)
│
├── Prompt Library (shared + personal prompts)
│   ├── Prompts Grid / List
│   ├── Collections & Folders
│   ├── Tags & Categories
│   ├── Search & Filters
│   ├── Create/Edit Prompt
│   ├── Version History per Prompt
│   └── Import / Export Prompts
│
├── Templates (document + prompt templates)
│   ├── Template List (type: PRD, SRS, Architecture, etc.)
│   ├── Template Preview
│   ├── Create Custom Template
│   ├── Use Template (creates project/document from template)
│   └── Marketplace Templates (future)
│
├── AI Configuration (providers + models)
│   ├── Provider List (OpenAI, Anthropic, Google, etc.)
│   ├── API Key Management (add, mask, rotate, revoke)
│   ├── Model Selection (per step or global default)
│   ├── Rate Limits & Quotas
│   ├── Cost Tracking
│   └── Provider Status (health check, latency)
│
├── Shared Assets / Knowledge Base
│   ├── Reference Documents
│   ├── Brand Guidelines
│   ├── Code Snippets
│   ├── Images & Media
│   └── Search & Browse
│
├── Activity Center
│   ├── Activity Timeline (filterable by type, user, date)
│   ├── AI Generation Activity
│   ├── User Activity (member joined, left, role changed)
│   ├── Project Activity (created, archived, exported)
│   └── Audit Logs (for ADMIN — full event history)
│
├── Integrations
│   ├── Connected Integrations (status, configure, disconnect)
│   ├── Available Integrations (browse, connect)
│   ├── Webhook Management (endpoints, events, logs)
│   └── API Key Management (workspace-level API keys)
│
├── Settings
│   ├── General (name, slug, description, avatar/icon)
│   ├── Branding (logo, color — Pro/Team feature)
│   ├── AI Defaults (default model, temperature, max tokens)
│   ├── Notifications (email, in-app, slack)
│   ├── Security (session timeout, IP restrictions, MFA requirement)
│   ├── Data & Privacy (data retention, export, deletion)
│   └── Danger Zone (archive, transfer ownership, delete)
│
├── Billing & Usage
│   ├── Current Plan (name, price, renewal date)
│   ├── Seat Management (used / total)
│   ├── AI Credit Usage (tokens, cost)
│   ├── Storage Usage
│   ├── Invoices & Payment History
│   ├── Payment Methods
│   ├── Upgrade / Downgrade Flow
│   └── Usage Alert Configuration
│
└── Trash / Archive
    ├── Archived Projects (restore, permanent delete)
    ├── Deleted Prompts
    ├── Deleted Templates
    └── Auto-delete Policy (30-day retention)
```

---

## 3. Complete Layout

### Workspace Shell Layout (applies to all workspace pages)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  WORKSPACE SHELL (extends App Shell — sidebar + navbar + content)            │
│                                                                               │
│  ┌──────────┐ ┌────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │ │  NAVBAR (56px)                                              │ │
│  │          │ │  🏠 Home > Workspaces > Acme Corp > Projects                │ │
│  │ 🏠 Dash  │ │  (breadcrumbs with workspace context)         ⌘K  🔔  👤 ▾ │ │
│  │ 🏢 Works │ ├────────────────────────────────────────────────────────────┤ │
│  │ 📁 Proj  │ │                                                             │ │
│  │          │ │  WORKSPACE HEADER (sticky, bg-white, border-b, z-10)        │ │
│  │ ──────── │ │  ┌───────────────────────────────────────────────────────┐ │ │
│  │ WORKSPACE│ │  │ 🏢 Acme Corporation          [TEAM] badge  ⭐  [•••]  │ │ │
│  │ 🏠 Overv │ │  │ acme-corp · 5 projects · 3 members · Active          │ │ │
│  │ 📁 Proj  │ │  │                                                       │ │ │
│  │ 👥 Memb  │ │  │ [Overview] [Projects] [Members] [Templates] [•••]    │ │ │
│  │ 📝 Prom  │ │  │ ← tabs — horizontal scroll on mobile                │ │ │
│  │ 📄 Temp  │ │  └───────────────────────────────────────────────────────┘ │ │
│  │ 🤖 AI    │ │                                                             │ │
│  │ 📚 Know  │ │  CONTENT AREA (flex-1, overflow-y-auto, p-6)               │ │
│  │ 📊 Activ │ │  max-width: 1200px, mx-auto                                 │ │
│  │ 🔌 Integ │ │                                                             │ │
│  │ ⚙️ Sett  │ │  ┌───────────────────────────────────────────────────────┐ │ │
│  │ 💳 Bill  │ │  │                                                       │ │ │
│  │ ──────── │ │  │  [Tab content renders here]                          │ │ │
│  │ 🔔 Act   │ │  │                                                       │ │ │
│  │ ⚙️ Sett  │ │  │  Varies by active tab:                               │ │ │
│  │ ❓ Help  │ │  │  - Overview:  stats, recent activity, quick actions  │ │ │
│  └──────────┘ │  │  - Projects:  filterable project list/grid          │ │ │
│               │  │  - Members:   member list + invitation management   │ │ │
│               │  │  - Settings:  form with sections                    │ │ │
│               │  │  - etc.                                            │ │ │
│               │  └───────────────────────────────────────────────────────┘ │ │
│               └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

```
DESKTOP (≥1280px):
  Sidebar: 240px expanded. Workspace section visible with all sub-items.
  Workspace Header: Full. Tabs horizontal. All metadata visible.
  Content: max-w-1200px centered. Tab content appropriate layout.

TABLET (768–1023px):
  Sidebar: 64px collapsed (icons only). Tooltip for labels.
  Workspace Header: Compact. Some metadata truncated. Tabs horizontal scroll.
  Content: Full width. Stacked layouts.

MOBILE (<768px):
  Sidebar: Hidden (hamburger overlay).
  Workspace Header: Minimal. Name + tab dropdown (or horizontal scroll).
  Content: Single column. All cards full-width.
  Bottom Nav: Present. 🏠 Home · 📁 Workspaces · 🤖 AI · 👤 Profile
```

---

## 4. Workspace Overview

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: OVERVIEW (default landing tab for workspace)                            │
│                                                                               │
│  ┌──────────────────────────────────────┐ ┌────────────────────────────────┐ │
│  │  WORKSPACE STATS (4-up grid)         │ │  QUICK ACTIONS                  │ │
│  │                                      │ │                                 │ │
│  │  ┌──────────┐ ┌──────────┐         │ │  [+ New Project]               │ │
│  │  │    5     │ │   32     │         │ │  [+ Invite Member]             │ │
│  │  │ Projects │ │ Documents│         │ │  [🤖 Open AI Chat]             │ │
│  │  └──────────┘ └──────────┘         │ │  [📋 Generate PRD]             │ │
│  │  ┌──────────┐ ┌──────────┐         │ │  [📄 Browse Templates]         │ │
│  │  │    3     │ │   12     │         │ │  [⚙️ Workspace Settings]       │ │
│  │  │ Members  │ │Generations│        │ └────────────────────────────────┘ │
│  │  └──────────┘ └──────────┘         │                                     │
│  └──────────────────────────────────────┘                                     │
│                                                                               │
│  ┌──────────────────────────────────────┐ ┌────────────────────────────────┐ │
│  │  RECENT PROJECTS (list, max 5)      │ │  RECENT ACTIVITY (timeline)     │ │
│  │                                      │ │                                 │ │
│  │  📋 Mobile App Redesign  Active     │ │  ● Jane joined the workspace    │ │
│  │     ████████░░  4/9 steps           │ │    2 hours ago                  │ │
│  │                                      │ │  ● PRD generated for Mobile    │ │
│  │  📋 API Gateway v2      Draft       │ │    App by Bob                   │ │
│  │     ██░░░░░░░░  1/9 steps           │ │    3 hours ago                  │ │
│  │                                      │ │  ● Architecture exported as    │ │
│  │  [View All Projects →]              │ │    PDF by Jane                  │ │
│  └──────────────────────────────────────┘ │    1 day ago                   │ │
│                                           │  [View All Activity →]         │ │
│                                           └────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────┐ ┌────────────────────────────────┐ │
│  │  AI USAGE (this month)              │ │  PINNED PROJECTS               │ │
│  │                                      │ │                                 │ │
│  │  Tokens: 125,000 / 500,000          │ │  ⭐ Mobile App Redesign         │ │
│  │  Cost:   $3.42                      │ │  ⭐ Architecture Reference      │ │
│  │  Model:  GPT-4o (70%), Claude (30%)│ │                                 │ │
│  │                                      │ │  (or empty state)              │ │
│  └──────────────────────────────────────┘ └────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  TEAM MEMBERS (preview — horizontal avatar row with count)               │ │
│  │  👤👤👤 +2  ·  [Manage Members →]                                       │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Empty States

```
FIRST-TIME (just created, no projects, no members beyond owner):
  All stat boxes show zeros.
  Recent Projects: "No projects yet. Create one to get started." [+ Create Project]
  Recent Activity: "No activity yet. Invite your team to collaborate."
  Pinned Projects: "Pin projects here for quick access."
  Team Members: Only owner shown. "Invite your team →" prompt.

WITH PROJECTS BUT NO MEMBERS:
  Stats show counts > 0.
  Activity shows project/document activity (AI generations, edits).
  Team Members: "Working solo? Invite collaborators →"
```

---

## 5. Workspace Switcher

### Location & Behavior

```
LOCATION:    Sidebar, between main nav and workspace section.
             Or: Top of sidebar as a dropdown when multiple workspaces exist.

DESKTOP VIEW:
  ┌────────────────────────────┐
  │  🏢 Acme Corp          ▾  │  ← Dropdown trigger
  │     acme-corp              │
  ├────────────────────────────┤
  │  DROPDOWN (on click):      │
  │  ┌────────────────────────┐│
  │  │ 🔍 Search workspaces...││
  │  │ ────────────────────── ││
  │  │ ● Acme Corp        ▾  ││  ← Current (indigo dot)
  │  │   5 projects · 3 members││
  │  │ ────────────────────── ││
  │  │ ○ Personal Workspace   ││
  │  │   2 projects · 1 member ││
  │  │ ────────────────────── ││
  │  │ ○ Client Deliverables  ││
  │  │   12 projects · 8 mem  ││
  │  │ ────────────────────── ││
  │  │ + Create Workspace     ││
  │  │ ⚙️ Manage Workspaces   ││
  │  └────────────────────────┘│
  └────────────────────────────┘

COLLAPSED SIDEBAR:
  ┌────┐
  │ 🏢 │  ← Icon only. Click opens dropdown.
  │ ▾  │
  └────┘

MOBILE:
  Top of content area (below navbar):
  ┌──────────────────────────────┐
  │ 🏢 Acme Corp ▾   [+ New]    │
  └──────────────────────────────┘
  Dropdown: full-width bottom sheet.

QUICK SWITCH KEYBOARD SHORTCUT:
  ⌘1, ⌘2, ⌘3 — Switch to 1st/2nd/3rd workspace (ordered by recent access)
  ⌘⇧W — Open workspace switcher in ⌘K
```

### Workspace CRUD Operations

```
CREATE:
  Trigger:     "+ Create Workspace" in dropdown or sidebar
  Dialog:      Name, slug (auto-generated, editable), type (Personal/Team), description
  POST:        /api/v1/workspaces { name, slug, type }
  On success:  Navigate to new workspace overview. Toast: "Workspace created!"

RENAME:
  Trigger:     Settings → General → Name field
  PATCH:       /api/v1/workspaces/:id { name }
  Optimistic:  Name updates instantly in header + sidebar. Revert on error.

CHANGE SLUG:
  Trigger:     Settings → General → Slug field
  PATCH:       /api/v1/workspaces/:id { slug }
  Validation:  Async uniqueness check. Debounced 500ms.
  Warning:     "Changing the URL may break shared links."

ARCHIVE:
  Trigger:     Settings → Danger Zone → "Archive Workspace"
  Dialog:      "Are you sure? All projects will be hidden from members.
               You can restore within 30 days."
  Confirm:     Type workspace name to confirm.
  DELETE:      /api/v1/workspaces/:id (soft — sets deletedAt)
  On success:  Navigate to /workspaces. Toast: "Workspace archived."

RESTORE:
  Trigger:     Workspaces list → "Archived" filter → ••• → Restore
  PATCH:       /api/v1/workspaces/:id { deletedAt: null, status: 'ACTIVE' }
  On success:  Workspace reappears in active list. Navigate to overview.

DELETE (PERMANENT):
  Trigger:     Archived workspace → ••• → "Delete Permanently"
  Dialog:      "This is irreversible. All data will be permanently deleted."
  Confirm:     Type "DELETE {workspace name}" to confirm.
  DELETE:      /api/v1/workspaces/:id (hard — or flag permanentDeleteAt)
  On success:  Workspace removed. Toast. Navigate to /workspaces.

FAVORITE:
  Toggle:      ⭐ icon next to workspace name (in switcher or header)
  Persistence: User preferences JSON.
  Effect:      Favorited workspaces appear first in switcher + sidebar.
```

---

## 6. Project Management

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: PROJECTS                                                                │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  TOOLBAR                                                                  │ │
│  │  ┌────────────────────────────┐  ┌──────────┐ ┌────────┐ ┌────────────┐ │ │
│  │  │ 🔍 Search projects...      │  │ Status ▼ │ │ Sort ▼ │ │+ New Project│ │ │
│  │  └────────────────────────────┘  └──────────┘ └────────┘ └────────────┘ │ │
│  │  (search with 200ms debounce)    (All/Draft/Active/Complete/Archived)      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  PROJECT LIST (or grid toggle)                                            │ │
│  │                                                                           │ │
│  │  LIST VIEW:                                                               │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ ☐  📋 Mobile App Redesign   Active   9 docs  4/9 steps  2h ago  [Open] [•••]│
│  │  │ ☐  📋 API Gateway v2        Draft    3 docs  1/9 steps  1d ago  [Open] [•••]│
│  │  │ ☐  📋 Analytics Dashboard   Complete 9 docs  9/9 steps  3d ago  [Open] [•••]│
│  │  │ ☐  📋 Internal Tools Suite  Archived 0 docs  0/9 steps  1w ago  [Restore]  │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  BULK ACTIONS BAR (appears when any checkbox checked):                    │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  3 selected  [Archive] [Export] [Move to Workspace] [Clear]        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  PAGINATION:                                                              │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Showing 1–20 of 45    [← Prev]  [1] [2] [3]  [Next →]            │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  EMPTY STATE (no projects):                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                              📁                                           │ │
│  │                      No projects yet                                      │ │
│  │          Create your first project to start generating specs.             │ │
│  │                       [+ Create Project]                                  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Project CRUD

```
CREATE:
  Trigger:     "+ New Project" button in toolbar
  Dialog:      ┌──────────────────────────────────────────┐
               │  Create New Project                       │
               │                                           │
               │  Project Name*                            │
               │  ┌──────────────────────────────────────┐ │
               │  │ My New Project                       │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Slug (auto-generated)                    │
               │  ┌──────────────────────────────────────┐ │
               │  │ my-new-project           ✓ Available │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Description (optional)                   │
               │  ┌──────────────────────────────────────┐ │
               │  │ Brief description of this project...  │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Template (optional)                      │
               │  ┌──────────────────────────────────────┐ │
               │  │ None (start empty)             ▾     │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  ┌──────────────┐  ┌──────────────┐      │
               │  │ Create        │  │ Cancel        │      │
               │  └──────────────┘  └──────────────┘      │
               └──────────────────────────────────────────┘
  POST:        /api/v1/projects { name, slug, description, workspaceId }
  On success:  Navigate to new project. Toast: "Project created!"

DUPLICATE:
  Trigger:     ••• → Duplicate (on project row)
  Dialog:      "Duplicate {project name}?"
               Option: ☐ "Include all documents" (copies generated documents)
               New name: "{original} (Copy)"
  POST:        /api/v1/projects { name, slug, workspaceId, duplicateFrom: projectId }
  On success:  New project appears in list. Toast.

ARCHIVE:
  Trigger:     ••• → Archive or bulk action
  Dialog:      "Archive {project}? Members won't be able to access it.
               You can restore within 30 days."
  DELETE:      /api/v1/projects/:id (soft)
  Optimistic:  Row fades out. Reappears if API fails.

RESTORE:
  Trigger:     Filter: "Archived" → "Restore" button on archived project row
  PATCH:       /api/v1/projects/:id { deletedAt: null }
  On success:  Row moves to active list.

DELETE PERMANENT:
  Trigger:     ••• → Delete Permanently (only visible for archived projects)
  Confirm:     Type project name.
  DELETE:      /api/v1/projects/:id (hard)

MOVE TO WORKSPACE:
  Trigger:     ••• → Move to Workspace
  Dialog:      Select target workspace from dropdown
  PATCH:       /api/v1/projects/:id { workspaceId }
  Confirm:     "Moving will change who can access this project."

TAGS:
  Trigger:     ••• → Manage Tags
  Dialog:      Add/remove tags. Free-text input with suggestions from existing tags.
  PATCH:       /api/v1/projects/:id { tags: [...] }
  Display:     Tags shown on project row as small chips

FILTERS:
  Status:      All | Draft | Active | Generating | Completed | Archived
  Type:        (future) PRD-first | Architecture-first | Custom
  Tags:        Multi-select tag filter
  URL:         Filters reflected in query params (?status=active&tag=client)

SORT:
  Options:     Last Modified (default) | Name A-Z | Name Z-A | Created (newest) | Created (oldest)
  URL:         ?sort=updatedAt&order=desc
```

---

## 7. Member Management

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: MEMBERS                                                                 │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  [+ Invite Member]                      🔍 Search members...             │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ACTIVE MEMBERS (3)                                                       │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 👤 Jane Smith (you)    Owner     jane@acme.com    Joined Jun 2026  │  │ │
│  │  │                       [Owner badge — cannot change own role]       │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 👤 Bob Johnson         Admin     bob@acme.com     Joined Jul 2026  │  │ │
│  │  │                       [Admin ▾]  [Remove]                         │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 👤 Carol Williams      Editor    carol@acme.com   Joined Jul 2026  │  │ │
│  │  │                       [Editor ▾]  [Remove]                        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  PENDING INVITATIONS (1)                                                  │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 📧 dave@acme.com       Editor   Sent 2 days ago   [Resend] [✕ Revoke]│ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  EMPTY (no members beyond owner):                                             │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          👥                                               │ │
│  │                  No team members yet                                      │ │
│  │         Invite collaborators to work together on projects.                │ │
│  │                    [+ Invite Member]                                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Member CRUD

```
INVITE:
  Trigger:     "+ Invite Member" button
  Dialog:      ┌──────────────────────────────────────────┐
               │  Invite Team Member                       │
               │                                           │
               │  Email Address*                            │
               │  ┌──────────────────────────────────────┐ │
               │  │ colleague@company.com                 │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Role                                     │
               │  ┌──────────────────────────────────────┐ │
               │  │ Editor                        ▾      │ │
               │  │  • Admin — full access                │ │
               │  │  • Editor — create/edit content       │ │
               │  │  • Viewer — read-only                 │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Personal Message (optional)              │
               │  ┌──────────────────────────────────────┐ │
               │  │ Hey! Join our PromptPilot workspace.. │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  ┌──────────────┐  ┌──────────────┐      │
               │  │ Send Invite   │  │ Cancel        │      │
               │  └──────────────┘  └──────────────┘      │
               └──────────────────────────────────────────┘
  POST:        /api/v1/workspaces/:id/invitations { email, role, message }
  On success:  Invitation appears in Pending list. Toast: "Invitation sent!"
  Email:       "Jane invited you to Acme Corp on PromptPilot" with Accept link.
  Expiry:      7 days.

RESEND INVITATION:
  Trigger:     "Resend" button on pending invitation
  POST:        /api/v1/workspaces/:id/invitations/:inviteId/resend
  Cooldown:    1 minute between resends
  Toast:       "Invitation resent!"

REVOKE INVITATION:
  Trigger:     ✕ on pending invitation
  Dialog:      "Revoke invitation to dave@acme.com?"
  DELETE:      /api/v1/workspaces/:id/invitations/:inviteId
  Optimistic:  Row fades out.

CHANGE ROLE:
  Trigger:     Role dropdown on member row
  Immediate:   PATCH /api/v1/workspaces/:id/members/:userId { role }
  Confirmation: Toast "Bob's role changed to Admin"
  Restrictions:
    - Cannot change OWNER's role
    - Admins can only be changed by Owner
    - Downgrading own role: "You're about to downgrade your own role. Continue?"

REMOVE MEMBER:
  Trigger:     "Remove" button on member row
  Dialog:      "Remove {name} from {workspace}? They will lose access to all projects."
  DELETE:      /api/v1/workspaces/:id/members/:userId
  Optimistic:  Row fades out.
  Restrictions:
    - Cannot remove Owner
    - Self-removal: "Leave workspace?" confirmation. Owner cannot leave without transfer.

TRANSFER OWNERSHIP:
  Trigger:     Settings → Danger Zone → "Transfer Ownership"
  Dialog:      Select new owner from Admin members.
               "This will transfer full ownership to {name}. You will become an Admin."
               Require password confirmation for security.
  POST:        /api/v1/workspaces/:id/transfer-ownership { newOwnerId, password }
  On success:  Roles swap. Workspace header updates. Toast.
```

### Bulk Invite (future)

```
TRIGGER:       "Bulk Invite" link below single invite form
INPUT:         Textarea — paste multiple emails (comma, semicolon, or newline separated)
               All get same role.
VALIDATION:    Parse and validate each email. Show invalid ones.
PROGRESS:      Send invitations sequentially or in batches. Show progress.
RESULTS:       "5 invitations sent. 2 emails were invalid: ..."
```

---

## 8. Roles & Permissions

### Complete Permission Matrix

```
ACTION                              OWNER   ADMIN   EDITOR  VIEWER
─────────────────────────────────────────────────────────────────────
WORKSPACE MANAGEMENT:
View workspace details              ✅      ✅      ✅      ✅
Edit workspace name/slug            ✅      ✅      ❌      ❌
Edit workspace settings             ✅      ✅      ❌      ❌
Archive workspace                   ✅      ❌      ❌      ❌
Transfer ownership                  ✅      ❌      ❌      ❌
View billing                        ✅      ✅      ❌      ❌
Manage billing                      ✅      ❌      ❌      ❌

MEMBER MANAGEMENT:
View member list                    ✅      ✅      ✅      ✅
Invite members                      ✅      ✅      ❌      ❌
Resend invitations                  ✅      ✅      ❌      ❌
Revoke invitations                  ✅      ✅      ❌      ❌
Change member roles                 ✅      ✅[1]   ❌      ❌
Remove members                      ✅      ✅[1]   ❌      ❌
Leave workspace                     ✅      ✅      ✅      ✅

PROJECT MANAGEMENT:
Create projects                     ✅      ✅      ✅      ❌
View all projects                   ✅      ✅      ✅      ✅
Edit any project settings           ✅      ✅      ✅[2]   ❌
Archive any project                 ✅      ✅      ❌      ❌
Restore any project                 ✅      ✅      ❌      ❌
Delete any project                  ✅      ❌      ❌      ❌
Move project to another workspace   ✅      ✅      ❌      ❌

DOCUMENT MANAGEMENT:
Generate documents (AI)             ✅      ✅      ✅      ❌
View all documents                  ✅      ✅      ✅      ✅
Edit documents                      ✅      ✅      ✅[2]   ❌
Review/approve documents            ✅      ✅      ✅      ❌
Export documents                    ✅      ✅      ✅      ✅
View version history                ✅      ✅      ✅      ✅
Restore document versions           ✅      ✅      ✅[2]   ❌

AI & RESOURCES:
Manage AI providers                 ✅      ✅      ❌      ❌
Manage API keys                     ✅      ✅      ❌      ❌
Access Prompt Library               ✅      ✅      ✅      ✅
Create/edit shared prompts          ✅      ✅      ✅      ❌
Delete shared prompts               ✅      ✅      ❌      ❌
Access Templates                    ✅      ✅      ✅      ✅
Create/edit shared templates        ✅      ✅      ✅      ❌

ACTIVITY & AUDIT:
View activity feed                  ✅      ✅      ✅      ✅
View audit logs                     ✅      ✅      ❌      ❌
Export audit logs                   ✅      ❌      ❌      ❌

INTEGRATIONS:
Manage integrations                 ✅      ✅      ❌      ❌
View integration status             ✅      ✅      ✅      ❌
Create/manage webhooks              ✅      ✅      ❌      ❌

[1] Admin can change roles of Editors and Viewers, but not other Admins or the Owner.
[2] Editor can only edit/restore documents in projects they created (own projects).
```

### Permission Inheritance

```
Organization (future)
    │
    └── Workspace
           │
           ├── Role: OWNER ──────── Full control
           ├── Role: ADMIN ──────── Management without destruction
           ├── Role: EDITOR ─────── Content creation + editing (own or all)
           └── Role: VIEWER ─────── Read-only

PERMISSION INHERITANCE RULES:
  1. Workspace role applies to ALL projects in that workspace
  2. EDITORs can only edit their OWN projects' documents (default)
     Configurable: "Allow Editors to edit all projects" setting (admin toggle)
  3. Future: Project-level role overrides workspace role (more granular)
  4. Future: Organization role overrides workspace role (org admin > workspace admin)
```

### Role Change Restrictions

```
SAFEGUARDS:
  - Cannot change OWNER's role (must transfer ownership first)
  - Admin can only change Editor/Viewer roles (not other Admins)
  - Cannot remove the last Admin (workspace must have at least one Admin/Owner)
  - Changing own role to lower permission shows warning:
    "You will lose the ability to manage members and settings. Continue?"
  - All role changes logged to audit trail

UI FEEDBACK:
  - Role change: Immediate toast confirmation
  - Unavailable actions: Button disabled with tooltip explaining why
  - Own role indicator: "(you)" badge next to own row
```

---

## 9. AI Configuration

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: AI CONFIGURATION                                                        │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  AI PROVIDERS                                                             │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  🤖 OpenAI                                            [Configure]  │  │ │
│  │  │     Status: ● Connected · Model: gpt-4o (default)                 │  │ │
│  │  │     API Key: sk-...a1b2                          [Rotate] [Remove]│  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  🧠 Anthropic                                         [Configure]  │  │ │
│  │  │     Status: ● Connected · Model: claude-3-5-sonnet-20241022       │  │ │
│  │  │     API Key: sk-ant-...x9y0                      [Rotate] [Remove]│  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  🔵 Google                                            [Configure]  │  │ │
│  │  │     Status: ○ Not configured                                       │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  🟣 Azure OpenAI                                      [Configure]  │  │ │
│  │  │     Status: ○ Not configured                                       │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  🟠 Groq                                              [Configure]  │  │ │
│  │  │     Status: ○ Not configured                                       │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  DEFAULT AI SETTINGS                                                      │ │
│  │                                                                           │
│  │  Default Model for New Projects:  [GPT-4o ▾]                             │ │
│  │  Default Temperature:             [0.2    ▾]  (0 = deterministic, 1 = creative)│
│  │  Default Max Tokens:              [16000  ▾]                              │ │
│  │                                                                           │ │
│  │  Provider Priority (for auto-fallback):                                   │ │
│  │  ≡ OpenAI                                                          ↑↓     │ │
│  │  ≡ Anthropic                                                       ↑↓     │ │
│  │  ≡ Google                                                          ↑↓     │ │
│  │  (drag to reorder — top provider tried first; falls back on failure)      │ │
│  │                                                                           │ │
│  │  [Save Defaults]                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  USAGE & QUOTAS                                                           │ │
│  │                                                                           │
│  │  Monthly Token Limit:  [500,000 ▾]  (0 = unlimited)                       │ │
│  │  Monthly Cost Limit:    [$50.00  ▾]  (0 = unlimited)                      │ │
│  │  Alert at:              [80%     ▾]  of limit                              │ │
│  │                                                                           │ │
│  │  Current Usage (July 2026):                                               │ │
│  │  Tokens: ████████████████░░░░░░  125,000 / 500,000  (25%)                │ │
│  │  Cost:   ██████░░░░░░░░░░░░░░░░  $12.50 / $50.00     (25%)               │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Provider Configuration Dialog

```
CONFIGURE PROVIDER (e.g., OpenAI):
  ┌──────────────────────────────────────────────────────────┐
  │  Configure OpenAI                                         │
  │                                                           │
  │  API Key*                                                 │
  │  ┌──────────────────────────────────────────────────────┐ │
  │  │ sk-...                                               │ │
  │  └──────────────────────────────────────────────────────┘ │
  │  Your key is encrypted at rest. Never shared.             │
  │                                                           │
  │  Organization ID (optional)                               │
  │  ┌──────────────────────────────────────────────────────┐ │
  │  │ org-...                                              │ │
  │  └──────────────────────────────────────────────────────┘ │
  │                                                           │
  │  Default Model                                            │
  │  ┌──────────────────────────────────────────────────────┐ │
  │  │ gpt-4o                                        ▾      │ │
  │  └──────────────────────────────────────────────────────┘ │
  │                                                           │
  │  Available Models (check to enable for this workspace):   │
  │  ☑ gpt-4o           ☑ gpt-4o-mini     ☐ gpt-4.1         │
  │  ☑ gpt-4-turbo      ☐ gpt-3.5-turbo   ☑ o3-mini         │
  │                                                           │
  │  ┌──────────────────┐  ┌──────────────┐                  │
  │  │ Test Connection   │  │ Save          │                  │
  │  └──────────────────┘  └──────────────┘                  │
  └──────────────────────────────────────────────────────────┘

TEST CONNECTION:
  Calls provider health check endpoint.
  Success: "✓ Connection successful. Model: gpt-4o. Latency: 234ms"
  Failure: "✕ Connection failed. Invalid API key or network error."

API KEY SECURITY:
  - Stored encrypted at rest (AES-256-GCM)
  - Never returned in API responses (masked: sk-...a1b2)
  - Rotate: generates new key warning. Old key invalidated after rotation.
  - Audit log: key added, key rotated, key removed, connection test
```

### Provider Health Status

```
PROVIDER      STATUS         LATENCY      LAST CHECKED
─────────────────────────────────────────────────────────
OpenAI        ● Connected     234ms       2 min ago
Anthropic     ● Connected     189ms       2 min ago
Google        ○ Not configured   —             —
Azure OpenAI  ⚠ Degraded      1,234ms     2 min ago
Groq          ✕ Error          Timeout     2 min ago

HEALTH CHECK: Runs every 5 minutes automatically.
              Manual trigger: "Test All Connections" button.
              Status affects provider priority (degraded/error providers skipped).
```

---

## 10. Prompt Library

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: PROMPT LIBRARY                                                          │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  TOOLBAR                                                                  │ │
│  │  ┌────────────────────────────┐  ┌──────────┐ ┌────────┐ ┌────────────┐ │ │
│  │  │ 🔍 Search prompts...       │  │ Tags ▼   │ │ Sort ▼ │ │+ New Prompt│ │ │
│  │  └────────────────────────────┘  └──────────┘ └────────┘ └────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌────────────┐ ┌──────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR    │ │  PROMPTS GRID (3 cols desktop, 2 tablet, 1 mobile)       │ │
│  │            │ │                                                           │ │
│  │ Collections │ │  ┌──────────────────┐ ┌──────────────────┐              │ │
│  │ ────────── │ │  │ 📝 PRD Generator  │ │ 📝 Code Review   │              │ │
│  │ 📁 All     │ │  │ ──────────────── │ │ ──────────────── │              │ │
│  │ 📁 PRD     │ │  │ Generates a      │ │ Reviews code for │              │ │
│  │ 📁 Code    │ │  │ comprehensive PRD│ │ bugs & patterns  │              │ │
│  │ 📁 Review  │ │  │ from description │ │                  │              │ │
│  │ 📁 Arch    │ │  │                  │ │ Tags: code       │              │ │
│  │ 📁 API     │ │  │ Tags: prd, doc   │ │ review           │              │ │
│  │ 📁 Favorites│ │  │ ⭐ 12 uses       │ │ ☆ 5 uses        │              │ │
│  │            │ │  │ [Use] [Edit] [•••]│ │ [Use] [Edit]    │              │ │
│  │ Filters    │ │  └──────────────────┘ └──────────────────┘              │ │
│  │ ────────── │ │                                                           │ │
│  │ ☐ Shared   │ │  ┌──────────────────┐ ┌──────────────────┐              │ │
│  │ ☑ My Prompts│ │  │ 📝 API Designer  │ │ 📝 Bug Report    │              │ │
│  │            │ │  │ ──────────────── │ │ ──────────────── │              │ │
│  │ Tags       │ │  │ Designs REST API │ │ Generates bug    │              │ │
│  │ ────────── │ │  │ specifications   │ │ report template  │              │ │
│  │ prd (3)    │ │  │                  │ │                  │              │ │
│  │ code (2)   │ │  │ Tags: api, design│ │ Tags: bugs       │              │ │
│  │ api (1)    │ │  │ ⭐ 8 uses        │ │ ☆ 2 uses        │              │ │
│  │ bugs (1)   │ │  └──────────────────┘ └──────────────────┘              │ │
│  └────────────┘ └──────────────────────────────────────────────────────────┘ │
│                                                                               │
│  EMPTY STATE:                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          📝                                               │ │
│  │                  No prompts yet                                           │ │
│  │       Create reusable prompts to speed up your workflow.                 │ │
│  │       [+ Create Prompt]  [Browse Templates]                              │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Prompt CRUD

```
CREATE:
  Dialog:      ┌──────────────────────────────────────────┐
               │  Create Prompt                            │
               │                                           │
               │  Title*                                   │
               │  ┌──────────────────────────────────────┐ │
               │  │ PRD Generator                        │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  System Prompt*                            │
               │  ┌──────────────────────────────────────┐ │
               │  │ You are an expert product manager... │ │
               │  │ (multi-line, 10 rows)                │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  User Prompt Template*                     │
               │  ┌──────────────────────────────────────┐ │
               │  │ Generate a PRD for: {product_desc}   │ │
               │  │ Variables: {product_desc}, {audience} │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Collection                               │
               │  ┌──────────────────────────────────────┐ │
               │  │ PRD ▾                                │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Tags                                     │
               │  ┌──────────────────────────────────────┐ │
               │  │ prd ×  documentation ×  template ×   │ │
               │  └──────────────────────────────────────┘ │
               │                                           │
               │  Visibility                               │
               │  ○ Private (only me)                      │
               │  ● Shared (workspace members)             │
               │                                           │
               │  ┌──────────────┐  ┌──────────────┐      │
               │  │ Save Prompt   │  │ Cancel        │      │
               │  └──────────────┘  └──────────────┘      │
               └──────────────────────────────────────────┘

EDIT:
  Same dialog, pre-filled. Tracks versions on save.
  Version counter: "v3 · Last edited 2 days ago"

USE:
  Click "Use" → navigates to AI Chat with prompt pre-loaded
  Or: Inserts into current editor session
  Usage counter increments

DELETE:
  ••• → Delete → Confirmation dialog
  Soft delete → moves to "Deleted" filter
  Permanent after 30 days
```

---

## 11. Template Library

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: TEMPLATES                                                               │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  [All Templates] [PRD] [SRS] [Architecture] [DB Schema] [API Spec] [...] │ │
│  │  (horizontal scrollable category tabs)                                    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐  │
│  │ ┌──────────────────┐ │ │ ┌──────────────────┐ │ │ ┌──────────────────┐ │  │
│  │ │ Standard PRD     │ │ │ │ Agile PRD        │ │ │ │ Lean PRD         │ │  │
│  │ │ ──────────────── │ │ │ │ ──────────────── │ │ │ │ ──────────────── │ │  │
│  │ │ Comprehensive    │ │ │ │ User-story based │ │ │ │ Minimal, focused │ │  │
│  │ │ PRD with all     │ │ │ │ PRD for agile    │ │ │ │ PRD for startups │ │  │
│  │ │ standard sections│ │ │ │ teams            │ │ │ │                  │ │  │
│  │ │                  │ │ │ │                  │ │ │ │                  │ │  │
│  │ │ Sections: 12     │ │ │ │ Sections: 8     │ │ │ │ Sections: 5     │ │  │
│  │ │ ⭐ Popular       │ │ │ │ ⭐ 45 uses       │ │ │ │ ⭐ 12 uses       │ │  │
│  │ │ [Use] [Preview]  │ │ │ │ [Use] [Preview]  │ │ │ │ [Use] [Preview]  │ │  │
│  │ └──────────────────┘ │ │ └──────────────────┘ │ │ └──────────────────┘ │  │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘  │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  YOUR CUSTOM TEMPLATES                                                    │ │
│  │  ┌──────────────────────┐ ┌──────────────────────┐                       │ │
│  │  │ Client Onboarding    │ │ Internal Tools Spec  │                       │ │
│  │  │ ─────────────────── │ │ ─────────────────── │                       │ │
│  │  │ Custom PRD for      │ │ Template for        │                       │ │
│  │  │ client projects     │ │ internal tool specs │                       │ │
│  │  │ [Use] [Edit] [•••]  │ │ [Use] [Edit] [•••]  │                       │ │
│  │  └──────────────────────┘ └──────────────────────┘                       │ │
│  │                                                    [+ Create Template]   │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Template Usage

```
USE TEMPLATE:
  Click "Use" → Dialog: "Create project from '{template name}'?"
  Options: workspace (pre-filled), project name (auto-suggested), description
  Creates new project with template's pipeline structure and prompt configuration
  Navigate to new project

CREATE CUSTOM TEMPLATE:
  From existing project: ••• → "Save as Template"
  Or from scratch: "+ Create Template" in Templates tab
  Dialog: name, description, category, visibility (private/shared), source project (optional)
  Saved template appears in "Your Custom Templates"

PREVIEW TEMPLATE:
  Click "Preview" → side panel or modal showing template structure
  Lists: sections, prompts, pipeline configuration
  "What this template generates" description
```

---

## 12. Shared Assets / Knowledge Base (Future Phase 5)

```
TAB: KNOWLEDGE BASE

PURPOSE: Store reference documents, brand guidelines, code snippets, and
         other assets that the AI can reference when generating documents.

LAYOUT:
  ┌──────────────────────────────────────────────────────────────────┐
  │  ┌────────────────┐ ┌──────────────────────────────────────────┐ │
  │  │ FOLDERS        │ │  ASSETS GRID / LIST                       │ │
  │  │ 📁 Brand       │ │                                           │ │
  │  │ 📁 Tech Specs  │ │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
  │  │ 📁 Code        │ │  │ 📄 Brand │ │ 📄 Style │ │ 📄 API   │ │ │
  │  │ 📁 Research    │ │  │ Guide    │ │ Guide    │ │ Standards│ │ │
  │  │                │ │  └──────────┘ └──────────┘ └──────────┘ │ │
  │  │ [+ New Folder] │ └──────────────────────────────────────────┘ │
  │  └────────────────┘                                              │
  └──────────────────────────────────────────────────────────────────┘

AI INTEGRATION:
  Assets tagged for AI context are injected into generation prompts.
  "Knowledge Base" section in generation settings: select which assets to include.
  Improves generation quality with organization-specific context.
```

---

## 13. Activity Center

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: ACTIVITY                                                                │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  FILTERS: [All Activity ▾]  [All Members ▾]  [All Projects ▾]  [Date ▾] │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ACTIVITY TIMELINE                                                        │ │
│  │                                                                           │ │
│  │  TODAY                                                                    │ │
│  │  ─────────────────────────────────────────────────────────────────────── │ │
│  │  ● 2:45 PM   Jane generated PRD for Mobile App Redesign                  │ │
│  │              GPT-4o · 8,200 tokens · $0.21            [View Document]    │ │
│  │  ● 1:30 PM   Bob joined the workspace                                    │ │
│  │              Invited by Jane · Role: Editor                              │ │
│  │  ● 10:15 AM  Carol edited Architecture document                          │ │
│  │              v3 → v4 · 147 lines changed              [View Diff]        │ │
│  │                                                                           │ │
│  │  YESTERDAY                                                                │ │
│  │  ─────────────────────────────────────────────────────────────────────── │ │
│  │  ● 4:00 PM   Jane exported Mobile App specification suite               │ │
│  │              PDF · 9 documents · 1.2 MB                [Download]        │ │
│  │  ● 2:30 PM   Bob created project "API Gateway v2"                       │ │
│  │              Draft · 0 documents                       [View Project]    │ │
│  │                                                                           │
│  │  JULY 18                                                                  │ │
│  │  ─────────────────────────────────────────────────────────────────────── │ │
│  │  ● 11:00 AM   Jane changed Bob's role to Admin                           │ │
│  │              Editor → Admin                                              │ │
│  │  ● 9:00 AM    Carol was invited by Jane                                  │ │
│  │              Role: Editor · Pending                                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  LOAD MORE ACTIVITY...                                                    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Activity Types

```
AI ACTIVITY:
  - Document generated (PRD, SRS, Architecture, etc.)
  - Document regenerated
  - Pipeline completed (all 9 steps)
  - Generation failed
  - Conversation started

USER ACTIVITY:
  - Member joined workspace
  - Member left workspace
  - Member role changed
  - Invitation sent / accepted / expired / revoked

PROJECT ACTIVITY:
  - Project created / archived / restored / deleted
  - Project renamed / moved
  - Document edited (version created)
  - Document exported
  - Comment added (future)

ADMIN ACTIVITY (audit log):
  - Settings changed (AI config, integrations, billing)
  - API key added / rotated / removed
  - Workspace renamed / settings changed
  - Transfer ownership
```

### Audit Log (Admin only)

```
ACCESS:       Activity tab → "Audit Log" toggle (visible only to Admin/Owner)
PURPOSE:      Full, un-filterable event history for security and compliance
COLUMNS:      Timestamp | User | Action | Resource | IP Address | Details
EXPORT:       Export as CSV or JSON
RETENTION:    1 year (configurable in enterprise plan)
EVENTS:       All activity events + security events (failed logins, permission changes,
              settings changes, API key operations, data exports)
```

---

## 14. Integrations

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: INTEGRATIONS                                                            │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  CONNECTED INTEGRATIONS                                                   │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  🐙 GitHub                    ● Connected    [Configure] [Disconnect]│  │ │
│  │  │     Repository: acme/backend-api                                    │  │ │
│  │  │     Sync: Push specs to repo on export                              │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  💬 Slack                     ● Connected    [Configure] [Disconnect]│  │ │
│  │  │     Channel: #engineering-specs                                     │  │ │
│  │  │     Notifications: Generation complete, Comments                   │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  AVAILABLE INTEGRATIONS                                                   │ │
│  │                                                                           │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │ │
│  │  │ 🐙 GitHub    │ │ 📋 Jira      │ │ 📐 Linear    │ │ 💬 Slack     │    │ │
│  │  │ [Connect]    │ │ [Connect]    │ │ [Connect]    │ │ Connected    │    │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │ │
│  │  │ 📊 Notion    │ │ 🎨 Figma     │ │ 🔗 Zapier    │ │ 🌐 Webhooks  │    │ │
│  │  │ [Connect]    │ │ [Connect]    │ │ [Connect]    │ │ [Configure]  │    │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Webhook Management

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  WEBHOOKS                                                                    │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  [+ Create Webhook]                                                       │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  CI/CD Pipeline                         ● Active                   │  │ │
│  │  │  URL: https://ci.acme.com/hooks/promptpilot                        │  │ │
│  │  │  Events: document.generated, export.completed                      │  │ │
│  │  │  Last delivery: ✓ 2h ago (200 OK, 234ms)                          │  │ │
│  │  │                                     [Edit] [Disable] [Delete]      │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Slack Notifier                         ⚠ Failing (3 attempts)     │  │ │
│  │  │  URL: https://hooks.slack.com/...                                  │  │ │
│  │  │  Events: document.generated                                        │  │ │
│  │  │  Last delivery: ✕ 1h ago (500 Internal Server Error)               │  │ │
│  │  │                                     [Edit] [Retry] [Delete]        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  WEBHOOK EVENTS:                                                              │
│  ☑ document.generated        ☑ project.created                               │
│  ☑ document.updated          ☑ project.archived                              │
│  ☑ export.completed          ☑ member.joined                                 │
│  ☑ generation.completed      ☑ member.removed                                │
│  ☑ generation.failed                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### API Key Management (Workspace-Level)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  API KEYS (for programmatic access to workspace)                              │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  [+ Create API Key]                                                       │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Production API Key                                               │  │ │
│  │  │  Key: pp_ws_a1b2c3...x9y0           Created: Jul 15, 2026        │  │ │
│  │  │  Last used: 2 hours ago              Expires: Never               │  │ │
│  │  │  Scopes: read:documents, read:projects                            │  │ │
│  │  │                              [Regenerate] [Edit Scopes] [Revoke]  │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  ⚠️ Your API key is only shown once when created. Store it securely.     │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Workspace Settings

### Layout (Tab: Settings)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: SETTINGS                                                                │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  SETTINGS NAVIGATION (left sidebar within tab)                            │ │
│  │  ┌──────────────┐ ┌────────────────────────────────────────────────────┐ │ │
│  │  │ General      │ │  GENERAL SETTINGS                                   │ │
│  │  │ Branding     │ │                                                     │ │
│  │  │ AI Defaults  │ │  Workspace Name                                     │ │
│  │  │ Notifications│ │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Security     │ │  │ Acme Corporation                               │ │ │
│  │  │ Data & Priv  │ │  └────────────────────────────────────────────────┘ │ │
│  │  │ Danger Zone  │ │                                                     │ │
│  │  └──────────────┘ │  Workspace Slug                                     │ │
│  │                   │  ┌────────────────────────────────────────────────┐ │ │
│  │                   │  │ acme-corp                          ✓ Available  │ │ │
│  │                   │  └────────────────────────────────────────────────┘ │ │
│  │                   │                                                     │ │
│  │                   │  Description                                        │ │
│  │                   │  ┌────────────────────────────────────────────────┐ │ │
│  │                   │  │ Engineering specifications for Acme products   │ │ │
│  │                   │  └────────────────────────────────────────────────┘ │ │
│  │                   │                                                     │ │
│  │                   │  Workspace Icon                                     │ │
│  │                   │  ┌────┐                                            │ │
│  │                   │  │ 🏢 │  [Upload Icon]  [Remove]                   │ │
│  │                   │  └────┘                                            │ │
│  │                   │                                                     │ │
│  │                   │  ┌──────────────────┐                               │ │
│  │                   │  │ Save Changes      │                               │ │
│  │                   │  └──────────────────┘                               │ │
│  └──────────────────┘ └────────────────────────────────────────────────────┘ │
│                                                                               │
│  BRANDING (Pro/Team plan):                                                    │
│  ┌────────────────────────────────┐                                          │
│  │  Workspace Logo                │                                          │
│  │  (replaces PromptPilot logo in │                                          │
│  │   exports and shared pages)    │                                          │
│  │                                │                                          │
│  │  Primary Color                 │                                          │
│  │  (used in exports)             │                                          │
│  └────────────────────────────────┘                                          │
│                                                                               │
│  DANGER ZONE:                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ⚠️ DANGER ZONE                                                          │ │
│  │                                                                           │ │
│  │  Transfer Ownership                                                       │ │
│  │  Transfer this workspace to another Admin.                                │ │
│  │  You will become an Admin after transfer.                                 │ │
│  │                                              [Transfer Ownership]         │ │
│  │                                                                           │ │
│  │  Archive Workspace                                                        │ │
│  │  Hide this workspace from all members. Projects become inaccessible.      │ │
│  │  You can restore within 30 days.                                          │ │
│  │                                              [Archive Workspace]          │ │
│  │                                                                           │ │
│  │  Delete Workspace                                                         │ │
│  │  Permanently delete this workspace and ALL its data.                      │ │
│  │  This action is irreversible after 30 days.                               │ │
│  │                                              [Delete Workspace]           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Settings Sections

```
GENERAL:
  - Workspace Name (required, 3-100 chars)
  - Workspace Slug (auto-generated, editable, unique)
  - Description (optional, up to 500 chars)
  - Workspace Icon/Avatar (upload or emoji)

BRANDING (Pro/Team):
  - Custom Logo (replaces PromptPilot logo in exports)
  - Primary Brand Color (used in exports, shared pages)
  - Preview of branded export

AI DEFAULTS:
  - Default Model (per step or global)
  - Default Temperature (0.0 - 2.0)
  - Default Max Tokens
  - Auto-Fallback: toggle (try next provider on failure)
  - Default Prompt Template (for new projects)

NOTIFICATIONS:
  - Email Notifications:
    ☑ Generation complete    ☑ Generation failed
    ☑ Member joined          ☑ Member left
    ☑ Export complete        ☑ Comment added (future)
  - Slack Notifications (if Slack integration connected):
    Same toggles + channel selector
  - Digest: Daily/Weekly summary email toggle

SECURITY:
  - Session Timeout: [Never ▾ | 1 hour | 8 hours | 24 hours]
  - Require MFA: toggle (forces all members to enable MFA)
  - IP Restriction: allowlist IP ranges (Enterprise)
  - API Key Expiry: [Never ▾ | 30 days | 90 days | 365 days]

DATA & PRIVACY:
  - Data Retention: auto-archive projects after [Never ▾ | 90 days | 1 year]
  - Export Workspace Data: "Download all workspace data (JSON)"
  - Delete Workspace Data: "Request permanent deletion"
```

---

## 16. Billing & Usage

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TAB: BILLING & USAGE (visible to Owner and Admin)                            │
│                                                                               │
│  ┌──────────────────────────────────────┐ ┌────────────────────────────────┐ │
│  │  CURRENT PLAN                        │ │  USAGE THIS MONTH               │ │
│  │                                      │ │                                 │ │
│  │  Pro Plan                            │ │  Seats                          │ │
│  │  $29/month                           │ │  ████████████████░░░░  3/5     │ │
│  │  Next billing: Aug 15, 2026          │ │                                 │ │
│  │                                      │ │  AI Tokens                      │ │
│  │  ┌──────────────────────────────┐   │ │  ████████████████████  125K/500K│ │
│  │  │ ⚡ Upgrade to Team            │   │ │                                 │ │
│  │  │ $99/mo · Unlimited projects  │   │ │  Storage                        │ │
│  │  │ · 10 members · Priority AI   │   │ │  ████░░░░░░░░░░░░░░░░  45MB/1GB │ │
│  │  └──────────────────────────────┘   │ │                                 │ │
│  └──────────────────────────────────────┘ │  AI Cost                        │ │
│                                           │  ██████░░░░░░░░░░░░░░  $12.50  │ │
│                                           │  (of $50.00 monthly limit)      │ │
│                                           └────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  PAYMENT METHOD                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 💳 Visa ending in 4242                          [Update] [Remove]   │  │ │
│  │  │    Expires 12/2027                                                  │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  [+ Add Payment Method]                                                  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  INVOICE HISTORY                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Jul 15, 2026    Pro Plan — Monthly      $29.00    [Download PDF]  │  │ │
│  │  │  Jun 15, 2026    Pro Plan — Monthly      $29.00    [Download PDF]  │  │ │
│  │  │  May 15, 2026    Pro Plan — Monthly      $29.00    [Download PDF]  │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  USAGE ALERT CONFIGURATION                                                │ │
│  │                                                                           │ │
│  │  Alert when token usage reaches:  [80% ▾]                                 │ │
│  │  Alert when cost reaches:         [$40.00 ▾]                               │ │
│  │  Alert when seat limit reached:   toggle on/off                            │ │
│  │                                                                           │ │
│  │  Notification method:  ☑ Email  ☑ In-app  ☐ Slack                       │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Upgrade Flow

```
TRIGGER: "Upgrade" button or approaching limit warning
FLOW:
  1. Click "Upgrade to {Plan}"
  2. Plan comparison dialog:
     ┌──────────────────────────────────────────────────────┐
     │  Upgrade Workspace                                   │
     │                                                      │
     │  Current: Pro ($29/mo) → Upgrade to:                 │
     │                                                      │
     │  ┌─────────────────────┐ ┌─────────────────────────┐ │
     │  │ Team                │ │ Enterprise               │ │
     │  │ $99/month           │ │ Custom                   │ │
     │  │ 10 members          │ │ Unlimited members        │ │
     │  │ Unlimited projects  │ │ SSO + SAML               │ │
     │  │ Priority AI         │ │ Audit logs               │ │
     │  │ [Upgrade to Team]   │ │ [Contact Sales]          │ │
     │  └─────────────────────┘ └─────────────────────────┘ │
     └──────────────────────────────────────────────────────┘
  3. Confirm payment method
  4. Prorated charge shown (if mid-cycle)
  5. Confirmation page. "You're now on the Team plan!"
  6. Features unlock immediately
```

---

## 17. Functional Requirements (Consolidated)

```
CREATE:
  Workspace:       Dialog → POST /workspaces → navigate
  Project:         Dialog → POST /projects → navigate
  Prompt:          Dialog → POST /workspaces/:id/prompts
  Template:        Dialog → POST /workspaces/:id/templates
  Invitation:      Dialog → POST /workspaces/:id/invitations
  API Key:         Dialog → POST /workspaces/:id/api-keys
  Webhook:         Dialog → POST /workspaces/:id/webhooks
  Integration:     OAuth flow → POST /workspaces/:id/integrations

EDIT:
  All resources:   Inline or dialog → PATCH endpoint → optimistic update

DELETE / ARCHIVE:
  All resources:   ••• menu → Confirmation dialog → DELETE/PATCH endpoint
  Hard delete:     Only available for already-archived items
  Bulk:            Checkbox selection → action bar → confirmation → batch API

SEARCH:
  Global:          ⌘K → searches across workspace, projects, members, prompts
  Local:           Search bar within each tab with 200ms debounce

FILTER / SORT:
  Projects:        Status, tags, created date, modified date
  Members:         Role, join date
  Activity:        Type, user, project, date range
  Prompts:         Collection, tags, visibility, usage count

DRAG & DROP:
  Provider priority in AI Config (reorder)
  Future: Reorder projects within workspace

IMPORT / EXPORT:
  Import prompts:  JSON/CSV file upload
  Export prompts:  JSON download
  Export activity: CSV download
  Export workspace data: Full JSON export (Data & Privacy settings)
```

---

## 18. Search Experience

```
WORKSPACE SEARCH (via ⌘K when workspace context is active):

SCOPES:
  - Projects within this workspace (name, description)
  - Members (name, email, role)
  - Prompts (title, content, tags)
  - Templates (name, category)
  - Documents (title, type, content — across all projects)
  - Settings pages (navigate directly)

RANKING:
  1. Exact name matches
  2. Recent/frequent items
  3. Prefix matches
  4. Content matches

FILTER KEYWORDS (type to filter):
  "project: Mobile"     → Only projects
  "member: bob"         → Only members
  "prompt: PRD"         → Only prompts
  "template: arch"      → Only templates
  "doc: architecture"   → Only documents

SAVED SEARCHES (future):
  Save search queries with names
  "My active projects": status=active owner=me
  Appear in sidebar under workspace section

TAB-SPECIFIC SEARCH:
  Each tab has its own search bar for filtering the list
  Projects tab: search filters project list
  Members tab: search filters member list
  Prompt Library: full-text search across prompts
```

---

## 19. AI Features

```
WORKSPACE MEMORY (Phase 5+):
  AI remembers workspace context across projects and conversations
  "Based on your workspace's coding standards document..."
  Shared context from Knowledge Base injected into generation prompts

SHARED AI CONTEXT:
  Configure default context documents in AI Settings
  "Always include brand guidelines when generating PRDs"
  "Include workspace API standards in all API spec generations"

PROMPT RECOMMENDATIONS:
  AI suggests prompts based on project type and activity
  "3 PRD templates match your project domain (FinTech)"
  "Your team frequently uses this prompt pattern. Save as template?"

TEMPLATE RECOMMENDATIONS:
  "Based on your Architecture doc, try the Microservices template"
  "Teams in your industry use this API Spec template"

KNOWLEDGE RETRIEVAL (RAG — Phase 6):
  Upload documents to Knowledge Base
  AI retrieves relevant sections during generation
  "Referencing your Security Policy v2.1..."

WORKSPACE INSIGHTS:
  "Your team generates the most documents on Tuesdays"
  "Architecture generation takes 2.3 attempts on average"
  "Consider upgrading — your token usage has grown 40% month-over-month"

USAGE OPTIMIZATION:
  "Switch from GPT-4o to Claude 3.5 for Architecture docs — same quality, 30% cheaper"
  "You're approaching your monthly token limit. Review usage or upgrade."
```

---

## 20. State Management

```
LOADING:
  Tab switch:       Skeleton cards/rows (200ms delay before showing skeleton)
  List fetch:       TableSkeleton with shimmer (existing component)
  Detail fetch:     CardSkeleton with shimmer
  Search:           Debounced 200ms. Previous results remain visible during fetch.

EMPTY:
  Projects tab:     "No projects yet. Create one!" [+ Create Project]
  Members tab:      "No team members yet. Invite collaborators!" [+ Invite Member]
  Prompts tab:      "No prompts yet. Create or browse templates."
  Templates tab:    "No custom templates. Create from an existing project."
  Activity tab:     "No activity yet. Start by creating a project."
  Integrations:     "No integrations connected. Browse available integrations."
  Archived filter:  "No archived items. Items you archive will appear here."

ERROR:
  Fetch error:      "Couldn't load {resource}. [Retry]" within tab content
  Action error:     Toast with error message + retry action
  Permission:       Redirect or disabled UI with tooltip

OFFLINE:
  Cached data shown (SWR).
  Banner: "You're offline. Changes will sync when reconnected."
  Create/edit actions queued (future).

CONFLICT RESOLUTION:
  Concurrent edits: Last-write-wins for most settings.
  Member changes:   Optimistic. If member was already removed, toast + refresh.
  Slug conflicts:   Real-time validation. "This slug is taken." shown inline.

AUTOSAVE:
  Settings forms:   Auto-save on field blur (debounced 2s)
  Prompt editor:    Auto-save on pause (debounced 3s)
  Indicator:        "✓ Saved" with timestamp in status bar
```

---

## 21. API Design (Condensed Reference)

```
WORKSPACES:
  GET    /api/v1/workspaces                          List workspaces (owner/member)
  GET    /api/v1/workspaces/:id                      Get workspace details
  POST   /api/v1/workspaces                          Create workspace
  PATCH  /api/v1/workspaces/:id                      Update workspace
  DELETE /api/v1/workspaces/:id                      Archive workspace (soft delete)
  POST   /api/v1/workspaces/:id/restore              Restore archived workspace

MEMBERS:
  GET    /api/v1/workspaces/:id/members              List members
  PATCH  /api/v1/workspaces/:id/members/:userId      Change role
  DELETE /api/v1/workspaces/:id/members/:userId      Remove member
  POST   /api/v1/workspaces/:id/invitations          Invite member
  GET    /api/v1/workspaces/:id/invitations          List pending invitations
  POST   /api/v1/workspaces/:id/invitations/:id/resend   Resend invitation
  DELETE /api/v1/workspaces/:id/invitations/:id      Revoke invitation
  POST   /api/v1/workspaces/:id/transfer-ownership   Transfer ownership

PROJECTS (within workspace context):
  GET    /api/v1/projects?workspaceId=:id            List workspace projects (paginated, filterable)
  POST   /api/v1/projects                            Create project
  PATCH  /api/v1/projects/:id                        Update project
  DELETE /api/v1/projects/:id                        Archive project
  POST   /api/v1/projects/:id/restore                Restore project
  POST   /api/v1/projects/:id/duplicate              Duplicate project
  POST   /api/v1/projects/:id/move                   Move to another workspace

AI CONFIG:
  GET    /api/v1/workspaces/:id/ai-providers         List configured providers
  POST   /api/v1/workspaces/:id/ai-providers         Add/configure provider
  PATCH  /api/v1/workspaces/:id/ai-providers/:prov   Update provider config
  DELETE /api/v1/workspaces/:id/ai-providers/:prov   Remove provider
  POST   /api/v1/workspaces/:id/ai-providers/:prov/test  Test connection
  GET    /api/v1/workspaces/:id/ai-defaults          Get default AI settings
  PATCH  /api/v1/workspaces/:id/ai-defaults          Update defaults

PROMPTS:
  GET    /api/v1/workspaces/:id/prompts              List prompts (paginated, filterable)
  POST   /api/v1/workspaces/:id/prompts              Create prompt
  GET    /api/v1/workspaces/:id/prompts/:id          Get prompt detail
  PATCH  /api/v1/workspaces/:id/prompts/:id          Update prompt (creates version)
  DELETE /api/v1/workspaces/:id/prompts/:id          Delete prompt

TEMPLATES:
  GET    /api/v1/workspaces/:id/templates            List templates
  POST   /api/v1/workspaces/:id/templates            Create template
  GET    /api/v1/workspaces/:id/templates/:id        Get template
  PATCH  /api/v1/workspaces/:id/templates/:id        Update template
  DELETE /api/v1/workspaces/:id/templates/:id        Delete template

ACTIVITY:
  GET    /api/v1/workspaces/:id/activity             Activity feed (paginated, filterable)
  GET    /api/v1/workspaces/:id/audit-logs           Audit logs (admin only)

INTEGRATIONS:
  GET    /api/v1/workspaces/:id/integrations         List integrations
  POST   /api/v1/workspaces/:id/integrations/:name   Connect integration
  DELETE /api/v1/workspaces/:id/integrations/:name   Disconnect integration
  GET    /api/v1/workspaces/:id/webhooks             List webhooks
  POST   /api/v1/workspaces/:id/webhooks             Create webhook
  DELETE /api/v1/workspaces/:id/webhooks/:id         Delete webhook

BILLING:
  GET    /api/v1/workspaces/:id/billing              Billing overview
  GET    /api/v1/workspaces/:id/billing/invoices     Invoice history
  POST   /api/v1/workspaces/:id/billing/upgrade      Upgrade plan
  PATCH  /api/v1/workspaces/:id/billing/payment      Update payment method

CACHING:
  Workspace list:       SWR, stale 30s
  Workspace details:    SWR, stale 60s
  Project list:         SWR, stale 30s
  Member list:          SWR, stale 60s
  Activity:             SWR, stale 30s, poll active

OPTIMISTIC UPDATES:
  Archive/restore:      ✅
  Rename:               ✅
  Role change:          ✅
  Member remove:        ✅
  Favorite toggle:      ✅
  Settings save:        ✅ (with autosave)

RETRY:
  SWR default: 3 retries with exponential backoff (1s, 2s, 4s)
  Mutations: Single retry on failure
  Offline: Queue mutation in IndexedDB (future)
```

---

## 22. Database Mapping

```
Workspace:
  id, name, slug, ownerId (FK → User), type (PERSONAL/TEAM),
  status (ACTIVE/ARCHIVED), settings (JSON), deletedAt
  Relations: owner, members[], projects[], apiKeys[], invitations[]

WorkspaceMember:
  id, workspaceId (FK → Workspace), userId (FK → User),
  role (OWNER/ADMIN/EDITOR/VIEWER), joinedAt
  Unique: [workspaceId, userId]

Project:
  id, name, slug, description, workspaceId (FK → Workspace),
  ownerId (FK → User), status (DRAFT/ACTIVE/COMPLETED/ARCHIVED),
  settings (JSON), tags[], deletedAt
  Relations: workspace, owner, documents[], aiConversations[], exports[]

Invitation:
  id, workspaceId (FK → Workspace), invitedBy (FK → User),
  email, role (ADMIN/EDITOR/VIEWER), token (unique),
  status (PENDING/ACCEPTED/EXPIRED/REVOKED), expiresAt, createdAt

AIConfiguration (future):
  id, workspaceId, provider, apiKeyEncrypted, defaultModel,
  models[], settings (JSON), status, lastTestedAt

Prompt:
  id, workspaceId, createdBy (FK → User), title, systemPrompt,
  userPromptTemplate, variables[], collection, tags[], visibility,
  usageCount, version, deletedAt

Template:
  id, workspaceId, createdBy, name, description, category, structure (JSON),
  visibility, usageCount, deletedAt

Webhook:
  id, workspaceId, url, events[], secretEncrypted, active, lastDeliveryAt,
  lastDeliveryStatus, failureCount

Integration:
  id, workspaceId, provider, config (JSON — encrypted tokens),
  status, connectedAt

AuditEntry:
  id, workspaceId, userId, action, resourceType, resourceId,
  metadata (JSON), ipAddress, userAgent, createdAt

Indexes:
  workspaces:             (ownerId, slug) unique, status
  workspace_members:      (workspaceId, userId) unique     (✅ existing)
  projects:               (workspaceId, slug) unique        (✅ existing)
  invitations:            token unique, (workspaceId, status)
  prompts:                (workspaceId, deletedAt), tags[]
  audit_entries:          (workspaceId, createdAt), (userId, createdAt)

Pagination:
  All list endpoints: cursor-based or offset-based
  Default: 20 items per page, max 100
  Response meta: { total, page, limit, totalPages }
```

---

## 23. Security

```
WORKSPACE ISOLATION:
  Every query scoped to workspaceId
  Middleware: authorizeWorkspace(workspaceId) on all workspace routes
  Cross-workspace access: explicitly blocked unless user is member of both

MULTI-TENANCY:
  Row-level security via Prisma:
    where: { workspaceId, ...otherConditions }
  No tenant can access another tenant's data
  API keys scoped to workspace

ENCRYPTION:
  API keys:        AES-256-GCM encrypted at rest
  Webhook secrets: AES-256-GCM encrypted at rest
  OAuth tokens:    AES-256-GCM encrypted at rest (for integrations)
  TOTP secrets:    AES-256-GCM encrypted at rest

AUDIT LOGS:
  All sensitive actions logged: member changes, role changes,
    settings changes, API key operations, data exports, ownership transfers
  Immutable — cannot be deleted or modified
  1-year retention (configurable in enterprise)

SESSION VALIDATION:
  Workspace access requires valid JWT
  Role verified on every request
  Workspace membership verified on every request

PERMISSION INHERITANCE:
  Workspace role → applies to all projects
  Future: Project-level role overrides workspace role
  Future: Organization role overrides workspace role

API AUTHORIZATION:
  JWT verify → extract userId + role
  → check workspace membership + role
  → check resource ownership/permissions
  → allow or 403

DATA RETENTION:
  Active data:        Indefinite (until archived)
  Archived data:      30 days soft delete, then permanent deletion
  Audit logs:         1 year (configurable)
  Deleted accounts:   30 days recovery window, then permanent

BACKUPS:
  Daily automated backups (PostgreSQL)
  30-day retention for backups
  Point-in-time recovery (PITR) for enterprise
```

---

## 24. Accessibility

```
WCAG 2.2 AA:
  Color contrast:     All text ≥ 4.5:1. UI components ≥ 3:1.
  Keyboard:           All workspace functions accessible via Tab/Enter/Space/Arrows.
  Focus indication:   outline-2 outline-primary-500 outline-offset-2 on all interactive.
  Semantic:           <nav>, <main>, <table>, proper heading hierarchy.

KEYBOARD:
  Tab navigation:     Natural DOM order through all controls
  Enter/Space:        Activate buttons, toggles, open dialogs
  Arrow keys:         Navigate between tabs, within dropdowns
  Escape:             Close dialogs, dropdowns, modals
  ⌘K:                 Focus search / command palette

SCREEN READERS:
  Page titles:        Dynamic: "Acme Corp — Projects — PromptPilot"
  Live regions:       "Invitation sent to dave@acme.com"
  Status updates:     "3 members. Bob's role changed to Admin."
  Tables:             Proper <th scope> for data tables
  Forms:              <label> associations for all inputs

REDUCED MOTION:
  @media (prefers-reduced-motion: reduce):
    - No row add/remove animations
    - No drag handle animations
    - No card hover lifts
    - No progress bar transitions (instant width)
    - Static avatars (no scale on hover)
```

---

## 25. Responsive Design

```
DESKTOP (≥1280px):
  Sidebar:         240px, all workspace sub-items visible
  Tabs:            Horizontal, full text
  Content:         max-w-1200px
  Members:         Table layout (avatar + name + role + actions)
  Projects:        Table or grid layout

LAPTOP (1024–1279px):
  Sidebar:         240px (fits at this width)
  Content:         Full width of content area
  Tabs:            Horizontal

TABLET (768–1023px):
  Sidebar:         64px collapsed (icons only). Tooltip for workspace sub-items.
  Tabs:            Horizontal with scroll overflow
  Content:         Full width
  Members:         Card layout (stacked, not table)
  Projects:        Card layout
  Settings:        Single column

MOBILE (<768px):
  Sidebar:         Hidden. Hamburger overlay toggle.
  Tabs:            Dropdown selector or horizontal scroll
  Content:         p-4, full width
  Members:         Stacked cards
  Projects:        Stacked cards
  All dialogs:     Full-screen or bottom sheet
  Settings:        Single column, sections stacked
  Bottom Nav:      Home · Workspaces · AI · Profile

FOLDABLES:
  Dual-screen:     Map mode (content on one, context on other)
  Single-screen:   Same as mobile
```

---

## 26. Animations

```
WORKSPACE SWITCHING:
  Content fade out (150ms) → skeleton (100ms) → new content fade in (250ms)
  Sidebar workspace section collapses and re-expands with slide animation

DRAG & DROP (AI provider priority):
  Drag handle: cursor grab
  Dragging: item lifts (scale 1.02, shadow-lg, opacity 0.9)
  Drop zone: highlight between items
  Release: item slides to position (300ms spring)

TAB SWITCHING:
  Active indicator slides horizontally (200ms ease)
  Content crossfade (200ms)

CARD HOVER:
  translateY(-2px) + shadow transition (150ms ease)

INVITE FLOW:
  Dialog: scale 0.95 → 1 + fade in (200ms spring)
  Success: checkmark draw animation (400ms ease-out)
  Row appear: slide down + fade in (250ms)

MEMBER ROW:
  Add: slide down + fade in (250ms)
  Remove: slide left + fade out + collapse (200ms ease-in)
  Role change: badge alpha transition (200ms)

SETTINGS SAVE:
  Save button: "Save Changes" → spinner (200ms) → "✓ Saved" (2s) → "Save Changes"
  Autosave indicator: "● Unsaved" → "Saving..." → "✓ Saved 2s ago" (fades after 3s)

TOAST:
  Slide in from right + fade (300ms spring)
  Dismiss: slide right + fade (200ms ease-in)
```

---

## 27. Performance

```
CACHING:
  SWR for all lists:      stale-while-revalidate pattern
  Workspace details:      cached 60s
  Member list:            cached 60s
  Project list:           cached 30s
  Activity:               cached 30s (poll active generations every 3s)
  Settings:               cached 5min (rarely changes)

LAZY LOADING:
  Tab content:            Only fetched when tab is active (on-demand)
  Activity feed:          "Load more" pagination (20 per page)
  Members list:           Paginated (if 50+ members)
  Integrations:           Lazy-loaded icons and configuration UIs

VIRTUALIZATION:
  Project list:           Needed for 100+ projects (react-virtuoso)
  Activity feed:          Needed for 1000+ events
  Member list:            Not needed (<100 members typical)

CODE SPLITTING:
  Each tab:               Dynamic import (lazy)
  Settings sub-sections:  Dynamic import
  Dialogs:                Dynamic import per dialog type
  Integrations:           Dynamic import per provider

REAL-TIME UPDATES:
  Activity feed:          Poll every 30s (or SSE for active generations)
  Member presence:        Future (WebSocket)
  Notification count:     Poll every 30s

OPTIMISTIC RENDERING:
  Member remove:          Row fades immediately. Reappears on API failure.
  Role change:            Badge updates immediately.
  Project archive:        Row fades immediately.
  Settings save:          UI updates, autosave indicator confirmed by API.
```

---

## 28. Future Scalability

```
ORGANIZATIONS (Phase 5):
  Org owns multiple workspaces
  Org-level members + billing
  Workspace inherits org policies

DEPARTMENTS (Phase 6):
  Sub-groups within organization
  Department-level templates and prompts
  Cross-department sharing controls

NESTED WORKSPACES:
  Parent/child workspace relationship
  Inherit settings from parent
  Override at child level

MARKETPLACE (Phase 5):
  Install templates, prompts, integrations from marketplace
  Workspace-scoped installs
  Billing integration

PLUGINS (Phase 5):
  Workspace-level plugin installation
  Plugin configuration per workspace
  Permissions: which members can install/manage plugins

AI AGENTS (Phase 6):
  Deploy agents to workspaces
  Agent permissions: which resources can agent access
  Agent activity in workspace activity feed

ENTERPRISE GOVERNANCE:
  Policy enforcement at org level
  Workspace-level overrides where allowed
  Compliance reports per workspace

COMPLIANCE:
  SOC 2: Audit logs, access controls, encryption
  GDPR: Data export, deletion, processing records
  HIPAA: BAA, encryption, access controls (future)

SCIM (Phase 5):
  Automated member provisioning/deprovisioning
  Okta, Azure AD integration
  Group → Workspace role mapping

SSO (Phase 5):
  Workspace-level SAML/OIDC configuration
  Domain verification: auto-join workspace for matching emails
  Enforce SSO: prevent password login for workspace members
```

---

## 29. React Component Hierarchy

```
WorkspaceModule
│
├── WorkspaceShell (layout wrapper)
│   ├── WorkspaceSidebarSection (within main Sidebar)
│   │   ├── WorkspaceSwitcher
│   │   │   ├── WorkspaceSelector (dropdown trigger)
│   │   │   └── WorkspaceDropdown
│   │   │       ├── SearchInput
│   │   │       ├── WorkspaceItem[]
│   │   │       ├── CreateWorkspaceButton
│   │   │       └── ManageWorkspacesLink
│   │   └── WorkspaceNavItems (Overview, Projects, Members, etc.)
│   │
│   ├── WorkspaceHeader (sticky)
│   │   ├── WorkspaceInfo (icon, name, slug, type badge, status)
│   │   ├── FavoriteToggle (⭐)
│   │   ├── ContextMenu (•••)
│   │   └── WorkspaceTabs
│   │       └── TabItem[] (Overview, Projects, Members, Templates, AI, Activity, Integrations, Settings)
│   │
│   └── WorkspaceTabContent (renders active tab)
│       │
│       ├── WorkspaceOverview
│       │   ├── StatGrid (StatBox[])
│       │   ├── QuickActions
│       │   ├── RecentProjects (ProjectCard[])
│       │   ├── RecentActivity (ActivityTimeline)
│       │   ├── AIUsageOverview (UsageBars)
│       │   ├── PinnedProjects (ProjectCard[] compact)
│       │   └── TeamPreview (AvatarRow + ManageLink)
│       │
│       ├── ProjectList
│       │   ├── ProjectToolbar (search, filter, sort, create)
│       │   ├── ProjectTable / ProjectGrid
│       │   │   └── ProjectRow[]
│       │   │       ├── Checkbox (bulk select)
│       │   │       ├── ProjectIcon + Name + Description
│       │   │       ├── StatusBadge
│       │   │       ├── PipelineProgress (mini bar)
│       │   │       ├── Metadata (docs, members, timestamp)
│       │   │       └── Actions (Open, ContextMenu)
│       │   ├── BulkActionBar (conditional)
│       │   └── Pagination
│       │
│       ├── MemberList
│       │   ├── MemberToolbar (search, invite button)
│       │   ├── ActiveMembers
│       │   │   └── MemberRow[]
│       │   │       ├── Avatar + Name + Email
│       │   │       ├── YouBadge (conditional)
│       │   │       ├── RoleDropdown
│       │   │       └── RemoveButton
│       │   ├── PendingInvitations
│       │   │   └── InvitationRow[]
│       │   │       ├── Email + Role + SentDate
│       │   │       ├── ResendButton
│       │   │       └── RevokeButton
│       │   └── EmptyState
│       │
│       ├── PromptLibrary
│       │   ├── PromptSidebar (collections, filters, tags)
│       │   ├── PromptToolbar (search, sort, create)
│       │   ├── PromptGrid
│       │   │   └── PromptCard[]
│       │   │       ├── Icon + Title + Description
│       │   │       ├── TagChips[]
│       │   │       ├── FavoriteToggle
│       │   │       ├── UsageCount
│       │   │       └── Actions (Use, Edit, ContextMenu)
│       │   └── EmptyState
│       │
│       ├── TemplateLibrary
│       │   ├── CategoryTabs (horizontal scroll)
│       │   ├── TemplateGrid
│       │   │   └── TemplateCard[]
│       │   └── CustomTemplatesSection
│       │
│       ├── AIConfiguration
│       │   ├── ProviderList
│       │   │   └── ProviderCard[]
│       │   │       ├── ProviderIcon + Name
│       │   │       ├── StatusIndicator
│       │   │       ├── APIKeyDisplay (masked)
│       │   │       └── Actions (Configure, Test, Rotate, Remove)
│       │   ├── DefaultSettings (model, temperature, max tokens)
│       │   ├── ProviderPriority (drag-and-drop list)
│       │   └── UsageQuotas (limit inputs + progress bars)
│       │
│       ├── ActivityCenter
│       │   ├── ActivityFilters (type, user, project, date)
│       │   ├── ActivityTimeline
│       │   │   └── ActivityItem[]
│       │   │       ├── Icon (type-specific)
│       │   │       ├── Description + Metadata
│       │   │       └── ActionLink (View, Download, etc.)
│       │   ├── AuditLogToggle (admin only)
│       │   └── LoadMoreButton
│       │
│       ├── IntegrationsPanel
│       │   ├── ConnectedIntegrations
│       │   │   └── ConnectedCard[]
│       │   ├── AvailableIntegrations (grid)
│       │   ├── WebhookManager
│       │   │   └── WebhookRow[]
│       │   └── APIKeyManager
│       │       └── APIKeyRow[]
│       │
│       ├── SettingsPage
│       │   ├── SettingsSidebar (sections)
│       │   └── SettingsContent (per section)
│       │       ├── GeneralForm
│       │       ├── BrandingForm
│       │       ├── AIDefaultsForm
│       │       ├── NotificationsForm
│       │       ├── SecurityForm
│       │       ├── DataPrivacyForm
│       │       └── DangerZone
│       │           ├── TransferOwnershipButton
│       │           ├── ArchiveWorkspaceButton
│       │           └── DeleteWorkspaceButton
│       │
│       └── BillingPage
│           ├── CurrentPlanCard
│           ├── UsageWidgets (seats, tokens, storage, cost)
│           ├── PaymentMethodCard
│           ├── InvoiceHistory
│           └── UsageAlertsConfig
│
├── InviteDialog
├── CreateProjectDialog
├── TransferOwnershipDialog
├── ArchiveConfirmDialog
├── DeleteConfirmDialog
└── ProviderConfigDialog
```

---

## 30. UX Best Practices

### Why Each Workspace Feature Exists

```
WORKSPACE OVERVIEW:
  Need: "Where am I? What's happening here?"
  Solution: Landing tab shows context, stats, and recent activity.
  Users orient themselves before navigating deeper.

PROJECTS TAB:
  Need: "What are we working on? What's the status?"
  Solution: Central project registry with status, progress, and quick actions.
  The most-used workspace tab for creators.

MEMBERS TAB:
  Need: "Who has access? Who should I add?"
  Solution: Roster management. Invitations, role changes, removals.
  Essential for collaboration and security.

PROMPT LIBRARY:
  Need: "Don't make me rewrite this prompt every time."
  Solution: Reusable prompts with versioning, tagging, and collections.
  Converts one-off prompt usage into shared organizational knowledge.

TEMPLATES:
  Need: "How do I start? What's a good structure?"
  Solution: Pre-built and custom templates that bootstrap projects.
  Reduces time-to-first-document from hours to minutes.

AI CONFIGURATION:
  Need: "Which AI am I using? How much is it costing?"
  Solution: Centralized provider management, API keys, defaults, and quotas.
  Transparency + control over the biggest operational cost.

ACTIVITY CENTER:
  Need: "What happened while I was away?"
  Solution: Chronological feed of all workspace events, filterable by type/user/project.
  Replace "What's the status?" Slack messages with self-serve visibility.

INTEGRATIONS:
  Need: "How do I connect PromptPilot to our existing tools?"
  Solution: Connectors to GitHub, Slack, Jira, etc. Webhooks for custom workflows.
  Makes PromptPilot part of the existing toolchain, not an isolated silo.

SETTINGS:
  Need: "How do I configure this workspace for my team?"
  Solution: All configuration in one place, organized by concern.
  Clear separation between safe changes (General) and dangerous ones (Danger Zone).

BILLING:
  Need: "What am I paying for? Should I upgrade?"
  Solution: Transparent usage + plan management. Proactive upgrade prompts.
  Reduces billing surprises and support tickets.
```

### Collaboration Efficiency

```
PATTERN 1: Shared Context
  All members see the same workspace overview, projects, and activity.
  No "did you see my update?" — the activity feed is the source of truth.

PATTERN 2: Progressive Permissions
  Viewers see everything but can't break anything.
  Editors create and edit freely within guardrails.
  Admins manage the workspace structure.
  Owners hold ultimate responsibility.
  No one has more power than they need — principle of least privilege.

PATTERN 3: Transparent AI Usage
  Everyone sees AI generation activity, token consumption, and costs.
  No hidden AI usage. Builds trust and accountability.

PATTERN 4: Asynchronous by Default
  Activity feed + notifications replace real-time meetings.
  Members catch up on their own schedule.
  Comments and reviews (future) enable async collaboration.
```

### Solo Creator to Enterprise Scaling

```
SOLO (1 person, Personal workspace):
  - Overview tab is the landing page
  - Projects tab: personal projects only
  - Members tab: hidden or shows "Personal workspace — just you"
  - AI Config: simple. One API key. One model.
  - No billing tab (free tier) or simplified
  - Sidebar: compact. No workspace switcher needed.

SMALL TEAM (2–10, Team workspace):
  - Members tab: active with invitations
  - Prompt Library: starts being useful (shared prompts)
  - Templates: custom templates emerge
  - Activity feed: team activity visible
  - Integrations: Slack + GitHub connected

ENTERPRISE (50+, Team/Enterprise workspace):
  - Multiple workspaces (workspace switcher essential)
  - Members tab: search + bulk operations needed
  - AI Config: multiple providers, quotas, cost tracking
  - Audit logs: mandatory for compliance
  - SSO + SCIM: automated provisioning
  - Settings: security policies, IP restrictions
  - Billing: enterprise contract, custom pricing

SCALING MECHANISM:
  Same component architecture. Features appear/disappear based on:
    - Plan tier (Free hides audit logs, branding, SSO)
    - Member count (bulk actions appear at 10+ members)
    - Workspace type (Personal hides Members tab complexity)
  No code fork. Conditional rendering based on context.
```

---

_Document Version: 1.0 — PromptPilot Enterprise Workspace Specification_
_Last Updated: 2026-07-21_
_Status: Foundation built (Prisma models, repositories, routes). Ready for frontend implementation._
