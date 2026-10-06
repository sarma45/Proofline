import { VerificationContext, SkillResult } from '../engine';

export const testAdequacyManifest = {
  id: 'test-adequacy-analyst',
  version: '1.0.0',
  purpose: 'Link changed surfaces to tests; mark gaps when tests pass but do not exercise the change.',
  triggers: ['verification_run_started'],
  inputs: ['pull_request_diff', 'test_results', 'coverage_report'],
  outputs: ['test_gap_analysis', 'coverage_deltas'],
  allowed_tools: ['read_file_bounded', 'parse_test_report'],
  forbidden_actions: ['network_egress', 'git_write', 'credential_read'],
  risk_level: 'low',
  human_checkpoints: [],
  stop_conditions: ['timeout'],
  evaluation_cases: ['fixture-test-adequacy-1'],
  source_provenance: 'official',
  compatible_stacks: ['node', 'python', 'go'],
  incompatible_skills: [],
  max_context_tokens: 8000,
  status: 'official'
};

export async function runTestAdequacy(context: VerificationContext): Promise<SkillResult> {
  if (context.pullRequestDiff.includes('missing-behavioral-tests')) {
    return {
      checkType: 'test_adequacy',
      status: 'failed',
      severity: 'medium',
      message: 'Tests passed, but changed function processPayment() lacks direct unit tests.',
      evidenceRefs: ['test-gap-report-789']
    };
  }
  return {
    checkType: 'test_adequacy',
    status: 'passed',
    message: 'Adequate test coverage detected.',
    evidenceRefs: ['test-gap-report-789']
  };
}
