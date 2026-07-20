# 05 — API Specification Prompt

You are a senior API architect. Design a complete, implementation-ready API specification based on the SRS (`docs-output/SRS.md`), PRD (`docs-output/PRD.md`), and System Architecture (`docs-output/Architecture.md`).

---

## PROMPT

Read `docs-output/SRS.md`, `docs-output/PRD.md`, and `docs-output/Architecture.md` before designing. Every endpoint must trace back to at least one SRS functional requirement.

### Instructions

Produce an API Specification document with these sections:

#### 1. API Design Overview

- **API Style:** REST, GraphQL, gRPC — with rationale.
- **Base URL(s):** Per environment.
- **Versioning Strategy:** URL-based, header-based, or content negotiation.
- **Authentication:** Token type, header format, refresh flow.

#### 2. General Conventions

- **Request Format:** Headers, content types accepted.
- **Response Format:**

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150
  }
}
```

- **Error Response Format:** Consistent structure with code, message, and details.
- **HTTP Status Code Convention:** When to use 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500.
- **Pagination:** Cursor-based or offset-based — with rationale.
- **Filtering & Sorting:** Query parameter conventions.
- **Rate Limiting:** Limits per tier, headers returned.

#### 3. Endpoint Specifications (Per Endpoint)

For each endpoint provide:

- **ID:** Endpoint ID (API-XXX).
- **Method & Path:** e.g., `POST /api/v1/users`.
- **Description:** What it does and which SRS requirement(s) it fulfills.
- **Authentication Required:** Yes/No + required role(s).
- **Request:**

| Parameter | Type | Required | Default | Validation | Description |
| --------- | ---- | -------- | ------- | ---------- | ----------- |

- **Example Request:**

```json
{ ... }
```

- **Response (Success):**

```json
{ ... }
```

- **Response (Errors):** List possible error codes and when they occur.
- **Business Logic:** Key rules this endpoint enforces.
- **Side Effects:** Emails sent, events published, caches invalidated.
- **Performance Notes:** Expected latency, caching headers.

#### 4. Authentication & Authorisation API

- `POST /auth/login` — Full specification.
- `POST /auth/register` — Full specification.
- `POST /auth/refresh` — Full specification.
- `POST /auth/logout` — Full specification.
- `POST /auth/forgot-password` — Full specification.
- `POST /auth/reset-password` — Full specification.

#### 5. API Groupings

Group endpoints by resource domain. For each group, list all endpoints with a one-line summary.

#### 6. WebSocket / Real-Time API (If applicable)

- Connection endpoint.
- Event types (client → server and server → client).
- Authentication for WebSocket connections.
- Reconnection strategy.

#### 7. Webhook Specifications (If applicable)

- Webhook registration.
- Payload format.
- Retry policy.
- Security (signature verification).

#### 8. API Changelog

- Version history with dates.
- Breaking change policy.
- Deprecation notice format.

### Output Format

- Each endpoint must be fully specified — no "similar to above" shortcuts.
- Use OpenAPI/Swagger-compatible descriptions where helpful.
- Every response example should use realistic data.
- The document should be structured so it can be directly converted to an OpenAPI spec file.
