# 10 — Metering & Plans (No Payment Collection Yet)

## Principle

Meter **outcomes** (completed passports, deep verification credits), not raw model tokens.  
Show usage before limits. Do not implement payment collection before passports are useful.

## Plans (enforce limits in API/worker)

### Free

- 1 public repository
- 10 passports / month
- Basic skills
- Public evidence report

### Pro — $19/active developer/month (display only until billing)

- 3 private repositories
- 100 passports / month
- Full plan-to-diff alignment
- Private evidence retention
- Additional skill packs

### Team — $49/active developer/month

- Org policies, shared skill registry, SSO (later), audit export, custom gates, dashboards, budgets

### Enterprise

- Contract; private deploy; CMK; signed bundles; SCIM — Stage 3/4

## Usage events

Emit `usage_records` when:

- Passport reaches a terminal useful state (define: completed verification with passport published)
- Assurance Credit consumed (deep workflows) — optional MVP stub

Reconcile: count of passports in DB ↔ usage_records for the period.

## Enforcement

- Before `verification.run`: check plan limits
- Soft warn in UI at 80%; hard block at 100% with clear upgrade path
- Never silently skip security checks to save quota

## Active developer

Define consistently (e.g. user who triggered or reviewed a passport in the billing period). Document the definition in code comments and API docs.
