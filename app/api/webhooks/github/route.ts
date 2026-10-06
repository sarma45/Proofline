import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { processVerificationRun } from '../../../../lib/workers/verification';
import crypto from 'crypto';

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

    // 1. Verify Webhook Signature (MVP)
    // In production, we strictly enforce this. For local dev without a secret, we might bypass.
    if (process.env.NODE_ENV === 'production' && !verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (!event || !deliveryId) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
    }

    // 2. Deduplicate Delivery
    const existingDelivery = await prisma.githubWebhookDelivery.findUnique({
      where: { id: deliveryId }
    });

    if (existingDelivery) {
      return NextResponse.json({ message: 'Already processed' }, { status: 200 });
    }

    const payload = JSON.parse(rawBody);
    const action = payload.action;

    // 3. Store Delivery
    await prisma.githubWebhookDelivery.create({
      data: {
        id: deliveryId,
        event,
        action,
        payload: rawBody
      }
    });

    // 4. Route Event Logic
    if (event === 'pull_request') {
      await handlePullRequestEvent(action, payload);
    } else if (event === 'ping') {
      console.log('GitHub Webhook Ping received.');
    } else {
      console.log(`Unhandled GitHub event: ${event}`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePullRequestEvent(action: string, payload: any) {
  // We only care about opened or synchronized PRs for creating/updating passports
  if (!['opened', 'synchronize', 'reopened'].includes(action)) {
    return;
  }

  const { pull_request: pr, repository } = payload;
  
  // Find or create repository
  // In a real app, the organization/project mapping would be resolved via the installation ID.
  // For MVP, we'll connect it to our seeded "Acme Corp" / "Core Platform" project.
  const project = await prisma.project.findFirst();
  if (!project) throw new Error('No project found to associate PR with.');

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

  // Create a new Passport for this specific commit hash pair
  // If the PR is updated (synchronized), we generate a NEW passport, ensuring immutability.
  const passport = await prisma.passport.create({
    data: {
      assuranceStatus: 'EVIDENCE_COLLECTING',
      scopeSummary: 'Evaluating PR Changes',
      policyVersion: '1.0.0', // Would resolve from Project settings
      projectId: project.id,
      pullRequestId: prRecord.id
    }
  });

  // Create the Verification Run intent to be picked up by the Worker/Engine
  const run = await prisma.verificationRun.create({
    data: {
      status: 'pending',
      passportId: passport.id
    }
  });

  console.log(`Created Passport ${passport.id} for PR #${pr.number} (${action})`);

  // Asynchronously trigger the worker (fire and forget)
  // In a production environment this would be pushed to a queue (SQS/Redis).
  processVerificationRun(run.id).catch(e => console.error("Worker error:", e));
}
