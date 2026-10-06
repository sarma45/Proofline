import { processOutbox } from '../lib/workers/outbox';
import { prisma } from '../lib/prisma';
import { processVerificationRun } from '../lib/workers/verification';

let isShuttingDown = false;

// Handle graceful shutdown
process.on('SIGINT', () => { isShuttingDown = true; console.log('Shutting down worker...'); process.exit(0); });
process.on('SIGTERM', () => { isShuttingDown = true; console.log('Shutting down worker...'); process.exit(0); });

async function main() {
  console.log('[Worker] Starting background worker daemon...');
  
  // Basic polling loop
  while (!isShuttingDown) {
    try {
      // Poll outbox
      await processOutbox();
      
      // Poll Verification Runs
      const pendingRuns = await prisma.verificationRun.findMany({
        where: { status: 'pending' },
        take: 10
      });
      
      if (pendingRuns.length > 0) {
        console.log(`[Worker] Found ${pendingRuns.length} pending verification runs.`);
        for (const run of pendingRuns) {
          try {
            // We should use processVerificationRun but since worker script is separated, we need to import it
            await processVerificationRun(run.id);
          } catch (err) {
            console.error(`[Worker] Failed to process verification run ${run.id}:`, err);
          }
        }
      }

    } catch (e) {
      console.error('[Worker] Error in background polling loop:', e);
    }
    
    // Sleep 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main();
