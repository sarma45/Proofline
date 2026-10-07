import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

async function getVerifiedGitHubEmail(accessToken?: string) {
  if (!accessToken) return null;

  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const emails = (await response.json()) as GitHubEmail[];
  return emails.find((email) => email.primary && email.verified)?.email ?? null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "read:user user:email" },
      },
      async profile(profile, tokens) {
        const email =
          (typeof profile.email === "string" && profile.email) ||
          (await getVerifiedGitHubEmail(tokens.access_token));

        return {
          id: String(profile.id),
          name: profile.name ?? profile.login ?? null,
          email,
          image: profile.avatar_url ?? null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      // Do not create or match Proofline accounts using an unverified email.
      if (!user.email) return "/auth/signin?error=EmailNotAvailable";

      await prisma.$transaction(async (tx) => {
        let dbUser = await tx.user.findUnique({ where: { email: user.email! } });

        if (!dbUser) {
          const organization = await tx.organization.create({
            data: { name: `${user.name || user.email}'s Organization` },
          });

          dbUser = await tx.user.create({
            data: {
              email: user.email!,
              name: user.name || null,
              organizationId: organization.id,
            },
          });

          await tx.membership.create({
            data: {
              userId: dbUser.id,
              organizationId: organization.id,
              role: "owner",
            },
          });
        }

        // A valid session must have a project; otherwise the dashboard would
        // immediately send the user back to sign-in after successful OAuth.
        const projectCount = await tx.project.count({
          where: { organizationId: dbUser.organizationId },
        });

        if (projectCount === 0) {
          await tx.project.create({
            data: {
              name: "My first project",
              organizationId: dbUser.organizationId,
            },
          });
        }
      });

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { organization: { include: { projects: true } } },
        });

        if (dbUser) {
          (session as typeof session & {
            dbUserId?: string;
            organizationId?: string;
            projects?: string[];
          }).dbUserId = dbUser.id;
          (session as typeof session & {
            dbUserId?: string;
            organizationId?: string;
            projects?: string[];
          }).organizationId = dbUser.organizationId;
          (session as typeof session & {
            dbUserId?: string;
            organizationId?: string;
            projects?: string[];
          }).projects = dbUser.organization.projects.map((project) => project.id);
        }
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
