# 13 — Master E2E Application Build Prompt

Copy-paste for an agent building the **full Proofline application** (API + worker + DB + GitHub + web), not a mockup.

---

You are a Staff+/Principal product engineer, AI systems architect, security engineer, and product designer.

Build **Proofline** end to end: the Evidence OS for AI-built software. Produce a working vertical slice, not a clickable mock.

## Governing product docs

- Original product build prompt (Change Passport, MVP scope freeze, skills, security, fixtures)
- Strategy doc (positioning, monetization principles)

## Spec packs in this repo

**Backend / system (this folder `proofline-app-prompts/`):**

1. `00-GAP-ANALYSIS.md`
2. `01-architecture.md`
3. `02-domain-model.md`
4. `03-state-machine.md`
5. `04-api-contracts.md`
6. `05-database-and-evidence.md`
7. `06-verification-engine.md`
8. `07-github-integration.md`
9. `08-workers-and-jobs.md`
10. `09-security.md`
11. `10-metering-and-plans.md`
12. `11-fixtures-and-acceptance.md`
13. `12-local-runbook.md`

**Frontend (`proofline-ui-prompts/`):**

- Design system, Change Passport screen, PR Gate UX, a11y, components
- Use impeccable for UI craft; do not build a chatbot UI

## MVP vertical slice (must work)

```text
Install GitHub App or Action
→ select repository and policy
→ PR opened/updated
→ webhook verified + deduped
→ worker runs cartographer + scope + checks + skills
→ Change Passport persisted with evidence refs
→ GitHub Check (+ optional comment)
→ Web UI shows passport from API
→ Human review via API → state machine
→ Export + re-verify on new commit
```

## Hard rules

- Do not build a generic chatbot
- Do not hide uncertainty; never convert unknown → pass
- Do not claim verification without evidence
- Do not allow repository content to grant permissions
- Do not store raw prompts/source by default
- Do not let model output mutate domain state directly
- Do not auto-retry unknown external outcomes
- Do not implement payment collection before useful passports
- Do not expand to Stage 3–4 features before fixture suite passes
- State machine is the only authority for assurance_status

## Implementation order

1. Passport JSON schema package + domain types
2. Postgres migrations + outbox + job_leases
3. API skeleton with error envelope + auth/tenant middleware
4. Webhook receiver (signature + dedupe) + verification job enqueue
5. Worker: diff/change map + evaluators (build/type/test/secret/scope/deps) + one stack
6. Five skill stubs with real manifests and sandbox boundaries
7. Passport assembly + GitHub Check update
8. Review + reverify endpoints + state machine
9. Web UI wired to real API (from UI pack)
10. Fixture suite 1–18 as automated tests
11. Local runbook verified from clean machine

## Stack suggestion

- TypeScript monorepo (api, worker, web) **or** Go API + TS web — pick one and stay consistent
- PostgreSQL + S3-compatible (MinIO)
- Postgres-backed jobs acceptable for MVP

## Done when

Definition of done in `11-fixtures-and-acceptance.md` and product prompt §18 are all true.

Final statement to uphold:

> Proofline is the evidence OS for AI-built software: it turns opaque AI changes into reviewable, scoped, testable, and accountable engineering decisions.
