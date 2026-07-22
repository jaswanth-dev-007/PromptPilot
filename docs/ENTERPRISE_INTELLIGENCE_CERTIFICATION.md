# PromptPilot — Enterprise Intelligence Certification

## Platform Status — July 2026

## What Exists

Every data point requested is already captured in production — not designed, not planned. **Built.**

| Intelligence Domain   | Data Source                                                            | Status                                |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| Token Usage           | `Generation.promptTokens` + `completionTokens`                         | Captured per API call                 |
| Cost Analysis         | `Generation.cost` × per-model pricing from `tokens.ts`                 | Captured per API call                 |
| Model Usage           | `Generation.model` + `Generation.provider`                             | Captured per API call                 |
| Latency               | `Generation.durationMs`                                                | Captured per API call                 |
| Success Rate          | `Generation.status` = SUCCESS / FAILED / RETRIED                       | Captured per API call                 |
| Project Aggregation   | `aggregateByProject()` — SUM tokens + cost + count                     | Queryable now                         |
| Pipeline Summary      | `PipelineResult` — completedSteps, failedSteps, totalTokens, totalCost | Returned per run                      |
| Conversation Tracking | `AIConversation.totalInputTokens` / `totalOutputTokens` / `totalCost`  | Incremented per generation            |
| Per-Request Logging   | `request-logger.ts` — method, url, status, duration                    | Logged per request                    |
| Knowledge Graph       | 9-node dependency DAG with transitive staleness detection              | Built + running                       |
| Audit Trail           | `AuditEntry` Prisma model (designed)                                   | Ready for migration                   |
| Forecasting           | Not built                                                              | Data exists, ML model not implemented |

## What's Needed

These domains don't need architecture documents. They need database queries and frontend dashboards.

| Need                 | Solution                                                                     | Effort  |
| -------------------- | ---------------------------------------------------------------------------- | ------- |
| Usage dashboard      | `SELECT SUM(tokens), SUM(cost) FROM generations GROUP BY DATE(createdAt)`    | 1 query |
| Per-model comparison | `SELECT model, SUM(tokens), AVG(durationMs) FROM generations GROUP BY model` | 1 query |
| Success rate         | `SELECT COUNT(CASE WHEN status='SUCCESS') / COUNT(*) FROM generations`       | 1 query |
| Forecasting          | ML model is Phase 7 — data collection exists, model doesn't                  | Weeks   |
| Reporting            | Export queries to CSV/PDF/JSON — no pipeline exists                          | Days    |

## Final Decision

**Phase 8.0 is authorized but the bottleneck is not architecture.** The data capture layer is complete. The query layer doesn't exist yet. Phase 8.0 implementation means building analytics endpoints and dashboards — not designing more architecture. Architecture design for this domain is complete.
