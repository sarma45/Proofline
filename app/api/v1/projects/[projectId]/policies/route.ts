import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { logger } from '../../../../../../lib/logger';
import { headers } from 'next/headers';

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
    const policies = await prisma.policy.findMany({
      where: {
        projectId: params.projectId,
        project: { organizationId: tenantId }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(policies);
  } catch (error) {
    logger.error({ context: 'policies-api', tenantId, projectId: params.projectId }, 'Failed to list policies', error);
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
    const { version, rules } = body;

    if (!version || !rules) {
      return NextResponse.json({ error: 'Missing version or rules' }, { status: 400 });
    }

    // Verify project belongs to tenant
    const project = await prisma.project.findFirst({
      where: { id: params.projectId, organizationId: tenantId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const policy = await prisma.policy.create({
      data: {
        projectId: params.projectId,
        version,
        rules: typeof rules === 'string' ? rules : JSON.stringify(rules)
      }
    });

    logger.info({ context: 'policies-api', tenantId, projectId: params.projectId, policyId: policy.id }, `Created new policy version ${version}`);

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    logger.error({ context: 'policies-api', tenantId, projectId: params.projectId }, 'Failed to create policy', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
