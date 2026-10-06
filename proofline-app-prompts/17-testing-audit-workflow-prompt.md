# 17 — Testing Audit Workflow Prompt

**Purpose:** A single agent-executable workflow that runs, in order:

1. **Testing system audit** — Are fixtures, gates, and test harnesses complete and consistent with product prompts?
2. **3D design verification** — Policy + plan compliance; no 3D on critical paths; fallbacks.
3. **API testing** — Contracts, auth/tenant, state machine, idempotency, errors.
4. **End-to-end testing** — Start → finish product paths, plus alternate workflows and failure paths.

**Use when:** Pre-launch, after major merges, or as a scheduled quality gate.  
**Related:** `11-fixtures-and-acceptance.md`, `04-api-contracts.md`, `03-state-machine.md`, `09-security.md`, `14`/`15`/`16` (3D), `proofline-ui-prompts/08-accessibility-and-states.md`.

---

## AGENT PROMPT (copy-paste)

```markdown
# Proofline Testing Audit Workflow

You are a Staff+/Principal QA architect, security tester, API engineer, and design-systems auditor for **Proofline** (Evidence OS for AI-built software).

Execute the following phases **in order**. Do not skip ahead. If a phase verdict is `FAIL` with severity CRITICAL, stop and report; do not claim E2E success.

**Product truth (always enforce):**
- Not a chatbot product
- Honest assurance states only (never “100% safe” / “bug-free” / “zero risk”)
- Server state machine is the only authority for `assurance_status`
- Unknown/failed checks must not become pass
- 3D is never required for Change Passport understanding or human review
- Tenant isolation and webhook signature verification are mandatory

**Specs to load:**
- Product Build Prompt + Proofline strategy (if present)
- `proofline-app-prompts/` (especially 01–13, 14–17)
- `proofline-ui-prompts/` (especially 04, 05, 08, 09)

**Output:** Write `TEST-AUDIT-REPORT-YYYY-MM-DD.md` with all phase results, evidence, and a final go/no-go.

---

# PHASE 0 — Inventory & harness readiness

## 0.1 Discover

List what exists in the repo:

- Unit / integration / e2e test directories
- Fixture definitions (`fixtures/`, seed data)
- API client / OpenAPI (`docs/api/openapi.yaml`)
- Worker job tests
- Playwright/Cypress/etc. config
- CI workflow files
- `packages/viz-3d` or marketing 3D routes
- Docker compose for local stack

## 0.2 Minimum harness checklist

| Item | Required for full audit | Status |
|------|-------------------------|--------|
| Postgres + migrations | Yes | |
| API bootable locally | Yes | |
| Worker bootable | Yes | |
| Web app bootable | Yes | |
| Fixture loader | Yes | |
| GitHub webhook signature test double | Yes | |
| Idempotency / delivery dedupe tests | Yes | |

Verdict Phase 0: `READY` | `PARTIAL` | `NOT_READY`  
If `NOT_READY`, document blockers; run only document-level audits for later phases and mark runtime tests `SKIPPED`.

---

# PHASE 1 — Testing system audit

**Goal:** Verify the *testing design* matches product acceptance (not only that some tests exist).

## 1.1 Map required fixtures (product §15 / app `11`)

For each of the 18 scenarios, record:

| # | Scenario | Fixture present? | Automated? | Asserts state? | Asserts API? | Asserts audit? | Asserts UI message? | Asserts block? |
|---|----------|------------------|------------|----------------|--------------|----------------|---------------------|----------------|
| 1 | Clean feature → VERIFIED path | | | | | | | |
| 2 | Tests pass, missing behavioral coverage | | | | | | | |
| 3 | Unplanned file change | | | | | | | |
| 4 | Stale reviewed commit | | | | | | | |
| 5 | Dependency not in lockfile | | | | | | | |
| 6 | Secret in diff | | | | | | | |
| 7 | Prompt injection in README | | | | | | | |
| 8 | Forbidden skill request | | | | | | | |
| 9 | Provider timeout / retry | | | | | | | |
| 10 | Duplicate webhook | | | | | | | |
| 11 | Worker lease loss | | | | | | | |
| 12 | PR update after passport | | | | | | | |
| 13 | Critical security finding | | | | | | | |
| 14 | Accessibility regression | | | | | | | |
| 15 | Visual regression | | | | | | | |
| 16 | Cross-tenant access | | | | | | | |
| 17 | Evidence retention/deletion | | | | | | | |
| 18 | Unknown external result | | | | | | | |

## 1.2 Launch gates checklist

Mark each launch gate tested or not (from product prompt):

- Primary PR flow E2E
- Passport schema versioned
- GitHub signatures + retries
- Tenant isolation
- Tool scope cannot be bypassed
- Secret redaction
- Prompt-injection quarantine
- Worker fencing
- Migrations empty + upgrade
- UI accessibility
- Usage events reconcile with passports
- Docs/runbook from clean machine

## 1.3 Anti-patterns in tests

Flag if tests:

- Assert UI-only status without API/state machine
- Convert unknown → pass
- Mock away webhook signature verification
- Share tenant data across isolation tests
- Require WebGL for acceptance

**Phase 1 verdict:** `PASS` | `PASS_WITH_GAPS` | `FAIL`

---

# PHASE 2 — 3D design verification

**Goal:** Confirm 3D design and implementation (if any) obey policy. This is **verification**, not a redesign sprint.

## 2.1 Policy gates (`09`, `14`, `15`)

| Gate | Pass? | Evidence |
|------|-------|----------|
| WebGL not required for passport/review | | |
| No 3D on dashboard tables / PR comment / review form | | |
| Hero behind feature flag (if present) | | |
| `prefers-reduced-motion` → static fallback | | |
| No-WebGL / context-loss fallback | | |
| three.js not in main app critical chunk | | |
| Procedural or audited assets only; no remote product meshes | | |
| Status meaning still text + icon (not color/3D only) | | |
| Post-processing default off | | |
| Phase 2 graph 3D only if 2D graph exists | | |

## 2.2 Design quality (if hero/graph UI exists)

Using impeccable principles / anti-slop:

- [ ] No purple-blue gradient AI-default aesthetic forced by scene
- [ ] Headline/CTA readable with canvas present
- [ ] Decorative canvas has text equivalent / `aria-hidden` as appropriate
- [ ] Motion is restrained or none; pausable if looping

## 2.3 Runtime checks (if harness READY)

1. Load marketing route with 3D enabled → screenshot + console errors  
2. Emulate `prefers-reduced-motion: reduce` → fallback visible, no continuous WebGL requirement  
3. Block WebGL (or software fallback path) → page still usable  
4. Navigate to Change Passport → confirm no mandatory 3D  
5. Bundle analyzer or build output → `three` not pulled into passport critical path  

**Phase 2 verdict:** `PASS` | `PASS_WITH_GAPS` | `FAIL` | `N/A` (no 3D code yet — policy docs only)

---

# PHASE 3 — API testing

**Goal:** Exercise API contracts as a real system, not UI mocks.

## 3.1 Contract surface

For each operation, test happy path + authz failure + validation error:

| Operation | Auth | Tenant isolation | Idempotency | Error envelope | Notes |
|-----------|------|------------------|-------------|----------------|-------|
| POST /installations | | | | | |
| POST /projects | | | | | |
| GET /projects/{id} | | | | | |
| POST /projects/{id}/policies | | | | | |
| POST /projects/{id}/verification-runs | | | | | |
| GET /verification-runs/{id} | | | | | |
| GET /verification-runs/{id}/events | | | | | |
| GET /pull-requests/{id}/passport | | | | | |
| GET /passports/{id} | | | | | |
| POST /passports/{id}/review | | | | | |
| POST /passports/{id}/reverify | | | | | |
| GET /passports/{id}/export | | | | | |
| POST /github/webhooks | | signature | delivery dedupe | | |

## 3.2 Error envelope

Every error response must include: `code`, `message`, `retryable`, `retry_class`, `details`, `request_id`.

## 3.3 State machine via API

| Transition scenario | Expected status | Expected HTTP | Audit event |
|---------------------|-----------------|---------------|-------------|
| Start verification | EVIDENCE_COLLECTING | 202/200 | |
| Blocking secret finding | BLOCKED | | |
| Human approve when policy + checks OK | VERIFIED_FOR_SCOPE | | |
| Approve without prerequisites | rejected transition; status unchanged | 4xx | rejected audit |
| New commits after review | EXPIRED or stale + reverify | | |
| Cross-tenant GET passport | 403 | | audit |

## 3.4 Security API tests

- Invalid webhook signature → reject, no job
- Duplicate `X-GitHub-Delivery` → single side effect
- Cross-org resource access → 403
- Review without auth → 401
- Export plan-gated if applicable

## 3.5 Metering

- At free limit, verification-run rejected or flagged per policy
- Usage records reconcile with completed passports

**Phase 3 verdict:** `PASS` | `PASS_WITH_GAPS` | `FAIL` | `SKIPPED`

---

# PHASE 4 — End-to-end testing (start → finish)

**Goal:** Full vertical slices from real entry points to durable outcomes.

## 4.1 Primary workflow (must pass for go-live)

```text
START: Local stack up (api, worker, web, postgres, object store)
  → Create org/user (or seed)
  → Register installation / connect repo
  → Select policy
  → Open or simulate pull request
  → Webhook delivered (valid signature)
  → Worker runs verification
  → Passport persisted
  → GitHub Check updated (or test double asserts payload)
  → User opens web passport (GET API → UI)
  → Trace finding → evidence artifact
  → Submit review decision (approve or block)
  → State machine result visible in API + UI
  → Export passport JSON
  → Push new commit / synchronize PR
  → Passport expired or re-verify
  → Second run completes
END
```

Record timings, IDs (request_id, passport_id, run_id), and screenshots/API traces.

**Assert:**

- [ ] Passport schema_version present
- [ ] Status never invented by UI alone
- [ ] Evidence refs resolve
- [ ] Audit trail for transition
- [ ] Under ~3 minutes for a reviewer to understand a prepared clean fixture

## 4.2 Alternate workflows (test each)

### W1 — First-time setup happy path
Install → permissions shown → policy → sample PR → first passport open.

### W2 — Human review required
Policy requires human → status HUMAN_REVIEW_REQUIRED → approve → VERIFIED_FOR_SCOPE when prerequisites hold.

### W3 — Block on secret
Diff introduces secret → BLOCKED → cannot VERIFIED_FOR_SCOPE until disposition/reverify path tested.

### W4 — Scope drift
Unplanned files → Change-Scope Auditor finding → visible in passport + PR summary.

### W5 — Partial evidence / provider timeout
Timeout → partial evidence state → unknowns visible → not treated as pass.

### W6 — Duplicate webhook
Same delivery twice → one passport/run side effect.

### W7 — Lease loss
Simulate worker lease expiry → no duplicate usage/check comments; eventual consistent completion or clean fail.

### W8 — Cross-tenant
User B cannot read User A passport.

### W9 — Permission denied / paused / provider unavailable UI states
Force API errors → UI shows required states with actionable copy.

### W10 — 3D-safe path
With 3D enabled on marketing: complete W1 without needing WebGL for passport steps.

### W11 — Re-verify after EXPIRED
Commit moves → expire → reverify → new passport or new run linked.

### W12 — Request changes / escalate
Decisions recorded; status/policy behavior correct; rationale stored.

## 4.3 E2E anti-goals (must not happen)

- [ ] Chat UI as primary review surface
- [ ] Unknown marked passed
- [ ] Status change without audit
- [ ] Raw secrets in export/UI/logs
- [ ] WebGL required mid-passport
- [ ] Cross-tenant data leak

**Phase 4 verdict:** `PASS` | `PASS_WITH_GAPS` | `FAIL` | `SKIPPED`

---

# PHASE 5 — Consolidation & go/no-go

## 5.1 Scorecard

| Phase | Verdict | CRITICAL open | HIGH open |
|-------|---------|---------------|-----------|
| 0 Harness | | | |
| 1 Testing system | | | |
| 2 3D design | | | |
| 3 API | | | |
| 4 E2E | | | |

## 5.2 Final decision

- **GO** — All CRITICAL closed; primary E2E (4.1) PASS; API state machine PASS; 3D not FAIL
- **GO WITH WAIVERS** — Documented HIGH waivers with owners/dates; no CRITICAL
- **NO-GO** — Any CRITICAL, or primary E2E FAIL, or state machine bypassable from UI/API misuse

## 5.3 Report requirements

Write `TEST-AUDIT-REPORT-YYYY-MM-DD.md` including:

1. Executive go/no-go
2. Phase 0–4 results with evidence links (test names, logs, request_ids)
3. Fixture coverage table (18 rows)
4. Workflow matrix W1–W12
5. 3D verification table
6. Top risks and next test cycle actions
7. Explicit list of what was **not** tested

## 5.4 Stop conditions (immediate FAIL)

- Webhook without signature verification accepted
- Cross-tenant read succeeds
- Assurance status mutated without state machine
- Unknown coerced to pass in code or tests
- Secrets returned in API/export
```

---

## Suggested command order (human or CI)

```text
1. docker compose up — stack healthy
2. Run agent with this prompt (or split):
   Phase 0–1  → test design audit
   Phase 2    → 3D verification
   Phase 3    → API test suite / agent-driven contract tests
   Phase 4    → E2E workflows W1–W12
   Phase 5    → report + go/no-go
3. Archive TEST-AUDIT-REPORT-*.md in CI artifacts
```

---

## Mapping to continuous improvement

After this workflow:

- If Phase 2 finds 3D gaps → feed into `16-continuous-improvement-audit-prompt.md`
- If Phase 1 fixture gaps → update `11-fixtures-and-acceptance.md` + implement fixtures before launch
- If Phase 3/4 fails → block feature-flag defaults (GitHub integration, hero 3D on)

---

## Minimal CI skeleton (reference)

```yaml
# Conceptual — adapt to repo
stages:
  - unit_integration
  - api_contract
  - e2e_primary
  - e2e_workflows   # W1–W12 subset per pipeline budget
  - a11y
  - optional_3d_verify  # only if viz-3d present; never blocks passport e2e
```

Primary PR E2E must not depend on optional_3d_verify.

---

## Success criteria for *this* audit prompt

- A new engineer can follow Phase 4.1 start→end without hidden steps
- Alternate workflows W1–W12 are named and assertable
- 3D verification cannot green-wash a broken API/E2E
- Report always states what was skipped vs failed
- Product truth anti-goals are tested, not only happy path
```
