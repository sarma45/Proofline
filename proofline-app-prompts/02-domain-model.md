# 02 — Domain Model & Passport Schema

## Aggregates (MVP)

```text
Organization
User
Membership
Project
Repository
Policy
PullRequest
ChangePassport
VerificationRun
Skill / SkillVersion
EvidenceArtifact
HumanDecision
UsageRecord
AuditEvent
IdempotencyRecord
OutboxEvent
JobLease
```

## Invariants

- Every tenant-owned entity carries `organization_id` (and usually `project_id`).
- Mutable aggregates have a monotonic `version` for optimistic concurrency.
- Only the **state machine** mutates `ChangePassport.assurance_status`.
- Model/skill output never writes status or human decisions directly.
- Evidence artifacts are immutable after write; redaction is classification at write time.
- `reviewed_payload_hash` is fixed at review time; mismatch with merge payload is visible and may expire assurance.

## Canonical Change Passport (schema_version 1.0)

Persist and export this shape. UI and API share it.

```json
{
  "passport_id": "uuid",
  "schema_version": "1.0",
  "organization_id": "uuid",
  "project_id": "uuid",
  "repository": {
    "provider": "github",
    "owner": "string",
    "name": "string",
    "base_commit": "sha",
    "proposed_commit": "sha"
  },
  "pull_request": {
    "provider_id": "string",
    "number": 0,
    "url": "string"
  },
  "intent": {
    "summary": "string",
    "success_criteria": ["string"],
    "non_goals": ["string"],
    "assumptions": ["string"],
    "source": "declared|inferred|unknown"
  },
  "plan": {
    "plan_id": "uuid|null",
    "version": 0,
    "plan_hash": "sha256|null",
    "steps": []
  },
  "provenance": {
    "agent_source": "string|null",
    "model_provider": "string|null",
    "model": "string|null",
    "provenance_level": "full|partial|unavailable"
  },
  "skills": [
    {
      "id": "string",
      "version": "string",
      "status": "official|verified-community|organization-private|unverified|quarantined"
    }
  ],
  "changed_surfaces": [
    {
      "kind": "file|symbol|endpoint|dependency|other",
      "path_or_name": "string",
      "planned": true,
      "change_type": "added|modified|deleted|unknown"
    }
  ],
  "verification_runs": [
    {
      "run_id": "uuid",
      "status": "string",
      "checks": []
    }
  ],
  "findings": [
    {
      "finding_id": "uuid",
      "severity": "critical|high|medium|low|info",
      "title": "string",
      "check_id": "string|null",
      "summary": "string",
      "evidence_refs": [],
      "blocking": true
    }
  ],
  "unknowns": [
    {
      "code": "string",
      "summary": "string",
      "suggested_action": "string|null"
    }
  ],
  "human_decisions": [
    {
      "decision_id": "uuid",
      "actor_user_id": "uuid",
      "decision": "approve|request_changes|block|escalate",
      "rationale": "string|null",
      "created_at": "timestamp"
    }
  ],
  "reviewed_payload_hash": "sha256|null",
  "merge_payload_hash": "sha256|null",
  "assurance_status": "UNASSESSED",
  "policy_version": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "version": 1
}
```

Ship a formal JSON Schema under `packages/passport-schema` and version it.

## Check result shape (embedded)

```yaml
check_id: string
check_type: build|typecheck|test|scope|dependency|secret|sast|endpoint_map|a11y|visual|other
version: string
inputs: object
scope: string
started_at: timestamp
completed_at: timestamp|null
status: passed|failed|blocked|skipped|unknown
summary: string
evidence_refs: []
limitations: string|null
redaction_class: none|partial|full
```

## Policy (minimal MVP fields)

- Required checks list
- Whether human review is required for VERIFIED_FOR_SCOPE
- Blocking severity threshold
- Allowed skill statuses
- Retention days for evidence

## Usage record

- organization_id, project_id
- event_type: `passport_completed` | `verification_run` | `assurance_credit`
- passport_id (nullable)
- quantity
- created_at
- idempotency key
