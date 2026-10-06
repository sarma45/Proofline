# Proofline UI Build Prompts

**Product:** Proofline — The Evidence OS for AI-Built Software  
**Tagline:** AI can write the change. Proofline proves what changed, why it changed, and whether it is safe to merge.  
**Primary surface:** Change Passport + GitHub PR Gate + Web Dashboard

These files are the complete design and implementation specification for the Proofline website and product UI. Use them with:

- **Design skill:** [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (`/impeccable init`, then polish / audit / critique)
- **3D skill (optional accents only):** [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)

## File index

| File | Purpose |
|------|---------|
| `00-README.md` | This index and how to use the prompts |
| `01-product-brief.md` | Product truth, positioning, non-goals, assurance language |
| `02-design-system.md` | Tokens, typography, color, spacing, status system, anti-slop rules |
| `03-information-architecture.md` | Sites, routes, primary user flows, navigation |
| `04-change-passport-screen.md` | Core product screen — full section-by-section spec |
| `05-pr-gate-and-github.md` | GitHub check, PR comment, install flow |
| `06-dashboard-and-secondary.md` | Team dashboard, setup, review brief, empty/error states |
| `07-components-and-patterns.md` | Component inventory and interaction patterns |
| `08-accessibility-and-states.md` | Required states, a11y, keyboard, reduced motion |
| `09-3d-and-motion.md` | When and how to use 3D / motion (restrained) |
| `10-implementation-notes.md` | Stack recommendations, data contracts, fixtures |
| `11-master-agent-prompt.md` | Single copy-paste prompt that references all of the above |

## Recommended build order

1. Read `01` + `02` → establish product truth and design system.
2. Implement design tokens + base layout shell.
3. Build **Change Passport screen** (`04`) with fixture data first.
4. Add PR Gate surfaces (`05`).
5. Dashboard + secondary (`06`).
6. Polish with impeccable audit/polish; add optional 3D only after core UI is solid.
7. Run accessibility and fixture acceptance checks (`08` + `10`).

## Success criteria (non-negotiable)

A reviewer must understand a Change Passport in **under three minutes**:
- What changed
- Why it changed
- What passed / failed
- What remains unknown
- What decision is requested

Never display “100% safe”, “bug-free”, “zero risk”, or “fully autonomous security”.
