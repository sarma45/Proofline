import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function run() {
  const runId = `retention-${Date.now()}`;
  const ctx = { context: 'retention-job', runId };
  
  logger.info(ctx, 'Starting 180-day evidence retention job');

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 180);

  try {
    // 1. Delete EvidenceArtifacts older than 180 days based on createdAt, 
    // or where retentionUntil is past.
    const deletedArtifacts = await prisma.evidenceArtifact.deleteMany({
      where: {
        isLegalHold: false,
        OR: [
          { createdAt: { lt: cutoff } },
          { retentionUntil: { lt: new Date() } }
        ]
      }
    });

    logger.info(ctx, `Archived/deleted ${deletedArtifacts.count} evidence artifacts`);

    // 2. Optionally, delete passports/verification runs that are fully obsolete if business logic dictates.
    // For now, MVP retention job only focuses on evidence blobs/artifacts to reduce storage costs.

  } catch (error) {
    logger.error(ctx, 'Error running retention job', error);
  } finally {
    await prisma.$disconnect();
    logger.info(ctx, 'Retention job completed');
  }
}

if (require.main === module) {
  run().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
