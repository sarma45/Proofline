import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Proofline Terms of Service.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-muted">
          <p>Last updated: October 2026</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Proofline, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p>
            Proofline is an "Evidence OS" designed to verify AI-generated software changes. We provide automated pull request gates, verification tools, and cryptographically signed "Change Passports". We do not guarantee that software is free of bugs, vulnerabilities, or defects. The final responsibility for deploying code remains with the human reviewers and your organization.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to use the service for any unlawful purpose or to verify malicious code intended to cause harm.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            Your code remains your intellectual property. Proofline claims no ownership over the source code or proprietary algorithms you verify using our platform. The Proofline platform itself, including its verification engines, algorithms, and interfaces, remains the property of Proofline.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Proofline shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including but not limited to damages for loss of profits, data, or source code.
          </p>
        </div>
      </main>
    </div>
  );
}
