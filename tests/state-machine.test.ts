import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssuranceStateMachine } from '../lib/state-machine';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    passport: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    auditEvent: {
      create: vi.fn(),
    }
  }
}));

describe('Assurance State Machine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.passport.findUnique).mockResolvedValue({
      id: 'test-1',
      assuranceStatus: 'EVIDENCE_COLLECTING',
      version: 1,
      verificationRuns: []
    } as any);
    vi.mocked(prisma.passport.updateMany).mockResolvedValue({ count: 1 });
  });

  describe('Valid Transitions', () => {
    it('should transition EVIDENCE_COLLECTING -> VERIFIED_FOR_SCOPE on checks_done_clean', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'system',
        trigger: 'checks_done_clean'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('VERIFIED_FOR_SCOPE');
      expect(prisma.passport.updateMany).toHaveBeenCalledWith({
        where: { id: 'test-1', version: 1 },
        data: { assuranceStatus: 'VERIFIED_FOR_SCOPE', version: 2 }
      });
      expect(prisma.auditEvent.create).toHaveBeenCalled();
    });

    it('should transition EVIDENCE_COLLECTING -> HUMAN_REVIEW_REQUIRED on checks_done_human_needed', async () => {
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'system',
        trigger: 'checks_done_human_needed'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('HUMAN_REVIEW_REQUIRED');
    });

    it('should transition HUMAN_REVIEW_REQUIRED -> VERIFIED_FOR_SCOPE on approve', async () => {
      vi.mocked(prisma.passport.findUnique).mockResolvedValue({ id: 'test-1', assuranceStatus: 'HUMAN_REVIEW_REQUIRED', version: 1, verificationRuns: [] } as any);
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        trigger: 'approve'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('VERIFIED_FOR_SCOPE');
    });

    it('should transition HUMAN_REVIEW_REQUIRED -> BLOCKED on block', async () => {
      vi.mocked(prisma.passport.findUnique).mockResolvedValue({ id: 'test-1', assuranceStatus: 'HUMAN_REVIEW_REQUIRED', version: 1, verificationRuns: [] } as any);
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        trigger: 'block'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('BLOCKED');
    });
    
    it('should remain HUMAN_REVIEW_REQUIRED on escalate', async () => {
      vi.mocked(prisma.passport.findUnique).mockResolvedValue({ id: 'test-1', assuranceStatus: 'HUMAN_REVIEW_REQUIRED', version: 1, verificationRuns: [] } as any);
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        trigger: 'escalate'
      });
      
      expect(result.success).toBe(true);
      expect(result.toStatus).toBe('HUMAN_REVIEW_REQUIRED');
    });

    it('should transition to EXPIRED on new_commit_pushed from terminal states', async () => {
      vi.mocked(prisma.passport.findUnique).mockResolvedValue({ id: 'test-1', assuranceStatus: 'VERIFIED_FOR_SCOPE', version: 1, verificationRuns: [] } as any);
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'system',
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
        trigger: 'approve'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/not allowed/);
      expect(prisma.passport.update).not.toHaveBeenCalled();
    });

    it('should block UNASSESSED -> VERIFIED_FOR_SCOPE (no such transition)', async () => {
      vi.mocked(prisma.passport.findUnique).mockResolvedValue({ id: 'test-1', assuranceStatus: 'UNASSESSED', version: 1, verificationRuns: [] } as any);
      const result = await AssuranceStateMachine.transition({
        passportId: 'test-1',
        actor: 'user',
        trigger: 'checks_done_clean'
      });
      
      expect(result.success).toBe(false);
    });
  });
});
