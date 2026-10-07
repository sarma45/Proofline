import Link from 'next/link';
import { GitHubSignInButton } from '../../../components/GitHubSignInButton';

type SearchParams = {
  error?: string;
  callbackUrl?: string;
};

const messages: Record<string, string> = {
  EmailNotAvailable:
    'GitHub did not return a verified email address. Verify an email on your GitHub account and try again.',
  OAuthAccountNotLinked:
    'This email is already associated with an account using another sign-in method. Sign in with that original method; accounts are not linked automatically.',
  OAuthSignin:
    'GitHub could not start authorization. Check that the GitHub App Client ID in Vercel matches the app where this callback URL is configured.',
  OAuthCallback:
    'GitHub returned an authorization error. Confirm the Client ID and Client Secret belong to the same GitHub App and that the callback URL is saved exactly.',
  Configuration:
    'GitHub sign-in is not configured correctly. Check GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and NEXTAUTH_SECRET in the Vercel production environment, then redeploy.',
  AccessDenied:
    'GitHub did not provide a verified email address or authorization was denied. Check your GitHub account email and retry.',
};

export default function SignInPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const error = searchParams?.error ?? '';
  const callbackUrl = searchParams?.callbackUrl ?? '/onboarding';
  const message = messages[error] ?? (error
    ? 'GitHub sign-in failed. Check the GitHub App configuration and retry.'
    : 'Sign in securely with your GitHub account to continue.');
  const callbackBase = process.env.NEXTAUTH_URL || 'https://proofline-tau-plum.vercel.app';

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-background-elevated p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign in to Proofline</h1>
          <p className="text-sm text-muted">Use your GitHub account to access your workspace.</p>
        </div>
        {error && (
          <div role="alert" className="rounded-md border border-status-failed/30 bg-status-failed/10 p-4 text-sm">
            <p className="font-semibold">Sign-in could not be completed</p>
            <p className="mt-1">{message}</p>
          </div>
        )}
        <div className="flex justify-center">
          <GitHubSignInButton callbackUrl={callbackUrl} />
        </div>
        <p className="text-center text-xs text-muted">
          Required callback: <code className="break-all">{callbackBase}/api/auth/callback/github</code>
        </p>
        <p className="text-center text-sm text-muted">
          GitHub App installation is a separate step after sign-in.{' '}
          <Link href="/onboarding" className="text-accent underline">Continue to setup</Link>
        </p>
      </section>
    </main>
  );
}
