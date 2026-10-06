# 16 — Continuous Improvement Audit Prompt

**Purpose:** A reusable, agent-executable prompt that (1) verifies consistency and completeness across **all** Proofline prompt packs, then (2) produces concrete **3D UI improvements** under product constraints.

**How to use:** Paste the block under **§ AGENT PROMPT (copy-paste)** into your coding agent on a schedule (e.g. after each major PR, weekly, or pre-launch). Point the agent at the repo paths below. Re-run; do not treat a single pass as permanent.

---

## Inputs (always load)

```text
artifacts/
  README.md
  proofline-ui-prompts/          # 00–11
  proofline-app-prompts/         # 00–16 (this file included)
Product sources (if available):
  Proofline — Product Build Prompt.md
  Proofline.md
```

**Skills for improvement work (after audit):**

- Design: pbakaus/impeccable (`audit`, `polish`, `critique`)
- 3D: CloudAI-X/threejs-skills (only subsystems touched)
- Constraint law: `proofline-ui-prompts/09-3d-and-motion.md`
- Plan + prior audit: `14-3d-development-plan.md`, `15-3d-plan-audit.md`

---

## AGENT PROMPT (copy-paste)

```markdown
# Proofline Continuous Improvement Audit

You are a Staff+/Principal product engineer, design systems lead, and security-minded auditor.

Run a **two-phase** continuous improvement cycle:

1. **VERIFY** — Systematically audit every Proofline prompt/spec document for consistency, gaps, conflicts, and drift from product truth.
2. **IMPROVE 3D UI** — Only after verification, propose and (if code exists) implement **bounded** 3D UI improvements that pass the verification gates.

Do not expand product scope. Do not turn Proofline into a 3D demo. Prefer the smallest reversible change.

---

## Phase 1 — VERIFY (mandatory, complete before any 3D code change)

### 1.1 Inventory

List every file under:

- `proofline-ui-prompts/`
- `proofline-app-prompts/`
- Root `artifacts/README.md`
- Product build prompt / strategy docs if present

Mark each file: present | missing | stale | conflicting.

### 1.2 Product truth gates (fail closed)

Confirm all docs still enforce:

- [ ] Not a coding chatbot / no chat-primary UI
- [ ] Honest assurance states only (no “100% safe”, “bug-free”, “zero risk”)
- [ ] State machine is server authority for `assurance_status`
- [ ] Unknown/failed checks never become pass
- [ ] MVP scope freeze respected (no Stage 3–4 features required)
- [ ] Repository content cannot grant tools/permissions
- [ ] 3D never required for Change Passport or human review
- [ ] Reviewer can understand a passport in under 3 minutes

Any violation → **CRITICAL finding**; fix docs before UI work.

### 1.3 Cross-document consistency matrix

Check alignment between:

| Topic | UI pack | App pack | 3D plan/audit | Product prompt |
|-------|---------|----------|---------------|----------------|
| Assurance vocabulary | | | | |
| Passport sections (1–9) | | | | |
| Allowed 3D surfaces | | | | |
| A11y / reduced-motion | | | | |
| GitHub PR surfaces (no 3D) | | | | |
| Evidence graph (2D first) | | | | |
| Skills / verification (backend) | | | | |
| Fixtures / DoD | | | | |

Report: match | drift | missing.

### 1.4 3D-specific verification

Against `09`, `14`, `15`:

- [ ] Phase 0 non-blocking for MVP
- [ ] Phase 2 has kill criteria (or flag as still open finding)
- [ ] A11y canvas checklist defined
- [ ] Perf budget + enforcement path defined
- [ ] Art direction lock status (done / not done)
- [ ] Vanilla vs R3F decision status
- [ ] No remote meshes in product app policy present
- [ ] Post-processing default off
- [ ] Feature flag for hero 3D
- [ ] Fallback path for no-WebGL and reduced-motion

### 1.5 Gap & conflict register

Output a table:

| ID | Severity | Source files | Finding | Required fix | Blocks 3D work? |
|----|----------|--------------|---------|--------------|-----------------|

Severities: CRITICAL | HIGH | MEDIUM | LOW.

### 1.6 Verification verdict

One of:

- `PASS` — proceed to Phase 2 with listed improvements only
- `PASS_WITH_DOC_FIXES` — apply doc fixes first in same session, then Phase 2
- `FAIL` — stop; no 3D UI implementation until CRITICAL/HIGH product-truth issues resolved

---

## Phase 2 — IMPROVE 3D UI (only if Phase 1 ≠ FAIL)

### 2.1 Improvement principles

1. Clarity and trust over novelty
2. 2D/text remains source of meaning; 3D is illustration
3. Procedural geometry preferred
4. Lazy-load, dispose, pause off-screen, pixelRatio cap
5. Impeccable anti-slop: no generic AI gradients, no Inter-only chrome forced by 3D frame
6. Every improvement must include fallback behavior
7. Do not start Phase 2 graph 3D unless 2D graph exists and kill-test policy is satisfied

### 2.2 Allowed improvement catalog (pick only what applies)

Prioritize in order:

**A. Foundation (Phase 0)**

- Scene shell robustness (context loss, resize, visibility pause)
- Reduced-motion and no-WebGL fallback quality
- Bundle isolation verification
- PERF.md budgets if missing

**B. Marketing hero (Phase 1)**

- Metaphor clarity (sealed evidence / passport node — not sci-fi clutter)
- Readability of adjacent headline/CTA with canvas present
- Static fallback fidelity matching hero message
- Motion: one restrained loop or none; pausable
- Color-independent composition

**C. Evidence graph (only if eligible)**

- Strengthen **2D/SVG graph** first if weak
- 3D toggle only if kill criteria documented and 2D complete
- Node pick → existing side panel / section scroll
- Label legibility; no free-flight camera requirement

**D. Status metaphor (Phase 3)**

- Prefer CSS/SVG over continuous WebGL
- Must not replace StatusPill text+icon

**Forbidden improvements**

- 3D on dashboard tables, PR comments, review forms
- Autoplay heavy scenes on passport load
- Remote untrusted mesh loading in product
- Making WebGL required for any acceptance fixture
- Adding scroll-craft full-page as product dependency

### 2.3 Improvement workflow

For each selected improvement:

1. **State current behavior** (doc + code if present)
2. **State target behavior** (1 short paragraph)
3. **Risk** (a11y, perf, brand, scope)
4. **Implementation plan** (smallest diff)
5. **Acceptance checks**
   - reduced-motion path
   - no-WebGL path
   - keyboard/CTA still works
   - no passport critical-path dependency
   - impeccable critique notes (anti-slop)
6. Implement only if code exists in repo; otherwise output a precise patch plan and updated docs
7. Update `14-3d-development-plan.md` and/or `15-3d-plan-audit.md` with outcomes

### 2.4 Output artifacts (required)

Produce or update:

1. `CI-AUDIT-REPORT.md` (dated) containing:
   - Phase 1 inventory + matrix + findings + verdict
   - Phase 2 improvements chosen + acceptance results
   - Follow-ups for next audit cycle
2. Doc patches for any drift found in Phase 1
3. Code changes only inside `packages/viz-3d` (or agreed marketing route), unless fixing a CRITICAL product-truth doc issue
4. Changelog bullets for the audit cycle

### 2.5 Stop conditions

Stop the cycle if:

- A CRITICAL product-truth violation appears mid-work
- Improvement requires new product features outside MVP freeze
- Perf budget would be exceeded with no fallback
- Design would make status color-only or hide unknowns

---

## Phase 3 — Schedule the next loop

End every run with:

| Field | Value |
|-------|--------|
| Next audit trigger | (e.g. after hero lands / weekly / pre-launch) |
| Open findings carried forward | IDs |
| 3D phase status | 0/1/2/3 + blocked reasons |
| Owner | |

Do not mark continuous improvement “done.” Mark **this cycle** complete.
```

---

## Lightweight cron-style usage

```text
Trigger: weekly OR after merge to main affecting web/ or packages/viz-3d/
Command: run agent with § AGENT PROMPT
Input: full artifacts + product prompts
Output: CI-AUDIT-REPORT.md (versioned by date)
Gate: FAIL blocks 3D feature-flag default-on
```

---

## Minimal report template (`CI-AUDIT-REPORT.md`)

```markdown
# CI Audit Report — YYYY-MM-DD

## Verdict
PASS | PASS_WITH_DOC_FIXES | FAIL

## Phase 1 — Verification
### Inventory
### Consistency matrix
### 3D checklist
### Findings
| ID | Sev | Finding | Fix | Blocks 3D? |
### Doc fixes applied

## Phase 2 — 3D UI improvements
### Selected items (A/B/C/D)
### Changes made
### Acceptance results
### Explicitly not done (and why)

## Carry forward
### Open findings
### Next trigger
### 3D phase status
```

---

## Design skill invocation (after PASS)

```text
/impeccable audit <hero or graph route>
/impeccable polish <target>
```

Reject polish that reintroduces: purple gradients, nested glass cards, confidence meters, chat chrome.

---

## Relationship to other docs

| Doc | Role |
|-----|------|
| `09-3d-and-motion.md` | Policy (law) |
| `14-3d-development-plan.md` | Delivery plan |
| `15-3d-plan-audit.md` | Baseline one-time audit |
| **`16` (this file)** | Repeatable verify → improve loop |
| UI + app packs | Full system under verification |

---

## Success criteria for this continuous process

- Drift between prompts is detected within one cycle
- 3D UI changes never violate product truth gates
- Each cycle leaves a dated report and a shorter open-findings list
- Phase 2 graph 3D remains optional and killable
- Passport “time to understand &lt; 3 minutes” is never traded for visuals
```
