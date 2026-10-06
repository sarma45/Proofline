import { prisma } from '../lib/prisma';
import { processVerificationRun } from '../lib/workers/verification';
import { processOutbox } from '../lib/workers/outbox';

async function main() {
  const scenario = process.argv[2] || 'clean';
  console.log(`🚀 Starting End-to-End Workflow Simulation (Scenario: ${scenario})...`);

  // Map scenario to fixture proposedCommit
  let commitHash = 'def5678'; // fixture1 (clean/human review)
  if (scenario === 'clean') {
    commitHash = 'abc9999'; // fixture2 (clean)
  } else if (scenario === 'blocked') {
    commitHash = 'bad6666'; // fixture3 (blocked)
  } else if (scenario === 'human') {
    commitHash = 'def5678'; // fixture1 (human review required/has warnings)
  }

  console.log(`Using proposed commit: ${commitHash} to trigger fixture behavior.`);

  // 1. Setup Tenant and Repository
  const org = await prisma.organization.upsert({
    where: { id: 'org-a' },
    update: {},
    create: {
      id: 'org-a',
      name: 'Acme Corp'
    }
  });

  const project = await prisma.project.upsert({
    where: { id: 'project-a' },
    update: {},
    create: {
      id: 'project-a',
      name: 'Core Platform',
      organizationId: org.id
    }
  });

  const repo = await prisma.repository.upsert({
    where: { githubRepoId: 'acme-corp/api-gateway' },
    update: {},
    create: {
      githubRepoId: 'acme-corp/api-gateway',
      fullName: 'acme-corp/api-gateway',
      projectId: project.id
    }
  });

  // 2. Simulate Webhook: PR Opened
  console.log("📦 Simulating GitHub Webhook: PR Opened...");
  const prId = `acme-corp/api-gateway-${Date.now()}`;
  const prRecord = await prisma.pullRequest.create({
    data: {
      githubPrId: prId,
      number: Math.floor(Math.random() * 10000),
      title: `Feature: Add Export Endpoint (${scenario})`,
      baseCommit: 'abc1234',
      proposedCommit: commitHash,
      repositoryId: repo.id
    }
  });

  // 3. Webhook creates Passport & Verification Run
  const passport = await prisma.passport.create({
    data: {
      assuranceStatus: 'EVIDENCE_COLLECTING',
      scopeSummary: `Evaluating PR Changes (${scenario})`,
      policyVersion: '1.0.0',
      projectId: project.id,
      pullRequestId: prRecord.id
    }
  });

  const run = await prisma.verificationRun.create({
    data: {
      status: 'pending',
      passportId: passport.id
    }
  });

  console.log(`✅ Passport created! ID: ${passport.id}`);
  console.log("⚙️  Engine Worker picking up run...");

  // 4. Worker processes the run
  await processVerificationRun(run.id);

  // 5. Worker processes the outbox
  console.log("📬 Processing outbox events (simulating GitHub Checks API)...");
  await processOutbox();

  // 6. Verify Final State
  const finalPassport = await prisma.passport.findUnique({
    where: { id: passport.id },
    include: {
      verificationRuns: { include: { results: true } }
    }
  });

  console.log("\n=============================================");
  console.log(`🏁 END-TO-END SIMULATION COMPLETE (${scenario.toUpperCase()})`);
  console.log(`Passport Status:  ${finalPassport?.assuranceStatus}`);
  console.log(`Verification:     ${finalPassport?.verificationRuns[0]?.results.length || 0} checks performed`);
  console.log(`Outbox:           Check update delivered to GitHub`);
  console.log("\n👀 To view this passport in the UI, start the dev server (npm run dev) and visit:");
  console.log(`http://localhost:3000/passports/${passport.id}/brief`);
  console.log("=============================================\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
