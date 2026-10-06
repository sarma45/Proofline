import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as decisionRoute } from '../app/api/v1/passports/[passportId]/decision/route';
import { GET as getRoute } from '../app/api/v1/passports/[passportId]/route';
import { prisma } from '../lib/prisma';
import { AssuranceStateMachine } from '../lib/state-machine';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    project: {
      findFirst: vi.fn(),
    },
    passport: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  }
}));

vi.mock('../lib/state-machine', () => ({
  AssuranceStateMachine: {
    transition: vi.fn(),
  }
}));

// Helper to create mock request
const createMockRequest = (body: any) => {
  return {
    json: async () => body,
  } as Request;
};

describe('API Route Contracts & Isolation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tenant Isolation', () => {
    it('GET /passports/:id should return 401 if unauthorized (no session project)', async () => {
      (prisma.project.findFirst as any).mockResolvedValue(null);
      
      const res = await getRoute(new Request('http://localhost'), { params: { passportId: '123' } });
      expect(res.status).toBe(401);
    });

    it('GET /passports/:id should query with projectId to enforce tenant isolation', async () => {
      (prisma.project.findFirst as any).mockResolvedValue({ id: 'tenant-a' });
      (prisma.passport.findUnique as any).mockResolvedValue(null);
      
      await getRoute(new Request('http://localhost'), { params: { passportId: '123' } });
      
      expect(prisma.passport.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '123', projectId: 'tenant-a' } // Crucial isolation check
        })
      );
    });
  });

  describe('Decision Contracts', () => {
    it('POST /decision should reject invalid decision strings', async () => {
      const req = createMockRequest({ decision: 'maybe', rationale: 'idk' });
      const res = await decisionRoute(req, { params: { passportId: '123' } });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/Invalid decision/);
    });

    it('POST /decision should process valid decisions via State Machine', async () => {
      (prisma.project.findFirst as any).mockResolvedValue({ id: 'tenant-a' });
      (prisma.passport.findUnique as any).mockResolvedValue({ id: '123', assuranceStatus: 'HUMAN_REVIEW_REQUIRED' });
      (AssuranceStateMachine.transition as any).mockResolvedValue({ success: true, toStatus: 'VERIFIED_FOR_SCOPE' });
      (prisma.$transaction as any).mockResolvedValue(true);

      const req = createMockRequest({ decision: 'approve', rationale: 'looks good' });
      const res = await decisionRoute(req, { params: { passportId: '123' } });
      
      expect(res.status).toBe(200);
      expect(AssuranceStateMachine.transition).toHaveBeenCalledWith({
        passportId: '123',
        actor: 'user_123', // Hardcoded MVP actor
        fromStatus: 'HUMAN_REVIEW_REQUIRED',
        trigger: 'approve',
        payload: { rationale: 'looks good' }
      });
    });
  });
});
