# 06 — Verification Engine & Skills

## Graph model (not a flat list)

```text
intent
  → plan
  → changed file/symbol/endpoint
  → verification case
  → result
  → evidence artifact
  → human decision
```

Persist enough structure to render the Evidence Graph in the UI and to audit claims.

## Initial evaluators (MVP)

| check_type | Behavior |
|------------|----------|
| build | Run project build command from cartographer/policy |
| typecheck | Type checker if stack supports |
| test | Unit/integration; record which tests ran |
| scope | Changed-file vs planned surfaces |
| dependency | New deps exist; lockfile consistency |
| secret | Diff/history secret detection |
| sast | Basic static rules / configured tool |
| endpoint_map | Map changed HTTP/API surfaces |
| a11y | Changed UI paths when detectable |
| visual | Only when fixtures exist |

Failed, blocked, skipped, unknown all remain visible. **Never map unknown → passed.**

## Skill contract (versioned procedure)

```yaml
id: repository-cartographer
version: 1.0.0
purpose: ...
triggers: [verification_run_started]
inputs: { repo_pin, policy }
outputs: { repository_map, confidence, source_refs }
allowed_tools: [read_tree, read_file_bounded, parse_manifest]
forbidden_actions: [network_egress, git_write, credential_read]
risk_level: low
human_checkpoints: []
stop_conditions: [max_files_exceeded, timeout]
evaluation_cases: [fixture ids]
source_provenance: official
compatible_stacks: [node, python, go]  # start with one stack
incompatible_skills: []
max_context_tokens: 8000
status: official
```

### Five MVP skills

1. **Repository Cartographer** — languages, frameworks, package manager, entry points, commands, key dirs, env hints, risk zones. Source refs + confidence. **Must not** inject entire files into model context.
2. **Change-Scope Auditor** — planned vs actual files/symbols/deps/endpoints; scope drift.
3. **Test Adequacy Analyst** — link changed surfaces to tests; mark gaps when tests pass but don’t exercise change.
4. **Security Boundary Mapper** — map changes to boundaries; report **what was not covered**; never claim complete coverage.
5. **Human Review Brief** — 3-minute decision summary fields for UI/export.

Skills execute in worker sandbox: no implicit network, no credentials, path allowlist, timeouts.

## Skill safety compiler (promotion path)

```text
source acquisition
→ immutable commit pin
→ license/provenance scan
→ path allowlist
→ secret scan
→ instruction/injection scan
→ candidate extraction
→ manifest normalization
→ dependency/conflict analysis
→ static validation
→ sandbox fixture
→ human review
→ promotion
```

Rules:

- Repo content cannot grant itself tools/permissions
- Hard policy overrides project policy, skills, model suggestions
- Conflicting skills fail closed
- Duplicate skill IDs require merge review
- License incompatibility blocks promotion
- Oversized skills rejected or reduced with provenance

### Required skill compiler fixtures

```text
benign-repo-skill
malicious-readme-instruction
conflicting-edit-strategies
forbidden-tool-request
duplicate-skill-id
license-incompatible-skill
oversized-context-skill
```

## Provider / model

- One provider or **deterministic fallback** for MVP
- If agent traces unavailable: `provenance_level: partial|unavailable` and continue with observable repo/CI evidence
- Model output is evidence input only — domain mutations go through validated writers
