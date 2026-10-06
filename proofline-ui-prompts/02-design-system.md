# 02 — Design System

Use **impeccable** to generate and enforce tokens. This file is the product-specific constraint layer on top of impeccable.

## Design personality

- Calm, precise, high-signal engineering tool
- Dense but scannable (reviewers spend real time here)
- Trust through clarity, not decoration
- Dark-first preferred; light mode must meet the same contrast rules
- Zero marketing-gradient energy inside the product

## Anti-slop rules (hard constraints)

Do **not**:

- Use Inter / Roboto / Open Sans as the sole typeface
- Use purple-to-blue gradients as primary branding
- Nest cards inside cards
- Put thin gray text on colored backgrounds
- Place a rounded-square icon tile above every section heading
- Show fake confidence meters or “AI score” percentages
- Use glassmorphism or heavy drop shadows for core content
- Make the UI look like a chat product

## Typography

- **Display / headings:** Distinctive technical or editorial face (impeccable chooses; avoid generic sans-only stacks)
- **Body:** Highly readable, slightly tighter than marketing sites for density
- **Mono:** Required for commit SHAs, hashes, file paths, plan hashes, request IDs
- Hierarchy must work at 200% zoom
- Line length for long review text: ~60–75 characters preferred in primary columns

## Color & status system

### Base

- Neutral high-contrast surfaces (near-black / near-white with clear elevation steps)
- Single restrained accent for interactive elements (links, primary buttons, focus)
- Borders and dividers must be visible at reduced contrast

### Semantic status (color is secondary)

Every status must be readable without color:

| Status | Icon idea | Pattern / treatment |
|--------|-----------|---------------------|
| UNASSESSED | hollow circle | muted |
| EVIDENCE_COLLECTING | spinner / pulse | neutral progress |
| HUMAN_REVIEW_REQUIRED | eye / person | attention, not alarm |
| CONDITIONAL_PASS | check with caveat | warning-adjacent |
| BLOCKED | stop / shield | strong negative |
| VERIFIED_FOR_SCOPE | sealed check | success, scoped |
| EXPIRED | clock with slash | stale |
| FAILED | X | error |
| CANCELLED | dash | neutral terminal |

Status pills always include **text label + icon**. Never color alone.

### Findings severity

- Critical → blocks VERIFIED_FOR_SCOPE
- High / Medium / Low / Info
- Always show severity + short title + “view evidence”

## Spacing & density

- Prefer compact tables and expandable rows over large card grids
- Section vertical rhythm consistent; avoid large empty hero-style whitespace inside product screens
- Comfortable for multi-hour review sessions

## Elevation & surfaces

- Flat or very subtle elevation
- Clear section boundaries via borders / background steps, not shadows
- Sticky decision header on the Change Passport is allowed and encouraged

## Iconography

- Prefer a consistent, slightly technical set
- Status and severity icons must be distinct by shape, not only color
- File / symbol / endpoint icons optional; do not decorate every heading

## Motion (see also 09)

- Minimal and purposeful
- Status transitions, expand/collapse, graph node reveal only
- Respect `prefers-reduced-motion`
- No continuous decorative animation in the product shell

## Dark / light

- Dark-first for the product app
- Marketing/landing may be more expressive but must still feel like the same product family
- Both modes must pass WCAG 2.2 AA for text and interactive elements

## Design tokens to define early

```
--color-bg
--color-bg-elevated
--color-border
--color-text
--color-text-muted
--color-accent
--color-status-* (each assurance state)
--color-severity-*
--font-sans
--font-mono
--space-*
--radius-sm / md (keep modest)
--focus-ring
```

Impeccable should generate the concrete values; this file constrains the personality.
