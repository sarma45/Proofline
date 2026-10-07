import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { ArrowRight, CheckCircle, Circle, Github, Shield } from "lucide-react";
import { authOptions } from "../../lib/auth-options";
import { GitHubSignInButton } from "../../components/GitHubSignInButton";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(session?.user?.email);
  const appSlug = (process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "proofline-mahadeva").replace(
    /[^a-zA-Z0-9-]/g,
    "",
  );
  const installationUrl = `https://github.com/apps/${appSlug}/installations/new`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-xl space-y-8">
        <header className="space-y-3 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background-elevated">
            <Shield size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set up Proofline</h1>
          <p className="text-lg text-muted">Sign in first, then install the GitHub App on the repositories you want Proofline to verify.</p>
        </header>

        <section className="space-y-7 rounded-xl border border-border bg-background-elevated p-8 shadow-sm">
          <div className="flex gap-4">
            {signedIn ? <CheckCircle className="mt-1 shrink-0 text-status-verified" size={24} /> : <Circle className="mt-1 shrink-0 text-accent" size={24} />}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">1. Sign in with GitHub</h2>
              {signedIn ? (
                <p className="mt-1 text-sm text-muted">Signed in as {session?.user?.email}.</p>
              ) : (
                <>
                  <p className="mb-4 mt-1 text-sm text-muted">This creates your Proofline workspace using the verified primary email from GitHub.</p>
                  <GitHubSignInButton callbackUrl="/onboarding" label="Continue with GitHub" />
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {signedIn ? <Circle className="mt-1 shrink-0 fill-accent/20 text-accent" size={24} /> : <Circle className="mt-1 shrink-0 text-muted" size={24} />}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">2. Install the GitHub App</h2>
              <p className="mb-4 mt-1 text-sm text-muted">Grant the Proofline GitHub App access to the repositories you want to connect. This is separate from signing in.</p>
              {signedIn ? (
                <a href={installationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#24292e] px-4 py-2 text-sm font-medium text-white hover:bg-[#24292e]/90">
                  <Github size={16} /> Install Proofline on GitHub
                </a>
              ) : (
                <p className="text-sm text-muted">Sign in above to continue to installation.</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 opacity-60">
            <Circle className="mt-1 shrink-0 text-muted" size={24} />
            <div>
              <h2 className="text-lg font-semibold">3. Configure your first project</h2>
              <p className="mt-1 text-sm text-muted">Your workspace and starter project are created during sign-in. Repository event processing will be enabled after app installation is connected.</p>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-between px-2">
          <Link href="/" className="text-sm text-muted hover:text-foreground">Back to Proofline</Link>
          {signedIn && <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">Open dashboard <ArrowRight size={14} /></Link>}
        </footer>
      </div>
    </main>
  );
}
