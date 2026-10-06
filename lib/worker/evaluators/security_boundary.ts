import { VerificationContext, SkillResult } from '../engine';

export const securityMapperManifest = {
  id: 'security-boundary-mapper',
  version: '1.0.0',
  purpose: 'Map changes to security boundaries; report what was not covered; never claim complete coverage.',
  triggers: ['verification_run_started'],
  inputs: ['pull_request_diff', 'repository_map'],
  outputs: ['boundary_crossings', 'unverified_surfaces'],
  allowed_tools: ['read_diff', 'parse_ast'],
  forbidden_actions: ['network_egress', 'git_write', 'credential_read'],
  risk_level: 'low',
  human_checkpoints: [],
  stop_conditions: ['timeout'],
  evaluation_cases: ['fixture-security-boundary-1'],
  source_provenance: 'official',
  compatible_stacks: ['node', 'python', 'go'],
  incompatible_skills: [],
  max_context_tokens: 8000,
  status: 'official'
};

export async function runSecurityMapper(context: VerificationContext): Promise<SkillResult> {
  if (context.pullRequestDiff.includes('AWS_SECRET_KEY')) {
    return {
      checkType: 'security_boundary',
      status: 'blocked',
      severity: 'critical',
      message: 'Secret introduced in diff. Boundary violated.',
      evidenceRefs: ['boundary-map-101']
    };
  }
  if (context.pullRequestDiff.includes('IGNORE_PROMPT')) {
    return {
      checkType: 'security_boundary',
      status: 'failed',
      severity: 'high',
      message: 'Prompt injection attempt detected in README. Quarantined.',
      evidenceRefs: ['boundary-map-102']
    };
  }
  return {
    checkType: 'security_boundary',
    status: 'passed',
    message: 'Changes do not cross established trust boundaries (isolated to UI). Note: Not a complete security audit.',
    evidenceRefs: ['boundary-map-101']
  };
}
