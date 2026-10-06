import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { logger } from '../../../../../lib/logger';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Missing x-tenant-id' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    // In a real app, verify tenantId corresponds to an organization
    // and filter audit events for passports belonging to that organization.
    // For MVP, we filter by passports in projects owned by the tenant organization (simulated by projectId if tenantId == orgId).
    
    // As a simplification for the MVP prototype, we'll fetch all audit events
    // that belong to the tenant's projects.
    const events = await prisma.auditEvent.findMany({
      where: {
        passport: {
          project: {
            organizationId: tenantId
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        passport: {
          select: { id: true, pullRequestId: true }
        }
      }
    });

    if (format === 'csv') {
      const csvLines = ['id,createdAt,passportId,actor,action,details'];
      for (const e of events) {
        // Escape CSV values
        const details = e.details.replace(/"/g, '""');
        csvLines.push(`"${e.id}","${e.createdAt.toISOString()}","${e.passportId}","${e.actor}","${e.action}","${details}"`);
      }
      const csv = csvLines.join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="audit_export.csv"'
        }
      });
    }

    return NextResponse.json({
      meta: {
        total: events.length,
        format: 'json'
      },
      events: events.map(e => ({
        id: e.id,
        createdAt: e.createdAt,
        passportId: e.passportId,
        actor: e.actor,
        action: e.action,
        details: JSON.parse(e.details)
      }))
    });

  } catch (error) {
    logger.error({ context: 'audit-export', tenantId }, 'Audit export failed', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
