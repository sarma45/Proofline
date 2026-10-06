import { PrismaClient } from '@prisma/client';
import { allFixtures } from '../lib/fixtures';
import { storeEvidenceBlob } from '../lib/blobStorage';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with fixtures...');

  // Create default org and project
  const org = await prisma.organization.create({
    data: { name: 'Acme Corp' }
  });

  const project = await prisma.project.create({
    data: {
      name: 'Core Platform',
      organizationId: org.id
    }
  });

  const repo = await prisma.repository.create({
    data: {
      githubRepoId: 'acme-corp/api-gateway',
      fullName: 'acme-corp/api-gateway',
      projectId: project.id
    }
  });

  for (const fixture of allFixtures) {
    const pr = await prisma.pullRequest.upsert({
      where: { githubPrId: fixture.repo + '-' + fixture.proposedCommit },
      update: {},
      create: {
        githubPrId: fixture.repo + '-' + fixture.proposedCommit,
        number: Math.floor(Math.random() * 1000),
        title: fixture.intent.summary,
        baseCommit: fixture.baseCommit,
        proposedCommit: fixture.proposedCommit,
        repositoryId: repo.id
      }
    });

    const passport = await prisma.passport.create({
      data: {
        id: fixture.id,
        assuranceStatus: fixture.status,
        scopeSummary: fixture.scopeSummary,
        policyVersion: fixture.policyVersion,
        version: 1,
        projectId: project.id,
        pullRequestId: pr.id,
      }
    });

    const run = await prisma.verificationRun.create({
      data: {
        status: 'completed',
        passportId: passport.id
      }
    });

    for (const check of fixture.verification.checks) {
      await prisma.verificationResult.create({
        data: {
          checkType: check.type,
          status: check.status,
          message: check.summary,
          severity: 'info',
          verificationRunId: run.id
        }
      });
    }

    // Store rich evidence in blob storage
    await storeEvidenceBlob({
      passportId: passport.id,
      contentType: 'application/json',
      content: JSON.stringify({
        changeMap: fixture.changeMap,
        unknowns: fixture.unknowns,
        plan: fixture.intent,
      })
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
