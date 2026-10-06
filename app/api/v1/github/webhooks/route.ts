import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const deliveryId = request.headers.get('x-github-delivery');
    const event = request.headers.get('x-github-event');
    const signature = request.headers.get('x-hub-signature-256');

    if (!deliveryId || !event) {
      return NextResponse.json({
        code: "bad_request",
        message: "Missing GitHub webhook headers",
        retryable: false,
        retry_class: "none",
        request_id: crypto.randomUUID()
      }, { status: 400 });
    }

    const payload = await request.json();

    // 1. Verify signature (stubbed for MVP)
    // const isValid = await verifySignature(signature, payload, process.env.GITHUB_WEBHOOK_SECRET);
    
    // 2. Dedupe on delivery_id
    // const existing = await prisma.githubWebhookDelivery.findUnique({ where: { id: deliveryId } });
    // if (existing) {
    //   return NextResponse.json({ message: "Already processed" }, { status: 200 });
    // }
    
    // 3. Store delivery and enqueue verification job
    // await prisma.$transaction([
    //   prisma.githubWebhookDelivery.create({ data: { id: deliveryId, event, action: payload.action, payload } }),
    //   prisma.outboxEvent.create({ data: { type: 'VERIFICATION_REQUESTED', payload } })
    // ]);

    return NextResponse.json({ received: true }, { status: 202 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({
      code: "internal_error",
      message: "An internal error occurred processing the webhook",
      retryable: true,
      retry_class: "backoff",
      request_id: crypto.randomUUID()
    }, { status: 500 });
  }
}
