import { VerificationContext, SkillResult } from '../engine';

export const humanReviewBriefManifest = {
  id: 'human-review-brief',
  version: '1.0.0',
  purpose: 'Generate a 3-minute decision summary fields for UI/export.',
  triggers: ['verification_run_started'],
  inputs: ['pull_request_diff', 'previous_evaluator_results'],
  outputs: ['review_summary', 'decision_points'],
  allowed_tools: [],
  forbidden_actions: ['network_egress', 'git_write', 'credential_read'],
  risk_level: 'low',
  human_checkpoints: [],
  stop_conditions: ['timeout'],
  evaluation_cases: ['fixture-human-review-1'],
  source_provenance: 'official',
  compatible_stacks: ['node', 'python', 'go'],
  incompatible_skills: [],
  max_context_tokens: 4000,
  status: 'official'
};

export async function runHumanReviewBrief(context: VerificationContext): Promise<SkillResult> {
  // Stub implementation for MVP
  return {
    checkType: 'human_review',
    status: 'passed',
    message: 'Summary: UI text update. Risk: Low. Needs attention: None.',
    evidenceRefs: ['review-brief-202']
  };
}
