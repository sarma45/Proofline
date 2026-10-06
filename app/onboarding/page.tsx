import React from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, Circle, ArrowRight, Github } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      
      <div className="max-w-xl w-full space-y-10">
        
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-background-elevated rounded-2xl flex items-center justify-center border border-border shadow-sm mb-6">
            <Shield size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Proofline</h1>
          <p className="text-muted text-lg">Let's set up your first Change Passport and secure your AI deployments.</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-background-elevated border border-border rounded-xl p-8 shadow-sm">
          <div className="space-y-8">
            
            {/* Step 1: Account (Done) */}
            <div className="flex gap-4">
              <div className="mt-1">
                <CheckCircle className="text-status-verified" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create Account</h3>
                <p className="text-muted text-sm mt-1">You've successfully authenticated with acme-corp.</p>
              </div>
            </div>

            {/* Step 2: Install (Current) */}
            <div className="flex gap-4 relative">
              <div className="absolute left-3 top-[-24px] bottom-[32px] w-px bg-border -z-10"></div>
              <div className="mt-1 bg-background">
                <Circle className="text-accent fill-accent/20" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-accent">Install GitHub App</h3>
                <p className="text-muted text-sm mt-1 mb-4">
                  Proofline needs access to your repository to intercept Pull Requests and generate passports. We only request `read` access to code and `write` access to commit statuses.
                </p>
                <button className="inline-flex items-center gap-2 bg-[#24292e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#24292e]/90 transition-colors">
                  <Github size={16} /> Install on GitHub
                </button>
              </div>
            </div>

            {/* Step 3: Policy (Pending) */}
            <div className="flex gap-4 opacity-50 relative">
              <div className="absolute left-3 top-[-24px] bottom-[32px] w-px bg-border -z-10"></div>
              <div className="mt-1 bg-background">
                <Circle className="text-muted" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Configure Policy</h3>
                <p className="text-muted text-sm mt-1">Define your first validation threshold (e.g., standard strictness).</p>
              </div>
            </div>

            {/* Step 4: Sample (Pending) */}
            <div className="flex gap-4 opacity-50 relative">
              <div className="absolute left-3 top-[-24px] bottom-[32px] w-px bg-border -z-10"></div>
              <div className="mt-1 bg-background">
                <Circle className="text-muted" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Run Sample Verification</h3>
                <p className="text-muted text-sm mt-1">We'll verify a mock PR so you can see a passport in action.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center px-4">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Back to Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">
            Skip to Dashboard <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
