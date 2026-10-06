import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Activity, Clock, AlertTriangle } from 'lucide-react';
import { StatusPill } from '../../../components/StatusPill';

export default function ProjectDetail() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-elevated px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <span className="font-semibold text-lg tracking-tight">Proofline</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/projects" className="text-foreground">Projects</Link>
            <Link href="#" className="text-muted hover:text-foreground transition-colors">Settings</Link>
          </div>
        </div>
      </header>

      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-muted">
          <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
          <ChevronRight size={14} />
          <span className="font-mono">acme-corp</span>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">api-gateway</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-background-elevated border border-border p-6 rounded-lg">
            <div className="flex items-center gap-2 text-muted mb-4">
              <Activity size={18} />
              <h3 className="font-medium">Verification Debt</h3>
            </div>
            <div className="text-3xl font-bold">12%</div>
            <p className="text-sm text-muted mt-2">of merged AI PRs lacked full behavioral evidence</p>
          </div>
          <div className="bg-background-elevated border border-border p-6 rounded-lg">
            <div className="flex items-center gap-2 text-muted mb-4">
              <Clock size={18} />
              <h3 className="font-medium">Time to Merge</h3>
            </div>
            <div className="text-3xl font-bold">1.4h</div>
            <p className="text-sm text-muted mt-2">average human review time</p>
          </div>
          <div className="bg-background-elevated border border-border p-6 rounded-lg">
            <div className="flex items-center gap-2 text-muted mb-4">
              <AlertTriangle size={18} />
              <h3 className="font-medium">Blocked</h3>
            </div>
            <div className="text-3xl font-bold">4</div>
            <p className="text-sm text-muted mt-2">passports blocked by policy this week</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Passports</h2>
          <div className="border border-border rounded-lg bg-background-elevated overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium text-muted">PR</th>
                  <th className="px-6 py-3 font-medium text-muted">Intent</th>
                  <th className="px-6 py-3 font-medium text-muted">Status</th>
                  <th className="px-6 py-3 font-medium text-muted">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted">#42</td>
                  <td className="px-6 py-4">
                    <Link href="/passports/pass_123abc" className="font-medium hover:text-accent transition-colors">
                      Feature: add export endpoint
                    </Link>
                  </td>
                  <td className="px-6 py-4"><StatusPill status="HUMAN_REVIEW_REQUIRED" size="sm" /></td>
                  <td className="px-6 py-4 text-muted">2m ago</td>
                </tr>
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted">#41</td>
                  <td className="px-6 py-4">
                    <Link href="/passports/pass_456def" className="font-medium hover:text-accent transition-colors">
                      Fix rate limit counter race condition
                    </Link>
                  </td>
                  <td className="px-6 py-4"><StatusPill status="VERIFIED_FOR_SCOPE" size="sm" /></td>
                  <td className="px-6 py-4 text-muted">1h ago</td>
                </tr>
                <tr className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted">#40</td>
                  <td className="px-6 py-4">
                    <Link href="/passports/pass_789ghi" className="font-medium hover:text-accent transition-colors">
                      Update dependencies
                    </Link>
                  </td>
                  <td className="px-6 py-4"><StatusPill status="BLOCKED" size="sm" /></td>
                  <td className="px-6 py-4 text-muted">3h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
