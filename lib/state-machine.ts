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
        if (hasBlockingResults) {
          errorMsg = 'Cannot approve: passport has unresolved critical findings.';
        } else {
          nextStatus = 'VERIFIED_FOR_SCOPE';
        }
      } else if (req.trigger === 'conditional_approve') {
        nextStatus = 'CONDITIONAL_PASS';
      } else if (req.trigger === 'block') {
        nextStatus = 'BLOCKED';
      } else if (req.trigger === 'request_changes') {
        nextStatus = 'FAILED';
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
      // Optimistic concurrency locking on version
      const updateResult = await prisma.passport.updateMany({
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
        const msg = 'Concurrency conflict: passport was modified by another request.';
        await this.audit(req, fromStatus, false, msg, toStatus);
        return { success: false, error: msg };
      }

    } catch (err) {
      logger.error({ context: 'state-machine', passportId: req.passportId }, `DB update failed for ${req.passportId}`, err);
      const msg = 'Internal error during state transition.';
      await this.audit(req, fromStatus, false, msg, toStatus);
      return { success: false, error: msg };
    }

    // 2. Emit audit event
    await this.audit(req, fromStatus, true, `Transitioned to ${toStatus}`, toStatus);
    return { success: true, toStatus };
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
          details: JSON.stringify({
            fromStatus,
            toStatus,
            reason,
            accepted,
            payload: req.payload
          })
        }
      });
    } catch (err) {
      logger.error(ctx, 'Failed to write AuditEvent', err);
    }
  }
}
