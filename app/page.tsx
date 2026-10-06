import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Github, Code, CheckCircle, FileJson, XCircle } from 'lucide-react';
import { PRGateSummary } from '../components/PRGateSummary';
import { HeroCanvas } from '../components/HeroCanvas';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <span className="font-bold text-lg tracking-tight">Proofline</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <Link href="#product" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
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

      <main id="main-content">
        {/* Hero Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background -z-10"></div>
          <HeroCanvas />
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background-elevated text-sm text-muted">
              <span className="flex h-2 w-2 rounded-full bg-status-verified"></span>
              Now verifying AI-generated Pull Requests
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
              The Evidence OS for<br />AI-built Software.
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              Don't let verification debt slow you down. Proofline generates an evidence-backed Change Passport for every AI-assisted software change.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/onboarding" className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-md hover:bg-accent/90 transition-colors font-medium text-lg w-full sm:w-auto justify-center">
                <Github size={20} /> Connect GitHub
              </Link>
              <Link href="/passports/pass_123abc" className="flex items-center gap-2 bg-background-elevated border border-border px-6 py-3 rounded-md hover:border-muted transition-colors font-medium text-lg w-full sm:w-auto justify-center">
                View Sample Passport <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem / Solution Section */}
        <section id="product" className="py-24 bg-background-elevated border-y border-border">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Stop guessing what the AI actually did.</h2>
              <p className="text-lg text-muted">
                The gap between the speed of AI code generation and the evidence required to trust it is growing. We call this <strong>verification debt</strong>.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                  <XCircle className="text-status-failed shrink-0 mt-1" />
                  <span><strong>Blind trust:</strong> Merging AI PRs without understanding the blast radius.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-status-failed shrink-0 mt-1" />
                  <span><strong>Slow reviews:</strong> Spending hours manually tracing AI-generated boilerplate.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-status-verified shrink-0 mt-1" />
                  <span><strong>Proofline:</strong> Automatically maps intent to actual changes, verifies behavior, and produces a review-ready passport.</span>
                </li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl -z-10 rounded-full"></div>
              <div className="transform rotate-2 shadow-2xl">
                <PRGateSummary 
                  status="HUMAN_REVIEW_REQUIRED"
                  repo="your-org/core-api"
                  prNumber={1042}
                  checksPassed={6}
                  checksTotal={6}
                  issuesFound={0}
                  passportUrl="/passports/pass_123abc"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">A review-ready passport for every PR.</h2>
            <p className="text-muted max-w-2xl mx-auto">Proofline is provider-neutral and integrates directly into your existing GitHub workflow.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background-elevated border border-border p-8 rounded-xl space-y-4 hover:border-muted transition-colors">
              <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center">
                <FileJson className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Plan Alignment</h3>
              <p className="text-muted leading-relaxed">
                We compare the agent's declared plan against the actual file diffs to catch scope drift before you even start reading code.
              </p>
            </div>
            
            <div className="bg-background-elevated border border-border p-8 rounded-xl space-y-4 hover:border-muted transition-colors">
              <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center">
                <Shield className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Honest Assurance</h3>
              <p className="text-muted leading-relaxed">
                No "100% safe" claims. We explicitly highlight unknowns, missing coverage, and unverified assumptions so you can review safely.
              </p>
            </div>
            
            <div className="bg-background-elevated border border-border p-8 rounded-xl space-y-4 hover:border-muted transition-colors">
              <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center">
                <Code className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Developer Fast-path</h3>
              <p className="text-muted leading-relaxed">
                Engineers ship faster without writing manual verification reports. Reviewers make decisions in under three minutes.
              </p>
            </div>
          </div>
        </section>
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
