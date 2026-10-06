# 08 — Accessibility & Required UI States

## Accessibility requirements

- WCAG 2.2 AA minimum for product surfaces
- Primary workflow keyboard-completable
- Visible focus rings (do not remove outline without replacement)
- Semantic landmarks: header, nav, main, complementary (side panel)
- Screen-reader announcements for status changes and async results (`aria-live` regions)
- Color is never the only status indicator
- Text zoom to 200% without loss of critical information
- Forms: labels, errors associated with fields, actionable error messages
- Reduced motion: respect `prefers-reduced-motion`; disable non-essential animation and auto-playing graph motion
- Target sizes and spacing for interactive controls

## Required UI states (implement all)

| State | When | UX expectation |
|-------|------|----------------|
| Loading | Initial fetch | Skeleton or calm spinner; preserve layout |
| Indexing | Repo map / skill run in progress | Progress + what is being indexed |
| Empty | No projects / no passports | Guided next action |
| Success | VERIFIED_FOR_SCOPE etc. | Clear status, no celebration noise |
| Blocked | BLOCKED / critical findings | Blocking items first, decision path clear |
| Stale | Passport commit ≠ PR head | Banner + re-verify CTA |
| Error | API / worker failure | Actionable message, request ID, retry |
| Paused | User or policy paused runs | How to resume |
| Permission denied | Missing scopes | Exact permission needed + link to fix |
| Partial evidence | Some checks done, some not | List complete vs pending; do not imply full pass |
| Provider unavailable | Model / tool provider down | Honest message; offline checks if any still run |
| Reconnecting | Transient network | Non-blocking indicator |

## Error copy principles

- Say what failed
- Say what the user can do
- Include request_id when available
- Do not blame the user for provider or webhook issues
- Do not hide unknowns

## Focus management

- Opening a side panel moves focus into it and returns focus on close
- After submitting a review decision, focus moves to the confirmation / updated status
- Skip link to main content on app shell

## Testing checklist (a11y)

- Keyboard only path through: open passport → read sections → submit decision
- Screen reader: status, findings, unknowns announced correctly
- High contrast / forced colors smoke check
- Reduced motion: no essential information only in motion
