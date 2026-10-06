import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssuranceStateMachine } from '../lib/state-machine';
import { prisma } from '../lib/prisma';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    passport: {
      update: vi.fn(),
    }
  }
}));

describe('Assurance State Machine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid Transitions', () => {
    it('should transition EVIDENCE_COLLECTING -> VERIFIED_FOR_SCOPE on checks_done_clean', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'system',
        fromStatus: 'EVIDENCE_COLLECTING',
        trigger: 'checks_done_clean'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('VERIFIED_FOR_SCOPE');
      expect(prisma.passport.update).toHaveBeenCalledWith({
        where: { id: 'test-1' },
        data: { assuranceStatus: 'VERIFIED_FOR_SCOPE' }
      });
    });

    it('should transition EVIDENCE_COLLECTING -> HUMAN_REVIEW_REQUIRED on checks_done_human_needed', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'system',
        fromStatus: 'EVIDENCE_COLLECTING',
        trigger: 'checks_done_human_needed'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('HUMAN_REVIEW_REQUIRED');
    });

    it('should transition HUMAN_REVIEW_REQUIRED -> VERIFIED_FOR_SCOPE on approve', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        fromStatus: 'HUMAN_REVIEW_REQUIRED',
        trigger: 'approve'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('VERIFIED_FOR_SCOPE');
    });

    it('should transition HUMAN_REVIEW_REQUIRED -> BLOCKED on block', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        fromStatus: 'HUMAN_REVIEW_REQUIRED',
        trigger: 'block'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('BLOCKED');
    });
    
    it('should remain HUMAN_REVIEW_REQUIRED on escalate', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        fromStatus: 'HUMAN_REVIEW_REQUIRED',
        trigger: 'escalate'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('HUMAN_REVIEW_REQUIRED');
    });

    it('should transition to EXPIRED on new_commit_pushed from terminal states', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'system',
        fromStatus: 'VERIFIED_FOR_SCOPE',
        trigger: 'new_commit_pushed'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('EXPIRED');
    });
  });

  describe('Invalid Transitions', () => {
    it('should block EVIDENCE_COLLECTING -> VERIFIED_FOR_SCOPE on approve (wrong trigger for state)', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        fromStatus: 'EVIDENCE_COLLECTING',
        trigger: 'approve'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/not allowed/);
      expect(prisma.passport.update).not.toHaveBeenCalled();
    });

    it('should block UNASSESSED -> VERIFIED_FOR_SCOPE (no such transition)', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        fromStatus: 'UNASSESSED',
        trigger: 'checks_done_clean'
      });
      
      expect(result.success).toBe(false);
    });
  });
});
