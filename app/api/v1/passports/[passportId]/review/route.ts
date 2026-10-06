import { NextResponse } from 'next/server';
import { AssuranceStateMachine, AssuranceStatus } from '../../../../../../lib/state-machine';
import { prisma } from '../../../../../../lib/prisma';
import { getSessionProjectId } from '../../../../../../lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;
    const body = await request.json();
    
    const { decision, rationale, reviewedHash, currentStatus } = body;

    const projectId = await getSessionProjectId(request);
    if (!projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passport = await prisma.passport.findUnique({
      where: { id: passportId, projectId }
    });
    if (!passport) {
      return NextResponse.json({ error: "Passport not found" }, { status: 404 });
    }

    if (!decision || !reviewedHash || !currentStatus) {
      return NextResponse.json({
        code: "bad_request",
        message: "Missing required fields for review",
        retryable: false,
        request_id: crypto.randomUUID()
      }, { status: 400 });
    }

    // Attempt transition via State Machine
    const trigger = decision === 'approve' ? 'approve' : 'block';
    
    const transitionResult = await AssuranceStateMachine.transition({
      passportId,
      actor: 'user_123', // Stubbed auth
      trigger,
      payload: { rationale, reviewedHash }
    });

    if (!transitionResult.success) {
      return NextResponse.json({
        code: "conflict",
        message: transitionResult.error,
        retryable: false,
        request_id: crypto.randomUUID()
      }, { status: 409 });
    }

    // If successful, log the decision to HumanDecision table
    await prisma.humanDecision.create({
      data: {
        decision: decision.toUpperCase(),
        actor: 'user_123',
        rationale: rationale || null,
        reviewedHash: reviewedHash,
        passportId: passport.id
      }
    });

    return NextResponse.json({
      success: true,
      newStatus: transitionResult.toStatus
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      code: "internal_error",
      message: "An error occurred processing the review",
      retryable: true,
      request_id: crypto.randomUUID()
    }, { status: 500 });
  }
}
