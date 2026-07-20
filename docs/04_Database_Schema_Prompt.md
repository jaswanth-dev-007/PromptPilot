# 04 — Database Schema Prompt

You are a senior database architect. Based on the SRS (`docs-output/SRS.md`), PRD (`docs-output/PRD.md`), and System Architecture (`docs-output/Architecture.md`), design a complete database schema ready for migration scripts.

---

## PROMPT

Read `docs-output/SRS.md`, `docs-output/PRD.md`, and `docs-output/Architecture.md` before designing. Your schema must align with the data requirements and architecture decisions in those documents.

### Instructions

Produce a Database Schema document with these sections:

#### 1. Database Technology Selection

- **Primary Database:** Type (PostgreSQL, MongoDB, etc.) and version — with rationale tied to data patterns from the SRS.
- **Cache Database:** Redis, Memcached, etc.
- **Special-Purpose Stores:** Search index, time-series, blob storage, etc.

#### 2. Entity Overview

List every entity (table/collection) as a table with columns: **Entity | Description | Estimated Record Count | Growth Rate | Storage Engine (if applicable)** .

#### 3. Detailed Schema (Per Entity)

For each entity provide:

- **Table/Collection Name.**
- **Description:** What this entity represents.
- **Columns/Fields** as a table:

| Column | Type | Constraints | Default | Description | Indexed? |

- **Primary Key:** Field(s) and rationale.
- **Foreign Keys:** Referenced entity, cascading behaviour.
- **Indexes:** Name, columns, type (B-tree, Hash, GIN, etc.), and the query pattern it serves.
- **Constraints:** UNIQUE, CHECK, NOT NULL — with business rule explanation.
- **Partitioning Strategy:** If applicable.

#### 4. Relationship Diagram

Describe the entity relationships:

- One-to-one, one-to-many, many-to-many relationships.
- Describe in text using format: `EntityA --(1..N)--> EntityB` with a brief note on the relationship.

#### 5. Data Types & Enums

- Define all custom enums with valid values.
- Define any composite types or JSONB schema shape expectations.

#### 6. Migration Strategy

- **Versioning:** How migrations are tracked and applied.
- **Rollback Plan:** How to safely revert a migration.
- **Zero-Downtime Migrations:** Strategy for schema changes in production.
- **Seed Data:** What reference data must exist before the app starts.

#### 7. Query Patterns & Performance

List the top 10 most frequent or performance-critical queries:

- Query description (what it fetches).
- SQL/pseudo-query.
- Expected frequency.
- Indexes relied on.
- Expected response time.

#### 8. Data Retention & Archival

- Retention policies per entity.
- Archival strategy for cold data.
- GDPR / data deletion compliance procedures.

#### 9. Backup & Recovery

- Backup frequency and type (full, incremental, WAL).
- Retention period for backups.
- Recovery procedure (step-by-step).
- RPO/RTO baseline.

#### 10. Sample Queries / Seed Script

- Example INSERT statements for each entity.
- A realistic dataset showing how entities relate.

### Output Format

- Full DDL for each table in the target database SQL dialect.
- Use markdown code blocks with syntax highlighting.
- Every design choice must reference the SRS requirement or architecture decision that drove it.
