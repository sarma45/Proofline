# Proofline UI Design Tokens (Dark-First)

Proofline uses a dark-first, evidence-centric design language. The UI is built to convey trust, clarity, and precision. It avoids gamification or unnecessary embellishments in favor of high-contrast, data-dense, and highly scannable layouts.

## Core Principles

1. **Dark-First:** The primary theme is dark mode, optimized for low eye strain during long code review sessions.
2. **Status is Supreme:** Colors are reserved strictly for semantic meaning (status, severity, actions).
3. **Typography for Data:** Monospace fonts are used for all technical artifacts (hashes, branches, code).

## CSS Variables (`app/globals.css`)

Proofline's tokens are defined as CSS variables and consumed via Tailwind configuration (`tailwind.config.ts`).

### Background & Surface

* `--color-bg`: `#09090b` (Zinc 950) - App background. Deep, neutral black.
* `--color-bg-elevated`: `#18181b` (Zinc 900) - Cards, modals, secondary surfaces.
* `--color-border`: `#27272a` (Zinc 800) - Borders, dividers, subtle separators.

### Typography

* `--color-text`: `#f4f4f5` (Zinc 50) - Primary text. High contrast, readable.
* `--color-text-muted`: `#a1a1aa` (Zinc 400) - Secondary text, helper copy, inactive states.
* `--color-accent`: `#3b82f6` (Blue 500) - Primary interactive elements, links, CTAs.

### Semantic Status Tokens

Colors indicate the state of a verification process or decision. They are used in `StatusPill`, `EvidenceGraph`, and banners.

* `--color-status-unassessed`: `#71717a` (Zinc 500) - Neutral, hasn't started.
* `--color-status-collecting`: `#3b82f6` (Blue 500) - In progress, active.
* `--color-status-review`: `#eab308` (Yellow 500) - Requires human attention.
* `--color-status-conditional`: `#f97316` (Orange 500) - Passed with caveats (unknowns present).
* `--color-status-blocked`: `#ef4444` (Red 500) - Explicitly blocked by human or policy.
* `--color-status-verified`: `#22c55e` (Green 500) - Cryptographically verified and passed checks.
* `--color-status-expired`: `#a8a29e` (Stone 400) - Stale passport, head moved.
* `--color-status-failed`: `#ef4444` (Red 500) - Verification checks failed.
* `--color-status-cancelled`: `#52525b` (Zinc 600) - Job aborted.

### Severity Tokens

Used for findings and audit alerts.

* `--color-severity-critical`: `#991b1b` (Red 800)
* `--color-severity-high`: `#ef4444` (Red 500)
* `--color-severity-medium`: `#f59e0b` (Amber 500)
* `--color-severity-low`: `#eab308` (Yellow 500)
* `--color-severity-info`: `#3b82f6` (Blue 500)

## Tailwind Configuration

These variables are mapped in `tailwind.config.ts`:

```typescript
colors: {
  background: "var(--color-bg)",
  "background-elevated": "var(--color-bg-elevated)",
  foreground: "var(--color-text)",
  muted: "var(--color-text-muted)",
  border: "var(--color-border)",
  accent: "var(--color-accent)",
  status: { /* ... */ },
  severity: { /* ... */ }
}
```

## Component Guidelines

* **Banners:** Use `bg-{status}/10` and `border-{status}` for contextual alerts (e.g., `PartialEvidenceBanner`).
* **Interactive Elements:** Hover states should transition smoothly (`transition-colors hover:bg-accent/90`).
* **Hash Displays:** Always use `font-mono text-xs bg-background border border-border px-1.5 py-0.5 rounded` for cryptographic hashes.
