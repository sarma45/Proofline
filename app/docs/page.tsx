import React from 'react';
import Link from 'next/link';
import { Shield, FileText, ChevronRight, BookOpen, Terminal, Lock } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-elevated px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <span className="font-semibold text-lg tracking-tight">Proofline</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/docs" className="text-foreground">Docs</Link>
            <Link href="/pricing" className="text-muted hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/login" className="text-muted hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/onboarding" className="bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/90 transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-sm mb-3">Getting Started</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="#" className="text-foreground font-medium block hover:text-accent transition-colors">Introduction</Link></li>
              <li><Link href="#" className="block hover:text-accent transition-colors">Quickstart</Link></li>
              <li><Link href="#" className="block hover:text-accent transition-colors">Core Concepts</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Guides</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="#" className="block hover:text-accent transition-colors">Setting up GitHub App</Link></li>
              <li><Link href="#" className="block hover:text-accent transition-colors">Configuring Policies</Link></li>
              <li><Link href="#" className="block hover:text-accent transition-colors">Customizing the PR Gate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Reference</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="#" className="block hover:text-accent transition-colors">CLI Commands</Link></li>
              <li><Link href="#" className="block hover:text-accent transition-colors">API Reference</Link></li>
              <li><Link href="#" className="block hover:text-accent transition-colors">Assurance Status Types</Link></li>
            </ul>
          </div>
        </aside>

        <div className="flex-1 max-w-3xl">
          <div className="mb-4 text-sm text-muted flex items-center gap-2">
            <Link href="/docs" className="hover:text-foreground">Docs</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">Introduction</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 tracking-tight">Introduction to Proofline</h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            Proofline is the Evidence OS for AI-built software. It bridges the trust gap between human reviewers and autonomous AI coding agents by verifying claims against cryptographic proof.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <div className="p-5 border border-border rounded-lg bg-background-elevated hover:border-accent/50 transition-colors cursor-pointer group">
              <Terminal className="text-accent mb-3 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="font-semibold mb-1">Quickstart Guide</h3>
              <p className="text-sm text-muted">Install the GitHub App and verify your first AI pull request in minutes.</p>
            </div>
            <div className="p-5 border border-border rounded-lg bg-background-elevated hover:border-accent/50 transition-colors cursor-pointer group">
              <BookOpen className="text-accent mb-3 group-hover:scale-110 transition-transform" size={24} />
              <h3 className="font-semibold mb-1">Core Concepts</h3>
              <p className="text-sm text-muted">Learn about Change Passports, Evidence Graphs, and Verification Policies.</p>
            </div>
          </div>

          <article className="prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-border pb-2">Why Proofline?</h2>
            <p className="text-muted leading-relaxed mb-4">
              As AI coding agents become more capable, the bottleneck in software development shifts from writing code to reviewing and trusting it. Traditional code review is designed for human-to-human interaction, assuming shared context and intent. AI agents, however, operate differently and can introduce novel types of risk (e.g., hallucinated dependencies, subtle logic shifts, or out-of-scope changes).
            </p>
            <p className="text-muted leading-relaxed mb-4">
              Proofline provides a verifiable "Change Passport" for every AI-generated commit. It doesn't just scan the code; it validates the <em>intent</em> against the actual <em>behavior</em>.
            </p>

            <div className="bg-status-failed/5 border border-status-failed/20 rounded-lg p-5 my-8">
              <h4 className="text-status-failed font-semibold flex items-center gap-2 mb-2">
                <Lock size={18} /> Our Security Philosophy
              </h4>
              <p className="text-sm text-muted">
                We never claim software is "100% safe" or "bug-free". Proofline is a tool to <em>surface evidence</em> and <em>accelerate human judgment</em>, not to replace the final human sign-off on critical infrastructure.
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
