# 05 — PR Gate & GitHub Surfaces

## Goals

- Proofline appears naturally in the developer’s existing PR workflow
- Status and blockers are visible without leaving GitHub
- One click opens the full Change Passport

## Install / first-time experience

1. User chooses “Install GitHub App” or “Add GitHub Action”
2. Clear permission list shown **before** authorize:
   - Default: read-only on code, PRs, checks
   - Write (comments, checks) only if needed and explicitly granted
   - External submissions / production deploy: never by default
3. Select repository (or org)
4. Select verification policy (sensible default provided)
5. Optional: run against an existing open PR or a sample fixture PR
6. Success state: “Passport ready — open report”

## GitHub Check run

**Title ideas:** `Proofline / Change Passport` or `Proofline — {assurance_status}`

**Summary (check output):**

- Assurance status
- Blocking findings count (and top 1–3 titles)
- Evidence completeness (e.g. “7/9 required checks complete”)
- Plan-to-diff alignment one-liner (aligned / drift detected / no plan)
- Unknowns count
- Link: “Open full Change Passport”

Check conclusion maps roughly to:

| Passport state | Check conclusion (example) |
|----------------|----------------------------|
| VERIFIED_FOR_SCOPE | success |
| CONDITIONAL_PASS / HUMAN_REVIEW_REQUIRED | neutral or success with attention |
| BLOCKED / FAILED | failure |
| EVIDENCE_COLLECTING | pending / in_progress |
| EXPIRED | neutral + “re-verify needed” |

Exact mapping is product policy; UI must stay honest.

## PR comment / review report

Short, structured comment (not a wall of text):

```
### Proofline Change Passport
**Status:** HUMAN_REVIEW_REQUIRED
**Scope:** …
**Blocking:** 1 critical finding (secret in diff)
**Alignment:** 2 unplanned files
**Unknowns:** 3
[Open full passport →]
```

Optional expandable details for top findings. Avoid flooding the PR with repeated comments on every push — update in place or use check runs as source of truth when possible.

## Web report (public or private link)

Same content as the Change Passport screen, possibly a simplified read-only view for users without full app access (policy-dependent). Public evidence report is allowed on Free plan for public repos.

## Permissions UX

- Always show what Proofline can and cannot do
- “Repository content cannot grant itself tools or permissions” — reflect this in UI copy where relevant
- Kill switch / disconnect is easy to find in settings

## Error & edge cases on GitHub side

- Webhook signature failure → do not process; show admin notice
- Duplicate delivery → idempotent, no duplicate side effects
- PR updated after passport → expire or mark stale; prompt re-verify
- Provider timeout → partial evidence state, retry guidance
