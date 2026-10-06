import { prisma } from './prisma';

export async function trackMeteringEvent(
  projectId: string,
  type: string,
  quantity: number = 1
) {
  try {
    await prisma.meteringEvent.create({
      data: {
        projectId,
        type,
        quantity,
      },
    });
  } catch (error) {
    console.error('Failed to track metering event:', error);
  }
}
