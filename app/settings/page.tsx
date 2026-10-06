import React from 'react';
import Link from 'next/link';
import { Shield, Key, Users, BookOpen, CreditCard, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-elevated px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <span className="font-semibold text-lg tracking-tight">Proofline</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/projects" className="text-muted hover:text-foreground transition-colors">Projects</Link>
            <Link href="/passports" className="text-muted hover:text-foreground transition-colors">Passports</Link>
            <Link href="/settings" className="text-foreground">Settings</Link>
            <div className="w-8 h-8 bg-border rounded-full ml-2"></div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-3">Organization</h2>
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-background-elevated text-foreground rounded-md font-medium">
            <Shield size={18} /> Policies
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted hover:bg-background-elevated hover:text-foreground rounded-md transition-colors">
            <Users size={18} /> Members & Roles
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted hover:bg-background-elevated hover:text-foreground rounded-md transition-colors">
            <Key size={18} /> Integrations
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted hover:bg-background-elevated hover:text-foreground rounded-md transition-colors">
            <Bell size={18} /> Notifications
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted hover:bg-background-elevated hover:text-foreground rounded-md transition-colors">
            <CreditCard size={18} /> Billing & Usage
          </a>
        </aside>

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl font-semibold mb-6">Verification Policies</h1>
            
            <div className="bg-background-elevated border border-border rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Strict Mode <span className="bg-status-verified/10 text-status-verified text-xs px-2 py-0.5 rounded font-mono">v3.1</span>
                    </h3>
                    <p className="text-muted text-sm mt-1">Requires human review for all security findings and drift.</p>
                  </div>
                  <span className="bg-accent/10 text-accent text-xs font-medium px-2 py-1 rounded">Default</span>
                </div>
              </div>
              <div className="bg-background p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Block on Critical Security Findings</span>
                  <div className="w-8 h-4 bg-accent rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Require test updates on new features</span>
                  <div className="w-8 h-4 bg-accent rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Enforce plan alignment</span>
                  <div className="w-8 h-4 bg-border rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-muted rounded-full"></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <h2 className="text-xl font-semibold text-status-failed mb-4">Danger Zone</h2>
            <div className="border border-status-failed/50 rounded-lg p-6 bg-status-failed/5">
              <h3 className="font-semibold text-foreground">Disconnect GitHub App</h3>
              <p className="text-muted text-sm mt-1 mb-4">
                This will immediately stop Proofline from analyzing new PRs. Existing passports will be retained.
              </p>
              <button className="bg-status-failed text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-status-failed/90 transition-colors">
                Disconnect Proofline
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
