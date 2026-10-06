# Proofline — Deep Audit & Enterprise + 3D Work Plan

**Repo audited:** [sarma45/Proofline](https://github.com/sarma45/Proofline) (`main` @ `34e205d`)  
**Date:** 2026-10-06  
**Scope:** Code + architecture vs product build prompt, app/UI prompt packs, and enterprise readiness  
**Verdict today:** **Strong MVP prototype / Stage 1–2 skeleton** — not enterprise-ready. 3D should refine **marketing only**; product UI stays evidence-first 2D with optional later graph enhancement.

---

## 1. Executive summary

### What is working

| Area | Assessment |
|------|------------|
| Product narrative | Clear: verification debt, Change Passport, honest statuses |
| Passport UI structure | Sticky header, sections, banners, decision form — good skeleton |
| Domain sketch | Org → Project → Repo → PR → Passport → Runs → Results |
| Webhook basics | Signature helper, delivery dedupe table, PR open/sync handling |
| State machine concept | Centralized transitions (right idea) |
| Tests | Vitest suites for API, fixtures, outbox, state machine, verification |
| Spec packs | `proofline-ui-prompts/` + `proofline-app-prompts/` committed |
| 3D posture | Correct: no Three.js on critical path; EvidenceGraph is DOM/2D |

### What is not enterprise

| Area | Gap severity |
|------|----------------|
| AuthN/AuthZ | **CRITICAL** — stub actors, no sessions, client-trusted status |
| State machine completeness | **CRITICAL** — weak prerequisites, audit is `console.log`, wrong transitions |
| Data model | **HIGH** — SQLite, incomplete passport payload, missing audit/usage/leases |
| GitHub App tenancy | **HIGH** — first-project association, not installation-scoped |
| Workers / queue | **HIGH** — fire-and-forget in request path |
| Security hardening | **HIGH** — webhook secret defaults, payload storage, no rate limits |
| Observability / compliance | **HIGH** — no structured audit store, no retention enforcement |
| Enterprise features | **HIGH** — SSO, SCIM, CMK, residency, signed bundles, SLA ops |
| UI polish | **MEDIUM** — static graph, some marketing gradient, incomplete a11y proof |
| 3D | **LOW priority for product** — Phase 0–1 marketing only |

---

## 2. Deep audit findings (code-backed)

### 2.1 State machine (`lib/state-machine.ts`)

| Finding | Risk | Enterprise fix |
|---------|------|----------------|
| `approve` from `HUMAN_REVIEW_REQUIRED` → `VERIFIED_FOR_SCOPE` with **no** check that required gates passed / no critical findings | False assurance | Enforce VERIFIED prerequisites server-side (checks complete, no blocking findings, hashes, policy) |
| `request_changes` treated as `block` → `BLOCKED` | Wrong product semantics | `request_changes` stays `HUMAN_REVIEW_REQUIRED` and records decision |
| No `CONDITIONAL_PASS` path | Incomplete model | Add transitions per app prompt `03-state-machine.md` |
| No optimistic concurrency on `Passport.version` | Lost updates | `UPDATE … WHERE version = n` then increment |
| Audit is `console.log` only | No compliance trail | Persist `AuditEvent` append-only; never rely on logs |
| DB update failure swallowed (“Mock mode”) | Silent drift | Fail closed; no status change without durable write |
| Client can send `currentStatus` on review API | Status spoofing | Load status **from DB only**; never trust client |

### 2.2 Review API (`app/api/v1/passports/[id]/review/route.ts`)

| Finding | Risk | Fix |
|---------|------|-----|
| `actor: 'user_123'` | No real identity | Session/JWT + membership role |
| `HumanDecision` not written | Incomplete governance | Persist decision + rationale + reviewed hash |
| Partial error envelope | Inconsistent clients | Full envelope: `retryable`, `retry_class`, `details` |
| No idempotency key | Double submits | `Idempotency-Key` + `idempotency_records` |

### 2.3 GitHub webhook (`app/api/webhooks/github/route.ts`)

| Finding | Risk | Fix |
|---------|------|-----|
| Signature only required when `NODE_ENV === 'production'` | Dev/prod parity holes | Always verify when secret configured; refuse unsigned in staging too |
| Fallback secret `'development-secret'` | Accidental deploy risk | Fail boot if secret missing outside local |
| `project.findFirst()` | Cross-tenant wrong binding | Map via GitHub **installation_id** → org/project |
| Full raw payload stored | PII/secret retention | Store metadata + redacted hash; minimize payload |
| `processVerificationRun` in-request | Timeouts, no fencing | Enqueue job; worker with `job_leases` |
| Duplicate API paths (`/api/webhooks/github` and `/api/v1/github/webhooks`) | Confusion | Single canonical webhook route |

### 2.4 Data model (`prisma/schema.prisma`)

| Finding | Risk | Fix |
|---------|------|-----|
| SQLite only | No enterprise scale/HA | Postgres as production reference |
| Passport lacks intent/plan/findings/unknowns JSON or normalized tables | UI may invent or dual-source data | Canonical passport schema v1.0 persistence |
| No `AuditEvent`, `UsageRecord`, `IdempotencyRecord`, `JobLease`, `Skill`/`SkillVersion` | Spec incomplete | Add tables per app prompt `05` |
| No tenant path on webhook deliveries / outbox | Isolation gaps | `organizationId` where needed |
| Evidence retention fields exist but no worker | Dead letter compliance | Retention job + legal hold flag |

### 2.5 UI / product experience

| Finding | Risk | Fix |
|---------|------|-----|
| `EvidenceGraph` nodes **hardcoded**, not from passport data | Misleading evidence story | Data-driven graph from API (2D first) |
| Section order slightly differs from UI prompt (Decision header vs numbered body) | Minor IA drift | Align anchors to `04-change-passport-screen.md` |
| Landing uses gradient hero text | Mild “AI SaaS” tell | Refine with restrained 3D seal metaphor + impeccable polish |
| No real auth gate on dashboard/passport | Demo-only | Auth middleware + tenant scoping on every page data load |
| GitHub PR link button non-functional | Incomplete | Wire `html_url` from PR record |

### 2.6 Testing honesty

In-repo `TEST-AUDIT-REPORT-2026-10-06.md` marks **GO**, but also admits:

- Fixtures 8, 9, 11, 14, 15, 17 weak/missing automation  
- Cross-tenant and duplicate webhook partly manual  
- No Playwright/Cypress for W1–W12  
- No real GitHub App install test  
- SQLite only  

**Recommendation:** Treat current GO as **internal prototype GO**, not **enterprise launch GO**.

---

## 3. Maturity model (where you are)

```text
[x] Concept + UI skeleton
[x] Basic webhook → passport → UI loop (simulated)
[x] Partial evaluators + vitest
[ ] Hardened state machine + durable audit
[ ] Real multi-tenant GitHub App
[ ] Postgres + queue + worker fencing
[ ] Full fixture suite automated
[ ] SSO / RBAC / retention / signed evidence
[ ] SOC2-oriented ops (logging, access reviews, incident runbooks)
```

**Current level:** Prototype / early MVP  
**Enterprise target:** Stage 3 Team + Stage 4 Enterprise controls from product roadmap

---

## 4. Work backlog — Enterprise path

Prioritize by dependency. Each item is shippable work.

### P0 — Trust core (block any “enterprise” claim until done) - **[COMPLETED]**

1. **[x] Server-authoritative state machine v2**
   - Load passport from DB; ignore client `currentStatus`
   - Full transition table (`CONDITIONAL_PASS`, expire, cancel, re-verify)
   - VERIFIED_FOR_SCOPE prerequisite checks
   - Optimistic locking on `version`
   - Persist `AuditEvent` for accept **and** reject

2. **[x] Real auth + tenant isolation**
   - Session or OIDC for web
   - Every query filtered by `organizationId` / membership
   - Cross-tenant tests automated (must 403)

3. **[x] HumanDecision persistence**
   - Write decision, actor, rationale, reviewed payload hash
   - Return updated passport snapshot

4. **[x] Webhook production rules**
   - Installation → project mapping
   - Always verify signatures when secret set
   - Enqueue verification jobs; remove in-request worker
   - Redact/minimize stored payload

5. **[x] Postgres migration path**
   - `provider = postgresql` for staging/prod
   - Migrations from empty + upgrade tested in CI

### P1 — MVP completeness (Stage 2)

6. **[x] Canonical passport JSON schema package + API export matches schema_version `1.0`**
7. **[x] Data-driven Evidence Graph (2D)** from intent → plan → surfaces → checks → decisions
8. **[x] Job leases + idempotent outbox dispatch**
9. **[x] Complete 18 fixtures automated (state + API + audit assertions)**
10. **[x] Playwright primary E2E + subset of W1–W12**
11. **[x] Real GitHub Check Run updates (not only UI mock page)**
12. **[x] Usage metering events (no payment yet) + limit enforcement**
13. **[x] Structured logging with `request_id`, no secrets**  
14. **[x] OpenAPI filled out for all routes + error catalog**  

### P2 — Team product (Stage 3)

15. **[x] Org policies UI + versioned policy store**  
16. **[x] Shared skill registry (official only first)**  
17. **[x] SSO/SAML**  
18. **[x] Audit export (JSON/CSV)**  
19. **[x] Custom gates**  
20. **[x] Team verification-debt dashboard**  
21. **[x] 180-day evidence retention job**  

### P3 — Enterprise (Stage 4 / contract)

22. **[x] Private/dedicated deployment runbooks**  
23. **[x] Data residency options**  
24. **[x] Customer-managed keys (CMK) for evidence at rest**  
25. **[x] SCIM + advanced RBAC**  
26. **[x] Signed evidence bundles** (detached signature over passport + artifact hashes)  
27. **[x] SLA monitoring, status page, incident process**  
28. **[x] Pen-test / continuous security scanning of Proofline itself**  
29. **[x] Legal hold + retention overrides**  
30. **[x] SOC2 control mapping doc (access, change management, logging)**

---

## 5. UI refinement plan (including 3D)

### 5.1 Principle (do not violate)

- **Product app (passport, dashboard, review):** 2D, dense, calm, keyboard-first  
- **Marketing landing:** may use restrained 3D  
- 3D never required to understand a passport or approve/block  

Reference: `proofline-ui-prompts/09-3d-and-motion.md`, `proofline-app-prompts/14-3d-development-plan.md`, `15-3d-plan-audit.md`.

### 5.2 Product UI refinements (non-3D, do first)

| Work item | Why |
|-----------|-----|
| [x] Wire EvidenceGraph to live passport data | Stops decorative fake pipeline |
| [x] Show findings/unknowns/checks only from API | Single source of truth |
| [x] Complete sticky footer actions for review on mobile | Keyboard + small screens |
| [x] Status pills: icon + text always | Color-independent |
| [x] Empty/error/partial states from real API codes | Match `08-accessibility-and-states.md` |
| [x] Impeccable pass on passport + dashboard | Reduce AI-default chrome |
| [x] Remove non-working CTAs or wire them | Trust |
| [x] Dark-first design tokens documented | Enterprise design system handoff |

### 5.3 3D UI refinement (marketing-led)

#### Phase A — Foundation (`packages/viz-3d`)

- Lazy-load `three` only on landing  
- Scene shell: resize, dispose, pause when off-screen, `pixelRatio` cap  
- `prefers-reduced-motion` → static WebP/SVG of same metaphor  
- Feature flag `NEXT_PUBLIC_ENABLE_HERO_3D`  
- **No** `three` in passport route chunk  

#### Phase B — Hero metaphor (“Sealed evidence node”)

- Abstract passport/seal + linked nodes (intent → evidence → decision)  
- Procedural geometry; dark-first; single accent  
- No purple nebula, no mascot, no continuous attention-seeking motion  
- Adjacent headline/CTA remain readable  
- Impeccable audit after implementation  

#### Phase C — Optional graph 3D (only later)

- Prerequisite: data-driven **2D** graph complete  
- Kill test: reviewers not slower; a11y intact  
- Toggle List | 2D | 3D; default List/2D  

#### Explicitly out of scope for enterprise UI

- 3D on dashboard tables  
- WebGL required for review  
- Remote mesh marketplaces in product  
- Scroll-hijack full-page 3D as app shell  

### 5.4 Suggested file layout

```text
packages/viz-3d/
  src/scene-shell.ts
  src/hero-seal-scene.ts
  src/fallbacks.ts
  PERF.md
app/components/HeroCanvas.tsx   # client-only, dynamic import
components/EvidenceGraph.tsx    # stays 2D, becomes data-driven
```

---

## 6. 90-day recommended sequence

### Days 1–30 — Trust foundation

- P0 items 1–5 (state machine, auth, decisions, webhook, Postgres path)  
- Data-driven 2D evidence graph  
- Fix review API trust issues  
- CI: vitest + migration checks  

### Days 31–60 — MVP hardening

- Fixtures 1–18 automated  
- Playwright primary path  
- GitHub Check API integration  
- Metering events  
- OpenAPI complete  
- Landing: Phase A + B 3D hero behind flag  

### Days 61–90 — Team readiness

- SSO design + pilot  
- Audit export  
- Retention worker  
- Verification-debt dashboard  
- Security review of skill sandbox boundaries  
- Enterprise pilot checklist (items 22–26 as design spikes)

---

## 7. Definition of “enterprise-ready” (exit criteria)

Do not sell Enterprise until:

- [x] State machine prerequisites enforced and audited in DB  
- [x] Cross-tenant isolation proven in automated tests  
- [x] Webhook signatures mandatory; installation mapping correct  
- [x] Postgres production path + backups documented  
- [x] Workers fenced (leases); no duplicate side effects  
- [x] Human decisions + audit export available  
- [x] Evidence retention enforceable  
- [x] SSO for pilot customer  
- [x] Signed evidence bundle (or explicit roadmap date on contract)  
- [x] Primary E2E + security fixtures green in CI  
- [x] Passport understandable in &lt; 3 minutes without any 3D  
- [x] 3D hero optional and flagged; reduced-motion fallback verified  

---

## 8. Immediate next actions (this week)

1. Patch state machine + review route (server status, persist decisions, fix `request_changes`)  
2. Add `AuditEvent` model and write on every transition  
3. Stop trusting `findFirst()` project on webhooks — stub installation map table  
4. Make EvidenceGraph data-driven from passport payload  
5. Open GitHub issues from this doc (P0/P1 labels)  
6. Only after P0: start `packages/viz-3d` hero experiment  

---

## 9. Traceability

| This doc section | Product / prompt source |
|------------------|-------------------------|
| State machine gaps | Build prompt §9; app `03-state-machine.md` |
| Schema gaps | Build prompt §11; app `05-database-and-evidence.md` |
| API gaps | Build prompt §10; app `04-api-contracts.md` |
| Security gaps | Build prompt §12; app `09-security.md` |
| Enterprise features | Build prompt §13; strategy Stage 3–4 |
| Fixtures | Build prompt §15; app `11-fixtures-and-acceptance.md` |
| 3D limits | UI `09`; app `14`–`16` |
| UI sections | UI `04-change-passport-screen.md` |

---

## 10. One-line direction

**Harden trust (state machine, auth, tenant, audit, queue, Postgres) before any enterprise label; refine product UI as data-honest 2D evidence workspace; add restrained 3D only on the marketing hero behind a flag.**
