# 15 — Audit: Proofline 3D Development Plan

**Audited document:** `14-3d-development-plan.md`  
**Against:** Product Build Prompt, `Proofline.md` strategy, `09-3d-and-motion.md`, MVP scope freeze, a11y requirements  
**Audit date:** 2026-10-06  
**Verdict:** **Conditionally approved** — direction is correct; several gaps must be closed before Phase 1 spend.

---

## 1. Executive summary

| Dimension | Score | Notes |
|-----------|-------|--------|
| Product alignment | **Strong** | Matches “calm evidence OS,” not chatbot/spectacle |
| MVP scope discipline | **Strong** | Explicitly non-blocking for Stage 1–2 |
| A11y / reduced-motion | **Good** | Stated; needs testable acceptance criteria |
| Technical isolation | **Good** | `packages/viz-3d` boundary is right |
| Risk management | **Adequate** | Missing budget owners, kill criteria, security notes |
| Completeness | **Gaps** | No art direction lock, no QA matrix, weak graph ROI test |
| Over-scoping risk | **Low–medium** | Phase 2 graph 3D can become a sink if 2D is weak |

**Overall:** The plan correctly subordinates 3D to trust and evidence. It should **not** expand. Fix the gaps in §5 before treating Phase 1 as committed work.

---

## 2. Alignment check vs product truth

### 2.1 What the product requires

From the governing specs:

- UI must **not** look like a generic AI chat interface
- Calm, evidence-oriented engineering workspace
- Reviewer understands a passport in **&lt; 3 minutes**
- Honest statuses; no decorative confidence theater
- MVP excludes non-essential platform expansion
- Accessibility: reduced motion, color-independent status, keyboard path

### 2.2 Plan compliance

| Requirement | Plan status | Evidence |
|-------------|-------------|----------|
| 3D not required for passport/review | **Pass** | Phase 0 gate; non-goals; surface table |
| Marketing may be more expressive | **Pass** | Phase 1 hero |
| Evidence graph optional enhancement | **Pass** | Phase 2 after 2D |
| No WebGL on GitHub surfaces | **Pass** | Explicit |
| Procedural / code-owned preferred | **Pass** | Phase 1 + technical standards |
| CloudAI-X skill choice | **Pass** | Matches 09 |
| Does not claim security via visuals | **Pass** | Status meaning stays text+icon |

### 2.3 No conflicts found with

- MVP includes/excludes list (3D is not an include; plan does not force it)
- State machine / API / skills backend (3D is presentation-only)
- Monetization (no 3D paywall nonsense)

**Finding F1 (positive):** Plan does not violate product positioning or MVP freeze.

---

## 3. Strengths

1. **Correct hierarchy** — Product truth → 2D graph → optional 3D.
2. **Hard non-goals** — Prevents common AI-product failure (WebGL everywhere).
3. **Package isolation** — Limits bundle and dependency blast radius.
4. **Lifecycle rules** — Dispose, pause off-screen, pixel ratio cap are production-grade.
5. **Phase 0 exit criteria** — Allows abandoning 3D with zero MVP debt.
6. **Metaphor constraint** — “Sealed evidence node” resists generic AI gradients.
7. **Skill stack discipline** — Primary skill set; broader stack marketing-only.

---

## 4. Findings (severity-ordered)

### Critical

*None.* The plan does not put MVP or security at immediate risk if followed.

### High

**H1 — Phase 2 lacks a kill criterion**  
Phase 2 says “only if it improves clarity” but does not define how to measure that. Teams will default to building 3D graph because it was scheduled.

*Remediation:* Before any Phase 2 engineering, require a written decision:

- User test (n≥5 target reviewers): time-to-trace a finding in List vs 2D vs 3D  
- If 3D median is not ≥10% faster **or** preference ≥4/5 with no a11y regression → **cancel Phase 2**

**H2 — Accessibility acceptance is underspecified**  
“Respect reduced-motion” is necessary but not sufficient for canvas content.

*Remediation:* Add Phase 0/1 checklist:

- [ ] Canvas is not the only carrier of meaning (text equivalent adjacent)
- [ ] Focus never moves into WebGL without escape
- [ ] `aria-hidden="true"` on decorative canvas; visible caption/summary for SR
- [ ] Forced-colors / high-contrast: fallback still legible
- [ ] Keyboard users can complete marketing CTA without interacting with scene

**H3 — No performance budget numbers tied to CI**  
“&lt; 50 draw calls” and “&lt; 3s” are stated once; not enforced.

*Remediation:*

- Document budgets in `packages/viz-3d/PERF.md`
- PR template checkbox: bundle analyzer diff for `three` chunk
- Optional: simple smoke (headless or manual) on mid-tier profile before merge

### Medium

**M1 — Art direction not locked**  
“Sealed evidence node” is a recommendation, not a signed decision. Parallel metaphors will fragment the brand.

*Remediation:* One-page art lock (palette, 3 reference stills, forbidden motifs) before Phase 1 implementation.

**M2 — Public demo / fixture walkthrough (P2) is vague**  
Listed in surface table; no phase tasks, no owner, risk of last-minute heavy 3D for launch video.

*Remediation:* Either fold into Phase 1 (same scene, different camera) or mark **out of scope** until launch narrative is designed.

**M3 — R3F vs vanilla undecided**  
“Prefer vanilla unless R3F clearly wins” invites re-litigation mid-sprint.

*Remediation:* Decide in Phase 0:

- Default: **vanilla three** in `viz-3d`  
- R3F only if web app already standardizes on it **and** Phase 1 needs React lifecycle helpers  

**M4 — Security surface ignored**  
Marketing 3D is low risk, but loaders + remote assets can introduce supply-chain and SSRF-adjacent mistakes later.

*Remediation:* Add rule:

- Product app: no runtime load of remote meshes  
- Marketing: only hashed, repo-vendored, or CDN assets under content security policy  
- Do not use `img2threejs` or arbitrary image→mesh pipelines in authenticated product

**M5 — Motion policy split across docs**  
2D motion rules live in `09`; 3D plan partially duplicates. Drift risk.

*Remediation:* Single source: `09` = policy; `14` = delivery plan; `15` = audit. Cross-link only.

### Low

**L1 — Post-processing called out as “later”** without ban  
Bloom often becomes default “premium” slop.

*Remediation:* Post-processing **off by default**; enable only with explicit design approval and perf re-check.

**L2 — No ownership / RACI**  
Who approves Phase 1 go-live? Design? Eng? PM?

*Remediation:* Assign: Design approves stills; Eng owns perf/a11y; PM owns phase kill.

**L3 — Enterprise / locked-down browsers**  
Mentioned (“feature flag”) but not tested.

*Remediation:* Document WebGL disabled path in runbook; test one locked-down profile before launch.

---

## 5. Gap register (must add to plan)

| ID | Gap | Recommended addition |
|----|-----|----------------------|
| G1 | Phase 2 kill metrics | User-test gate before engineering |
| G2 | A11y canvas checklist | Expand Phase 0/1 exit criteria |
| G3 | PERF.md + PR checks | Enforce budgets |
| G4 | Art direction lock | Pre-Phase 1 artifact |
| G5 | Vanilla vs R3F decision | Phase 0 ADR (1 paragraph) |
| G6 | Asset/CSP security rule | Technical standards section |
| G7 | Demo walkthrough scope | Fold or cut |
| G8 | Owner / approver | RACI line |
| G9 | Context-loss + software WebGL | Explicit fallback UX |
| G10 | Analytics | Track fallback rate, WebGL errors (privacy-safe) |

---

## 6. Risk matrix

| Risk | Likelihood | Impact | Mitigation in plan? | Residual |
|------|------------|--------|---------------------|----------|
| 3D delays MVP | Low if Phase 0 discipline holds | High | Yes — non-blocking | Low |
| Phase 2 becomes vanity project | Medium | Medium | Weak — needs H1 | Medium until H1 |
| A11y regression on landing | Medium | Medium | Partial — needs H2 | Medium |
| Bundle bloat on app routes | Medium | Medium | Partial — lazy load stated | Medium until G3 |
| Brand looks like generic AI 3D | Medium | Medium | Metaphor guidance | Medium until G4 |
| Remote asset / loader abuse | Low (if marketing only) | High | Missing — needs M4 | Medium until M4 |
| Reviewer distraction on passport | Low if surface rules hold | High | Yes — no 3D on critical path | Low |

---

## 7. Effort realism

| Phase | Stated | Audit view |
|-------|--------|------------|
| Phase 0 | 2–3 days | **Realistic** for shell + flags + fallback stub |
| Phase 1 | 1–1.5 weeks | **Optimistic** if art direction not ready; **realistic** with locked stills and procedural only |
| Phase 2 | 1–2 weeks | **Optimistic** for production-quality labeled graph; often 2–3 weeks including interaction + a11y |
| Phase 3 | 3–5 days | Realistic if CSS/SVG-first |

**Recommendation:** Do not schedule Phase 2 on the critical path of public launch.

---

## 8. Comparison to alternative approaches

| Approach | Verdict for Proofline |
|----------|----------------------|
| No 3D at all | **Valid** — product category does not require it; plan already allows this |
| Plan as written | **Preferred** — staged, killable |
| Heavy scroll-craft marketing | **Reject for MVP app** — separate marketing track only |
| 3D evidence graph as default | **Reject** — fails clarity + a11y defaults |
| img2threejs product icons | **Defer** — correct in plan |

---

## 9. Audit decision

| Decision | Detail |
|----------|--------|
| **Approve Phase 0** | Yes — proceed when capacity exists |
| **Approve Phase 1** | Yes **after** G4 art lock + H2 a11y checklist + G5 ADR |
| **Approve Phase 2** | **Hold** until 2D graph ships **and** H1 kill test passes |
| **Approve Phase 3** | Optional polish only |
| **Change product roadmap?** | No — 3D remains non-MVP |

---

## 10. Required plan amendments (patch list)

Update `14-3d-development-plan.md` to include:

1. Phase 2 **kill criteria** (user-test metrics)  
2. Expanded **a11y canvas checklist** in Phase 0/1 exit criteria  
3. `packages/viz-3d/PERF.md` + PR template budget check  
4. **Art direction lock** as Phase 1 entry criterion  
5. **ADR:** vanilla three default  
6. **Security:** no remote meshes in product; CSP for marketing assets  
7. **RACI:** Design / Eng / PM approvers  
8. **Out of scope:** public demo 3D unless folded into Phase 1 scene  
9. Post-processing **default off**  
10. Telemetry: fallback activation + WebGL context loss (no PII)

---

## 11. Sign-off checklist (for engineering lead)

- [ ] Confirmed 3D is not on Stage 1 definition of done  
- [ ] Phase 0 package boundary reviewed  
- [ ] A11y checklist accepted by whoever owns accessibility  
- [ ] Art direction owner named  
- [ ] Phase 2 will not start without kill-test doc  
- [ ] Security reviewed asset loading policy  
- [ ] Aligns with `09-3d-and-motion.md` (no policy drift)

---

## 12. One-line audit conclusion

**The 3D plan is product-correct and MVP-safe; tighten kill criteria, a11y acceptance, perf enforcement, and art lock before spending on Phase 1, and keep Phase 2 firmly optional.**
