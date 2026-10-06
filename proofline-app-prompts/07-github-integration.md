# 07 — GitHub Integration

## Modes (MVP)

1. **GitHub App** (preferred for webhooks + checks + optional comments)
2. **GitHub Action** (can trigger verification and post results; useful for Stage 1 proof)

Default permissions: **read-only** on contents; checks write; PR comment write only if authorized.

## Responsibilities

- Verify webhook signatures (HMAC)
- Handle retries; deduplicate by delivery id
- Pin `base` and `proposed` (head) commits for every run
- Reconcile PR synchronize events (new commits → expire or re-verify)
- Create/update Check Runs with honest conclusions
- Optional summary PR comment (update in place when possible)

## Inbound events (minimum)

- `installation` / `installation_repositories`
- `pull_request` (opened, synchronize, reopened, closed)
- `check_suite` / `check_run` (if used)
- `ping`

## Check Run content

- Title includes assurance status when known
- Summary: status, blocking findings (top N), evidence completeness, plan alignment, unknowns, link to passport
- Conclusion mapping is policy-driven; stay honest (pending while EVIDENCE_COLLECTING)

## Security

- Never trust raw webhook body without signature
- Installation tokens only on server
- SSRF: do not fetch arbitrary URLs from repo content
- Secrets in logs redacted

## Action (Stage 1 alternative)

Example flow:

1. Action checks out PR head (or receives SHAs)
2. Calls Proofline API `verification-runs` or runs local evaluator bundle
3. Uploads results / calls API to publish passport
4. Uses `actions/github-script` or checks API for status

Full App path is required for MVP dashboard + automatic PR coverage.
