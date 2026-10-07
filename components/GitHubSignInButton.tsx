'use client';

import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';

export function GitHubSignInButton({
  callbackUrl = '/onboarding',
  label = 'Continue with GitHub',
}: {
  callbackUrl?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn('github', { callbackUrl })}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-[#24292e] px-5 py-3 font-medium text-white transition-colors hover:bg-[#24292e]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <Github size={19} aria-hidden="true" />
      {label}
    </button>
  );
}
