# 09 — 3D & Motion (Restrained)

## Principle

Proofline is an evidence tool. 3D and motion are **optional accents**, never required for understanding a passport or completing a review.

## Allowed 3D uses

1. **Marketing landing hero** — abstract “passport / seal / evidence graph” metaphor
2. **Evidence graph visualization** — only if it improves clarity over a good 2D graph; must have full non-3D fallback
3. **Status metaphor** — e.g. sealed node for VERIFIED_FOR_SCOPE (very subtle)

## Disallowed

- 3D as the primary way to show file lists, findings, or decisions
- Auto-playing heavy scenes inside the product app
- External multi-megabyte models as a hard dependency for core UI
- Anything that breaks on low-end devices or with reduced motion

## Skill to use

- Primary: [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)  
  Fundamentals, geometry, materials, lighting, loaders, interaction, post-processing as needed
- Optional broader stack: [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) for R3F / GSAP if marketing needs scroll-driven scenes

## Technical rules

- Prefer procedural / code-owned geometry for product metaphors
- Lazy-load Three.js only on routes that need it
- Cap pixel ratio; pause render loop when off-screen
- `prefers-reduced-motion: reduce` → static image or 2D SVG equivalent
- No required WebGL for Change Passport workflow

## Motion (2D)

Allowed:

- Expand/collapse
- Status pill transition
- Skeleton → content
- Subtle graph node entrance (once)

Not allowed:

- Continuous background animation in the app shell
- Parallax that moves critical text
- Attention-seeking motion on every finding

## Marketing vs product

| Surface | Motion / 3D level |
|---------|-------------------|
| Landing | Moderate; can be distinctive |
| Dashboard | Minimal |
| Change Passport | Minimal; clarity first |
| PR comment | None (text) |
