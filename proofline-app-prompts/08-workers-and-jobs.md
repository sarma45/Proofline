# 08 — Workers & Jobs

## Job contracts

Document in `docs/workers/job-contracts.yaml`.

### Core job types (MVP)

| Job | Input | Output / side effects |
|-----|--------|------------------------|
| `verification.run` | project_id, pr_id, base_sha, head_sha, policy_version, trigger | passport upsert, checks, evidence, GitHub check update, usage event |
| `passport.expire` | passport_id, reason | status → EXPIRED, audit |
| `github.check_update` | check_run payload | GitHub API |
| `evidence.retention` | organization_id batch | delete/archive per policy |
| `outbox.dispatch` | — | deliver domain events idempotently |

## Leasing / fencing

- `job_leases` table: job_id, worker_id, leased_until, attempt
- Heartbeat extension while running
- On lease loss: another worker may take job; **side effects must be idempotent**
- Stale completion after lease loss must not double-apply GitHub comments or usage

## Retries

- Retry only **known retryable** failures (network to GitHub, transient DB)
- Do **not** auto-retry unknown external outcomes
- Cap attempts; then FAILED + audit + visible unknown/partial evidence

## Idempotency keys

- Webhook delivery id
- verification.run: (project, pr, head_sha, policy_version) natural key where possible
- review POST: client Idempotency-Key
- usage_records: unique event key

## Observability fields per job

- request_id / correlation_id
- organization_id, project_id, passport_id (when safe)
- duration, outcome, attempt, worker_id
- redaction_class on logs

Do not log secrets, private source, or hidden model reasoning.
