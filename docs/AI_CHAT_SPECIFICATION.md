# PromptPilot — AI Chat Workspace Specification

## Complete UX, UI, AI Architecture & Engineering Design

### Version 1.0 — Production-Ready Build Document

---

## Design System Reference

All components reference the PromptPilot Design System (`docs/DESIGN_SYSTEM.md`), Tailwind token config, and existing codebase.

### Existing Foundation (Already Built)

| Component                                                 | Status   | Location                                         |
| --------------------------------------------------------- | -------- | ------------------------------------------------ |
| AIConversation Prisma model                               | ✅ Built | `prisma/schema.prisma`                           |
| Message model (SYSTEM/USER/ASSISTANT, sequencing)         | ✅ Built | `prisma/schema.prisma`                           |
| Generation model (token/cost/duration audit)              | ✅ Built | `prisma/schema.prisma`                           |
| AIConversationRepository (CRUD)                           | ✅ Built | `packages/database/src/repositories/`            |
| MessageRepository (create, listByConversation)            | ✅ Built | `packages/database/src/repositories/`            |
| GenerationRepository (create, listByConversation)         | ✅ Built | `packages/database/src/repositories/`            |
| PromptEngine (template compilation, context injection)    | ✅ Built | `packages/ai/src/engine/promptEngine.ts`         |
| GenerationService (conversation orchestration)            | ✅ Built | `packages/ai/src/engine/generationService.ts`    |
| OpenAIAdapter (generate + generateStream, SSE parsing)    | ✅ Built | `packages/adapters/src/openai.ts`                |
| AnthropicAdapter (generate + generateStream, SSE parsing) | ✅ Built | `packages/adapters/src/anthropic.ts`             |
| Adapter factory (createAdapter from config)               | ✅ Built | `packages/adapters/src/factory.ts`               |
| Token counting + cost estimation                          | ✅ Built | `packages/shared/src/tokens.ts`                  |
| Pipeline API route (generate + stream + run)              | ✅ Built | `apps/api/src/routes/pipeline.ts`                |
| Conversation routes scaffold                              | ✅ Built | `apps/frontend/app/(app)/conversations/page.tsx` |

### Design Tokens

- **Typography:** Inter (headings + body), JetBrains Mono (code blocks, prompts)
- **Primary:** Indigo-600 (#4F46E5), **Neutral:** Slate 50–950
- **Spacing:** 4px base unit, **Radii:** md 8px, lg 12px, xl 16px
- **Motion:** 150ms fast, 250ms normal, 400ms slow, Framer Motion spring
- **Breakpoints:** sm:640, md:768, lg:1024, xl:1280, 2xl:1536

---

## 1. Information Architecture

### Complete Hierarchy

```
AI Chat Workspace
│
├── Conversation List (left sidebar, 280px)
│   ├── New Conversation Button (+)
│   ├── Search Conversations (⌘F within sidebar)
│   ├── Conversation Filters
│   │   ├── [All] [Project] [Freeform] [Templates]
│   │   └── Sort: Recent / Name / Model
│   ├── Conversation Groups (by date)
│   │   ├── Today
│   │   │   ├── 💬 Architecture Discussion
│   │   │   ├── 💬 PRD Brainstorming
│   │   │   └── 💬 API Design Questions
│   │   ├── Yesterday
│   │   ├── This Week
│   │   └── Older
│   ├── Conversation Tree View (toggle)
│   │   └── Visual tree of branched conversations
│   └── Context Menu per conversation (Rename, Star, Archive, Export, Delete)
│
├── Chat Area (center, flex-1)
│   ├── Chat Header
│   │   ├── Conversation Title (editable, inline)
│   │   ├── Model Switcher
│   │   │   └── [GPT-4o ▾] with provider icon + model name
│   │   ├── Context Scope Selector
│   │   │   └── [Full Project ▾] | Architecture Only | Custom Selection
│   │   ├── Context Window Meter
│   │   │   └── ████████░░░░ 8.2K/128K tokens
│   │   ├── Branch Navigator (when viewing branch)
│   │   │   └── ← Back to main conversation | Branch: "Alternative approach"
│   │   └── Conversation Actions (•••)
│   │       ├── Rename
│   │       ├── Star
│   │       ├── Export as Markdown/PDF/JSON
│   │       ├── Save as Template
│   │       ├── Save as Prompt (to library)
│   │       ├── Convert to PRD
│   │       ├── Convert to SRS
│   │       ├── Convert to User Stories
│   │       ├── Compare Model Responses
│   │       ├── Clear Conversation
│   │       └── Delete
│   │
│   ├── Message List (flex-1, overflow-y-auto)
│   │   ├── System Context Card (collapsible)
│   │   │   └── "Context: Mobile App Redesign project, Architecture + PRD loaded"
│   │   ├── Message Group (by role, consecutive messages merged)
│   │   │   ├── User Message Bubble
│   │   │   │   ├── Avatar (top-right or left, depending on layout)
│   │   │   │   ├── Message Content (Markdown rendered)
│   │   │   │   ├── Attachments (file chips, image thumbnails)
│   │   │   │   ├── Timestamp
│   │   │   │   ├── Edit Button (on hover)
│   │   │   │   └── Branch from here (••• on hover)
│   │   │   └── AI Message Card
│   │   │       ├── Model Badge (GPT-4o, Claude 3.5)
│   │   │       ├── Message Content (Markdown + code blocks + syntax highlighting)
│   │   │       ├── Thinking/Reasoning Block (collapsible — "🤔 Thought for 3.2s")
│   │   │       ├── Tool Calls Block (when tools are called)
│   │   │       │   └── ┌────────────────────────────────────────┐
│   │   │       │       │ 🔧 Read File: src/api/routes/auth.ts   │
│   │   │       │       │    Result: 95 lines read               │
│   │   │       │       └────────────────────────────────────────┘
│   │   │       ├── Timestamp + Token Count
│   │   │       ├── Action Bar (on hover or always visible)
│   │   │       │   ├── 📋 Copy
│   │   │       │   ├── 👍 / 👎 (feedback)
│   │   │       │   ├── 🔄 Regenerate
│   │   │       │   ├── 🌿 Branch from here
│   │   │       │   ├── 🔊 Read Aloud (future)
│   │   │       │   ├── 📝 Apply to Document
│   │   │       │   └── ••• More
│   │   │       └── Quick Follow-up Suggestions
│   │   │           └── ["Tell me more about..."] ["What are the trade-offs?"] ["Summarize this"]
│   │   └── Streaming Message (when AI is generating)
│   │       ├── Model Badge (with pulsing dot)
│   │       ├── Live Content (token-by-token)
│   │       ├── Blinking Cursor █
│   │       ├── Token Counter (live: 1.2K / estimated 4K)
│   │       ├── Timer (Elapsed: 4.2s)
│   │       └── Stop Button ⏹
│   │
│   └── Prompt Suggestions (when chat is empty or after AI response)
│       ├── Based on project context
│       ├── Based on recent documents
│       ├── Common follow-ups
│       └── Prompt Library quick-insert
│
├── Composer (sticky bottom)
│   ├── Attachment Bar (conditional — when files attached)
│   │   └── FileChip[] (name, type icon, size, ✕ remove)
│   ├── Context Selection Bar
│   │   └── 📄 Architecture (v2) ✕  |  📄 PRD (v3) ✕  |  + Add Context
│   ├── Prompt Input (textarea, auto-resize)
│   │   ├── Placeholder: "Ask anything about your project..."
│   │   ├── Markdown support (rendered in messages)
│   │   ├── @mention support (@docs, @files, @templates)
│   │   ├── /command support (/help, /clear, /export, /branch, /model)
│   │   ├── Shift+Enter for newline
│   │   └── Character counter (optional)
│   ├── Composer Footer
│   │   ├── Model Indicator: GPT-4o · 128K context
│   │   ├── Token Estimator: ~450 tokens
│   │   ├── Attachment Button 📎
│   │   ├── Voice Input Button 🎤 (future)
│   │   ├── Prompt Optimizer Button ✨
│   │   └── Send Button ➤ (or ⏹ Stop when streaming)
│   └── Keyboard Shortcuts Hint (⌘Enter to send, Shift+Enter for newline)
│
└── Right Panel (320px, collapsible)
    ├── Conversation Info
    │   ├── Model + Provider
    │   ├── Temperature
    │   ├── Max Tokens
    │   ├── Messages: 24
    │   ├── Total Tokens: 45K
    │   └── Total Cost: $1.23
    ├── Context Documents
    │   ├── 📄 Architecture (v2) — Active
    │   ├── 📄 PRD (v3) — Active
    │   └── + Add Document
    ├── Conversation Tree (visual graph)
    │   └── [Main] → [Branch 1] → [Sub-branch]
    │               ↘ [Branch 2]
    ├── Prompt Suggestions (contextual)
    └── Export Actions
```

---

## 2. UI Layout

### Full Layout — Desktop

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  AI CHAT WORKSPACE                                                             │
│                                                                               │
│  ┌──────────┐ ┌───────────────────────────────────────┐ ┌──────────────────┐ │
│  │ CONV     │ │  CHAT HEADER                           │ │  RIGHT PANEL     │ │
│  │ LIST     │ │  ┌───────────────────────────────────┐ │ │  (320px)         │ │
│  │ (280px)  │ │  │ 💬 Architecture Discussion        │ │ │                  │ │
│  │          │ │  │ [GPT-4o ▾] [Full Context ▾]  [•••]│ │ │  CONVERSATION     │ │
│  │ + New    │ │  │ ██████████░░░░ 8.2K/128K tokens  │ │ │  INFO             │ │
│  │ ──────── │ │  └───────────────────────────────────┘ │ │  ─────────────── │ │
│  │ 🔍 Search│ │                                         │ │  Model: GPT-4o   │ │
│  │          │ │  SYSTEM CONTEXT (collapsible)           │ │  Temp: 0.2       │ │
│  │ TODAY    │ │  ┌───────────────────────────────────┐ │ │  Max Tok: 16K    │ │
│  │ ──────── │ │  │ 📋 Context: Mobile App Redesign    │ │ │  Msgs: 24        │ │
│  │ 💬 Arch  │ │  │      Architecture v2 + PRD v3     │ │ │  Tokens: 45K     │ │
│  │ discuss  │ │  └───────────────────────────────────┘ │ │  Cost: $1.23     │ │
│  │ 2h ago   │ │                                         │ │                  │ │
│  │          │ │  ┌───────────────────────────────────┐ │ │  CONTEXT DOCS    │ │
│  │ 💬 PRD   │ │  │ 👤 You                    2:45 PM │ │ │  ─────────────── │ │
│  │ brains   │ │  │ ┌─────────────────────────────┐  │ │ │  📄 Arch (v2) ✕ │ │
│  │ ▶ 1d ago │ │  │ │ Should we use microservices │  │ │ │  📄 PRD (v3)  ✕ │ │
│  │          │ │  │ │ or a modular monolith for   │  │ │ │  + Add Document │ │
│  │ YESTERDAY│ │  │ │ the API layer?              │  │ │ │                  │ │
│  │ ──────── │ │  │ └─────────────────────────────┘  │ │ │  CONV TREE       │ │
│  │ 💬 API   │ │  └───────────────────────────────────┘ │ │  ─────────────── │ │
│  │ design   │ │                                         │ │  [Main]          │ │
│  │ 2d ago   │ │  ┌───────────────────────────────────┐ │ │   ├─ [Branch 1]  │ │
│  │          │ │  │ 🤖 GPT-4o                2:45 PM  │ │ │   │  └─ [Sub]    │ │
│  │ OLDER    │ │  │ ┌─────────────────────────────┐  │ │ │   └─ [Branch 2]  │ │
│  │ ──────── │ │  │ │ Given your project's        │  │ │ │                  │ │
│  │ 💬 Tech  │ │  │ │ requirements and team size,  │  │ │ │  SUGGESTIONS     │ │
│  │ stack    │ │  │ │ I recommend a modular        │  │ │ │  ─────────────── │ │
│  │ 1w ago   │ │  │ │ monolith approach initially  │  │ │ │  "Ask about..."  │ │
│  │          │ │  │ │ because:                     │  │ │ │  "Compare..."    │ │
│  │ ──────── │ │  │ │                              │  │ │                  │ │
│  │ ⭐ Starred│ │  │ │ 1. Your team size...       │  │ │ └──────────────────┘ │
│  │ 💬 Auth  │ │  │ │ 2. Early-stage product...   │  │ │                      │
│  │ flow    │ │  │ │ 3. Tight launch timeline...  │  │ │                      │
│  │          │ │  │ └─────────────────────────────┘  │ │                      │
│  │ ──────── │ │  │                                   │ │                      │
│  │ 🗑️ Trash │ │  │  Tokens: 850 · GPT-4o · 2.3s    │ │                      │
│  │ (3)      │ │  │  [📋] [👍] [👎] [🔄] [🌿] [•••] │ │                      │
│  └──────────┘ │  └───────────────────────────────────┘ │                      │
│               │                                         │                      │
│               │  ┌───────────────────────────────────┐ │                      │
│               │  │  🤔 GPT-4o Thought for 3.2s       │ │                      │
│               │  │  ┌─────────────────────────────┐  │ │                      │
│               │  │  │ Analyzing architecture...    │  │ │                      │
│               │  │  │ Considering trade-offs...    │  │ │                      │
│               │  │  │ Evaluating team constraints..│  │ │                      │
│               │  │  └─────────────────────────────┘  │ │                      │
│               │  └───────────────────────────────────┘ │                      │
│               │                                         │                      │
│               │  ┌───────────────────────────────────┐ │                      │
│               │  │ 🔧 Tool: Read Document             │ │                      │
│               │  │ ┌─────────────────────────────┐  │ │                      │
│               │  │ │ Read Architecture v2...      │  │ │                      │
│               │  │ │ Result: 847 lines · 12.4K   │  │ │                      │
│               │  │ │ tokens · Found 3 references  │  │ │                      │
│               │  │ └─────────────────────────────┘  │ │                      │
│               │  └───────────────────────────────────┘ │                      │
│               │                                         │                      │
│               │  STREAMING MESSAGE (when active)        │                      │
│               │  ┌───────────────────────────────────┐ │                      │
│               │  │ ● GPT-4o (generating...)          │ │                      │
│               │  │ ┌─────────────────────────────┐  │ │                      │
│               │  │ │ I'd recommend considering...  │  │ │                      │
│               │  │ │ the following architecture █  │  │ │                      │
│               │  │ └─────────────────────────────┘  │ │                      │
│               │  │  Tokens: 1.2K · Elapsed: 4.2s   │ │                      │
│               │  │                        [⏹ Stop] │ │                      │
│               │  └───────────────────────────────────┘ │                      │
│               │                                         │                      │
│               │  ┌───────────────────────────────────┐ │                      │
│               │  │  COMPOSER                          │ │                      │
│               │  │  ┌─────────────────────────────┐  │ │                      │
│               │  │  │ What about the caching       │  │ │                      │
│               │  │  │ strategy? Should we use... █ │  │ │                      │
│               │  │  └─────────────────────────────┘  │ │                      │
│               │  │                                   │ │                      │
│               │  │  📎 🎤 ✨  GPT-4o · ~48 tokens  │ │                      │
│               │  │                              [➤] │ │                      │
│               │  └───────────────────────────────────┘ │                      │
│               └───────────────────────────────────────┘ │                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

```
DESKTOP (≥1280px):
  Conversation List:   280px (left sidebar)
  Chat Area:           flex-1
  Right Panel:         320px (collapsible via toggle)

TABLET (768–1023px):
  Conversation List:   Toggle overlay (hamburger icon in header)
  Chat Area:           Full width
  Right Panel:         Hidden by default. Toggle via info button in header.

MOBILE (<768px):
  Conversation List:   Back-navigation or bottom sheet
  Chat Area:           Full screen
  Right Panel:         Bottom sheet (slide up)
  Composer:            Fixed bottom, full width
  Message actions:     Hidden by default. Long-press or swipe to reveal.
```

---

## 3. Chat Components

### Component Catalog

```
CONVERSATION LIST COMPONENTS:
  ConversationList
    └── ConversationItem
        ├── ConversationIcon (💬 / ⭐ / based on context)
        ├── ConversationTitle
        ├── ConversationPreview (last message truncated)
        ├── ConversationMeta (message count, timestamp)
        ├── ModelBadge (small)
        ├── StarIndicator
        ├── BranchIndicator (🌿 if has branches)
        └── ContextMenu (Rename, Star, Archive, Export, Delete)

CHAT HEADER COMPONENTS:
  ChatHeader
    ├── ConversationTitle (editable — click to rename)
    ├── ModelSwitcher
    │   ├── ModelDropdown
    │   │   └── ModelOption[] (provider icon + model name + context window + cost tier)
    ├── ContextScopeSelector
    │   ├── "Full Project" (default — all documents)
    │   ├── "Selected Documents" (picker)
    │   └── "Current Document Only"
    ├── ContextWindowMeter
    │   └── ProgressBar (token usage vs context window)
    └── ConversationActions (••• dropdown)

MESSAGE COMPONENTS:
  SystemContextCard (collapsible)
    ├── ContextSummary
    ├── DocumentList (with ✕ to remove individual docs)
    └── ExpandToggle

  UserMessageCard
    ├── Avatar
    ├── MessageContent (Markdown rendered)
    ├── AttachmentChips
    ├── Timestamp
    ├── EditButton (on hover, top-right)
    └── HoverActions
        ├── 📝 Edit
        ├── 🌿 Branch from here
        ├── 📋 Copy
        └── 🗑️ Delete

  AIMessageCard
    ├── ModelBadge (provider icon + model name)
    ├── ReasoningBlock (collapsible, conditional)
    │   ├── ThinkingTime ("Thought for 3.2s")
    │   └── ReasoningContent (monospace, dimmed)
    ├── ToolCallBlock (conditional)
    │   ├── ToolIcon + ToolName
    │   ├── ToolInput (collapsible)
    │   └── ToolOutput (collapsible)
    ├── MessageContent (Markdown + syntax highlighting)
    ├── TokenCount + Duration
    ├── ActionBar
    │   ├── 📋 Copy
    │   ├── 👍 / 👎 (with count)
    │   ├── 🔄 Regenerate
    │   ├── 🌿 Branch
    │   ├── 🔊 Listen
    │   ├── 📝 Apply to Document
    │   └── ••• More
    └── FollowUpSuggestions (row of suggestion chips)

  StreamingMessageCard
    ├── ModelBadge (with pulsing dot)
    ├── LiveContent (token-by-token append)
    ├── BlinkingCursor
    ├── TokenCounter (live)
    ├── ElapsedTimer
    └── StopButton

COMPOSER COMPONENTS:
  Composer
    ├── AttachmentBar (conditional)
    │   └── AttachmentChip (name, type, size, ✕)
    ├── ContextSelectionBar (conditional)
    │   └── ContextChip[] (document name, ✕ remove, + Add)
    ├── PromptTextarea
    │   ├── Auto-resize (min 2 rows, max 12)
    │   ├── @mention autocomplete popup
    │   ├── /command autocomplete popup
    │   └── Character/token counter
    ├── ComposerFooter
    │   ├── ModelIndicator
    │   ├── TokenEstimator
    │   ├── AttachmentButton (📎)
    │   ├── VoiceButton (🎤)
    │   ├── OptimizeButton (✨)
    │   └── SendButton (➤ / ⏹ Stop)
    └── KeyboardHint

RIGHT PANEL COMPONENTS:
  RightPanel (collapsible)
    ├── ConversationInfo
    │   ├── InfoRow[] (Model, Temp, MaxTokens, Messages, TotalTokens, Cost)
    ├── ContextDocuments
    │   ├── DocumentChip[] (with ✕ remove)
    │   └── AddDocumentButton
    ├── ConversationTree
    │   └── TreeGraph (visual branching structure)
    ├── PromptSuggestions
    │   └── SuggestionChip[]
    └── ExportActions
        ├── ExportMD / ExportPDF / ExportJSON
        ├── SaveAsTemplate
        └── SaveAsPrompt
```

---

## 4. Composer

### Layout & Behavior

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  COMPOSER (sticky bottom, bg-white, border-t, p-4)                            │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ATTACHMENT BAR (conditional — shown when files are attached)             │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                      │ │
│  │  │ 📄 arch-v2.md│ │ 🖼️ diagram   │ │ 📊 data.csv  │                      │ │
│  │  │ 12.4 KB   ✕  │ │ 2.1 MB    ✕  │ │ 450 KB    ✕  │                      │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  CONTEXT SELECTION BAR (conditional — shown when docs are selected)       │ │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │ │
│  │  │ 📄 Architecture │ │ 📄 PRD          │ │ + Add Context   │             │ │
│  │  │ (v2)         ✕  │ │ (v3)         ✕  │ │                 │             │ │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘             │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  PROMPT INPUT                                                             │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                                                                       │ │ │
│  │  │  What about the caching strategy? Should we use Redis or in-memory?  │ │ │
│  │  │  █                                                                    │ │ │
│  │  │                                                                       │ │ │
│  │  └──────────────────────────────────────────────────────────────────────┘ │ │
│  │  (min-height: 48px, max-height: 240px, auto-resize)                       │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  COMPOSER FOOTER                                                          │ │
│  │  ┌────────────────────────────────────┐  ┌──────────────────────────────┐ │ │
│  │  │ 📎  🎤  ✨  GPT-4o · ~48 tokens    │  │                        [➤]  │ │ │
│  │  │ (attachment, voice, optimize)      │  │                    (send)     │ │ │
│  │  └────────────────────────────────────┘  └──────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ⌘Enter to send · Shift+Enter for newline · ⌘K for commands                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Composer States

```
DEFAULT:
  Input empty. Send button visible but requires content to enable.
  Placeholder: "Ask anything about your project..."

TYPING:
  Input has content. Send button primary + enabled.
  Token estimator updates in real-time (debounced 300ms).

STREAMING:
  Input disabled. Send button → Stop button (⏹).
  Placeholder: "AI is responding..."

ATTACHMENT UPLOADING:
  Attachment chip shows progress bar.
  Send button disabled until upload complete.
  Placeholder: "Uploading files..."

AFTER SEND:
  Input cleared. Focus returns to input.
  Attachment bar cleared (or persists if "keep attachments" preference).

ERROR:
  Red border on input. "Message failed to send. [Retry]" below.
  Message content preserved (not cleared).

NETWORK OFFLINE:
  Input enabled but send button disabled.
  "You're offline. Messages will be queued." banner.
```

### @Mention System

```
TRIGGER: @ character in input

POPUP (above composer):
  ┌──────────────────────────────────────────┐
  │  @docs      Search documents...           │
  │  ─────────────────────────────────────── │
  │                                           │
  │  DOCUMENTS                                │
  │  📄 Architecture (v2)                     │
  │  📄 PRD (v3)                              │
  │  📄 SRS (v1)                              │
  │  📄 API Spec (v1)                         │
  │                                           │
  │  TEMPLATES & PROMPTS                      │
  │  📝 PRD Template — Standard               │
  │  📝 Architecture Review Prompt            │
  │                                           │
  │  FILES                                    │
  │  📄 brand-guidelines.pdf                  │
  │  📊 architecture-diagram.png              │
  └──────────────────────────────────────────┘

BEHAVIOR:
  - Filter as user types after @
  - Arrow keys to navigate. Enter to select.
  - Selected document appears as chip in context bar
  - @mention inserts reference in text: "@Architecture"
```

### /Command System

```
TRIGGER: / character at start of input or on empty line

POPUP (above composer):
  ┌──────────────────────────────────────────┐
  │  /help        Show available commands    │
  │  /clear       Clear current conversation │
  │  /export      Export conversation        │
  │  /branch      Create a new branch        │
  │  /model       Switch active model        │
  │  /temp        Set temperature            │
  │  /context     Change context scope       │
  │  /template    Load a prompt template     │
  │  /retry       Regenerate last response   │
  │  /summarize   Summarize conversation     │
  │  /prd         Convert to PRD             │
  │  /srs         Convert to SRS             │
  └──────────────────────────────────────────┘

BEHAVIOR:
  - Filter as user types
  - Arrow keys to navigate. Enter to execute.
  - Some commands execute immediately (/clear, /branch)
  - Some open a sub-dialog (/model, /export)
  - Some insert a template or trigger generation (/prd, /srs)
```

### Prompt Optimizer (✨)

```
TRIGGER: Click ✨ button in composer footer, or ⌘⇧O

BEHAVIOR:
  1. Takes current prompt text
  2. Sends to AI with meta-prompt: "Improve this prompt for clarity, specificity,
     and effectiveness. Return only the improved prompt."
  3. Replaces input text with optimized version
  4. Shows diff: original (strikethrough, red) → optimized (green)
  5. User can accept, reject, or edit further

OPTIMIZATION TYPES (chosen via dropdown on ✨ button):
  - More Specific (adds detail, constraints)
  - More Concise (removes fluff)
  - More Professional (formal tone)
  - More Creative (open-ended, exploratory)
  - Add Examples (asks AI to include examples)
  - Structured Output (asks for tables, lists, headings)
```

---

## 5. AI Message Cards

### Message Card Layout

````
┌──────────────────────────────────────────────────────────────────────────────┐
│  AI MESSAGE CARD                                                              │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  🤖 GPT-4o                                                    2:45 PM    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  REASONING BLOCK (collapsible, collapsed by default)                      │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  🤔 Thought for 3.2s                                          [▾]   │ │ │
│  │  │  ─────────────────────────────────────────────────────────────────  │ │ │
│  │  │  Let me analyze the architecture requirements:                      │ │ │
│  │  │  1. The team is 4 engineers → suggests monolithic or modular        │ │ │
│  │  │  2. Timeline is 8 weeks → speed matters over scalability            │ │ │
│  │  │  3. Existing codebase is Express + React → stay in ecosystem        │ │ │
│  │  │  4. Future plans include 50+ engineers → plan for extraction        │ │ │
│  │  │                                                                      │ │ │
│  │  │  Conclusion: Recommend modular monolith with clear boundaries       │ │ │
│  │  │  that can be extracted later.                                       │ │ │
│  │  └──────────────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  TOOL CALLS (collapsible, collapsed by default)                           │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  🔧 Read Document: Architecture (v2)                        [▾]     │ │ │
│  │  │  ─────────────────────────────────────────────────────────────────  │ │ │
│  │  │  Input:  { "documentId": "arch-123", "sections": ["overview",      │ │ │
│  │  │            "tech-stack"] }                                           │ │ │
│  │  │  Output: 847 lines · 12.4K tokens · 234ms                           │ │ │
│  │  └──────────────────────────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  🔧 Search Knowledge Base: "caching strategy"               [▾]     │ │ │
│  │  │  Result: 3 documents found                                         │ │ │
│  │  └──────────────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  MESSAGE CONTENT (Markdown rendered)                                      │ │
│  │                                                                           │ │
│  │  I'd recommend a modular monolith approach for your API layer,            │ │
│  │  given your current constraints:                                          │ │
│  │                                                                           │ │
│  │  ## Recommended Architecture                                              │ │
│  │                                                                           │ │
│  │  ```                                                                       │ │
│  │  src/                                                                      │ │
│  │  ├── modules/          # Domain modules (bounded contexts)                │ │
│  │  │   ├── auth/         # Authentication & authorization                   │ │
│  │  │   ├── projects/     # Project management                              │ │
│  │  │   ├── pipeline/     # Generation pipeline                             │ │
│  │  │   └── export/       # Export service                                  │ │
│  │  ├── shared/           # Shared kernel                                    │ │
│  │  │   ├── database/     # Prisma client + repos                           │ │
│  │  │   ├── errors/       # Error classes                                   │ │
│  │  │   └── logging/      # Logger                                          │ │
│  │  └── infrastructure/   # Express app, middleware, config                 │ │
│  │  ```                                                                       │ │
│  │                                                                           │ │
│  │  ### Why This Works                                                       │ │
│  │                                                                           │ │
│  │  1. **Team Size**: 4 engineers can own 1-2 modules each                  │ │
│  │  2. **Timeline**: Monolith is faster to build initially                   │ │
│  │  3. **Future**: Modules can be extracted to microservices later           │ │
│  │  4. **Existing Stack**: Compatible with Express + TypeScript              │ │
│  │                                                                           │ │
│  │  ### Caching Strategy                                                      │ │
│  │                                                                           │ │
│  │  | Layer | Strategy | TTL |                                               │ │
│  │  |-------|----------|-----|                                               │ │
│  │  | Client | SWR | 30s |                                                   │ │
│  │  | API | Redis | 60s |                                                    │ │
│  │  | DB | PostgreSQL query cache | Auto |                                   │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  Tokens: 850 input · 420 output · GPT-4o · 2.3s                          │ │
│  │  Cost: ~$0.02                                                             │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ACTION BAR                                                               │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────────────┐ │ │
│  │  │ 📋   │ │ 👍 3 │ │ 👎   │ │ 🔄   │ │ 🌿   │ │ 📝 Apply to Document │ │ │
│  │  │ Copy │ │      │ │      │ │Regen │ │Branch│ │                      │ │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  FOLLOW-UP SUGGESTIONS                                                     │ │
│  │  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │ │
│  │  │ What about database│ │ How would this     │ │ Show me an example │   │ │
│  │  │ sharding?         │ │ compare to using   │ │ of the module      │   │ │
│  │  │                   │ │ NestJS?            │ │ structure?         │   │ │
│  │  └────────────────────┘ └────────────────────┘ └────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
````

### Message Card States

```
COMPLETED:
  Full content rendered. Actions visible. Follow-up suggestions shown.

STREAMING:
  Content building token by token. Blinking cursor. "Stop" button visible.
  Token counter + timer live. Actions hidden (except Stop).

GENERATING (non-streaming):
  Spinner with "Generating..." text. Cancel button.
  Token counter not available until complete.

FAILED:
  Error message: "Response interrupted — API rate limit exceeded. [Retry] [Continue]"
  Partial content shown (if any was received).
  Red border on card.

EDITED (user edited their preceding message):
  Small badge: "Regenerated" with timestamp.
  Original response accessible via "View previous version" link.

BRANCHED:
  Small badge: "🌿 Branch" with link to branch.
  Original conversation continues from branch point.
```

---

## 6. User Message Cards

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  USER MESSAGE CARD                                                            │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                                     👤 You · 2:45 PM    [✏️] [🌿] [•••] │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ATTACHMENTS (conditional)                                                │ │
│  │  ┌──────────────┐ ┌──────────────┐                                       │ │
│  │  │ 🖼️ diagram   │ │ 📄 notes.md  │                                       │ │
│  │  │ [thumbnail]   │ │ 1.2 KB       │                                       │ │
│  │  └──────────────┘ └──────────────┘                                       │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  MESSAGE CONTENT                                                          │ │
│  │                                                                           │ │
│  │  Should we use microservices or a modular monolith for the API layer?     │ │
│  │                                                                           │ │
│  │  Context:                                                                  │ │
│  │  - Team of 4 engineers                                                     │ │
│  │  - 8-week timeline                                                        │ │
│  │  - Current stack: Express + React                                         │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

USER MESSAGE ACTIONS (on hover or tap):
  ✏️  Edit    — Opens inline edit mode. Resubmits on save. Creates new AI response.
               Previous response preserved as "previous version".
  🌿 Branch   — Creates a new branch from this point in conversation
  📋 Copy     — Copies message text
  🗑️  Delete  — Removes message and all subsequent messages (with confirmation)

EDIT MODE:
  ┌──────────────────────────────────────────────────────────┐
  │  EDITING MESSAGE                                          │
  │  ┌──────────────────────────────────────────────────────┐ │
  │  │ Should we use microservices or a modular monolith?   │ │
  │  │ (updated text)                                       │ │
  │  └──────────────────────────────────────────────────────┘ │
  │  ┌────────────────┐  ┌────────────────┐                  │
  │  │ Save & Resend   │  │ Cancel         │                  │
  │  └────────────────┘  └────────────────┘                  │
  └──────────────────────────────────────────────────────────┘
```

---

## 7. Streaming UX

### Streaming Behavior

````
STREAMING ARCHITECTURE:
  Client: EventSource or fetch with ReadableStream
  Server: SSE (Server-Sent Events) via Express
  Format: text/event-stream

SSE EVENT TYPES:
  data: {"type": "token", "content": "I'd recommend..."}
  data: {"type": "token", "content": " a modular monolith..."}
  data: {"type": "thinking", "content": "Analyzing team constraints..."}  (future: reasoning)
  data: {"type": "tool_call", "tool": "read_document", "input": {...}}
  data: {"type": "tool_result", "tool": "read_document", "output": "..."}
  data: {"type": "progress", "tokensUsed": 1200, "tokensTotal": 16000, "percentComplete": 7}
  data: {"type": "error", "message": "Rate limit exceeded"}
  data: {"type": "done", "usage": {"input": 850, "output": 420, "cost": 0.02}}

VISUAL:
  1. AI message card appears with pulsing dot + "Generating..."
  2. Model badge with animated gradient border
  3. Content appears token by token
     - Append-only rendering (no re-render of previous content)
     - Rendering throttled to 60fps via requestAnimationFrame
     - Markdown partially rendered (headings, bold, italic applied to completed lines)
     - Code blocks: start rendering when ``` fence is closed
  4. Blinking cursor at insertion point (alternating opacity, 1s cycle)
  5. Token counter increments live
  6. Timer running
  7. Auto-scroll: follows new content. Stops if user scrolls up manually.
     "Scroll to bottom" button appears when user scrolls up.

STOPPING:
  Click ⏹ → AbortController.abort()
  Partial content preserved
  Card shows "Generation stopped" indicator
  "Continue Generation" button appears

RECONNECTING:
  If SSE connection drops:
    - Show "Reconnecting..." indicator
    - Exponential backoff: 1s, 2s, 5s, 10s
    - Max 3 attempts
    - On failure: "Connection lost. [Retry] [View Partial]"

CANCELLED BY USER:
  AbortController.abort()
  Message saved with partial content
  Conversation status: CANCELLED
  "Generation cancelled. [Continue] [Regenerate]"
````

### Streaming Indicators

```
GENERATING STATE — Visual hierarchy:
  ● GPT-4o (pulsing indigo dot, 2s cycle)
    └── Card border: subtle animated gradient (indigo → violet → indigo, 3s cycle)

THINKING STATE (when AI is reasoning — future):
  🤔 GPT-4o is thinking... (amber dot with rotating animation)
    └── Thinking block expands with reasoning steps

TOOL CALL STATE:
  🔧 GPT-4o is reading Architecture (v2)... (gear icon rotating)
    └── Tool call block expands with input/output

STREAMING COMPLETE:
  ✓ GPT-4o (green checkmark, 200ms spring animation)
    └── Card border returns to static
    └── Content: final cursor blink → cursor disappears
    └── Token counter: final value appears with brief highlight
    └── Actions bar: fades in (150ms stagger)
```

---

## 8. Prompt Suggestions

### Suggestion Types

```
CONTEXT-AWARE SUGGESTIONS:
  Based on current project + conversation:
  "Compare microservices vs monolith for a 4-person team"
  "What caching strategy works best with PostgreSQL?"
  "Generate an API endpoint list for the auth module"
  "What are the security implications of this architecture?"

AI-RESPONSE FOLLOW-UPS (shown after each AI message):
  "Tell me more about the caching strategy"
  "What are the trade-offs with this approach?"
  "Show me a code example"
  "How would this scale to 100K users?"
  "Summarize this in 3 bullet points"

TEMPLATE SUGGESTIONS (shown when chat is empty):
  "Generate a PRD for a mobile banking app"
  "Review my architecture for scalability issues"
  "Create user stories for an e-commerce checkout flow"
  "Design a database schema for a social media platform"

RANDOM DISCOVERY (1-2 shown at bottom):
  "What's the best way to handle file uploads in Express?"
  "Explain CQRS pattern with an example"
  "How do I optimize Prisma queries for large datasets?"
```

### Suggestion Layout

```
┌──────────────────────────────────────────────────────────────┐
│  SUGGESTIONS (shown above composer or within empty chat)     │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  SUGGESTED FOLLOW-UPS                                    ││
│  │                                                           ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ Tell me more about the module structure           │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ How would you handle authentication in this      │   ││
│  │  │ architecture?                                    │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ What about deployment? Docker or serverless?     │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │                                                           ││
│  │  ┌────────────────────┐ ┌────────────────────┐         ││
│  │  │ 🔄 Regenerate     │ │ ✨ More suggestions │         ││
│  │  └────────────────────┘ └────────────────────┘         ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
│  EMPTY CHAT (no messages yet):                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  💡 START A CONVERSATION                                 ││
│  │                                                           ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ 🎯 Generate a PRD for my product idea            │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ 🏗️ Review my architecture for best practices     │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ 📝 Create user stories from my requirements      │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │  ┌──────────────────────────────────────────────────┐   ││
│  │  │ 📊 Design a database schema for my app           │   ││
│  │  └──────────────────────────────────────────────────┘   ││
│  │                                                           ││
│  │  Or type your own question below...                      ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

BEHAVIOR:
  Click suggestion → fills composer → auto-sends (or fills for review)
  Configurable: auto-send vs fill-and-review (user preference)
  Dismissible: ✕ on each suggestion card
```

---

## 9. Context Window

### Context Window Meter

```
┌──────────────────────────────────────────────────────────────┐
│  CONTEXT WINDOW METER (in chat header)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  GPT-4o · 128K context window                            ││
│  │  ████████████░░░░░░░░░░░░░  8.2K / 128K tokens  (6.4%)  ││
│  │  ─────────────────────────────────────────────────────── ││
│  │  Breakdown:                                               ││
│  │  System Prompt        1.2K    ██░░░░░░░░░░░░░░░░░░       ││
│  │  Project Context      4.5K    ████████░░░░░░░░░░░░       ││
│  │  Conversation History  2.1K    ████░░░░░░░░░░░░░░░░       ││
│  │  Current Prompt        0.4K    █░░░░░░░░░░░░░░░░░░░       ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
│  STATES:                                                      │
│  Green (0-70%):    Normal. Everything fits comfortably.       │
│  Amber (70-90%):   Warning. "Context filling up."             │
│  Red (90-100%):    Critical. "Context nearly full. Older      │
│                    messages will be summarized or truncated."  │
│  Full (100%+):     Error. "Cannot add more context. Start     │
│                    a new conversation or clear history."       │
│                                                               │
│  AUTO-MANAGEMENT:                                             │
│  At 90%:          Oldest messages summarized (AI-generated     │
│                   tl;dr replacing full content)               │
│  At 100%:         Input disabled until conversation is        │
│                   trimmed or new conversation started          │
│                                                               │
│  CONTEXT WINDOW BY MODEL:                                     │
│  GPT-4o:           128K tokens                                │
│  GPT-4o-mini:      128K tokens                                │
│  Claude 3.5 Sonnet: 200K tokens                               │
│  Claude Opus 4:    200K tokens                                │
│  Gemini 2.0 Pro:   2M tokens                                  │
└──────────────────────────────────────────────────────────────┘
```

### Context Management

```
CONTEXT SCOPE SELECTOR:
  ┌──────────────────────────────────────────┐
  │  [Full Project ▾]                         │
  │  ─────────────────────────────────────── │
  │  ● Full Project (all 9 documents)        │
  │  ○ Selected Documents                    │
  │    ☑ Architecture (v2)                   │
  │    ☑ PRD (v3)                            │
  │    ☐ SRS (v1)                            │
  │    ☐ API Spec (v1)                       │
  │    ...                                    │
  │  ○ Current Document Only                 │
  │  ○ No Documents (freeform chat)          │
  │  ○ Custom Prompt Template                │
  └──────────────────────────────────────────┘

CONTEXT INJECTION (server-side, via PromptEngine):
  1. System prompt: "You are an expert software engineer..."
  2. Project description + constraints from project settings
  3. Selected documents (truncated to fit context window)
  4. Conversation history (last N messages, summarized if too long)
  5. User's current message

DOCUMENT TRUNCATION STRATEGY:
  If all selected documents exceed context window:
    1. Include full content of most recently accessed documents
    2. Summarize older documents (AI-generated summary)
    3. Show "Some documents were summarized to fit context" notice
```

---

## 10. Attachments

```
SUPPORTED FILE TYPES:
  Images:     PNG, JPG, GIF, WebP, SVG (max 20MB)
  Documents:  PDF, DOCX, MD, TXT, CSV (max 20MB)
  Code:       JS, TS, PY, GO, RS, etc. (all text-based, max 5MB)
  Data:       JSON, YAML, XML, SQL (max 5MB)

UPLOAD METHODS:
  1. Click 📎 button in composer → file picker dialog
  2. Drag & drop files onto composer or chat area
  3. Paste image from clipboard (⌘V)
  4. @mention existing project files

ATTACHMENT PROCESSING:
  Text files:       Content extracted and included in prompt as context
  Images:           Vision model support (GPT-4o, Claude 3.5). Base64 sent to API.
  PDF/DOCX:         Text extraction (server-side). Included in prompt.
  Code files:       Syntax-highlighted display. Full content in prompt.
  Data files:       Parsed and included as structured data.

ATTACHMENT DISPLAY:
  ┌──────────────────────────────────────────────────────────┐
  │  Image:                                                   │
  │  ┌────────────────────┐                                   │
  │  │                    │                                   │
  │  │   [thumbnail]      │  diagram.png                      │
  │  │                    │  2.1 MB                           │
  │  │                    │  [✕]                              │
  │  └────────────────────┘                                   │
  │                                                           │
  │  Document:                                                │
  │  ┌──────────────────────────────────────────────────────┐ │
  │  │ 📄 architecture-review.pdf                    [✕]    │ │
  │  │    450 KB · 12 pages · Text extracted                 │ │
  │  └──────────────────────────────────────────────────────┘ │
  │                                                           │
  │  Code:                                                    │
  │  ┌──────────────────────────────────────────────────────┐ │
  │  │ 📄 auth-service.ts                           [✕]    │ │
  │  │    2.4 KB · 85 lines                                   │ │
  │  └──────────────────────────────────────────────────────┘ │
  └──────────────────────────────────────────────────────────┘

UPLOAD STATES:
  Uploading:  Progress bar on chip. "Uploading... 65%"
  Processing: Spinner. "Extracting text..."
  Complete:   File icon + name + size. Included in prompt indicator.
  Error:      Red chip. "Upload failed — file too large. [Remove] [Retry]"
  Unsupported: Red chip. "File type not supported. [Remove]"
```

---

## 11. AI Memory

```
MEMORY TYPES:

1. PROJECT MEMORY (persistent across conversations):
   - Project description
   - Technology stack
   - Constraints and preferences
   - Key decisions made in previous conversations
   - Stored in project.settings JSON
   - Automatically injected into system prompt

2. CONVERSATION MEMORY (within a single conversation):
   - Full message history (until context window fills)
   - Summarized history (when context window is tight)
   - Key decisions extracted by AI (shown in right panel)

3. WORKSPACE MEMORY (across all projects):
   - Coding standards document
   - Preferred architecture patterns
   - Brand guidelines
   - Technical constraints
   - Stored in workspace knowledge base
   - Opt-in: user selects which documents to include

4. USER MEMORY (across all workspaces — future):
   - Preferred programming languages
   - Preferred frameworks
   - Communication style preferences
   - Stored in user.preferences JSON

MEMORY DISPLAY (right panel or context card):
  ┌──────────────────────────────────────────┐
  │  🧠 AI MEMORY                             │
  │  ─────────────────────────────────────── │
  │                                           │
  │  Project: Mobile App Redesign             │
  │  • Stack: React Native + Express + Postgres│
  │  • Team: 4 engineers                      │
  │  • Timeline: 8 weeks                      │
  │  • Preferred: Modular monolith            │
  │                                           │
  │  Key Decisions:                           │
  │  • Architecture: Modular monolith         │
  │  • Caching: Redis for session + API cache │
  │  • Auth: Custom JWT (not managed service) │
  │  • Database: PostgreSQL via Prisma        │
  │                                           │
  │  [Edit Memory] [Clear Memory]             │
  └──────────────────────────────────────────┘

MEMORY EDITING:
  - User can edit AI's understanding of the project
  - "Edit Memory" opens a textarea: free-form update to project memory
  - "Clear Memory" resets to defaults (project description + tech stack only)
  - Memory updates are appended to system prompt
```

---

## 12. Model Switcher

```
┌──────────────────────────────────────────────────────────────┐
│  MODEL SWITCHER (dropdown in chat header)                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  [🤖 GPT-4o ▾]                                            ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
│  DROPDOWN:                                                    │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                                                           ││
│  │  OPENAI                                                   ││
│  │  ─────────────────────────────────────────────────────── ││
│  │  ● GPT-4o                     128K ctx   $2.50/1M in    ││
│  │  ○ GPT-4o-mini                128K ctx   $0.15/1M in    ││
│  │  ○ GPT-4.1                    1M ctx     $2.00/1M in    ││
│  │  ○ o3-mini                    200K ctx   $1.10/1M in    ││
│  │                                                           ││
│  │  ANTHROPIC                                                ││
│  │  ─────────────────────────────────────────────────────── ││
│  │  ○ Claude 3.5 Sonnet         200K ctx   $3.00/1M in    ││
│  │  ○ Claude 3.5 Haiku          200K ctx   $0.80/1M in    ││
│  │  ○ Claude Opus 4             200K ctx   $15.00/1M in   ││
│  │                                                           ││
│  │  GOOGLE                                                   ││
│  │  ─────────────────────────────────────────────────────── ││
│  │  ○ Gemini 2.0 Pro            2M ctx     $1.25/1M in    ││
│  │  ○ Gemini 2.0 Flash          1M ctx     $0.08/1M in    ││
│  │                                                           ││
│  │  ─────────────────────────────────────────────────────── ││
│  │  ⚡ Switch model for this conversation only              ││
│  │  💡 Tip: Use /model to switch via command               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
│  MODEL SWITCH BEHAVIOR:                                       │
│  - Switching mid-conversation:                                │
│    "Switching from GPT-4o to Claude 3.5 Sonnet. Response     │
│     style may change. Continue?"                              │
│  - Previous messages keep their model badges                  │
│  - New messages use the new model                             │
│  - Different models have different system prompt behaviors:   │
│    Claude: XML-style system prompts preferred                 │
│    GPT: Markdown-style system prompts preferred               │
│    System prompt auto-adapted per model                       │
│                                                               │
│  MODEL COMPARISON MODE:                                       │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Compare Models                                           ││
│  │  Run the same prompt on 2+ models side by side            ││
│  │                                                           ││
│  │  Select models: [GPT-4o] [Claude 3.5 Sonnet] [+ Add]     ││
│  │  ┌──────────────────┐ ┌──────────────────────────────────┐││
│  │  │ GPT-4o           │ │ Claude 3.5 Sonnet                │││
│  │  │ Tokens: 1.2K     │ │ Tokens: 980                      │││
│  │  │ Cost: $0.02      │ │ Cost: $0.01                      │││
│  │  │ Time: 2.3s       │ │ Time: 4.1s                       │││
│  │  │ ──────────────── │ │ ──────────────────────────────── │││
│  │  │ I recommend...   │ │ I'd suggest considering...       │││
│  │  └──────────────────┘ └──────────────────────────────────┘││
│  │                                                           ││
│  │  [👍 Prefer GPT-4o] [👍 Prefer Claude] [Both useful]     ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

---

## 13. Tool Calls

```
TOOL CALLING ARCHITECTURE (future Phase 5+):

DEFINED TOOLS:
  1. read_document     — Read a project document by ID or name
  2. search_knowledge  — Search workspace knowledge base
  3. read_file         — Read uploaded project file
  4. list_documents    — List available documents in project
  5. search_web        — (future) Search the web for current info
  6. generate_document — Trigger document generation via pipeline
  7. compare_documents — Diff two document versions

TOOL CALL FLOW:
  1. User asks a question
  2. AI decides it needs more context
  3. AI emits: { "type": "tool_call", "tool": "read_document", "input": { "name": "Architecture" } }
  4. Server executes the tool call (reads document from DB)
  5. Server returns: { "type": "tool_result", "output": "..." }
  6. AI continues generating with the additional context
  7. Response incorporates the tool result

TOOL CALL DISPLAY:
  Each tool call is a collapsible card within the AI message:

  ┌──────────────────────────────────────────────────────────┐
  │  🔧 Read Document: Architecture (v2)            [▾]      │
  │  ─────────────────────────────────────────────────────── │
  │  Input:                                                   │
  │  { "documentId": "arch-123", "sections": ["all"] }       │
  │                                                           │
  │  Output: 847 lines · 12.4K tokens · 234ms                │
  │  ┌──────────────────────────────────────────────────────┐│
  │  │ # System Architecture                                 ││
  │  │ ## Overview                                           ││
  │  │ The Mobile App Redesign follows a... [truncated]     ││
  │  └──────────────────────────────────────────────────────┘│
  └──────────────────────────────────────────────────────────┘

USER APPROVAL MODE (configurable):
  "GPT-4o wants to read Architecture (v2). [Allow] [Deny] [Always allow]"
  First-time tool use requires approval.
  Subsequent uses auto-approved within same conversation.
  Setting: "Auto-approve tool calls" toggle.
```

---

## 14. Conversation Tree

```
CONVERSATION TREE (visual branching structure in right panel):

┌──────────────────────────────────────────────────────┐
│  🌿 CONVERSATION TREE                                 │
│                                                       │
│  ● Main: Architecture Discussion                      │
│  │  (24 messages · GPT-4o · 2h ago)                  │
│  │                                                    │
│  ├──● Branch: Microservices approach                  │
│  │  │  (8 messages · Claude · 1h ago)                │
│  │  │                                                 │
│  │  └──● Sub-branch: Event-driven microservices       │
│  │       (5 messages · GPT-4o · 30m ago)             │
│  │                                                    │
│  └──● Branch: Caching comparison                      │
│       (3 messages · GPT-4o-mini · 45m ago)           │
│                                                       │
│  Active: ● (currently viewing)                         │
│  Inactive: ○                                          │
│                                                       │
│  ┌──────────────────────────────────────┐            │
│  │  + New Branch from current point     │            │
│  └──────────────────────────────────────┘            │
│                                                       │
│  Click any branch to navigate to it.                  │
│  Hover: preview first message.                        │
│  Right-click: Rename, Delete, Export.                 │
└──────────────────────────────────────────────────────┘

BRANCH NAVIGATION (in chat header when viewing branch):
  ┌──────────────────────────────────────────────────────┐
  │  ← Main: Architecture Discussion                      │
  │  🌿 Branch: "Microservices approach"  [Rename] [•••] │
  └──────────────────────────────────────────────────────┘

BRANCHING BEHAVIOR:
  - Branches start from any message (user or AI)
  - Branch inherits conversation history up to branch point
  - Branch has independent message history from branch point onward
  - Branches can be named, renamed, deleted
  - All branches visible in conversation tree
  - Model can differ per branch
  - Context scope can differ per branch
```

---

## 15. Branching

```
CREATING A BRANCH:
  1. Hover over any message → click 🌿 Branch
     OR: /branch command in composer
     OR: ••• menu on AI message → Branch from here

  2. Dialog:
     ┌──────────────────────────────────────────┐
     │  Create New Branch                        │
     │                                           │
     │  Branch Name (optional)                   │
     │  ┌──────────────────────────────────────┐ │
     │  │ Alternative architecture approach    │ │
     │  └──────────────────────────────────────┘ │
     │                                           │
     │  Starting from:                           │
     │  "Should we use microservices..."         │
     │                                           │
     │  Inherits:                                │
     │  • 12 previous messages                   │
     │  • Current model: GPT-4o                  │
     │  • Current context: Full Project          │
     │                                           │
     │  ┌──────────────┐  ┌──────────────┐      │
     │  │ Create Branch │  │ Cancel        │      │
     │  └──────────────┘  └──────────────┘      │
     └──────────────────────────────────────────┘

  3. Branch created. New conversation thread.
     First input pre-populated with the message that was branched from.
     User edits and sends.

MERGING (future):
  Not supported in v1. Branches are independent.
  Future: merge branch conversation into parent as context.

EXPORTING BRANCHES:
  Export individual branch as Markdown/PDF/JSON
  Export entire tree as structured document (main + all branches)
```

---

## 16. Search

```
CONVERSATION SEARCH:

TRIGGER: ⌘F within AI Chat workspace (or search bar in conversation list)

SEARCH SCOPE:
  - All conversation titles
  - All message content (full-text)
  - Across all conversations in current project (or globally)

RESULTS:
  ┌──────────────────────────────────────────┐
  │  SEARCH: "microservices"                  │
  │  ─────────────────────────────────────── │
  │                                           │
  │  CONVERSATIONS                            │
  │  ┌──────────────────────────────────────┐│
  │  │ 💬 Architecture Discussion           ││
  │  │    12 matches · 2h ago              ││
  │  └──────────────────────────────────────┘│
  │  ┌──────────────────────────────────────┐│
  │  │ 🌿 Microservices approach (Branch)   ││
  │  │    8 matches · 1h ago               ││
  │  └──────────────────────────────────────┘│
  │                                           │
  │  MESSAGES                                 │
  │  ┌──────────────────────────────────────┐│
  │  │ "Should we use microservices..."     ││
  │  │ You · 2:45 PM · Jump to →           ││
  │  └──────────────────────────────────────┘│
  │  ┌──────────────────────────────────────┐│
  │  │ "I recommend a modular monolith..."  ││
  │  │ GPT-4o · 2:46 PM · Jump to →        ││
  │  └──────────────────────────────────────┘│
  └──────────────────────────────────────────┘

IMPLEMENTATION:
  MVP: Client-side search across loaded conversations
  Future: PostgreSQL full-text search (tsvector on message content)
  Index: GIN index on messages.content for full-text search
```

---

## 18. API Design

```
CONVERSATIONS:
  GET    /api/v1/conversations?projectId=:id        List conversations (paginated)
  POST   /api/v1/conversations                      Create conversation
  GET    /api/v1/conversations/:id                  Get conversation with messages
  PATCH  /api/v1/conversations/:id                  Update (rename, star, archive)
  DELETE /api/v1/conversations/:id                  Archive conversation

MESSAGES:
  POST   /api/v1/conversations/:id/messages         Send message (triggers AI response via SSE)
  PATCH  /api/v1/conversations/:id/messages/:msgId  Edit user message
  DELETE /api/v1/conversations/:id/messages/:msgId  Delete message (soft)

BRANCHES:
  POST   /api/v1/conversations/:id/branch           Create branch from message
  GET    /api/v1/conversations/:id/branches         List branches
  PATCH  /api/v1/conversations/branches/:id         Rename branch
  DELETE /api/v1/conversations/branches/:id         Delete branch

STREAMING:
  POST   /api/v1/conversations/:id/messages/stream  Send + stream AI response (SSE)
  POST   /api/v1/conversations/:id/generate/cancel  Cancel active generation

EXPORT:
  POST   /api/v1/conversations/:id/export           Export conversation
    Payload: { format: "markdown" | "pdf" | "json" }
  Response: { url: "https://exports.promptpilot.dev/..." }

COMPARE MODELS:
  POST   /api/v1/conversations/:id/compare          Run same prompt on multiple models
    Payload: { message: "...", models: ["gpt-4o", "claude-3-5-sonnet"] }
  Response: { results: [{ model, content, tokens, cost, duration }] }

ATTACHMENTS:
  POST   /api/v1/conversations/:id/attachments      Upload file attachments
    FormData: file + metadata
  Response: { id, filename, type, size, extractedText }

SEARCH:
  GET    /api/v1/conversations/search?q={query}&projectId={id}
  Response: { conversations: [], messages: [] }

SEND MESSAGE — DETAILED:

POST /api/v1/conversations/:id/messages
{
  "content": "Should we use microservices?",
  "attachments": ["file-id-1", "file-id-2"],
  "contextScope": "full-project",
  "contextDocumentIds": ["doc-id-1", "doc-id-2"],
  "model": "gpt-4o",
  "temperature": 0.2,
  "branchId": null
}

Business Logic:
  1. Verify conversation belongs to user's project
  2. Verify user has access (EDITOR or higher)
  3. Create USER message (sequence = lastSequence + 1)
  4. Build prompt context:
     a. System prompt (based on model + conversation history)
     b. Project context (from selected documents)
     c. Conversation history (last N messages, summarized if needed)
     d. User message content
  5. Call LLM adapter (streaming or non-streaming)
  6. Stream response via SSE to client
  7. On completion: create ASSISTANT message + GENERATION record

SSE RESPONSE FORMAT:
  event: token
  data: {"content": "I recommend..."}

  event: thinking
  data: {"content": "Analyzing architecture..."}

  event: tool_call
  data: {"tool": "read_document", "input": {...}}

  event: tool_result
  data: {"tool": "read_document", "output": "..."}

  event: progress
  data: {"tokensUsed": 1200, "tokensTotal": 16000, "percentComplete": 7}

  event: error
  data: {"message": "Rate limit exceeded"}

  event: done
  data: {"messageId": "msg-456", "usage": {"input": 850, "output": 420, "cost": 0.02}}

CACHING:
  Conversation list:  SWR, stale 30s
  Messages:           SWR, stale 30s
  Active generation:  SSE (no caching)

OPTIMISTIC:
  User message:       Appears instantly in chat. Confirmed on API response.
  Conversation rename: Optimistic update.
  Message delete:     Optimistic hide.
  Star toggle:        Optimistic toggle.
```

---

## 19. Database Design

```
AIConversation (existing ✅):
  id, projectId, stepId (or "chat"), status (ACTIVE/COMPLETED/FAILED/CANCELLED),
  model, temperature, maxTokens, totalInputTokens, totalOutputTokens, totalCost,
  startedAt, completedAt, deletedAt, parentBranchId (nullable → for branching)
  Indexes: (projectId, stepId), (projectId, status)

Message (existing ✅):
  id, conversationId, role (SYSTEM/USER/ASSISTANT),
  content (Text), tokens, sequence, branchId (nullable),
  createdAt
  Unique: (conversationId, sequence)
  NEW: branchId FK to support branching

Generation (existing ✅):
  id, conversationId, model, provider, promptTokens, completionTokens,
  totalTokens, cost, durationMs, status (SUCCESS/FAILED/RETRIED),
  errorMessage, createdAt
  Indexes: (conversationId), (createdAt)

ConversationBranch (new — Phase 5):
  id, parentConversationId (FK), name, createdBy (FK → User),
  branchPointMessageId (FK → Message), createdAt

ConversationStar (new):
  id, conversationId, userId, createdAt
  Unique: (conversationId, userId)

Attachment (new — Phase 5):
  id, conversationId, messageId, filename, mimeType, size,
  storageUrl, extractedText (Text), status (UPLOADING/READY/ERROR),
  createdAt

RELATIONSHIPS:
  Project ──1:N──▶ AIConversation
  AIConversation ──1:N──▶ Message
  AIConversation ──1:N──▶ Generation
  AIConversation ──1:N──▶ ConversationBranch (branches from this conversation)
  Message ──1:N──▶ ConversationBranch (branches starting at this message)
  Message ──1:N──▶ Attachment

INDEXES FOR SEARCH (future):
  CREATE INDEX idx_messages_content_search
  ON messages USING GIN (to_tsvector('english', content));
```

---

## 20. AI Provider Abstraction Layer

```
ARCHITECTURE:
  Frontend → API Server → GenerationService → Adapter Layer → LLM Providers

ADAPTER INTERFACE (existing ✅):
  interface Adapter {
    readonly provider: string         // "openai", "anthropic", "google", "ollama"
    readonly model: string            // "gpt-4o", "claude-3-5-sonnet-20241022"
    readonly maxContextTokens: number // 128000, 200000, etc.
    generate(prompt, options): Promise<GenerationResult>
    generateStream(prompt, options): AsyncIterable<string>
    countTokens(text: string): number
    healthCheck(): Promise<HealthCheckResult>
  }

MULTI-MODEL SUPPORT:
  GenerationService expanded to support:
    - Model switching per conversation
    - Model comparison (run same prompt on 2+ models)
    - Provider fallback (try OpenAI → fallback to Anthropic on failure)
    - Cost-aware routing (use cheapest model that meets quality requirements)

STREAMING ABSTRACTION:
  All adapters implement AsyncIterable<string>
  SSE formatting layer converts stream to SSE events
  Client-agnostic: same EventSource API regardless of provider

FUTURE ADDITIONS:
  - Google Gemini adapter (packages/adapters/src/google.ts)
  - Ollama adapter (packages/adapters/src/ollama.ts)
  - Azure OpenAI adapter (packages/adapters/src/azure.ts)
  - Groq adapter (packages/adapters/src/groq.ts)
  - Mistral adapter (packages/adapters/src/mistral.ts)
  - Custom API adapter (for self-hosted models)
```

---

## 21. Token Usage

```
TOKEN TRACKING (per conversation):
  totalInputTokens:   Sum of all input tokens across messages
  totalOutputTokens:  Sum of all output tokens across generations
  totalCost:          Sum of all generation costs

TOKEN TRACKING (per message):
  tokens:             Token count for this message (estimated by gpt-tokenizer)

TOKEN TRACKING (per generation):
  promptTokens:       Input tokens for this API call
  completionTokens:   Output tokens for this API call
  cost:               Cost in USD (calculated via @promptpilot/shared estimateCost)

DISPLAY:
  Chat header:        Context window meter (live usage vs max)
  Each AI message:    "850 input · 420 output · $0.02"
  Conversation info:  "Total: 45K tokens · $1.23"
  Project page:       "Project total: 125K tokens · $3.42"

REAL-TIME UPDATES:
  During streaming: Token counter increments live
  On completion: Final count displayed
  Cost calculated server-side after generation completes

TOKEN ESTIMATOR (in composer):
  Client-side: gpt-tokenizer estimates tokens for current input
  Display: "~48 tokens" in composer footer
  Updates on every keystroke (debounced 300ms)
```

---

## 22. State Management

```
GLOBAL STATE:
  conversations:      Conversation[]       (list of all conversations)
  activeConversation: Conversation | null   (currently viewing)
  messages:           Message[]            (messages in active conversation)
  streamingState:     'idle' | 'streaming' | 'stopped' | 'error'
  streamingContent:   string               (accumulated streaming content)
  streamingTokens:    number               (live token count)
  streamingTimer:     number               (elapsed seconds)
  attachments:        Attachment[]         (pending uploads)
  contextDocuments:   Document[]           (selected context documents)
  activeModel:        string               (current model identifier)

COMPOSER STATE:
  input:              string               (current prompt text)
  estimatedTokens:    number               (token estimate for current input)
  attachmentFiles:    File[]               (pending file uploads)
  isOptimizing:       boolean              (prompt optimizer running)
  @mentionQuery:      string | null        (active @mention search)
  /commandQuery:      string | null        (active /command search)

UI STATE:
  rightPanelOpen:     boolean
  rightPanelTab:      'info' | 'context' | 'tree' | 'suggestions'
  conversationListOpen: boolean            (mobile)
  showSystemContext:  boolean              (system context card expanded)
  reasoningExpanded:  Record<string, boolean>  (per-message reasoning toggle)
  toolCallsExpanded:  Record<string, boolean>
  messageActionsVisible: string | null      (message ID with hover actions visible)

STREAMING STATE MACHINE:
  IDLE → STREAMING:      User sends message
  STREAMING → COMPLETE:  SSE [DONE] event received
  STREAMING → STOPPED:   User clicks Stop ⏹
  STREAMING → ERROR:     SSE error event or connection failure
  STOPPED → STREAMING:   User clicks "Continue Generation"
  ERROR → STREAMING:     User clicks "Retry"

OPTIMISTIC UPDATES:
  User message:           Appears instantly
  Conversation rename:    Updates instantly
  Star toggle:            Updates instantly
  Message delete:         Disappears instantly
  Attachment upload:      Shows progress chip

NOT OPTIMISTIC:
  AI response (streaming — real, not optimistic)
  Model switch (needs confirmation)
  Branch creation (needs server confirmation)
```

---

## 23. Security

```
DATA ACCESS:
  - User must be workspace member to access conversations
  - Conversations scoped to project → scoped to workspace
  - Message content never shared cross-project
  - Tool calls execute with user's permissions

API KEY SECURITY:
  - LLM API keys stored encrypted at rest (AES-256-GCM)
  - Never returned in API responses
  - Never logged
  - Rotated via workspace AI Configuration

INPUT SANITIZATION:
  - User messages sanitized before storage
  - Markdown rendered with sanitization (no raw HTML execution)
  - File uploads scanned for malware (future)
  - Prompt injection detection (future — heuristic or ML-based)

OUTPUT SANITIZATION:
  - AI responses treated as untrusted content
  - Rendered with Markdown sanitizer (no script execution)
  - Code blocks displayed with syntax highlighting (safe)

RATE LIMITING:
  - Per-user rate limits on message sending (30/min)
  - Per-project rate limits on AI generation (based on plan)
  - Streaming connections limited to 5 concurrent per user

AUDIT TRAIL:
  - Conversation created / deleted
  - Message sent / edited / deleted
  - Generation started / completed / failed
  - Model switched
  - Branch created / deleted
  - Export requested
```

---

## 24. Accessibility

```
WCAG 2.2 AA:
  Color contrast:        All text ≥ 4.5:1. Message role indicated by both position and label.
  Keyboard navigation:   Tab between messages. Enter to expand/collapse reasoning blocks.
                         Arrow keys to scroll message list. ⌘Enter to send.
  Screen reader:         Messages announced with role prefix: "You said:" / "AI responded:".
                         Streaming content announced via aria-live="polite" region.
                         Tool calls announced: "AI is reading the Architecture document."
  Focus management:      Focus moves to composer after sending. Focus moves to stop button
                         during streaming. Focus returns to composer after completion.
  ARIA:                  role="log" on message list. aria-live="polite" on streaming content.
                         role="status" on context window meter. aria-label on all icon buttons.
  Reduced motion:        Pulsing dot → static. Typewriter → instant text. Auto-scroll → jump.
                         Skeleton shimmer → static grey.

KEYBOARD SHORTCUTS (chat-specific):
  ⌘Enter:     Send message
  Shift+Enter: Newline in composer
  ⌘K:         Focus composer (when not already focused)
  Esc:         Stop generation / blur composer / close panel
  ⌘↑:         Edit last message
  ⌘L:         Focus conversation list
  ⌘⇧M:        Toggle model switcher
  ⌘⇧C:        Toggle context scope
  ⌘⇧B:        Toggle right panel
  ⌘F:         Search conversations
  Ctrl+Tab:    Next conversation
  Ctrl+Shift+Tab: Previous conversation
```

---

## 25. Performance

```
LAZY LOADING:
  Conversation list:    Load first 20. "Load more" for older.
  Messages:             Load last 50 on conversation open. Scroll up → load older.
  Right panel:          Lazy-load tab content on first selection.
  Attachments:          Lazy-load extracted text on demand.

VIRTUALIZATION:
  Message list:         React-Virtuoso for 100+ messages.
                        Auto-scroll to bottom on new messages.
                        Pinned scroll-to-bottom button when scrolled up.
  Conversation list:    @tanstack/virtual for 100+ conversations.

STREAMING OPTIMIZATION:
  Token rendering:      requestAnimationFrame throttling.
                        Append-only — previous content not re-rendered.
                        Markdown partially parsed (completed lines only).
  DOM:                  Single text node append. Not full re-render.
  Memory:               Streaming content accumulated in useRef. Not state.
  State update:         Token counter updates debounced (500ms).

CACHING:
  Conversation list:    SWR, stale 30s. Revalidate on focus.
  Messages:             SWR, stale 30s. Revalidate on conversation switch.
  Active generation:    SSE (no cache). Real-time only.

MEMOIZATION:
  Message cards:        React.memo with content hash comparison.
  Conversation items:   React.memo with lastMessage + timestamp comparison.
  Composer:             Not memoized (needs to update on every keystroke).

CODE SPLITTING:
  Right panel:          Dynamic import.
  Model switcher:       Dynamic import.
  Attachment viewer:    Dynamic import per file type.
  Export dialog:        Dynamic import.
  Conversation tree:    Dynamic import (heavy visualization).
```

---

## 26. React Component Hierarchy

```
AIChatModule
│
├── AIChatLayout
│   │
│   ├── ConversationList (left sidebar)
│   │   ├── NewConversationButton
│   │   ├── ConversationSearch
│   │   ├── ConversationFilters
│   │   ├── ConversationGroup[]
│   │   │   └── ConversationItem[]
│   │   │       ├── ConversationIcon
│   │   │       ├── ConversationTitle
│   │   │       ├── ConversationPreview
│   │   │       ├── ConversationMeta (count, timestamp)
│   │   │       ├── ModelBadge (small)
│   │   │       ├── StarIndicator
│   │   │       ├── BranchIndicator
│   │   │       └── ContextMenu (Rename, Star, Archive, Export, Delete)
│   │   └── EmptyState (no conversations)
│   │
│   ├── ChatArea (center)
│   │   ├── ChatHeader
│   │   │   ├── ConversationTitle (editable)
│   │   │   ├── ModelSwitcher
│   │   │   │   └── ModelDropdown
│   │   │   │       └── ModelOption[] (grouped by provider)
│   │   │   ├── ContextScopeSelector
│   │   │   ├── ContextWindowMeter
│   │   │   ├── BranchNavigator (when viewing branch)
│   │   │   └── ConversationActions (••• dropdown)
│   │   │
│   │   ├── MessageList (virtualized)
│   │   │   ├── SystemContextCard (collapsible)
│   │   │   │   ├── ContextSummary
│   │   │   │   └── DocumentChips
│   │   │   ├── UserMessageCard[]
│   │   │   │   ├── Avatar
│   │   │   │   ├── AttachmentChips (conditional)
│   │   │   │   ├── MessageContent (Markdown)
│   │   │   │   ├── Timestamp
│   │   │   │   ├── EditButton
│   │   │   │   └── HoverActions (✏️ 🌿 📋 🗑️)
│   │   │   ├── AIMessageCard[]
│   │   │   │   ├── ModelBadge
│   │   │   │   ├── ReasoningBlock (collapsible)
│   │   │   │   ├── ToolCallBlock[] (collapsible)
│   │   │   │   ├── MessageContent (Markdown + syntax highlighting)
│   │   │   │   ├── TokenCount + Duration
│   │   │   │   ├── ActionBar (📋 👍 👎 🔄 🌿 🔊 📝 •••)
│   │   │   │   └── FollowUpSuggestions
│   │   │   ├── StreamingMessageCard (conditional)
│   │   │   │   ├── ModelBadge (pulsing)
│   │   │   │   ├── LiveContent
│   │   │   │   ├── BlinkingCursor
│   │   │   │   ├── TokenCounter (live)
│   │   │   │   ├── ElapsedTimer
│   │   │   │   └── StopButton
│   │   │   └── EmptyChat (suggestions when no messages)
│   │   │       └── PromptSuggestionCards[]
│   │   │
│   │   └── Composer (sticky bottom)
│   │       ├── AttachmentBar
│   │       │   └── AttachmentChip[]
│   │       ├── ContextSelectionBar
│   │       │   └── ContextChip[]
│   │       ├── PromptTextarea (auto-resize)
│   │       ├── @MentionPopup (conditional)
│   │       ├── /CommandPopup (conditional)
│   │       └── ComposerFooter
│   │           ├── AttachmentButton (📎)
│   │           ├── VoiceButton (🎤)
│   │           ├── OptimizeButton (✨)
│   │           ├── ModelIndicator
│   │           ├── TokenEstimator
│   │           └── SendButton (➤ / ⏹)
│   │
│   └── RightPanel (collapsible, 320px)
│       ├── ConversationInfo
│       ├── ContextDocuments
│       ├── ConversationTree
│       ├── PromptSuggestions
│       └── ExportActions
│
├── Dialogs
│   ├── ExportDialog
│   ├── SaveAsTemplateDialog
│   ├── SaveAsPromptDialog
│   ├── ConvertToPRDDialog
│   ├── ConvertToSRSDialog
│   ├── ModelCompareDialog
│   ├── BranchCreateDialog
│   └── DeleteConfirmDialog
│
└── Shared
    ├── MarkdownRenderer
    │   ├── SyntaxHighlighter (code blocks)
    │   └── Sanitizer
    ├── TokenCounter
    ├── ContextWindowMeter
    ├── HoverCard (tooltip on hover)
    └── EmptyState
```

---

_Document Version: 1.0 — PromptPilot AI Chat Workspace Specification_
_Last Updated: 2026-07-21_
_Status: Foundation built (adapters, PromptEngine, GenerationService, Prisma models, repository layer). Ready for frontend UI + SSE streaming integration._
