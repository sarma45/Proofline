import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processOutbox } from '../lib/workers/outbox';
import { prisma } from '../lib/prisma';

// Mock console.log/warn/error to keep test output clean
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    outboxEvent: {
      findMany: vi.fn(),
      update: vi.fn(),
    }
  }
}));

describe('Outbox Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process pending github.check_update events and mark them as delivered', async () => {
    // Setup mock pending events
    const mockEvent = {
      id: 'event-1',
      topic: 'github.check_update',
      payload: JSON.stringify({ prNumber: 123, repoId: 'acme-corp/api-gateway', status: 'VERIFIED_FOR_SCOPE' }),
      status: 'pending',
      attempts: 0
    };
    
    ((prisma as any).outboxEvent.findMany as any).mockResolvedValue([mockEvent]);

    await processOutbox();

    expect((prisma as any).outboxEvent.findMany).toHaveBeenCalled();
    expect((prisma as any).outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'event-1' },
      data: expect.objectContaining({
        status: 'delivered',
        attempts: 1
      })
    });
  });

  it('should handle failures and increment attempts (and fail at 3 attempts)', async () => {
    const mockEvent = {
      id: 'event-2',
      topic: 'github.check_update',
      payload: 'invalid-json', // This will throw on JSON.parse
      status: 'pending',
      attempts: 2 // It's on its 3rd attempt
    };
    
    ((prisma as any).outboxEvent.findMany as any).mockResolvedValue([mockEvent]);

    await processOutbox();

    expect((prisma as any).outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'event-2' },
      data: expect.objectContaining({
        status: 'failed',
        attempts: 3
      })
    });
  });
});
