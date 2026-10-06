# 01 — Product Brief & Truth

## One-sentence product

Proofline is the **trust layer** between AI-generated code and production software. It produces an evidence-backed **Change Passport** for every AI-assisted software change.

## What Proofline is

- Provider-neutral AI engineering trust layer
- Evidence OS for AI-built software
- GitHub/GitLab pull-request verification for AI-assisted changes
- Human-centered: proves what changed, why, what was verified, what remains unknown, and who approved it

## What Proofline is NOT

- A generic AI coding assistant or chatbot
- An autonomous deployment system
- A replacement for human security review
- A guarantee that code is bug-free
- A scanner that claims complete vulnerability coverage
- A full IDE replacement
- A multi-agent swarm or public unreviewed skill marketplace (MVP)

## Core problem: Verification debt

> The gap between the speed at which AI creates software changes and the evidence required for a human team to trust those changes.

## Product outcome (every supported PR)

A review-ready Change Passport containing:

- User intent
- Success criteria and non-goals
- Repository facts used
- Plan version and plan hash
- Changed files and symbols
- Planned-versus-actual scope
- Active skills and versions
- Tool receipts
- Test, build, type, security, accessibility, and visual evidence
- Unknowns and unverified assumptions
- Policy decisions
- Human approval or rejection
- Reviewed payload hash
- Proposed merge payload hash
- Assurance status

## Honest assurance status vocabulary (only these)

```
UNASSESSED
EVIDENCE_COLLECTING
HUMAN_REVIEW_REQUIRED
CONDITIONAL_PASS
BLOCKED
VERIFIED_FOR_SCOPE
EXPIRED
FAILED
CANCELLED
```

`VERIFIED_FOR_SCOPE` is allowed only when:

- Required checks completed
- Blocking gates passed
- Evidence artifacts exist
- Scope is explicit
- Commit hash is fixed
- No critical unresolved finding exists
- Human review is complete where policy requires it

A passport becomes `EXPIRED` when the commit, policy, environment, or verification inputs materially change.

## Language rules (UI copy)

**Use:**
- verified for scope
- evidence complete for configured checks
- human review required
- unknown coverage
- blocked by policy
- partial evidence
- scope drift detected

**Never use:**
- 100% safe
- bug-free
- fully autonomous security
- zero risk
- AI-certified code
- confidence: 98%

## Beachhead users

AI-forward software teams of 5–50 engineers already using coding agents who feel review, security, or governance friction.

Primary jobs:
- Developer → ship without writing a manual verification report
- Reviewer → decide whether a change is safe and understandable
- Staff / security / platform → scope, findings, audit, policy

## MVP name & promise

**Proofline PR Gate**

> Connect Proofline to a repository and receive a review-ready Change Passport for every AI-assisted pull request.

## UX principles (from product)

1. First-time setup must let a user install, select policy, run a sample PR, and open a passport in under three minutes.
2. Default permissions are read-only.
3. The UI must **not** look like a generic AI chat interface.
4. Use a calm, evidence-oriented engineering workspace.
5. Primary workflow must be keyboard-completable.
6. Honest about unknowns; never convert unknown into pass.
