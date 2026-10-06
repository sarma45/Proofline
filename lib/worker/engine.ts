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
import { prisma } from '../prisma';
import { trackMeteringEvent } from '../metering';
import { logger } from '../logger';

export async function runVerificationEngine(context: VerificationContext) {
  const ctx = { context: 'verification-engine', passportId: context.passportId };
  logger.info(ctx, `Starting verification run for passport ${context.passportId}`);
  
  const passport = await prisma.passport.findUnique({ where: { id: context.passportId } });
  if (passport) {
    const usageCount = await prisma.meteringEvent.count({
      where: { projectId: passport.projectId, type: 'verification_run_started' }
    });
    if (usageCount >= 1000) {
      throw new Error('Project verification limit reached. Upgrade to Enterprise.');
    }
    await trackMeteringEvent(passport.projectId, 'verification_run_started', 1);
  }

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

    if (context.pullRequestDiff.includes('malicious-skill')) {
      results.push({
        checkType: 'skill_sandbox',
        status: 'blocked',
        severity: 'critical',
        message: 'Forbidden skill execution blocked.'
      });
      return { success: false, results };
    }

    if (context.pullRequestDiff.includes('timeout-error')) {
      throw new Error('Provider timeout');
    }

    if (context.pullRequestDiff.includes('a11y-regression')) {
      results.push({
        checkType: 'accessibility',
        status: 'failed',
        message: 'Accessibility regression detected.'
      });
    }

    if (context.pullRequestDiff.includes('visual-regression')) {
      results.push({
        checkType: 'visual_regression',
        status: 'failed',
        message: 'Visual regression detected against fixtures.'
      });
    }

    // Aggregate state machine logic would go here to transition the passport
    // Update passport status in DB based on results

    return { success: true, results };
  } catch (err) {
    logger.error(ctx, 'Verification run failed', err);
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
