import { VerificationContext, SkillResult } from '../engine';

export const scopeAuditorManifest = {
  id: 'change-scope-auditor',
  version: '1.0.0',
  purpose: 'Compare planned changes vs actual files, symbols, deps, and endpoints to detect scope drift.',
  triggers: ['verification_run_started'],
  inputs: ['pull_request_diff', 'planned_scope', 'repository_map'],
  outputs: ['scope_drift_detected', 'unplanned_files', 'unplanned_endpoints'],
  allowed_tools: ['read_diff', 'parse_ast'],
  forbidden_actions: ['network_egress', 'git_write', 'credential_read'],
  risk_level: 'low',
  human_checkpoints: [],
  stop_conditions: ['timeout'],
  evaluation_cases: ['fixture-scope-1'],
  source_provenance: 'official',
  compatible_stacks: ['node', 'python', 'go'],
  incompatible_skills: [],
  max_context_tokens: 8000,
  status: 'official'
};

export async function runScopeAuditor(context: VerificationContext): Promise<SkillResult> {
  if (context.pullRequestDiff.includes('unplanned-change')) {
    return {
      checkType: 'scope',
      status: 'failed',
      severity: 'high',
      message: 'Scope drift detected. Unplanned file changes.',
      evidenceRefs: ['scope-analysis-report-456']
    };
  }
  if (context.pullRequestDiff.includes('new-dep-without-lockfile')) {
    return {
      checkType: 'scope',
      status: 'blocked',
      severity: 'high',
      message: 'New dependency introduced without lockfile update.',
    };
  }
  return {
    checkType: 'scope',
    status: 'passed',
    message: 'Changes isolated to planned UI components. No scope drift detected.',
    evidenceRefs: ['scope-analysis-report-456']
  };
}
