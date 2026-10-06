import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { logger } from '../../../../../../lib/logger';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing x-tenant-id' }, { status: 401 });
  }

  try {
    const passport = await prisma.passport.findFirst({
      where: {
        id: params.passportId,
        project: { organizationId: tenantId }
      },
      include: {
        EvidenceArtifact: true,
        verificationRuns: true
      }
    });

    if (!passport) {
      return NextResponse.json({ error: 'Passport not found' }, { status: 404 });
    }

    // Prepare evidence bundle
    const bundle = {
      passportId: passport.id,
      status: passport.assuranceStatus,
      policyVersion: passport.policyVersion,
      artifacts: passport.EvidenceArtifact.map(a => ({
        id: a.id,
        hash: a.hash,
        uri: a.uri
      })),
      timestamp: new Date().toISOString()
    };

    // Serialize bundle to JSON
    const bundleString = JSON.stringify(bundle);

    // Generate detached signature (For MVP, we just use an HMAC with a mock platform secret)
    // In production, this would be a digital signature using an asymmetric private key (e.g., ECDSA or RSA).
    const platformSecret = process.env.PLATFORM_SIGNING_SECRET || 'dev-mock-secret';
    
    const hmac = crypto.createHmac('sha256', platformSecret);
    hmac.update(bundleString);
    const signature = hmac.digest('hex');

    logger.info({ context: 'evidence-bundle', passportId: passport.id, tenantId }, 'Signed evidence bundle generated');

    return NextResponse.json({
      bundle,
      signature: {
        algorithm: 'HMAC-SHA256',
        value: signature
      }
    });

  } catch (error) {
    logger.error({ context: 'evidence-bundle', passportId: params.passportId, tenantId }, 'Failed to sign bundle', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
