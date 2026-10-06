import React from 'react';
import Link from 'next/link';
import { Shield, FileJson, CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { prisma } from '../../lib/prisma';
import { StatusPill } from '../../components/StatusPill';

import { getSessionProjectId } from '../../lib/auth';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Enforce Tenant Scope
  const projectId = await getSessionProjectId(new Request('http://localhost')); // We can pass a dummy request because getServerSession doesn't strictly need it in app router if we just call it directly in auth.ts
  
  if (!projectId) {
    redirect('/api/auth/signin');
  }

  const passports = await prisma.passport.findMany({
    where: { projectId },
    orderBy: { updatedAt: 'desc' },
    include: {
      pullRequest: {
        include: { repository: true }
      }
    }
  });

  // Metrics for the dashboard
  const metrics = {
    totalPassports: passports.length,
    verified: passports.filter(p => p.assuranceStatus === 'VERIFIED_FOR_SCOPE').length,
    blocked: passports.filter(p => p.assuranceStatus === 'BLOCKED').length,
    humanReview: passports.filter(p => p.assuranceStatus === 'HUMAN_REVIEW_REQUIRED').length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
              Proofline
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">acme-corp</span>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold border border-accent/30">
              AC
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
          <p className="text-muted mt-2">Overview of verification activity across your repositories.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-background-elevated border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-muted">Total Passports</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{metrics.totalPassports}</span>
              <span className="text-xs text-muted">this month</span>
            </div>
          </div>
          <div className="bg-background-elevated border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-muted">Verified</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-status-verified">{metrics.verified}</span>
              <span className="text-xs text-muted">safe to merge</span>
            </div>
          </div>
          <div className="bg-background-elevated border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-muted">Blocked</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-status-failed">{metrics.blocked}</span>
              <span className="text-xs text-muted">issues found</span>
            </div>
          </div>
          <div className="bg-background-elevated border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-muted">Needs Review</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-status-warning">{metrics.humanReview}</span>
              <span className="text-xs text-muted">awaiting decision</span>
            </div>
          </div>
        </div>

        {/* Passport List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Passports</h2>
            <button className="text-sm text-accent hover:underline font-medium">View all</button>
          </div>
          
          <div className="bg-background-elevated border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/10 border-b border-border text-muted">
                  <tr>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Summary</th>
                    <th className="px-6 py-4 font-medium">Repository</th>
                    <th className="px-6 py-4 font-medium">Updated</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {passports.map((passport) => (
                    <tr key={passport.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-6 py-4">
                        <StatusPill status={passport.assuranceStatus as any} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{passport.scopeSummary}</div>
                        <div className="text-xs text-muted truncate max-w-xs">{passport.pullRequest.title}</div>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {passport.pullRequest.repository.fullName}
                        <div className="text-xs font-mono mt-0.5">{passport.pullRequest.proposedCommit.substring(0, 7)}</div>
                      </td>
                      <td className="px-6 py-4 text-muted whitespace-nowrap">
                        {new Date(passport.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/passports/${passport.id}`}
                          className="inline-flex items-center gap-1 text-accent font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Review <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  
                  {passports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted">
                        <FileJson className="mx-auto mb-3 opacity-50" size={32} />
                        <p>No passports generated yet.</p>
                        <p className="text-sm mt-1">Install the GitHub app to get started.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
