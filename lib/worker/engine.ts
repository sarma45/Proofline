export interface VerificationContext {
  passportId: string;
  githubPrId: string;
  repositoryId: string;
  policy: any;
  pullRequestDiff: string; // Simplified for MVP
}

export interface SkillResult {
  checkType: string;
  status: 'passed' | 'failed' | 'blocked' | 'skipped' | 'unknown';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  evidenceRefs?: string[];
}

import { runCartographer } from './evaluators/cartographer';
import { runScopeAuditor } from './evaluators/scope';
import { runTestAdequacy } from './evaluators/test_adequacy';
import { runSecurityMapper } from './evaluators/security_boundary';
import { runHumanReviewBrief } from './evaluators/human_review';

export async function runVerificationEngine(context: VerificationContext) {
  console.log(`Starting verification run for passport ${context.passportId}`);
  
  const results: SkillResult[] = [];

  try {
    // 1. Repository Cartographer
    const cartography = await runCartographer(context);
    results.push(cartography);

    // 2. Scope Auditor
    const scope = await runScopeAuditor(context);
    results.push(scope);

    // 3. Test Adequacy Analyst
    const testAdequacy = await runTestAdequacy(context);
    results.push(testAdequacy);

    // 4. Security Boundary Mapper
    const security = await runSecurityMapper(context);
    results.push(security);

    // 5. Human Review Brief
    const humanReview = await runHumanReviewBrief(context);
    results.push(humanReview);

    // Aggregate state machine logic would go here to transition the passport
    // Update passport status in DB based on results

    return { success: true, results };
  } catch (err) {
    console.error('Verification run failed', err);
    // Important rule: Do not hide uncertainty; never convert unknown -> pass
    results.push({
      checkType: 'engine_execution',
      status: 'unknown',
      severity: 'high',
      message: 'Verification engine encountered a fatal error during execution.'
    });
    return { success: false, results };
  }
}
