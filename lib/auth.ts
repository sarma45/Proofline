import { prisma } from './prisma';
import { getServerSession } from "next-auth/next"
// We would ideally import the authOptions from the route handler, but we can also just use default getServerSession if we don't need typed session options here, or we can fetch the user directly.

export async function getSessionProjectId(request: Request): Promise<string | null> {
  // Check standard NextAuth session
  const session = await getServerSession();
  
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: { include: { projects: true } } }
    });
    
    if (dbUser && dbUser.organization.projects.length > 0) {
      // In a real app we'd check if the requested project (via URL or header) is in the user's projects.
      // For now, return their first project ID to bootstrap the UI.
      const requestedProjectId = request.headers.get('x-tenant-id');
      if (requestedProjectId && dbUser.organization.projects.some(p => p.id === requestedProjectId)) {
        return requestedProjectId;
      }
      return dbUser.organization.projects[0].id;
    }
  }

  // MVP fallback for development/testing ONLY if strictly enabled
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ALLOW_MOCK_AUTH === 'true') {
    const mockProject = await prisma.project.findFirst();
    return mockProject?.id || null;
  }

  return null;
}
