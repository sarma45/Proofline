# 10 — Implementation Notes

## Recommended stack (MVP)

- **App:** Next.js (App Router) + TypeScript + React
- **Styling:** CSS variables / Tailwind with design tokens from impeccable; or CSS Modules — keep tokens central
- **Components:** Accessible primitives (Radix / React Aria / similar) — not a heavy opinionated kit that fights the design system
- **Data:** Change Passport JSON as the contract; React Query or equivalent for fetching
- **Auth / GitHub:** Standard OAuth / GitHub App patterns
- **3D:** three + optional @react-three/fiber only where needed; code-split

Do not add services or packages that are not required for the passport flow.

## Data contract (UI must respect)

Canonical passport shape (schema_version 1.0) — see product build prompt. UI should:

- Render all sections even when optional arrays are empty (with honest empty copy)
- Never invent evidence
- Treat `assurance_status` as read-only from the API (state machine is server-side)
- Display `unknowns` and `limitations` prominently

## Fixture scenarios (drive UI development)

Build UI against at least these:

1. Clean AI-assisted feature with complete evidence → path to VERIFIED_FOR_SCOPE
2. Passing tests but missing behavioral coverage
3. Unplanned file change (scope drift)
4. Stale reviewed commit (EXPIRED / re-verify)
5. New dependency not in lockfile
6. Secret introduced in diff (BLOCKED)
7. Prompt injection in README (quarantined / finding)
8. Provider timeout → partial evidence
9. Duplicate webhook (no duplicate UI noise)
10. Critical security finding
11. Accessibility regression
12. Cross-tenant access attempt (permission denied)
13. Empty project / first-run
14. Human review required with clear decision form

Each fixture should exercise the correct banners, status pills, and section content.

## API surfaces the UI calls (from product spec)

- GET passport by PR or passport id
- POST review decision
- POST re-verify
- GET export
- Project / installation setup endpoints

Use standard error envelope: `code`, `message`, `retryable`, `request_id`, etc.

## Performance

- Passport page: critical path is header + intent + alignment + top findings
- Lazy-load audit, full file list, graph viz
- Avoid layout shift when status updates

## Security UX

- No raw secrets in UI (redact)
- Tenant isolation visible only as “you cannot access this” — no data leakage in errors
- Export may be restricted by plan

## Definition of done (UI)

- [ ] Change Passport screen matches section order and content rules
- [ ] All required UI states implemented
- [ ] Keyboard path for review decision works
- [ ] Status is never color-only
- [ ] Fixtures 1–14 render correctly
- [ ] Impeccable audit passes (anti-slop)
- [ ] Reduced motion respected
- [ ] No chatbot chrome
- [ ] Reviewer can understand a passport in under three minutes
