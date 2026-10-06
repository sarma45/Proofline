# 04 — Change Passport Screen (Core Product)

This is the highest-leverage surface. Build it first with real fixture data.

## Goal

A reviewer understands the change in **under three minutes** and can make an approve / request-changes / block decision with full context.

## Layout (desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Sticky Decision Header                                                   │
│ [Status pill]  Scope summary  ·  base…abc → proposed…def  ·  Policy v3   │
│ Reviewed hash ↔ Merge hash  ·  Updated 2m ago  ·  [Export] [Re-verify]   │
├──────────────────────────────────────────────────────────────────────────┤
│ Left: Section nav (anchors)     │  Main: Scrollable passport body        │
│ 1 Decision                      │                                        │
│ 2 Intent                        │  Sections 1–9 in order                 │
│ 3 Change map                    │                                        │
│ 4 Plan alignment                │                                        │
│ 5 Verification                  │                                        │
│ 6 Evidence graph                │                                        │
│ 7 Unknowns                      │                                        │
│ 8 Review decision               │                                        │
│ 9 Audit details                 │                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ Sticky footer actions (when HUMAN_REVIEW_REQUIRED):                      │
│ [Approve] [Request changes] [Block] [Escalate]  + short rationale field  │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: single column, section nav becomes a sticky jump menu or accordion.

## Section 1 — Decision header (always visible / sticky)

**Must show:**

- Assurance status (pill + full label)
- Scope one-liner (e.g. “Feature: add export endpoint — scoped to `api/export` + tests”)
- Repository `owner/name`
- Base commit SHA (short) → Proposed commit SHA (short), both copyable
- Policy version
- Created / updated timestamps
- Reviewed payload hash vs merge payload hash (match / mismatch badge)
- Actions: Export JSON, Re-verify, Open on GitHub PR

**Visual:** Calm, high contrast, no large decorative hero. Status is the dominant element.

## Section 2 — Intent

- Summary (what the user/agent was asked to do)
- Success criteria (list)
- Non-goals (list)
- Assumptions (list)
- Source: `declared` | `inferred` | `unknown` (badge)

If source is inferred or unknown, surface that prominently so the reviewer does not assume the intent was human-approved.

## Section 3 — Change map

Structured view of what actually changed:

- Files (path, change type: added/modified/deleted, lines +/−)
- Symbols / functions / classes touched (when available)
- Endpoints / routes / public surfaces
- Dependencies added/updated/removed
- Generated artifacts if relevant

Prefer a filterable table or compact tree. Link file paths to GitHub blob/diff when possible.

Highlight **unplanned** files/surfaces in the same view (or with a clear badge).

## Section 4 — Plan alignment

Compare approved/declared plan to actual diff:

| Check | Result |
|-------|--------|
| Planned file changed | yes / no |
| Unplanned file changed | yes / no (list) |
| Planned behavior evidenced | yes / no / unknown |
| Test added or updated | yes / no |
| Scope expanded | yes / no |
| New dependency introduced | yes / no |
| External side effect attempted | yes / no |

This is the product’s most visible trust moment: **does the final change match what was approved?**

Show plan version + plan hash. If plan is missing, state that clearly.

## Section 5 — Verification

List of checks, each with:

- check_type + version
- status: `passed` | `failed` | `blocked` | `skipped` | `unknown`
- short summary
- evidence_refs (links or expandable)
- limitations (honest)
- scope of the check

Initial evaluators to support:

- Build
- Type check
- Unit / integration tests
- Changed-file scope
- Dependency / lockfile consistency
- Secret detection
- Basic static security analysis
- Changed endpoint / surface mapping
- Accessibility (changed UI)
- Visual regression (when fixtures exist)

**Rule:** Failed or incomplete checks remain visible. Never convert unknown into pass.

Group or filter by: Blocking / Non-blocking / Skipped.

## Section 6 — Evidence graph

Visual graph (or structured outline) of:

```
intent → plan → changed file/symbol/endpoint → verification case → result → evidence artifact → human decision
```

- Nodes are clickable and scroll the page to the related section or open a detail panel
- Prefer clean SVG / canvas first; optional restrained Three.js only if it improves clarity without harming performance or a11y
- Must have a non-graph textual fallback for screen readers and reduced-motion users

## Section 7 — Unknowns

Explicit list of:

- Gaps in evidence
- Low-confidence repository facts
- Untested paths / behaviors
- Incomplete provenance (agent/model unavailable)
- Checks that were skipped or timed out
- Assumptions that were not verified

Each unknown should be actionable where possible (“Add test for X”, “Re-run after providing agent session”).

## Section 8 — Review decision

- Current human decisions (history)
- Form for new decision:
  - Approve
  - Request changes
  - Block
  - Escalate
- Required or optional rationale (policy-dependent)
- Actor identity
- Timestamp
- Link to policy rule that required human review (if any)

After submit: optimistic UI + confirmation; passport status transitions via the state machine only.

## Section 9 — Audit details (collapsible)

- Actor / request ID / event IDs
- Tool receipts
- Hashes (reviewed payload, merge payload, plan)
- Policy version and snapshot reference
- Skill versions active for this run
- Provenance level: full | partial | unavailable

Default collapsed to keep the main review path short; expand for security/compliance users.

## Interaction details

- Section anchors in URL (`#intent`, `#verification`, etc.)
- Keyboard: jump between sections, activate primary actions, expand rows
- Copy buttons on all hashes and SHAs
- “Open evidence” opens artifact in side panel or new tab without losing place
- Stale passport banner when PR head has moved: “This passport is for commit X; current head is Y — re-verify”

## Content density guidelines

- Decision header: one screen of critical info max
- Intent + Plan alignment + top findings: visible without excessive scrolling for a typical passport
- Long file lists and full audit trails: progressive disclosure
