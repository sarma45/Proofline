import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { prisma } from "../../../../lib/prisma"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      // Auto-provision user and default org if they don't exist
      await prisma.$transaction(async (tx) => {
        let dbUser = await tx.user.findUnique({ where: { email: user.email! } });
        
        if (!dbUser) {
          // Create default org for the user
          const org = await tx.organization.create({
            data: { name: `${user.name || user.email}'s Org` }
          });
          
          dbUser = await tx.user.create({
            data: {
              email: user.email!,
              name: user.name || null,
              organizationId: org.id
            }
          });

          await tx.membership.create({
            data: {
              userId: dbUser.id,
              organizationId: org.id,
              role: 'owner'
            }
          });
        }
      });
      
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { organization: { include: { projects: true } } }
        });
        if (dbUser) {
          (session as any).dbUserId = dbUser.id;
          (session as any).organizationId = dbUser.organizationId;
          (session as any).projects = dbUser.organization.projects.map(p => p.id);
        }
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
})

export { handler as GET, handler as POST }
