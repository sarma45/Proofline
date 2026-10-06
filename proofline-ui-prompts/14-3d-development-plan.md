# 14 — Proofline 3D Development Plan

**Principle:** Proofline is an evidence tool. 3D is optional accent, never required to understand a passport or complete a review.

**Primary skill:** [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)  
**Optional broader stack:** [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) (R3F, GSAP) for marketing only  
**Design constraint:** `proofline-ui-prompts/09-3d-and-motion.md`

---

## 1. Goals and non-goals

### Goals

| Goal | Why |
|------|-----|
| Memorable marketing hero | Explain “Change Passport / verification debt” in one glance |
| Optional evidence-graph viz | Help reviewers see intent → plan → change → check → decision |
| Status metaphor (subtle) | Reinforce VERIFIED_FOR_SCOPE / BLOCKED without decoration noise |
| Performance & a11y first | 3D must degrade to 2D; respect `prefers-reduced-motion` |

### Non-goals

- 3D as primary UI for files, findings, or review decisions
- Heavy GLB marketplaces or multi-megabyte assets as core deps
- Game-like interactions inside the product app
- WebGL required for any MVP acceptance fixture
- Auto-playing scenes on dashboard or passport load

---

## 2. Where 3D is allowed

| Surface | 3D level | Priority | When |
|---------|----------|----------|------|
| Marketing landing hero | Moderate | P1 | After Stage 1 product works |
| Public demo / fixture walkthrough | Out of scope | — | Unless folded into Phase 1 scene |
| Evidence graph (passport §6) | Optional, progressive | P2 | After solid SVG/2D graph |
| Status / seal metaphor | Minimal | P3 | Polish only |
| Dashboard | None / static illustration | — | Avoid |
| PR comment / GitHub check | None | — | Text only |
| Review decision form | None | — | Clarity only |

---

## 3. Phased plan

### Phase 0 — Foundation (do first, 2–3 days)

**Outcome:** Safe integration path; zero impact on MVP if 3D never ships.

1. **Decision gate:** Ship MVP Change Passport + PR flow with **2D only** (SVG/canvas graph). 3D is additive.
2. **Package boundary**
   ```text
   packages/viz-3d/          # isolated, optional peer
     src/
       scene-shell.tsx       # renderer, resize, dispose, reduced-motion
       prefers-reduced-motion.ts
       lazy.ts               # dynamic import three
     package.json            # three as dependency of this package only
   ```
3. **Rules encoded in code**
   - Lazy-load Three.js only on routes that opt in
   - Cap `pixelRatio` (e.g. `Math.min(devicePixelRatio, 2)`)
   - Pause render loop when canvas off-screen (`IntersectionObserver`)
   - On `prefers-reduced-motion: reduce` → static PNG/SVG fallback, no WebGL
   - Dispose geometries/materials/renderer on unmount
4. **Skills to load for agents**
   - `threejs-fundamentals` (scene, camera, renderer, loop)
   - `threejs-geometry`, `threejs-materials`, `threejs-lighting`
   - Later: `threejs-interaction`, `threejs-postprocessing` only if needed
5. **ADR (Architecture Decision Record)**
   - Default: **vanilla three** in `viz-3d`. R3F only if web app already standardizes on it **and** Phase 1 needs React lifecycle helpers.
6. **Telemetry (Privacy-Safe)**
   - Track fallback activation rate and WebGL context loss errors.

**Exit criteria:** Empty scene shell mounts/unmounts cleanly; Lighthouse/perf budget documented; reduced-motion path tested. Expanded A11y canvas checklist confirmed.

---

### Phase 1 — Marketing hero (1–1.5 weeks)

**Outcome:** Landing communicates product without looking like generic AI SaaS.

#### Concept (pick one metaphor and stick to it)

**Recommended: “Sealed evidence node”**

- Abstract passport / seal / linked nodes (intent → evidence → decision)
- Calm, technical, dark-first; single accent color
- No character mascots, no rocket ships, no purple nebula

Alternative: “Verification debt weight” — abstract mass vs structured lattice (harder to read; only if design validates).

#### Implementation steps

0. **Entry Criterion**: Art direction lock (palette, 3 reference stills, forbidden motifs) must be signed off by Design.
1. Storyboard 3–5 still frames (impeccable + design review)
2. Procedural geometry preferred (boxes, lines, simple extrusions) over external GLB
3. Scene:
   - Perspective camera, subtle orbit or slow auto-rotate (pausable)
   - Hemisphere + directional light only; no expensive shadows unless proven
   - Post-processing (e.g. bloom) **off** by default; enable only with explicit design approval and perf re-check.
4. Fallback: same composition as static WebP/SVG for reduced-motion and no-WebGL
5. Performance budget:
   - &lt; 50 draw calls target for hero
   - First interactive &lt; 3s on mid laptop
   - No layout shift when canvas loads (reserved aspect box)

#### Deliverables

- `/` hero section with 3D + fallback
- Feature flag `NEXT_PUBLIC_ENABLE_HERO_3D`
- Docs: how to disable for low-end / enterprise locked-down browsers

**Exit criteria:** Design review pass; reduced-motion users see equivalent message; no regression on passport app routes.

---

### Phase 2 — Evidence graph enhancement (1–2 weeks, after 2D graph ships)

**Outcome:** Optional 3D/2.5D view of the same graph data the API already returns.

#### Prerequisite (mandatory)

Ship **accessible 2D graph first**:

- SVG or canvas
- Keyboard focusable nodes
- Screen-reader tree/list equivalent
- Same data: `intent → plan → surfaces → checks → artifacts → decisions`

#### 3D enhancement (progressive)

1. Toggle: “Graph view: List | 2D | 3D” (3D hidden if reduced-motion or WebGL fail)
2. Node layout from same coordinates or force-layout baked server/client once
3. Click node → existing side panel / scroll-to-section (no new interaction model)
4. Use `threejs-interaction` for raycast pick only; no free-flight camera required
5. Instanced nodes if count grows; start with &lt; 40 nodes typical passport

#### Anti-patterns

- Graph that only works in 3D
- Physics simulations for evidence links
- Auto-orbit while user tries to read labels

**Kill Criterion (Pre-engineering):** Run a user test (n≥5 target reviewers) measuring time-to-trace a finding in List vs 2D vs 3D. If 3D median is not ≥10% faster **or** preference ≥4/5 with no a11y regression → **cancel Phase 2**.

**Exit criteria:** Fixture passport graphs readable in List and 2D; 3D is optional parity, not source of truth.

---

### Phase 3 — Status metaphor polish (optional, 3–5 days)

**Outcome:** Tiny, restrained visual for status in marketing or empty states—not on every row.

Examples:

- VERIFIED_FOR_SCOPE: closed seal / locked node (static or one-shot animation)
- BLOCKED: broken link in chain
- EVIDENCE_COLLECTING: soft pulse (CSS preferred over continuous WebGL)

Prefer **CSS/SVG** for status pills; reserve Three.js for hero/graph only.

---

### Phase 4 — Explicitly deferred

| Idea | Why defer |
|------|-----------|
| img2threejs custom product icons | Nice-to-have; not MVP |
| Scroll-craft full-page marketing | Separate marketing site track |
| R3F game-like demo | Conflicts with trust positioning |
| Per-finding 3D threat models | Security UI needs clarity, not spectacle |
| WebXR | Out of category |

---

## 4. Technical standards

### Stack

```text
three (r160+ recommended)
Optional: @react-three/fiber + drei  — only if team already React-centric and Phase 1 needs it
Prefer vanilla three in packages/viz-3d for smaller surface area unless R3F clearly wins
```

### Code ownership

- Procedural scenes in repo (TypeScript factories)
- Marketing may use compressed GLB if audited and budgeted; document size

### Security

- **Product app:** No runtime load of remote meshes. Do not use arbitrary image-to-mesh pipelines in the authenticated product.
- **Marketing:** Only hashed, repo-vendored, or CDN assets under strict Content Security Policy (CSP).

### Lifecycle

```text
mount → create renderer/scene → start loop if visible && !reducedMotion
unmount → cancel RAF → dispose geometry/material/texture/renderer
route change → hard dispose (no leaked contexts)
```
- WebGL context loss + software WebGL: trigger explicit fallback UX.

### RACI

- **Design:** Approves stills and art direction.
- **Engineering:** Owns perf and a11y compliance.
- **PM:** Owns phase kill decisions.

### Quality gates

- [ ] `prefers-reduced-motion` path
- [ ] WebGL context loss handler (fallback UI)
- [ ] Bundle: three not in main app chunk
- [ ] No 3D on Change Passport critical path
- [ ] Keyboard users never trapped in canvas (focus escape)
- [ ] Color-independent meaning (3D is illustration, status still text+icon)
- [ ] Expanded A11y: Canvas is not the only carrier of meaning; `aria-hidden="true"` on decorative canvas; forced-colors fallback legible.
- [ ] Budget: `packages/viz-3d/PERF.md` documented + PR template budget check (bundle analyzer diff for `three` chunk).

---

## 5. Team workflow (with skills)

1. Read `09-3d-and-motion.md` + this plan before any scene work
2. Agent loads CloudAI-X skills for the subsystem being touched
3. Design stills approved before animation
4. Implement fallback **before** enabling default-on 3D
5. Perf check on integrated laptop + one low-end profile
6. Impeccable audit on surrounding page (3D must not force AI-slop chrome)

---

## 6. Timeline summary (relative to product stages)

| Product stage | 3D work |
|---------------|---------|
| Stage 1 — Proof of value (Action + passport + PR comment) | **Phase 0 only** (shell optional); no hero required |
| Stage 2 — MVP (dashboard, skills, review) | Phase 0 complete; Phase 1 hero if marketing site ships |
| Public launch | Phase 1 done; Phase 2 only if 2D graph already live |
| Stage 3+ | Phase 3 polish; evaluate deferred ideas with data |

---

## 7. Success metrics for 3D (honest)

- Hero message comprehension (qualitative user test) ≥ static-only baseline
- No increase in “time to understand passport” (3D must not sit on that path)
- WebGL error rate and fallback activation monitored
- Bundle size impact documented in PR template
- Zero severity a11y regressions tied to canvas

---

## 8. One-page agent prompt (3D tasks)

```text
You are implementing optional 3D for Proofline under packages/viz-3d.

Rules:
- Read proofline-ui-prompts/09-3d-and-motion.md and proofline-app-prompts/14-3d-development-plan.md
- Use CloudAI-X/threejs-skills (fundamentals, geometry, materials, lighting, interaction as needed)
- Never make WebGL required for Change Passport or review
- Always implement reduced-motion and no-WebGL fallbacks first
- Lazy-load three; dispose on unmount; pause when off-screen
- Procedural geometry preferred; calm technical aesthetic; no generic AI gradients
- Product status meaning stays in text + icons; 3D is illustration only

Current phase: [0|1|2|3]
Deliver: [scene shell | marketing hero | optional graph enhancement]
```

---

## 9. Recommended immediate next actions

1. **Do not block MVP** on any 3D work.  
2. Complete Phase 0 shell when a developer has spare capacity.  
3. Commission Phase 1 hero only when landing page is in scope for launch.  
4. Build Evidence Graph as **List + 2D** in the passport UI first; schedule Phase 2 later.

This keeps Proofline aligned with its category: **trust and evidence**, not 3D spectacle.
