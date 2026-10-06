import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Check } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Proofline',
  description: 'Pricing plans for Proofline. Secure your AI-generated code today.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <Link href="/" className="font-bold text-lg tracking-tight">Proofline</Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <Link href="/#product" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="/#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
            <Link href="/pricing" className="text-foreground transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-accent transition-colors">Dashboard</Link>
            <Link href="/dashboard" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/90 transition-colors">
              Install GitHub App
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Pay only for the AI PRs you verify. Stop paying for seats that don't write code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pro Tier */}
          <div className="border border-border bg-background-elevated p-8 rounded-xl flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-muted mb-6">For small teams scaling AI adoption.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-muted">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check size={18} className="text-status-verified" /> <span>500 PR Verifications / month</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-status-verified" /> <span>Basic Evidence Graphs</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-status-verified" /> <span>Standard Security Rules</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-status-verified" /> <span>Email Support</span></li>
            </ul>
            
            <Link href="/onboarding" className="block text-center bg-background border border-border hover:bg-background-elevated transition-colors text-foreground font-medium py-3 rounded-md">
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="border border-accent/50 bg-accent/5 p-8 rounded-xl flex flex-col relative">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted mb-6">For organizations with strict compliance requirements.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check size={18} className="text-accent" /> <span>Unlimited PR Verifications</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-accent" /> <span>Advanced Policy Engine</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-accent" /> <span>SSO / SAML Authentication</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-accent" /> <span>Dedicated Success Manager</span></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-accent" /> <span>Custom Compliance Reporting</span></li>
            </ul>
            
            <Link href="mailto:sales@proofline.dev" className="block text-center bg-accent hover:bg-accent/90 transition-colors text-white font-medium py-3 rounded-md">
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Shield size={18} />
            <span className="font-semibold text-foreground">Proofline</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/github-check" className="hover:text-foreground">GitHub Check Mocks</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
