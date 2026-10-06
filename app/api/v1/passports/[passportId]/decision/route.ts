import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { AssuranceStateMachine } from '../../../../../../lib/state-machine';
import crypto from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;
    const body = await request.json();
    
    // Validate request
    const validDecisions = ['approve', 'request_changes', 'block', 'escalate'];
    if (!validDecisions.includes(body.decision)) {
      return NextResponse.json({ error: `Invalid decision. Must be one of: ${validDecisions.join(', ')}` }, { status: 400 });
    }

    // MVP: Simulate resolving tenant/project from Auth context
    const mockSessionProjectId = (await prisma.project.findFirst())?.id;

    if (!mockSessionProjectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passport = await prisma.passport.findUnique({
      where: { 
        id: passportId,
        projectId: mockSessionProjectId 
      },
      include: { pullRequest: true }
    });

    if (!passport) {
      return NextResponse.json({ error: "Passport not found or unauthorized" }, { status: 404 });
    }

    // Use State Machine to enforce transitions
    const transitionResult = await AssuranceStateMachine.transition({
      passportId,
      actor: 'user_123',
      fromStatus: passport.assuranceStatus as any,
      trigger: body.decision, // matches 'approve', 'request_changes', 'block', 'escalate'
      payload: { rationale: body.rationale }
    });

    if (!transitionResult.success || !transitionResult.toStatus) {
      return NextResponse.json({ error: transitionResult.error || "Transition blocked by state machine" }, { status: 400 });
    }

    const finalStatus = transitionResult.toStatus;
    
    // Hash the rationale to meet the `reviewedHash` requirement
    const hash = crypto.createHash('sha256').update(body.rationale || body.decision).digest('hex');

    // Run additional inserts in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Save Human Decision
      await tx.humanDecision.create({
        data: {
          decision: body.decision.toUpperCase(),
          rationale: body.rationale || null,
          reviewedHash: hash,
          passportId: passport.id
        }
      });

      // 2. State Machine already updated the passport in DB in commit(), but if we wanted transactionality 
      //    we would pass `tx` to the state machine. For MVP, we'll let SM update it separately or we just 
      //    know it's updated. Wait, to maintain consistency with `tx`, we'll let SM update it.

      // 3. Emit Outbox Event to notify GitHub
      await tx.outboxEvent.create({
        data: {
          topic: 'github.check_update',
          payload: JSON.stringify({
            passportId: passport.id,
            prNumber: passport.pullRequest?.number,
            repoId: passport.pullRequest?.githubPrId.split('-')[0],
            status: finalStatus
          })
        }
      });
    });

    return NextResponse.json({ success: true, status: finalStatus });

  } catch (error) {
    console.error('Failed to record human decision:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
