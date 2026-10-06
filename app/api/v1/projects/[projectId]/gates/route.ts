import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { logger } from '../../../../../../lib/logger';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing x-tenant-id' }, { status: 401 });
  }

  try {
    const gates = await prisma.customGate.findMany({
      where: {
        projectId: params.projectId,
        project: { organizationId: tenantId }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Exclude secrets from the response
    const safeGates = gates.map(gate => ({
      id: gate.id,
      name: gate.name,
      endpoint: gate.endpoint,
      isActive: gate.isActive,
      createdAt: gate.createdAt
    }));

    return NextResponse.json(safeGates);
  } catch (error) {
    logger.error({ context: 'gates-api', tenantId, projectId: params.projectId }, 'Failed to list gates', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing x-tenant-id' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, endpoint } = body;

    if (!name || !endpoint) {
      return NextResponse.json({ error: 'Missing name or endpoint' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { id: params.projectId, organizationId: tenantId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const secret = crypto.randomBytes(32).toString('hex');

    const gate = await prisma.customGate.create({
      data: {
        projectId: params.projectId,
        name,
        endpoint,
        secret
      }
    });

    logger.info({ context: 'gates-api', tenantId, projectId: params.projectId, gateId: gate.id }, `Created new custom gate ${name}`);

    // Return the secret only once upon creation
    return NextResponse.json(gate, { status: 201 });
  } catch (error) {
    logger.error({ context: 'gates-api', tenantId, projectId: params.projectId }, 'Failed to create custom gate', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
