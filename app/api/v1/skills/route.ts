import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { logger } from '../../../../lib/logger';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      where: { isOfficial: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(skills);
  } catch (error) {
    logger.error({ context: 'skills-api' }, 'Failed to list skills', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// In MVP, skills are seeded, so we only provide GET.
// Later we could allow custom skill registration per org.
