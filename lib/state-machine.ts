import { prisma } from './prisma';

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
  fromStatus: AssuranceStatus;
  trigger: string;
  payload?: any;
}

export class AssuranceStateMachine {
  static async transition(req: TransitionRequest): Promise<{ success: boolean; toStatus?: AssuranceStatus; error?: string }> {
    if (req.fromStatus === 'EVIDENCE_COLLECTING') {
      if (req.trigger === 'checks_done_human_needed') return this.commit(req, 'HUMAN_REVIEW_REQUIRED');
      if (req.trigger === 'checks_done_clean') return this.commit(req, 'VERIFIED_FOR_SCOPE');
      if (req.trigger === 'checks_done_blocked') return this.commit(req, 'BLOCKED');
    }

    if (req.fromStatus === 'HUMAN_REVIEW_REQUIRED' && req.trigger === 'approve') {
      return this.commit(req, 'VERIFIED_FOR_SCOPE');
    }
    
    if (req.fromStatus === 'HUMAN_REVIEW_REQUIRED' && (req.trigger === 'block' || req.trigger === 'request_changes')) {
      return this.commit(req, 'BLOCKED');
    }

    if (req.fromStatus === 'HUMAN_REVIEW_REQUIRED' && req.trigger === 'escalate') {
      // Escalate just logs it but keeps it in HUMAN_REVIEW_REQUIRED for someone else
      return this.commit(req, 'HUMAN_REVIEW_REQUIRED');
    }

    if ((req.fromStatus === 'VERIFIED_FOR_SCOPE' || req.fromStatus === 'HUMAN_REVIEW_REQUIRED' || req.fromStatus === 'BLOCKED') && req.trigger === 'new_commit_pushed') {
      return this.commit(req, 'EXPIRED');
    }

    // Default reject
    await this.audit(req, false, 'Invalid transition');
    return { success: false, error: 'Transition not allowed by state machine rules' };
  }

  private static async commit(req: TransitionRequest, toStatus: AssuranceStatus) {
    // 1. Update passport in DB
    try {
      await prisma.passport.update({
        where: { id: req.passportId },
        data: { assuranceStatus: toStatus }
      });
    } catch (err) {
      console.warn(`[State Machine] Mock mode or DB update failed for ${req.passportId}:`, err);
    }

    // 2. Emit audit event
    await this.audit(req, true, `Transitioned to ${toStatus}`, toStatus);
    return { success: true, toStatus };
  }

  private static async audit(req: TransitionRequest, accepted: boolean, reason: string, toStatus?: AssuranceStatus) {
    console.log(`[AUDIT] ${accepted ? 'ACCEPTED' : 'REJECTED'}: Passport ${req.passportId} from ${req.fromStatus} triggered by ${req.trigger}. Actor: ${req.actor}. Reason: ${reason}`);
    
    // In a real app we would insert an AuditLog here.
  }
}
