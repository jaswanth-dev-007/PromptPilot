# PromptPilot — Enterprise Domain Model

## Phase 3.1.2 — Entity Relationship Architecture

---

## 1. ENTITY CATALOG

The core hierarchy is:

```
User → Workspace → Project → [ Documents, AI Conversations, Generations, Versions, Exports ]
```

### 1.1 User

**Purpose:** Identity and authentication. The atomic unit of access to the platform.

**Responsibilities:** Registration, login, logout, token management, profile management. Gate for all authorization.

**Owner:** Self (root entity)

**Lifecycle:** Created on registration. Active until explicit deactivation. Never hard-deleted.

**Primary Identifier:** `id` (UUID v7, time-ordered)

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `email` | String | ✅ | Unique, lowercase, trimmed |
| `passwordHash` | String | ✅ | bcrypt, 12 rounds |
| `name` | String | ✅ | Display name, 1–100 chars |
| `avatarUrl` | String | ❌ | Nullable |
| `role` | Enum | ✅ | `admin` \| `member`, default `member` |
| `isActive` | Boolean | ✅ | Default `true` |
| `lastLoginAt` | DateTime | ❌ | Updated on each login |
| `refreshTokenHash` | String | ❌ | SHA-256 of current refresh token |
| `createdAt` | DateTime | ✅ | Auto |
| `updatedAt` | DateTime | ✅ | Auto |

**Computed Fields:**
- `workspaceCount` — derived from Workspace.ownerId count
- `projectCount` — derived from Project.ownerId count (aggregate across workspaces)

**Validation Rules:**
- Email must match RFC 5322
- Email uniqueness enforced at DB level
- Password must be ≥ 8 characters (validated at API layer before hashing)
- `passwordHash` and `refreshTokenHash` must never appear in API responses

**Business Constraints:**
- Email is globally unique
- Only active users can authenticate
- `role` determines platform-level permissions (not workspace-level)

---

### 1.2 Workspace

**Purpose:** Multi-tenant boundary. Groups users, projects, and resources. Every user gets a "Personal" workspace automatically on registration.

**Responsibilities:** Tenant isolation, membership management, default settings inheritance.

**Owner:** User (workspace creator)

**Lifecycle:** Created on user registration (Personal workspace) or explicitly. Active until archived. Soft-deleted (archived), never hard-deleted.

**Primary Identifier:** `id` (UUID v7)

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `name` | String | ✅ | Display name |
| `slug` | String | ✅ | URL-safe, unique per owner |
| `ownerId` | UUID (FK → User) | ✅ | Creator, permanent admin |
| `type` | Enum | ✅ | `personal` \| `team` |
| `status` | Enum | ✅ | `active` \| `archived` |
| `settings` | JSON | ✅ | Default LLM config, theme, etc. |
| `createdAt` | DateTime | ✅ | Auto |
| `updatedAt` | DateTime | ✅ | Auto |

**Computed Fields:**
- `memberCount` — derived from WorkspaceMember count
- `projectCount` — derived from Project count in this workspace

**Validation Rules:**
- Slug must be unique per owner
- Owner cannot be removed from workspace
- Personal workspace cannot be deleted

**Business Constraints:**
- Exactly one personal workspace per user
- Team workspaces have no limit per user
- Slug format: `[a-z0-9-]+`

---

### 1.3 WorkspaceMember

**Purpose:** Membership junction between User and Workspace with role assignment.

**Owner:** Workspace

**Lifecycle:** Created on invitation acceptance or direct addition. Removed on member removal or workspace archival.

**Unique Constraint:** `(workspaceId, userId)` — one membership per user per workspace.

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `workspaceId` | UUID (FK → Workspace) | ✅ | |
| `userId` | UUID (FK → User) | ✅ | |
| `role` | Enum | ✅ | `admin` \| `editor` \| `viewer` |
| `joinedAt` | DateTime | ✅ | Auto |

---

### 1.4 Project

**Purpose:** Central organizing entity. Groups documents, conversations, generations, and exports into a single software specification effort.

**Responsibilities:** Project metadata, pipeline progress tracking, settings management. Container for all specification artifacts.

**Owner:** Workspace

**Lifecycle:** Created in a workspace. Active during specification development. Can be archived (soft-delete). Hard-delete cascades to all children.

**Primary Identifier:** `id` (UUID v7)

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `name` | String | ✅ | Display name |
| `slug` | String | ✅ | URL-safe, unique per workspace |
| `description` | String | ❌ | Optional |
| `workspaceId` | UUID (FK → Workspace) | ✅ | Parent workspace |
| `ownerId` | UUID (FK → User) | ✅ | Project creator |
| `status` | Enum | ✅ | `draft` \| `active` \| `completed` \| `archived` |
| `settings` | JSON | ✅ | Project-level LLM config overrides |
| `createdAt` | DateTime | ✅ | Auto |
| `updatedAt` | DateTime | ✅ | Auto |

**Computed Fields:**
- `documentCount` — derived
- `conversationCount` — derived
- `pipelineProgress` — derived from pipeline step completion status

**Validation Rules:**
- Slug must be unique within workspace
- Status transitions enforced: `draft` → `active` → `completed` → `archived`

---

### 1.5 Document

**Purpose:** Generated software engineering artifact. Maps to one pipeline step output (PRD, SRS, Architecture, etc.).

**Owner:** Project

**Lifecycle:** Created when a pipeline step completes generation. Immutable content; changes create new Versions. Deleted when project is hard-deleted. Soft-deletes supported.

**Primary Identifier:** `id` (UUID v7)

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `projectId` | UUID (FK → Project) | ✅ | Parent project |
| `stepId` | String | ✅ | Pipeline step ID (`prd`, `srs`, etc.) |
| `title` | String | ✅ | Human-readable title |
| `type` | Enum | ✅ | `master-context` \| `prd` \| `srs` \| `architecture` \| `database` \| `api-spec` \| `user-flows` \| `wireframes` \| `roadmap` |
| `content` | Text (Markdown) | ✅ | The generated artifact content |
| `status` | Enum | ✅ | `draft` \| `generated` \| `reviewed` \| `stale` |
| `version` | Integer | ✅ | Auto-incrementing, starts at 1 |
| `conversationId` | UUID (FK → AIConversation) | ✅ | The conversation that produced this document |
| `tokensUsed` | Integer | ❌ | Total tokens consumed |
| `modelUsed` | String | ❌ | LLM model identifier |
| `stale` | Boolean | ✅ | True if upstream artifact changed |
| `staleReason` | String | ❌ | Which dependency caused staleness |
| `createdAt` | DateTime | ✅ | Auto |
| `updatedAt` | DateTime | ✅ | Auto |

**Indexes:** `(projectId, stepId)` unique, `(projectId, type)`, `(conversationId)`

**Business Constraints:**
- One document per `(projectId, stepId)` per version
- Content is stored as raw Markdown text
- `stale` is computed when upstream document's `updatedAt` > this document's `createdAt`
- Document type must match a defined pipeline step

---

### 1.6 DocumentVersion

**Purpose:** Immutable snapshot of a document at a point in time. Enables version history, diff, and rollback.

**Owner:** Document

**Lifecycle:** Created on every document save/update. Immutable once created. Deleted when parent document is deleted.

**Primary Identifier:** `id` (UUID v7)

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `documentId` | UUID (FK → Document) | ✅ | Parent document |
| `versionNumber` | Integer | ✅ | Sequential per document |
| `content` | Text | ✅ | Snapshot of document content |
| `conversationId` | UUID | ❌ | Conversation that generated this version |
| `modelUsed` | String | ❌ | |
| `tokensUsed` | Integer | ❌ | |
| `createdAt` | DateTime | ✅ | Auto |

**Indexes:** `(documentId, versionNumber)` unique, `documentId`

---

### 1.7 AIConversation

**Purpose:** A single AI-driven pipeline execution context. Wraps one pipeline step's worth of LLM interactions. Contains the system prompt, user context, and all assistant responses.

**Owner:** Project

**Lifecycle:** Created when a pipeline step begins execution. Completed when generation finishes (all messages received). Archived with project.

**Primary Identifier:** `id` (UUID v7)

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `projectId` | UUID (FK → Project) | ✅ | Parent project |
| `stepId` | String | ✅ | Pipeline step ID |
| `status` | Enum | ✅ | `active` \| `completed` \| `failed` \| `cancelled` |
| `model` | String | ✅ | LLM model used |
| `temperature` | Float | ✅ | 0.0 – 2.0 |
| `maxTokens` | Integer | ✅ | Max completion tokens |
| `totalInputTokens` | Integer | ❌ | Aggregate across all messages |
| `totalOutputTokens` | Integer | ❌ | Aggregate |
| `totalCost` | Float | ❌ | Aggregate cost in USD |
| `startedAt` | DateTime | ❌ | |
| `completedAt` | DateTime | ❌ | |
| `createdAt` | DateTime | ✅ | Auto |
| `updatedAt` | DateTime | ✅ | Auto |

**Indexes:** `(projectId, stepId)`, `(projectId, status)`

---

### 1.8 Message

**Purpose:** Individual prompt/response pair within an AI conversation.

**Owner:** AIConversation

**Lifecycle:** Created during generation. Immutable once stored. Deleted with parent conversation.

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `conversationId` | UUID (FK → AIConversation) | ✅ | Parent conversation |
| `role` | Enum | ✅ | `system` \| `user` \| `assistant` |
| `content` | Text | ✅ | Raw message content |
| `tokens` | Integer | ❌ | Token count for this message |
| `sequence` | Integer | ✅ | Order within conversation |
| `createdAt` | DateTime | ✅ | Auto |

**Indexes:** `(conversationId, sequence)` unique

---

### 1.9 Generation

**Purpose:** A single LLM API call within a conversation. Records token usage and cost for that specific call.

**Owner:** AIConversation

**Lifecycle:** Created on each LLM API call. Immutable. Deleted with parent conversation.

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `conversationId` | UUID (FK → AIConversation) | ✅ | Parent conversation |
| `model` | String | ✅ | Model used for this call |
| `provider` | Enum | ✅ | `openai` \| `anthropic` \| `google` \| `ollama` |
| `promptTokens` | Integer | ✅ | Input tokens consumed |
| `completionTokens` | Integer | ✅ | Output tokens generated |
| `totalTokens` | Integer | ✅ | Computed: prompt + completion |
| `cost` | Float | ✅ | Computed from pricing table |
| `durationMs` | Integer | ✅ | API call wall time |
| `status` | Enum | ✅ | `success` \| `failed` \| `retried` |
| `errorMessage` | String | ❌ | If failed |
| `createdAt` | DateTime | ✅ | Auto |

**Indexes:** `(conversationId)`, `(userId)` (denormalized from conversation → project → workspace → user for aggregation queries)

---

### 1.10 Export

**Purpose:** Transform one or more documents into an external format for sharing.

**Owner:** Project

**Lifecycle:** Created on export request. File URL expires after 7 days. Deleted with parent project.

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `projectId` | UUID (FK → Project) | ✅ | Parent project |
| `format` | Enum | ✅ | `pdf` \| `markdown` \| `html` \| `docx` |
| `status` | Enum | ✅ | `pending` \| `processing` \| `completed` \| `failed` |
| `fileUrl` | String | ❌ | S3/GCS signed URL |
| `fileSize` | Integer | ❌ | Bytes |
| `documentIds` | JSON Array | ✅ | Which documents were exported |
| `createdAt` | DateTime | ✅ | Auto |
| `expiresAt` | DateTime | ✅ | 7 days from creation |

---

### 1.11 Notification

**Purpose:** In-app notification for pipeline events, workspace changes, and system alerts.

**Owner:** User

**Lifecycle:** Created on event. Marked read. Auto-archived after 30 days.

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `userId` | UUID (FK → User) | ✅ | Recipient |
| `type` | Enum | ✅ | Event type |
| `title` | String | ✅ | |
| `body` | String | ✅ | |
| `read` | Boolean | ✅ | Default false |
| `projectId` | UUID | ❌ | Optional reference |
| `createdAt` | DateTime | ✅ | Auto |

**Notification Types:** `pipeline_completed`, `generation_failed`, `member_invited`, `document_reviewed`, `export_completed`

---

### 1.12 APIKey

**Purpose:** Programmatic access token for CI/CD or external integrations.

**Owner:** Workspace

**Lifecycle:** Created by workspace admin. Revocable. Never hard-deleted (retained for audit).

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID v7 | ✅ | Primary key |
| `workspaceId` | UUID (FK → Workspace) | ✅ | |
| `name` | String | ✅ | Label for management |
| `keyHash` | String | ✅ | SHA-256 of the key |
| `prefix` | String | ✅ | First 8 chars for display |
| `lastUsedAt` | DateTime | ❌ | |
| `expiresAt` | DateTime | ❌ | |
| `revokedAt` | DateTime | ❌ | |
| `createdAt` | DateTime | ✅ | Auto |

---

## 2. RELATIONSHIP CATALOG

### 2.1 Ownership Relationships (Composition)

| Parent | Child | Type | Cascade Delete |
|--------|-------|------|---------------|
| User | Workspace (personal) | 1:1 | No (archived) |
| User | Workspace (team) | 1:N | No (archived) |
| Workspace | Project | 1:N | Yes (cascade) |
| Project | Document | 1:N | Yes (cascade) |
| Project | AIConversation | 1:N | Yes (cascade) |
| Document | DocumentVersion | 1:N | Yes (cascade) |
| AIConversation | Message | 1:N | Yes (cascade) |
| AIConversation | Generation | 1:N | Yes (cascade) |
| Project | Export | 1:N | Yes (cascade) |
| User | Notification | 1:N | Yes (cascade) |
| Workspace | APIKey | 1:N | Yes (cascade) |

### 2.2 Membership Relationships (Aggregation)

| Left | Right | Bridge | Type |
|------|-------|--------|------|
| User | Workspace | WorkspaceMember | M:N (via bridge) |

### 2.3 Reference Relationships

| Source | Target | Type | Notes |
|--------|--------|------|-------|
| Project.`ownerId` | User | N:1 | Creator, may differ from workspace owner |
| Document.`conversationId` | AIConversation | N:1 | The conversation that produced this document |
| Generation.`conversationId` | AIConversation | N:1 | Parent conversation |
| Export.`projectId` | Project | N:1 | Parent project |

### 2.4 Delete Behavior

| Action | Rule |
|--------|------|
| Delete User | Archive workspaces, preserve data |
| Delete Workspace | Cascade-archive all projects |
| Delete Project | Cascade-delete all documents, conversations, generations, exports |
| Delete Document | Cascade-delete all versions |
| Delete AIConversation | Cascade-delete all messages and generations |

---

## 3. AGGREGATE CATALOG

### Aggregate 1: User

```
User (Aggregate Root)
├── Notification[]
```

**Transaction Boundary:** User profile updates, notification creation.  
**Consistency:** Email uniqueness is transactional. Notifications are eventually consistent.

### Aggregate 2: Workspace

```
Workspace (Aggregate Root)
├── WorkspaceMember[]
├── Project[]
└── APIKey[]
```

**Transaction Boundary:** Workspace creation, renaming, member management, API key creation.  
**Consistency:** Slug uniqueness per owner is transactional. Member count is eventually consistent.

### Aggregate 3: Project

```
Project (Aggregate Root)
├── Document[]
│   └── DocumentVersion[]
├── AIConversation[]
│   ├── Message[]
│   └── Generation[]
└── Export[]
```

**Transaction Boundary:** Everything inside a project is a single consistency boundary. Pipeline execution is transactional within a step.  
**Consistency:** Step ordering within a pipeline must be consistent. Document staleness is computed.

### Aggregate 4: Document

```
Document (Aggregate Root)
└── DocumentVersion[]
```

**Transaction Boundary:** Document update + version creation is atomic.  
**Consistency:** Version numbers are sequential and monotonic within a document.

### Aggregate 5: AIConversation

```
AIConversation (Aggregate Root)
├── Message[]
└── Generation[]
```

**Transaction Boundary:** Message append + generation record creation is atomic per API call.  
**Consistency:** Message sequence numbers are sequential.

---

## 4. VALUE OBJECT CATALOG

| Value Object | Attributes | Used By |
|-------------|-----------|---------|
| `Email` | address (string) — validated, lowercased, trimmed | User |
| `Slug` | value (string) — `[a-z0-9-]+`, unique within scope | Workspace, Project |
| `DocumentType` | Enum: `master-context` \| `prd` \| `srs` \| `architecture` \| `database` \| `api-spec` \| `user-flows` \| `wireframes` \| `roadmap` | Document |
| `PipelineStepId` | String identifier matching manifest step IDs | Document, AIConversation |
| `WorkspaceRole` | Enum: `admin` \| `editor` \| `viewer` | WorkspaceMember |
| `ProjectStatus` | Enum: `draft` \| `active` \| `completed` \| `archived` | Project |
| `DocumentStatus` | Enum: `draft` \| `generated` \| `reviewed` \| `stale` | Document |
| `ConversationStatus` | Enum: `active` \| `completed` \| `failed` \| `cancelled` | AIConversation |
| `GenerationStatus` | Enum: `success` \| `failed` \| `retried` | Generation |
| `ExportFormat` | Enum: `pdf` \| `markdown` \| `html` \| `docx` | Export |
| `ExportStatus` | Enum: `pending` \| `processing` \| `completed` \| `failed` | Export |
| `LLMProvider` | Enum: `openai` \| `anthropic` \| `google` \| `ollama` | Generation |
| `TokenUsage` | promptTokens + completionTokens + totalTokens | Generation |
| `Cost` | amount (Float) + currency (default "USD") | Generation, AIConversation |
| `NotificationType` | Enum: `pipeline_completed` \| `generation_failed` \| `member_invited` \| `document_reviewed` \| `export_completed` | Notification |
| `WorkspaceSettings` | defaultModel, defaultTemperature, defaultMaxTokens | Workspace |
| `ProjectSettings` | overrides for model, temperature, maxTokens | Project |

---

## 5. DOMAIN EVENTS CATALOG

| Event | Producer | Consumers |
|-------|----------|-----------|
| `UserRegistered` | User aggregate | Notification service (welcome) |
| `UserLoggedIn` | User aggregate | Audit log |
| `WorkspaceCreated` | Workspace aggregate | Project creation (auto-create first project) |
| `MemberAdded` | Workspace aggregate | Notification (member invited) |
| `MemberRemoved` | Workspace aggregate | Authorization (revoke access) |
| `ProjectCreated` | Project aggregate | Pipeline initialization |
| `PipelineStarted` | Project aggregate | UI (show progress) |
| `StepStarted` | AIConversation aggregate | UI (show current step) |
| `GenerationCompleted` | Generation (within AIConversation) | Usage tracker, Notification |
| `GenerationFailed` | Generation | Notification (alert user) |
| `DocumentGenerated` | Document aggregate | Pipeline (check for next step), Notification |
| `DocumentMarkedStale` | Document aggregate | Pipeline (flag affected steps) |
| `PipelineCompleted` | Project aggregate | Project status update, Notification, Export trigger |
| `ExportCompleted` | Export aggregate | Notification (download ready) |

---

## 6. ENTITY RELATIONSHIP DIAGRAM (Text)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  User ────────owns────────▶ Workspace ────────contains─────▶ Project │
│   │                              │                               │    │
│   │ (1:N)                        │ (1:N)                         │    │
│   ▼                              ▼                               │    │
│  Notification               WorkspaceMember              ┌───────┼───────┐
│                             (User↔Workspace bridge)      │       │       │
│                                                          ▼       ▼       ▼
│                                                     Document  AIConv  Export
│                                                         │        │
│                                                         │ (1:N)   │ (1:N)
│                                                         ▼         ▼
│                                                   DocVersion  Message
│                                                                  │
│                                                                  │ (1:N)
│                                                                  ▼
│                                                              Generation
│
│  Workspace ─────────owns────────▶ APIKey (1:N)
│
└──────────────────────────────────────────────────────────────────────┘
```

### Cardinality Summary

| Relationship | Type | Cardinality |
|-------------|------|-------------|
| User → Workspace | 1:N | One user can own many workspaces |
| User → Notification | 1:N | One user has many notifications |
| User ↔ Workspace (membership) | M:N | Via WorkspaceMember bridge |
| Workspace → WorkspaceMember | 1:N | One workspace has many members |
| Workspace → Project | 1:N | One workspace contains many projects |
| Workspace → APIKey | 1:N | One workspace has many API keys |
| Project → Document | 1:N | One project has up to 9 documents (one per step) |
| Project → AIConversation | 1:N | One project has many conversations |
| Project → Export | 1:N | One project has many exports |
| Document → DocumentVersion | 1:N | One document has many versions |
| AIConversation → Message | 1:N | One conversation has many messages |
| AIConversation → Generation | 1:N | One conversation has many generations |
| Message → Message | 1:N (self-ref) | Messages can form chains (threading, future) |

---

## 7. MERMAID ER DIAGRAM

```mermaid
erDiagram
    User ||--o{ Workspace : owns
    User ||--o{ Notification : receives
    User ||--o{ WorkspaceMember : is
    Workspace ||--o{ WorkspaceMember : has
    Workspace ||--o{ Project : contains
    Workspace ||--o{ APIKey : has
    Project ||--o{ Document : generates
    Project ||--o{ AIConversation : runs
    Project ||--o{ Export : produces
    Document ||--o{ DocumentVersion : versions
    Document }o--|| AIConversation : "produced by"
    AIConversation ||--o{ Message : contains
    AIConversation ||--o{ Generation : records

    User {
        uuid id PK
        string email UK
        string passwordHash
        string name
        string role
        boolean isActive
        datetime lastLoginAt
        datetime createdAt
        datetime updatedAt
    }

    Workspace {
        uuid id PK
        string name
        string slug
        uuid ownerId FK
        enum type
        enum status
        json settings
        datetime createdAt
        datetime updatedAt
    }

    WorkspaceMember {
        uuid id PK
        uuid workspaceId FK
        uuid userId FK
        enum role
        datetime joinedAt
    }

    Project {
        uuid id PK
        string name
        string slug
        uuid workspaceId FK
        uuid ownerId FK
        enum status
        json settings
        datetime createdAt
        datetime updatedAt
    }

    Document {
        uuid id PK
        uuid projectId FK
        string stepId
        string title
        enum type
        text content
        enum status
        int version
        uuid conversationId FK
        int tokensUsed
        string modelUsed
        boolean stale
        datetime createdAt
        datetime updatedAt
    }

    DocumentVersion {
        uuid id PK
        uuid documentId FK
        int versionNumber
        text content
        datetime createdAt
    }

    AIConversation {
        uuid id PK
        uuid projectId FK
        string stepId
        enum status
        string model
        float temperature
        int maxTokens
        int totalInputTokens
        int totalOutputTokens
        float totalCost
        datetime startedAt
        datetime completedAt
        datetime createdAt
    }

    Message {
        uuid id PK
        uuid conversationId FK
        enum role
        text content
        int tokens
        int sequence
        datetime createdAt
    }

    Generation {
        uuid id PK
        uuid conversationId FK
        string model
        enum provider
        int promptTokens
        int completionTokens
        int totalTokens
        float cost
        int durationMs
        enum status
        datetime createdAt
    }

    Export {
        uuid id PK
        uuid projectId FK
        enum format
        enum status
        string fileUrl
        int fileSize
        json documentIds
        datetime createdAt
        datetime expiresAt
    }

    Notification {
        uuid id PK
        uuid userId FK
        enum type
        string title
        string body
        boolean read
        uuid projectId
        datetime createdAt
    }

    APIKey {
        uuid id PK
        uuid workspaceId FK
        string name
        string keyHash
        string prefix
        datetime lastUsedAt
        datetime expiresAt
        datetime revokedAt
        datetime createdAt
    }
```

---

## 8. DATABASE NORMALIZATION REVIEW

### 1NF — First Normal Form ✅

All columns contain atomic values. No repeating groups. `WorkspaceMember` properly extracted as a junction table instead of embedding `members[]` in Workspace. `Export.documentIds` is a JSON array (acceptable for this use case as the IDs are not queried individually).

### 2NF — Second Normal Form ✅

No partial dependencies. Every non-key attribute depends on the full primary key. `keyHash` and `prefix` both depend on the full `id` of APIKey.

### 3NF — Third Normal Form ✅

No transitive dependencies. `Document.type` does not derive from `Document.stepId` — they store different concepts (the step identifier vs the document category). `Generation.cost` is computed from `promptTokens` + `completionTokens` × pricing table, but stored as a denormalized computed field for query performance (acceptable trade-off).

### BCNF — Boyce-Codd Normal Form ✅

All determinants are candidate keys. The `(workspaceId, slug)` unique constraint on Project does not violate BCNF because `slug` is not a determinant of any other attribute.

### Denormalization Decisions

| Field | Reason |
|-------|--------|
| `Generation.totalTokens` | Computed from promptTokens + completionTokens — stored for fast aggregation queries |
| `Generation.cost` | Computed from totalTokens × pricing — stored to avoid pricing table recalculation |
| `AIConversation.totalInputTokens` | Aggregate of Message.tokens (role=user) — stored for dashboard display |
| `AIConversation.totalCost` | Aggregate of Generation.cost — stored for dashboard display |
| `Export.documentIds` | JSON array — not normalized; acceptable since IDs are not queried individually in WHERE clauses |

---

## 9. SCALABILITY REVIEW

| Scale | Strategy | Changes Required |
|-------|----------|-----------------|
| 10 users | Single PostgreSQL instance | None |
| 100 users | Connection pooling (PgBouncer) | Config change only |
| 1,000 users | Read replicas for analytics queries | Add replica, route dashboard queries to replica |
| 10,000 users | Shard by Workspace (tenant ID) | Application-level routing, partitioned by workspaceId |
| 100,000 users | Message table grows fastest — partition by `conversationId` hash | Table partitioning, archiving old conversations |
| 1M users | Microservice extraction (Generation → dedicated service) | Separate Generation DB, event-driven sync |

### Hot Paths (optimize first)

1. **Message insertion** — every streaming LLM chunk writes a message. Write-heavy. Use batch inserts.
2. **Generation aggregation** — `SUM(tokens)`, `SUM(cost)` GROUP BY project for dashboards. Use materialized views or Redis cache.
3. **Document staleness check** — compares `updatedAt` across pipeline steps. Compute on read, cache the result.

---

## 10. ARCHITECTURE RECOMMENDATIONS

1. **UUID v7 as primary key for every entity.** Time-ordered, globally unique, no sequential guessability. Enables horizontal sharding later.

2. **Workspace is the tenant boundary.** Every query must filter by `workspaceId` (either directly or joined through Project). This makes multi-tenancy correct from day one.

3. **Documents are the canonical output.** Documents always come from AIConversations. No document exists without a conversation. This traceability is critical for audit.

4. **Message sequence ordering is essential.** Every Message has a `sequence` integer. This enables replay, streaming reconstruction, and conversation display.

5. **Versions are append-only.** Never update a DocumentVersion after creation. This ensures audit trail integrity. The `Document.content` field shows the latest; `DocumentVersion.content` shows history.

6. **Soft-delete everything.** Add `deletedAt` to all entities if regulatory compliance requires data retention. Cascade-archive, never cascade-delete.

7. **Notification and Export are deferred to Phase 4.** The MVP needs User, Workspace, Project, Document, AIConversation, Message, and Generation. The remaining 4 entities can be added without schema migration impact.

---

## 11. PRODUCTION READINESS REPORT

| Criterion | Status |
|-----------|--------|
| Entity completeness | ✅ 12 entities defined |
| Relationship clarity | ✅ All 16 relationships documented with cardinality |
| Aggregate boundaries | ✅ 5 aggregate roots with transaction boundaries |
| Value objects | ✅ 16 reusable value objects |
| Domain events | ✅ 14 events with producer/consumer mapping |
| Normalization | ✅ 3NF/BCNF compliant with justified denormalization |
| Scalability path | ✅ Documented from 10 to 1M users |
| Index strategy | ✅ Documented per entity |
| Cascade behavior | ✅ Clear delete/archive rules |
| UUID v7 PKs | ✅ Time-ordered, shardable |
| No circular deps | ✅ Strict tree from User → Workspace → Project → children |

**The domain model is ready for Phase 3.1.3 — Prisma Schema Design.**
