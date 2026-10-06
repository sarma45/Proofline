import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Proofline Privacy Policy and Data Handling Practices.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-elevated px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={20} />
            <span className="font-semibold tracking-tight">Proofline</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-muted">
          <p>Last updated: October 2026</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>
            Proofline is an enterprise developer tool. We collect minimal personal data required to provide our service:
            email addresses, basic profile information via SSO/GitHub, and system activity logs necessary for auditing and security.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Code and Repository Data</h2>
          <p>
            As a code verification platform, we access your source code and pull requests. We do not use your proprietary code to train our own models. Your code is processed ephemerally during verification runs, and only cryptographic hashes, metadata, and specific evidence artifacts are retained to generate the Change Passport.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Security and Retention</h2>
          <p>
            We implement enterprise-grade security controls, including encryption at rest and in transit.
            Evidence artifacts and passports are retained according to your organizational policies and can be deleted upon request or automatically after the retention period expires.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We integrate with GitHub and optionally with enterprise Identity Providers (IdP). We do not sell your data to third parties. We use trusted infrastructure providers (e.g., AWS, Vercel) who are bound by strict confidentiality obligations.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our security practices, please contact our security team via your dedicated enterprise support channel.
          </p>
        </div>
      </main>
    </div>
  );
}
