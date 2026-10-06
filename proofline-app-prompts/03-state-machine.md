# 03 — Assurance State Machine

**Authority:** Server-side only. UI displays status; never invents transitions.

## States

```text
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

## Allowed transitions (MVP)

| From | To | Trigger |
|------|-----|---------|
| UNASSESSED | EVIDENCE_COLLECTING | Verification job started |
| EVIDENCE_COLLECTING | HUMAN_REVIEW_REQUIRED | Checks done; policy requires human |
| EVIDENCE_COLLECTING | CONDITIONAL_PASS | Checks done; non-blocking gaps; policy allows |
| EVIDENCE_COLLECTING | BLOCKED | Blocking finding or failed required gate |
| EVIDENCE_COLLECTING | FAILED | Unrecoverable pipeline failure |
| EVIDENCE_COLLECTING | CANCELLED | User/system cancel |
| HUMAN_REVIEW_REQUIRED | VERIFIED_FOR_SCOPE | Approve + all VERIFIED rules met |
| HUMAN_REVIEW_REQUIRED | BLOCKED | Block decision |
| HUMAN_REVIEW_REQUIRED | CONDITIONAL_PASS | Approve with known limitations (policy) |
| HUMAN_REVIEW_REQUIRED | HUMAN_REVIEW_REQUIRED | Request changes (stay; record decision) |
| CONDITIONAL_PASS | VERIFIED_FOR_SCOPE | Gaps closed + approve if needed |
| CONDITIONAL_PASS | BLOCKED | New blocking finding / human block |
| * (non-terminal) | EXPIRED | Commit/policy/inputs materially changed |
| * | CANCELLED | Explicit cancel where allowed |
| EXPIRED | EVIDENCE_COLLECTING | Re-verify started |
| BLOCKED | EVIDENCE_COLLECTING | Re-verify after fix (new run) |
| FAILED | EVIDENCE_COLLECTING | Retry |

Rejected transitions are recorded as **audit events** without mutating state.

## VERIFIED_FOR_SCOPE prerequisites

All must hold:

1. Required checks completed (not skipped/unknown unless policy allows)
2. No unresolved critical/blocking findings
3. Evidence artifacts exist for required checks
4. Scope explicit (intent + change map present)
5. Proposed commit hash fixed and matches run
6. Human review complete when policy requires it
7. `reviewed_payload_hash` set and matches current proposed payload (or policy exception recorded)

## EXPIRED conditions

- Proposed commit on PR differs from passport proposed_commit
- Policy version changed materially
- Verification environment inputs changed (declare which)
- Reviewed payload no longer matches merge candidate

## Transition validation inputs

Every transition attempt must include / load:

- Actor (user id or `system:worker`)
- organization_id + project_id
- policy_version
- commit hash
- evidence prerequisites snapshot
- aggregate `version` (optimistic lock)
- idempotency key when external (review POST, webhook)

## Audit

Append-only `audit_events`:

- event_type: `passport.transition.accepted` | `passport.transition.rejected` | …
- actor, passport_id, from_status, to_status, reason, request_id, payload hash
