import { getServerSession } from "next-auth/next";
import { prisma } from "./prisma";
import { authOptions } from "./auth-options";

export async function getSessionProjectId(request?: Request): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: { include: { projects: true } } },
    });

    if (dbUser && dbUser.organization.projects.length > 0) {
      const requestedProjectId = request?.headers.get("x-tenant-id");
      if (
        requestedProjectId &&
        dbUser.organization.projects.some((project) => project.id === requestedProjectId)
      ) {
        return requestedProjectId;
      }
      return dbUser.organization.projects[0].id;
    }
  }

  // MVP fallback is intentionally unavailable in production.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ALLOW_MOCK_AUTH === "true"
  ) {
    const mockProject = await prisma.project.findFirst();
    return mockProject?.id ?? null;
  }

  return null;
}
