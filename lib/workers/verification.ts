import { prisma } from '../prisma';
import { allFixtures } from '../fixtures';

/**
 * MVP Verification Engine Worker
 * Simulates processing a verification run by mapping it to our fixture data.
 * In a real implementation, this would spin up isolated sandboxes, 
 * run the 5 MVP skills (Repository Cartographer, Scope Auditor, etc.), 
 * and execute CI tasks.
 */
export async function processVerificationRun(runId: string) {
  try {
    // 1. Lease the run
    const run = await prisma.verificationRun.update({
      where: { id: runId },
      data: { status: 'running', leasedUntil: new Date(Date.now() + 5 * 60000) },
      include: { passport: { include: { pullRequest: true } } }
    });

    if (!run) throw new Error(`Run ${runId} not found`);

    console.log(`[Worker] Started verification run for Passport ${run.passportId}`);

    // Simulate work delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Fetch mock fixture data for this repo/commit to simulate real evaluations
    const pr = run.passport.pullRequest;
    const fixture = allFixtures.find(f => f.proposedCommit === pr.proposedCommit) || allFixtures[0];

    // 3. Insert Verification Results (Mocking the Skill Evaluations)
    const results = [];
    for (const check of fixture.verification.checks) {
      const result = await prisma.verificationResult.create({
        data: {
          verificationRunId: run.id,
          checkType: check.type,
          status: check.status,
          message: check.summary,
          severity: check.status === 'passed' ? 'info' : 'high'
        }
      });
      results.push(result);
    }

    // 4. Update the Passport Status and Complete the Run (in a transaction)
    const hasFailures = results.some(r => r.status === 'failure' || r.status === 'error');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    let finalStatus = 'VERIFIED_FOR_SCOPE';
    let trigger = 'checks_done_clean';

    if (hasFailures) {
      finalStatus = 'BLOCKED';
      trigger = 'checks_done_blocked';
    } else if (hasWarnings) {
      finalStatus = 'HUMAN_REVIEW_REQUIRED';
      trigger = 'checks_done_human_needed';
    }

    const { AssuranceStateMachine } = await import('../state-machine');
    const transition = await AssuranceStateMachine.transition({
      passportId: run.passportId,
      actor: 'system:engine',
      fromStatus: run.passport.assuranceStatus as any,
      trigger: trigger
    });

    if (!transition.success) {
      throw new Error(`State machine rejected transition from EVIDENCE_COLLECTING via ${trigger}`);
    }

    await prisma.$transaction(async (tx) => {
      // Passport status already updated by state machine, but we update the run here
      await tx.verificationRun.update({
        where: { id: run.id },
        data: { status: 'completed', leasedUntil: null }
      });

      // Emit Outbox event to notify GitHub
      await (tx as any).outboxEvent.create({
        data: {
          topic: 'github.check_update',
          payload: JSON.stringify({
            passportId: run.passportId,
            prNumber: pr?.number,
            repoId: pr?.githubPrId.split('-')[0],
            status: finalStatus
          })
        }
      });
    });

    console.log(`[Worker] Completed verification run for Passport ${run.passportId}. Status -> ${finalStatus}`);

  } catch (error) {
    console.error(`[Worker] Failed to process run ${runId}:`, error);
    
    // Attempt to mark as failed
    await prisma.verificationRun.update({
      where: { id: runId },
      data: { status: 'failed', leasedUntil: null }
    }).catch(console.error);
  }
}
