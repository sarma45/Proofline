# Gap Analysis: UI Prompts vs Full Product Spec

## Summary

| Area | UI pack (`proofline-ui-prompts`) | Product build prompt requirement | Gap |
|------|----------------------------------|----------------------------------|-----|
| Product positioning & copy | Covered | Covered | None |
| Change Passport UI sections | Covered | Covered | None |
| Design system / a11y / states | Covered | Covered | None |
| PR check / GitHub UX (frontend) | Covered | Covered | None |
| Dashboard UX | Covered | Covered | None |
| **Backend domain model** | Mention only | Full aggregates + rules | **MISSING** |
| **Change Passport JSON schema (canonical)** | Partial reference | Canonical shape + versioning | **MISSING** |
| **State machine (server authority)** | Status display only | Transitions, validation, audit | **MISSING** |
| **API (OpenAPI-level contracts)** | Endpoint names only | Full ops, errors, idempotency | **MISSING** |
| **Database schema & storage rules** | Not covered | Tables, tenant path, outbox, retention | **MISSING** |
| **Evidence artifact store** | Display only | Hash/URI model, redaction, retention | **MISSING** |
| **Verification engine** | Check list UI | Graph model, check contracts, evaluators | **MISSING** |
| **Five MVP skills (executable)** | Not covered | Skill manifests + safety compiler | **MISSING** |
| **GitHub App/Action integration** | UX only | Webhooks, signatures, checks API, dedupe | **MISSING** |
| **Workers / jobs / leases** | Not covered | Job contracts, fencing, retries | **MISSING** |
| **Security (tenant, SSRF, injection)** | UI permission copy | Full control plane | **MISSING** |
| **Usage metering & plans** | Pricing display | Events, limits, reconciliation | **MISSING** |
| **Observability** | Not covered | Request IDs, metrics, audit | **MISSING** |
| **Fixture suite (18 scenarios)** | UI subset | Full assert: state, API, audit, block | **MISSING** |
| **Local runbook / definition of done** | UI DoD | Full E2E: install → PR → passport → decide | **MISSING** |
| Monetization payment collection | Correctly deferred | Deferred until value proven | Aligned |
| Stage 3–4 platform features | Correctly deferred | Deferred | Aligned |

## Conclusion

The **UI pack is sufficient for a high-fidelity product frontend**.  
It is **not sufficient for an end-to-end application**.

You still need:

1. Real API + database + workers (not mocked passport JSON only)
2. GitHub webhook → verification pipeline → passport persistence
3. Server-side state machine (UI must not invent status)
4. Skills as versioned procedures with sandbox rules
5. Evidence storage and audit trail
6. Fixture-driven acceptance for launch gates

## Documents in this pack (fill the gaps)

| File | Purpose |
|------|---------|
| `00-GAP-ANALYSIS.md` | This file |
| `01-architecture.md` | System architecture, services, boundaries |
| `02-domain-model.md` | Aggregates, invariants, passport schema |
| `03-state-machine.md` | Assurance transitions, validation rules |
| `04-api-contracts.md` | REST operations, errors, idempotency |
| `05-database-and-evidence.md` | Tables, outbox, object storage |
| `06-verification-engine.md` | Check graph, evaluators, skill contracts |
| `07-github-integration.md` | App/Action, webhooks, checks, comments |
| `08-workers-and-jobs.md` | Job types, leases, retries |
| `09-security.md` | Tenant isolation, injection, secrets |
| `10-metering-and-plans.md` | Usage events, limits (no payment yet) |
| `11-fixtures-and-acceptance.md` | 18 fixtures + launch gates |
| `12-local-runbook.md` | How a new developer runs the full system |
| `13-master-e2e-prompt.md` | Single agent prompt for full application build |

## Recommended repo layout (E2E)

```text
proofline/
  apps/
    web/                 # UI (use proofline-ui-prompts)
    api/                 # HTTP API
    worker/              # Verification jobs
  packages/
    domain/              # Aggregates, state machine, schemas
    passport-schema/     # JSON Schema + types
    github/              # Webhook verify, checks client
  docs/
    api/openapi.yaml
    api/errors.yaml
    events/event-schemas.yaml
    workers/job-contracts.yaml
  fixtures/              # 18 acceptance scenarios
  docker-compose.yml     # Postgres + MinIO/S3-compatible + api + worker + web
```

No mock-only demo. Passport data must come from the verification pipeline.
