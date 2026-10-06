import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { AssuranceStateMachine } from '../../../../../../lib/state-machine';
import { getSessionProjectId } from '../../../../../../lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;

    // Resolve tenant/project from Auth context
    const mockSessionProjectId = await getSessionProjectId(request);

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

    // Force transition back to EVALUATING via State Machine
    const transitionResult = await AssuranceStateMachine.transition({
      passportId,
      actor: 'user_reverify',
      trigger: 'new_commit_pushed', // Or another appropriate trigger if we create one for manual re-verify
      payload: { rationale: 'Manual re-verification triggered' }
    });

    if (!transitionResult.success) {
      return NextResponse.json({ error: transitionResult.error }, { status: 400 });
    }

    // We can simulate re-queuing it
    await prisma.$transaction(async (tx) => {
      // Create new run
      await tx.verificationRun.create({
        data: {
          passportId: passport.id,
          status: 'pending'
        }
      });
      // (State machine already updated the status, but if we need an outbox event, we can add it here)
    });

    return NextResponse.json({ success: true, status: transitionResult.toStatus });

  } catch (error) {
    console.error('Failed to reverify passport:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
