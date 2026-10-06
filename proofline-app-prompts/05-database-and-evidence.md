# 05 — Database & Evidence Storage

## Engine

PostgreSQL (production reference). Migrations from empty and from previous versions must pass.

## Required tables (MVP)

```text
organizations
users
memberships
projects
repositories
policies
pull_requests
passports
verification_runs
verification_results
skills
skill_versions
evidence_artifacts
human_decisions
usage_records
idempotency_records
outbox_events
job_leases
audit_events
retention_items
github_webhook_deliveries   -- dedupe
```

## Rules

1. Every tenant-owned table has `organization_id` (and `project_id` where applicable).
2. Mutable aggregates have `version` integer; updates use optimistic concurrency.
3. Foreign keys and ON DELETE behavior are explicit (prefer restrict for passports/evidence).
4. Sensitive columns classified; encrypt at rest where required (CMK later for Enterprise).
5. **Do not store raw prompts or full source by default.**
6. Large evidence in object storage; DB stores: hash, uri, size_bytes, content_type, sensitivity, retention_until, redaction_class.
7. Passport + evidence + outbox insert in **one transaction**.
8. Consumers of outbox are idempotent.
9. `audit_events` append-only (except legal retention tools).
10. `github_webhook_deliveries` unique on delivery_id.

## Evidence envelope (metadata)

```yaml
request_hash: sha256
provider: string|null
model: string|null
input_schema: string
input_size: int
redaction_summary: string
context_refs: []
policy_version: string
output_schema: string
artifact_refs: []
raw_content_ref: null
raw_content_expiry: null
```

## Object storage

- Local: MinIO
- Prod: S3-compatible
- Paths namespaced by organization_id
- Signed URLs for authorized download only
- Lifecycle policies aligned with `retention_items`

## Indexing suggestions

- passports (organization_id, project_id, assurance_status, updated_at)
- passports (pull_request_id) or join via pull_requests
- verification_runs (status, leased_until)
- usage_records (organization_id, created_at)
- idempotency_records (key unique)

## Retention

- Free public: short retention / public report rules
- Pro: ~30 days private evidence
- Team: ~180 days
- Enforce via `retention_items` worker; hard-delete with audit
