import { prisma } from '../prisma';
import { logger } from '../logger';

export async function processOutbox() {
  const pendingEvents = await prisma.outboxEvent.findMany({
    where: { 
      status: { in: ['pending'] }
      // In a real system, we would also pick up 'processing' events where lastAttemptAt is older than lease timeout
    },
    orderBy: { createdAt: 'asc' },
    take: 50
  });

  if (pendingEvents.length === 0) return;

  logger.info({ context: 'outbox' }, `Found ${pendingEvents.length} pending events...`);

  for (const event of pendingEvents) {
    // 1. Optimistically claim (lease) the job
    const claim = await prisma.outboxEvent.updateMany({
      where: { id: event.id, status: 'pending' },
      data: { status: 'processing', lastAttemptAt: new Date() }
    });

    if (claim.count === 0) {
      // Someone else claimed it already
      continue;
    }

    try {
      // 1. Process the event based on its topic
      if (event.topic === 'github.check_update') {
        const payload = JSON.parse(event.payload);
        await notifyGitHub(payload);
      } else {
        logger.warn({ context: 'outbox', eventId: event.id }, `Unknown topic ${event.topic}`);
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
      logger.error({ context: 'outbox', eventId: event.id }, `Failed to process event`, error);
      
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

import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

async function notifyGitHub(payload: { passportId: string, prNumber: number, repoId: string, status: string, headSha?: string }) {
  const ctx = { context: 'github-api', repoId: payload.repoId, prNumber: payload.prNumber, passportId: payload.passportId };
  logger.info(ctx, `CheckRun update. Status: ${payload.status}`);
  
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;

  if (appId && privateKey) {
    try {
      // Find installation ID from repository -> project
      const repo = await prisma.repository.findUnique({
        where: { id: payload.repoId },
        include: { project: true }
      });
      
      const installationId = repo?.project?.githubInstallationId;
      if (!installationId) {
        logger.error(ctx, `Missing installationId for repo ${payload.repoId}`);
        return;
      }

      const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId,
          privateKey,
          installationId: Number(installationId)
        }
      });
      
      const [owner, repoName] = payload.repoId.split('/');

      await octokit.checks.create({
        owner,
        repo: repoName,
        name: 'Proofline Assurance',
        head_sha: payload.headSha || 'HEAD',
        status: payload.status === 'VERIFIED_FOR_SCOPE' || payload.status === 'HUMAN_REVIEW_REQUIRED' || payload.status === 'BLOCKED' ? 'completed' : 'in_progress',
        conclusion: payload.status === 'VERIFIED_FOR_SCOPE' ? 'success' : (payload.status === 'BLOCKED' ? 'failure' : 'action_required'),
        output: {
          title: `Proofline: ${payload.status}`,
          summary: `Assurance status is ${payload.status}. View passport: ${payload.passportId}`
        }
      });
      logger.info(ctx, `Check Run created successfully.`);
    } catch (e) {
      logger.error(ctx, `Failed to create check run`, e);
    }
  } else {
    // Simulate network delay for mock execution when credentials are not present
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

