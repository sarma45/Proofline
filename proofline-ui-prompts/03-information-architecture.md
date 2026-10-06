# 03 — Information Architecture & Flows

## Site structure (MVP)

### Marketing / public site

- `/` — Landing (problem: verification debt, solution: Change Passport, demo CTA)
- `/pricing` — Free / Pro / Team / Enterprise (from product brief)
- `/docs` — Getting started, schema, GitHub install
- `/fixtures` or public demo — intentionally vulnerable sample app + passport walkthrough

### Authenticated product app

- `/app` — Redirect to last project or onboarding
- `/app/onboarding` — Install GitHub App, select repo, select policy, run sample
- `/app/projects` — Project list
- `/app/projects/:projectId` — Project home (connected repos, recent passports, debt summary)
- `/app/projects/:projectId/passports` — Passport list (filter by status, repo, time)
- `/app/passports/:passportId` — **Change Passport screen** (core)
- `/app/passports/:passportId/review` — Focused human decision view (or same page with sticky action)
- `/app/settings` — Org, members, policies, usage, billing (later stages)
- `/app/usage` — Metering dashboard

### GitHub-facing (not full pages, but surfaces)

- PR check run status
- PR comment / review report summary
- Deep link into `/app/passports/:id`

## Primary user flows

### A. First-time setup (< 3 minutes to first passport)

1. Sign in / create account
2. Install Proofline GitHub App (or Action) on a repo
3. See exact permissions requested (default read-only)
4. Select verification policy
5. Open or create a sample PR
6. Proofline runs → passport appears
7. User opens Change Passport and understands the result

### B. Everyday PR review

1. PR opened/updated
2. Proofline check appears on GitHub
3. Reviewer clicks through to full passport
4. Scans Decision header → Intent → Change map → Plan alignment → Verification → Unknowns
5. Approves / requests changes / blocks
6. Decision recorded; passport may become VERIFIED_FOR_SCOPE or stay blocked

### C. Re-verify after commit update

1. New commits on PR
2. Previous passport may EXPIRE
3. New verification run
4. Side-by-side or clear “this passport is for commit X; PR head is now Y”

### D. Team overview

1. Manager opens project dashboard
2. Sees verification debt metrics, recent blocked/expired, usage vs plan

## Navigation principles

- Product shell: left nav (Projects, Passports, Settings) + top context (org / project switcher)
- Change Passport is a **document**, not a chat thread — use a structured single-page layout with sticky header and section anchors
- Breadcrumbs: Org → Project → Repo → Passport
- Always show current assurance status in chrome when viewing a passport

## Deep links

Every passport, finding, evidence artifact, and human decision must be linkable and shareable within the tenant.

## Empty & zero states

- No projects yet → guided install
- No passports yet → “Open a PR or run the sample”
- Partial evidence → explicit list of what is still collecting
- Provider unavailable → clear, non-blaming message + retry guidance
