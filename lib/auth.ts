import { prisma } from './prisma';

export async function getSessionProjectId(request: Request): Promise<string | null> {
  const tenantId = request.headers.get('x-tenant-id');
  if (tenantId) {
    // Validate the tenant exists
    const project = await prisma.project.findUnique({ where: { id: tenantId } });
    if (project) return project.id;
  }
  
  // MVP fallback for development/testing
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ALLOW_MOCK_AUTH === 'true') {
    const mockProject = await prisma.project.findFirst();
    return mockProject?.id || null;
  }

  return null;
}
