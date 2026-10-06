import { prisma } from './prisma';
import { logger } from './logger';

export type AssuranceStatus = 
  | 'UNASSESSED'
  | 'EVIDENCE_COLLECTING'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'CONDITIONAL_PASS'
  | 'BLOCKED'
  | 'VERIFIED_FOR_SCOPE'
  | 'EXPIRED'
  | 'FAILED'
  | 'CANCELLED';

export interface TransitionRequest {
  passportId: string;
  actor: string;
  trigger: string;
  payload?: any;
}

export class AssuranceStateMachine {
  static async transition(req: TransitionRequest): Promise<{ success: boolean; toStatus?: AssuranceStatus; error?: string }> {
    const passport = await prisma.passport.findUnique({
      where: { id: req.passportId },
      include: {
        verificationRuns: {
          include: { results: true }
        }
      }
    });

    if (!passport) {
      return { success: false, error: 'Passport not found' };
    }

    const currentStatus = passport.assuranceStatus as AssuranceStatus;
    let nextStatus: AssuranceStatus | null = null;
    let errorMsg: string | null = null;

    if (currentStatus === 'UNASSESSED' && req.trigger === 'start') {
      nextStatus = 'EVIDENCE_COLLECTING';
    } else if (currentStatus === 'EVIDENCE_COLLECTING') {
      if (req.trigger === 'checks_done_human_needed') nextStatus = 'HUMAN_REVIEW_REQUIRED';
      if (req.trigger === 'checks_done_clean') nextStatus = 'VERIFIED_FOR_SCOPE';
      if (req.trigger === 'checks_done_blocked') nextStatus = 'BLOCKED';
    } else if (currentStatus === 'HUMAN_REVIEW_REQUIRED') {
      if (req.trigger === 'approve') {
        // Enforce prerequisites server-side
        const hasBlockingResults = passport.verificationRuns.some(run => 
          run.results.some(res => res.severity === 'critical' && res.status !== 'pass')
        );
        const hasIncompleteRuns = passport.verificationRuns.some(run => run.status !== 'completed');
        
        // In a real app we'd compare req.payload.reviewedHash to passport.pullRequest.proposedCommit
        if (hasBlockingResults) {
          errorMsg = 'Cannot approve: passport has unresolved critical findings.';
        } else if (hasIncompleteRuns) {
          errorMsg = 'Cannot approve: verification checks are still running.';
        } else if (!req.payload?.reviewedHash) {
          errorMsg = 'Cannot approve: reviewedHash missing from payload.';
        } else {
          nextStatus = 'VERIFIED_FOR_SCOPE';
        }
      } else if (req.trigger === 'conditional_approve') {
        if (!req.payload?.reviewedHash) {
          errorMsg = 'Cannot conditionally approve: reviewedHash missing.';
        } else {
          nextStatus = 'CONDITIONAL_PASS';
        }
      } else if (req.trigger === 'block') {
        nextStatus = 'BLOCKED';
      } else if (req.trigger === 'request_changes') {
        // Semantic fix: requesting changes means it stays in review or goes back to collecting
        // We'll keep it in HUMAN_REVIEW_REQUIRED but log the decision.
        nextStatus = 'HUMAN_REVIEW_REQUIRED';
      } else if (req.trigger === 'escalate') {
        nextStatus = 'HUMAN_REVIEW_REQUIRED';
      }
    } else if (req.trigger === 'new_commit_pushed' && ['VERIFIED_FOR_SCOPE', 'CONDITIONAL_PASS', 'HUMAN_REVIEW_REQUIRED', 'BLOCKED'].includes(currentStatus)) {
      nextStatus = 'EXPIRED';
    } else if (req.trigger === 'cancel') {
      nextStatus = 'CANCELLED';
    } else if (req.trigger === 'reverify') {
      nextStatus = 'EVIDENCE_COLLECTING';
    }

    if (errorMsg) {
      await this.audit(req, currentStatus, false, errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!nextStatus) {
      await this.audit(req, currentStatus, false, 'Transition not allowed by state machine rules');
      return { success: false, error: 'Transition not allowed by state machine rules' };
    }

    return this.commit(req, currentStatus, nextStatus, passport.version);
  }

  private static async commit(req: TransitionRequest, fromStatus: AssuranceStatus, toStatus: AssuranceStatus, currentVersion: number) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Optimistic concurrency locking on version
        const updateResult = await tx.passport.updateMany({
          where: { 
            id: req.passportId,
            version: currentVersion
          },
          data: { 
            assuranceStatus: toStatus,
            version: currentVersion + 1
          }
        });

        if (updateResult.count === 0) {
          throw new Error('Concurrency conflict: passport was modified by another request.');
        }

        // 2. Emit audit event
        const reason = `Transitioned to ${toStatus}`;
        await tx.auditEvent.create({
          data: {
            passportId: req.passportId,
            action: req.trigger,
            actor: req.actor,
            details: {
              fromStatus,
              toStatus,
              reason,
              accepted: true,
              payload: req.payload
            }
          }
        });

        // 3. Record Human Decision if applicable
        if (['approve', 'conditional_approve', 'block', 'request_changes'].includes(req.trigger)) {
          await tx.humanDecision.create({
            data: {
              passportId: req.passportId,
              decision: req.trigger,
              actor: req.actor,
              rationale: req.payload?.rationale || null,
              reviewedHash: req.payload?.reviewedHash || 'unknown'
            }
          });
        }

        return true;
      });

      return { success: true, toStatus };
    } catch (err: any) {
      logger.error({ context: 'state-machine', passportId: req.passportId }, `DB update failed for ${req.passportId}`, err);
      const msg = err.message.includes('Concurrency conflict') ? err.message : 'Internal error during state transition.';
      // Note: We log the rejection outside the transaction since the tx rolled back.
      await this.audit(req, fromStatus, false, msg, toStatus);
      return { success: false, error: msg };
    }
  }

  private static async audit(req: TransitionRequest, fromStatus: AssuranceStatus, accepted: boolean, reason: string, toStatus?: AssuranceStatus) {
    const ctx = { context: 'audit', passportId: req.passportId, actor: req.actor, accepted };
    logger.info(ctx, `${accepted ? 'ACCEPTED' : 'REJECTED'}: from ${fromStatus} triggered by ${req.trigger}. Reason: ${reason}`);
    
    try {
      await prisma.auditEvent.create({
        data: {
          passportId: req.passportId,
          action: req.trigger,
          actor: req.actor,
          details: {
            fromStatus,
            toStatus,
            reason,
            accepted,
            payload: req.payload
          }
        }
      });
    } catch (err) {
      logger.error(ctx, 'Failed to write AuditEvent', err);
    }
  }
}
