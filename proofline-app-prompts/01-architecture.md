# 01 — System Architecture (E2E)

## Goal

A working vertical slice:

```text
GitHub PR event
  → webhook verified
  → job enqueued
  → worker: map repo + diff + run checks + skills
  → Change Passport persisted
  → GitHub Check + optional comment updated
  → Web UI reads passport from API
  → Human review decision written via API
  → State machine transitions (server only)
```

## Services (MVP — keep small)

| Component | Responsibility |
|-----------|----------------|
| **api** | Auth, installations, projects, policies, passport read, review, reverify, export, usage |
| **worker** | Verification runs, skill execution, check evaluators, GitHub check updates |
| **web** | Product UI (from `proofline-ui-prompts`) |
| **postgres** | System of record |
| **object store** | Evidence artifacts (S3-compatible; MinIO locally) |
| **queue** | Job delivery (Postgres-backed outbox + poller is acceptable for MVP; Redis/SQS later) |

Do **not** add separate microservices for skills, metering, or audit in MVP. Modules inside api/worker are enough.

## Trust boundaries

1. **GitHub** — untrusted payloads; verify signatures; pin commits
2. **Repository content** — untrusted; cannot grant tools/permissions
3. **Model/provider** — untrusted output; cannot mutate domain state directly
4. **Tenant** — strict isolation on every query and job
5. **Evidence** — hashed references; raw source not stored by default

## Data flow (happy path)

1. `pull_request` / `check_suite` / installation event received
2. Signature verified; delivery id stored for dedupe
3. Installation + repository resolved to tenant project
4. Policy loaded; usage limit checked
5. Verification job leased
6. Worker:
   - Pins base + proposed commits
   - Builds change map from diff
   - Runs Repository Cartographer (bounded)
   - Runs Change-Scope Auditor
   - Runs evaluators (build/type/test/secret/deps/…)
   - Runs Test Adequacy + Security Boundary Mapper as configured
   - Assembles passport + evidence refs
   - Writes passport + outbox events in one transaction
7. Worker updates GitHub Check Run
8. Optional PR comment summary
9. UI loads `GET .../passport`
10. Reviewer `POST .../review` → state machine

## Capability flags

Defer behind flags until fixtures pass:

- Dynamic skill compiler
- Strix / external safe-lab
- Multi-provider routing
- Cross-org memory
- Signed evidence bundles (Enterprise)

## Non-goals for architecture

- Autonomous merge/deploy
- Real-time multi-agent cockpit
- Public skill marketplace execution
- Guaranteeing detection of all AI-generated code
