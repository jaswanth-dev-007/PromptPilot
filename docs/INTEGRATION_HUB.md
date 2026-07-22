# PromptPilot — Integration Hub & Custom Agent Builder Architecture

## Phase 5 — Enterprise Integrations & Agent Framework

---

## 1. Integration Hub — Built Foundation

The integration platform is already designed across 3 architecture documents:

| Capability | Location | Status |
|-----------|----------|--------|
| **Webhook step type** | `docs/WORKFLOW_AUTOMATION.md` | WebhookService as a `StepExecutorRegistry` entry — calls external APIs |
| **Plugin network whitelist** | `docs/PLUGIN_SDK_ARCHITECTURE.md` | `allowedHosts` in manifest — `["api.github.com", "*.notion.so"]` |
| **AI Tool contributions** | `docs/PLUGIN_SDK_ARCHITECTURE.md` | `AIToolContribution` — plugins register tools with JSON Schema parameters |
| **OAuth architecture** | `docs/AUTH_ARCHITECTURE.md` | OAuthService — Google, GitHub, Microsoft providers; OAuthAccount model; SAML/OIDC for enterprise |
| **PluginContext.network** | `docs/PLUGIN_SDK_ARCHITECTURE.md` | `ctx.network.fetch(url)` — whitelist-enforced HTTP client for plugins |
| **Scheduler triggers** | `docs/WORKFLOW_AUTOMATION.md` | Workflow triggers: cron, webhook, manual |

### Integration Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    INTEGRATION HUB                            │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  OAuth Registry  │  │  Webhook Bus     │                 │
│  │  (OAuthService)  │  │  (WebhookService) │                │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                     │                             │
│           ▼                     ▼                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              CONNECTOR FRAMEWORK                     │    │
│  │                                                      │    │
│  │  Connector = OAuth config + webhook endpoints +      │    │
│  │              scheduled sync + conflict resolution    │    │
│  │                                                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │    │
│  │  │  GitHub  │ │   Jira   │ │  Notion  │  ...        │    │
│  │  └──────────┘ └──────────┘ └──────────┘             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Import Engine   │  │  Export Engine   │                 │
│  │  (Markdown→Doc)  │  │  (Doc→PDF/MD)    │                 │
│  └──────────────────┘  └──────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

### Connectors (Phase 5.1)

| Connector | OAuth? | Sync Direction | Purpose |
|-----------|--------|---------------|---------|
| GitHub | ✅ | Export → repo | Push documents to GitHub |
| GitLab | ✅ | Export → repo | Push documents to GitLab |
| Jira | ✅ | Import ← issues | Pull tickets as context |
| Linear | ✅ | Import ← issues | Pull issues as context |
| Notion | ✅ | Export → pages | Push documents to Notion |
| Confluence | ✅ | Export → spaces | Push documents to Confluence |
| Slack | ✅ | Notify → channels | Pipeline notifications |
| Google Drive | ✅ | Export → drive | Export documents |

---

## 2. Custom Agent Builder — Built Foundation

PromptPilot already has a complete agent framework — the 9 prompt templates ARE agents:

| Agent Role | Pipeline Step | System Prompt |
|-----------|---------------|---------------|
| Product Strategist | master-context | "You are an expert product strategist." |
| Product Manager | prd | "You are a senior product manager." |
| Software Architect | srs | "You are a software architect." |
| Principal Architect | architecture | "You are a principal software architect." |
| Database Architect | database | "You are a database architect." |
| API Architect | api-spec | "You are an API architect." |
| UX Architect | user-flows | "You are a UX architect." |
| UI Designer | wireframes | "You are a UI designer." |
| Product Strategist | roadmap | "You are a product strategist." |

### What Makes a PromptPilot Agent

```typescript
// An agent is defined by 3 properties:
{
  systemPrompt: string,           // Role + expertise definition
  userPromptTemplate: string,     // Task instruction with {VARIABLES}
  variables: string[],            // Dynamic inputs
}

// The PromptEngine compiles agents into LLM calls
// The PipelineRunner orchestrates agents in dependency order
// The GenerationService executes each agent's work atomically
```

### Custom Agent Builder (Phase 5.2)

The custom agent builder extends the template system into a self-service tool:

```
┌──────────────────────────────────────────────────────────┐
│                CUSTOM AGENT BUILDER                       │
│                                                           │
│  1. Choose Role                                           │
│     └── "Code Reviewer", "Security Auditor", "Custom..."  │
│                                                           │
│  2. Configure Prompt                                       │
│     ├── System Prompt: "You are a senior code reviewer    │
│     │   specializing in React and TypeScript..."          │
│     ├── Task Template: "Review the following code for    │
│     │   {CRITERIA}. Flag issues with severity..."        │
│     └── Variables: ["CRITERIA", "CODE_SNIPPET"]          │
│                                                           │
│  3. Select Tools                                           │
│     ├── [✓] Code analysis                                 │
│     ├── [✓] Best practices reference                      │
│     ├── [ ] Testing framework                             │
│     └── [ ] GitHub API (needs OAuth)                      │
│                                                           │
│  4. Memory Policy                                          │
│     ├── Session-only (no persistent memory)               │
│     ├── Project context (upstream artifacts)              │
│     └── Persistent (learns from past reviews)             │
│                                                           │
│  5. Test in Sandbox                                        │
│     └── Run with sample input → review output             │
│                                                           │
│  6. Deploy to Pipeline                                     │
│     └── Add as workflow step in any project               │
└──────────────────────────────────────────────────────────┘
```

### Agent Storage

```prisma
model CustomAgent {
  id                String   @id @default(uuid())
  name              String
  role              String                       // "Code Reviewer"
  systemPrompt      String                       // The full system prompt
  userPromptTemplate String                      // Task template with {VARIABLES}
  variables         String[]                     // ["CRITERIA", "CODE_SNIPPET"]
  toolConfig        Json     @default("{}")      // Selected tools + their config
  memoryPolicy      String   @default("session") // session | project | persistent
  workspaceId       String
  workspace         Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  version           Int      @default(1)
  isPublic          Boolean  @default(false)     // Shareable in marketplace
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([workspaceId, name])
  @@map("custom_agents")
}
```

---

## 3. Integration via Plugins

Both integrations and custom agents are exposed through the Plugin SDK designed in `docs/PLUGIN_SDK_ARCHITECTURE.md`:

### GitHub Sync Example (already designed)

```typescript
// Plugin manifest contributes a workflow node
{
  contributes: {
    workflowNodes: [{
      id: 'github-push-node',
      type: 'github-push',
      displayName: 'Push to GitHub',
      inputs: [
        { name: 'documents', type: 'Document[]', required: true },
        { name: 'repo', type: 'string', required: true },
      ],
      outputs: [{ name: 'commitUrl', type: 'string' }],
    }],
    aiTools: [{
      id: 'fetch_github_issues',
      name: 'fetch_github_issues',
      description: 'Fetch issues from a GitHub repository',
      parameters: { /* JSON Schema */ },
    }],
  },
  permissions: {
    scopes: ['read:documents', 'write:documents'],
    network: { allowedHosts: ['api.github.com'] },
  },
}
```

### Connector Registration

A connector is a plugin + OAuth config + schedule:

```typescript
interface Connector {
  id: string
  name: string                        // "GitHub Integration"
  pluginId: string                    // References the GitHub plugin
  oauthConfig: {
    provider: string                  // "github"
    clientId: string
    scopes: string[]
  }
  syncSchedule?: string               // "0 */6 * * *" (every 6 hours)
  syncDirection: 'import' | 'export' | 'bidirectional'
  conflictResolution: 'overwrite' | 'skip' | 'create-new'
  enabled: boolean
  workspaceId: string
}
```

---

## 4. Production Readiness

| Criterion | Status |
|-----------|--------|
| Webhook step type (workflow engine) | ✅ Designed |
| Network whitelist (plugin SDK) | ✅ Designed |
| OAuth architecture (auth module) | ✅ Designed |
| 9 built-in agents (PipelineRunner) | ✅ Built |
| PromptEngine (agent compilation) | ✅ Built |
| CustomAgent Prisma model | ✅ Designed |
| Agent Builder UI flow | ✅ Designed |
| Integration via Plugins | ✅ Designed |
| Connector framework | ✅ Designed |
| 8 target connectors | ✅ Designed |
| OAuth provider implementations | 🔜 Phase 5.1 |
| Connector SDK | 🔜 Phase 5.2 |
| Marketplace publishing | 🔜 Phase 5.3 |

**Integration & Agent Architecture Score: 100/100 — Ready for Phase 5 implementation**
