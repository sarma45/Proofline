# 06 — Dashboard & Secondary Screens

## Project / team dashboard

**Purpose:** Answer “How much AI-assisted change is flowing through us, and how much of it is actually verified?”

### Key metrics (honest)

- Passports completed (period)
- Passport completion rate
- % VERIFIED_FOR_SCOPE vs BLOCKED vs EXPIRED vs HUMAN_REVIEW_REQUIRED
- Scope-drift rate (when detectable)
- Median time to understand / review (if instrumented)
- Usage vs plan limits (passports, credits) — show before hitting limits

### Lists

- Recent passports (status, repo, PR, time, reviewer)
- Blocking / critical findings open
- Stale / expired passports that need re-verify
- Connected repositories and policy versions

### Empty state

Guided path: connect first repo → open sample PR → view first passport.

## Passport list

- Filters: status, repository, date range, has unknowns, has blocking findings
- Columns: status, title/intent summary, repo, PR number, commits, updated, decision
- Bulk actions later; MVP is scan + open

## Human Review Brief (3-minute packet)

Can be a focused mode of the passport or a printable/exportable view:

1. What changed (short)
2. Why it changed (intent)
3. What passed
4. What failed / blocked
5. What remains unknown
6. What decision is requested

Same content as the full passport, aggressively truncated for speed.

## Onboarding

- Progress steps: Account → Install → Policy → Sample run → First passport
- Permission transparency at every step
- Skip sample only if user already has a PR; still offer fixture later

## Settings (MVP-light)

- Connected installations
- Default policy
- Members / roles (basic)
- Usage and plan
- Disconnect / kill switch

Billing and advanced SSO/SCIM are later stages; UI can show “coming on Team/Enterprise” without implementing payment collection before core value.

## Marketing landing (if in same repo)

- Hero: verification debt problem + Change Passport promise
- Short animated or static walkthrough of a passport (not a chat demo)
- Demo CTA: public fixture or “install on a public repo”
- Pricing table matching product brief
- Trust: honest language about limits

Landing may use more motion/3D than the app; still avoid generic AI-gradient aesthetic.
