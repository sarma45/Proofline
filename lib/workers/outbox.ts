import { prisma } from '../prisma';

export async function processOutbox() {
  const pendingEvents = await prisma.outboxEvent.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    take: 50
  });

  if (pendingEvents.length === 0) return;

  console.log(`[Outbox] Processing ${pendingEvents.length} pending events...`);

  for (const event of pendingEvents) {
    try {
      // 1. Process the event based on its topic
      if (event.topic === 'github.check_update') {
        const payload = JSON.parse(event.payload);
        await notifyGitHub(payload);
      } else {
        console.warn(`[Outbox] Unknown topic ${event.topic}`);
      }

      // 2. Mark as delivered
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: 'delivered',
          attempts: event.attempts + 1,
          lastAttemptAt: new Date()
        }
      });
      
    } catch (error) {
      console.error(`[Outbox] Failed to process event ${event.id}:`, error);
      
      const newAttempts = event.attempts + 1;
      const newStatus = newAttempts >= 3 ? 'failed' : 'pending';
      
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: newStatus,
          attempts: newAttempts,
          lastAttemptAt: new Date()
        }
      });
    }
  }
}

async function notifyGitHub(payload: { passportId: string, prNumber: number, repoId: string, status: string }) {
  // In a real implementation, this would use an Octokit client with an Installation Token
  // to create or update a Check Run on the PR.
  console.log(`[GitHub API] Mock CheckRun update for PR #${payload.prNumber} in ${payload.repoId}. Status: ${payload.status}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
}
