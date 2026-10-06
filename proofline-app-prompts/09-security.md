# 09 — Security Requirements

## Application threats

- Tenant isolation on every query and job (organization_id mandatory)
- Authn/authz on all mutations
- Rate limits by class
- Path traversal protection on any file access from repo pin
- SSRF protection (block link-local, metadata IPs; allowlist egress)
- Secret redaction in logs, passports, and exports
- Dependency scanning of Proofline itself
- Kill switch for workers and GitHub integration

## AI-specific threats

- Untrusted repository instructions (README, agents.md, examples) — injection scan
- Repository content **cannot** grant tools or permissions
- Tool scope enforced in code (allowlist), not by prompt alone
- Sandboxed skill/script execution: no implicit network, no host credentials
- Model output cannot mutate assurance_status or bypass policy
- Prompt-injection fixtures must be quarantined in tests

## GitHub

- Least-privilege permissions; default read-only contents
- Webhook signature verification required
- Installation token hygiene

## Critical findings

Block transition to `VERIFIED_FOR_SCOPE` until human disposition.

## Strix / safe-lab (optional, gated)

Only against approved local/preview/staging targets with declared rules of engagement. Output is evidence, not complete coverage. Off by default.

## Audit

Security-relevant actions → audit_events (tool denied, cross-tenant attempt, kill switch, policy override).
