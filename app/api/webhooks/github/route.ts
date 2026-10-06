import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { processVerificationRun } from '../../../../lib/workers/verification';
import crypto from 'crypto';
import { logger } from '../../../../lib/logger';

// Replace with your actual GitHub App Webhook Secret from env
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'development-secret';

function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(payload).digest('hex')}`;
  
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch (e) {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    const deliveryId = request.headers.get('x-github-delivery');
    const reqId = crypto.randomUUID();
    const ctx = { reqId, deliveryId, event };

    if (!process.env.GITHUB_WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
      logger.error(ctx, 'GITHUB_WEBHOOK_SECRET is missing in production!');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    if (process.env.GITHUB_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (!event || !deliveryId) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
    }

    // 2. Deduplicate Delivery (Atomic)
    const payload = JSON.parse(rawBody);
    const action = payload.action;

    const redactedPayload = {
      action: payload.action,
      repository: payload.repository?.full_name,
      sender: payload.sender?.login,
      installation: payload.installation?.id
    };

    try {
      await prisma.githubWebhookDelivery.create({
        data: {
          id: deliveryId,
          event,
          action,
          payload: redactedPayload
        }
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Unique constraint violation means we already processed this delivery
        return NextResponse.json({ message: 'Already processed' }, { status: 200 });
      }
      throw e;
    }

    // 4. Route Event Logic
    if (event === 'pull_request') {
      await handlePullRequestEvent(action, payload, ctx);
    } else if (event === 'ping') {
      logger.info(ctx, 'GitHub Webhook Ping received.');
    } else {
      logger.info(ctx, `Unhandled GitHub event: ${event}`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    logger.error({ reqId: crypto.randomUUID() }, 'Webhook processing failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePullRequestEvent(action: string, payload: any, ctx: Record<string, any>) {
  // We only care about opened or synchronized PRs for creating/updating passports
  if (!['opened', 'synchronize', 'reopened'].includes(action)) {
    return;
  }

  const { pull_request: pr, repository, installation } = payload;
  
  if (!installation?.id) {
    logger.error(ctx, 'No installation ID found in webhook payload');
    return;
  }

  // Find or create repository
  // Map via GitHub installation_id -> org/project
  const project = await prisma.project.findUnique({
    where: { githubInstallationId: installation.id.toString() }
  });

  if (!project) {
    logger.error(ctx, `No project found mapped to installation ID ${installation.id}`);
    return;
  }

  const repo = await prisma.repository.upsert({
    where: { githubRepoId: repository.full_name },
    update: {},
    create: {
      githubRepoId: repository.full_name,
      fullName: repository.full_name,
      projectId: project.id
    }
  });

  // Upsert the Pull Request
  const prRecord = await prisma.pullRequest.upsert({
    where: { githubPrId: `${repository.full_name}-${pr.number}` },
    update: {
      title: pr.title,
      proposedCommit: pr.head.sha,
      baseCommit: pr.base.sha,
    },
    create: {
      githubPrId: `${repository.full_name}-${pr.number}`,
      number: pr.number,
      title: pr.title,
      baseCommit: pr.base.sha,
      proposedCommit: pr.head.sha,
      repositoryId: repo.id
    }
  });

  await prisma.$transaction(async (tx) => {
    // Create a new Passport for this specific commit hash pair
    // If the PR is updated (synchronized), we generate a NEW passport, ensuring immutability.
    const passport = await tx.passport.create({
      data: {
        assuranceStatus: 'EVIDENCE_COLLECTING',
        scopeSummary: 'Evaluating PR Changes',
        policyVersion: '1.0.0', // Would resolve from Project settings
        projectId: project.id,
        pullRequestId: prRecord.id
      }
    });

    // Create the Verification Run intent to be picked up by the Worker/Engine
    const run = await tx.verificationRun.create({
      data: {
        status: 'pending',
        passportId: passport.id
      }
    });

    logger.info(ctx, `Created Passport ${passport.id} for PR #${pr.number} (${action})`);

    // Enqueue verification job via Outbox
    await tx.outboxEvent.create({
      data: {
        topic: 'verification.start',
        payload: { runId: run.id }
      }
    });
  });
}
