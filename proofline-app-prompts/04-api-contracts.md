# 04 — API Contracts

Produce:

- `docs/api/openapi.yaml`
- `docs/api/errors.yaml`
- `docs/events/event-schemas.yaml`

## Standard error envelope

```json
{
  "code": "string",
  "message": "string",
  "retryable": false,
  "retry_class": "none|immediate|backoff|manual",
  "details": {},
  "request_id": "uuid"
}
```

## Auth

- User session / API token for web and automation
- GitHub App installation token for GitHub calls (server-side only)
- Every mutation: authenticate → resolve tenant → authorize project scope

## Required operations

### Installations & projects

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/installations` | Link GitHub installation to org; idempotent on installation_id |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/{project_id}` | |
| POST | `/api/v1/projects/{project_id}/policies` | Create/update policy version |
| GET | `/api/v1/projects/{project_id}/repositories` | Connected repos |

### Verification

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/projects/{project_id}/verification-runs` | Manual trigger; returns run_id; async |
| GET | `/api/v1/verification-runs/{run_id}` | Status + summary |
| GET | `/api/v1/verification-runs/{run_id}/events` | Stream or list of run events |

### Passports

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/pull-requests/{pull_request_id}/passport` | Latest passport for PR |
| GET | `/api/v1/passports/{passport_id}` | Full passport |
| POST | `/api/v1/passports/{passport_id}/review` | Human decision; idempotent key required |
| POST | `/api/v1/passports/{passport_id}/reverify` | Enqueue new run; may expire old |
| GET | `/api/v1/passports/{passport_id}/export` | JSON export; plan-gated |

## Mutation requirements (each)

Document in OpenAPI:

- Authentication scheme
- Required scopes
- Tenant authorization
- Request schema
- Response schema
- Error codes
- Idempotency (header `Idempotency-Key` for POST review, installations, verification-runs)
- Concurrency (If-Match / version)
- Rate-limit class
- Long-running behavior (202 + run_id for verification)

## Review request body

```json
{
  "decision": "approve|request_changes|block|escalate",
  "rationale": "string|null",
  "reviewed_payload_hash": "sha256"
}
```

Server validates hash against current proposed commit payload, runs state machine, appends `HumanDecision`, writes audit.

## Webhooks (inbound GitHub)

- POST `/api/v1/github/webhooks`
- Verify signature
- Dedupe on `X-GitHub-Delivery`
- Respond 2xx quickly; process async via job

## Rate limits (MVP classes)

- `read` — generous
- `write` — moderate
- `verify` — costly; tied to usage metering
