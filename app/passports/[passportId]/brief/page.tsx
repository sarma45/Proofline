import React from 'react';
import { StatusPill } from '../../../../components/StatusPill';
import { HashDisplay } from '../../../../components/HashDisplay';
import { DecisionForm } from '../../../../components/DecisionForm';
import { Shield, ArrowRight, CheckCircle, XCircle, AlertCircle, AlertTriangle, Printer } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPassport(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/v1/passports/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch passport');
  }
  return res.json();
}

export default async function BriefPage({ params }: { params: { passportId: string } }) {
  const passport = await getPassport(params.passportId);
  
  if (!passport) {
    return notFound();
  }

  const passedChecks = passport.verification.checks.filter((c: any) => c.status === 'success');
  const failedChecks = passport.verification.checks.filter((c: any) => c.status === 'failure' || c.status === 'error');
  const warningChecks = passport.verification.checks.filter((c: any) => c.status === 'warning');

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <main className="max-w-3xl mx-auto space-y-8 bg-background-elevated p-8 sm:p-12 border border-border shadow-sm rounded-xl">
        
        {/* Header (Printable context) */}
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted text-sm font-medium">
              <Shield size={16} className="text-accent" />
              <span>Proofline Human Review Brief</span>
            </div>
            <h1 className="text-2xl font-bold">{passport.scopeSummary}</h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span>{passport.repo}</span>
              <span className="opacity-50">•</span>
              <div className="flex items-center gap-1">
                <HashDisplay hash={passport.baseCommit} shorten />
                <ArrowRight size={14} />
                <HashDisplay hash={passport.proposedCommit} shorten />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <StatusPill status={passport.status} size="lg" />
            <button className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground print:hidden">
              <Printer size={14} /> Print Brief
            </button>
          </div>
        </div>

        {/* 1. What changed (short) */}
        <section className="space-y-2">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-muted">1. What Changed</h2>
          <p className="text-lg font-medium">{passport.intent.summary}</p>
        </section>

        {/* 2. Why it changed (intent) */}
        <section className="space-y-2">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-muted">2. Why It Changed</h2>
          <div className="bg-muted/10 p-4 rounded-md border border-border/50 text-sm">
            <ul className="list-disc list-inside space-y-1">
              {passport.intent.successCriteria.slice(0, 3).map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
              {passport.intent.successCriteria.length > 3 && (
                <li className="text-muted list-none pl-5 text-xs italic">...and {passport.intent.successCriteria.length - 3} more criteria.</li>
              )}
            </ul>
          </div>
        </section>

        {/* 3. What passed */}
        <section className="space-y-2">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-muted flex items-center gap-2">
            <CheckCircle size={16} className="text-status-verified" />
            3. What Passed ({passedChecks.length})
          </h2>
          {passedChecks.length > 0 ? (
            <ul className="space-y-1.5 text-sm">
              {passedChecks.map((c: any, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted shrink-0 w-24">{c.type}:</span>
                  <span>{c.summary}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No successful checks.</p>
          )}
        </section>

        {/* 4. What failed / blocked */}
        {(failedChecks.length > 0 || warningChecks.length > 0) && (
          <section className="space-y-2 bg-status-failed/5 border border-status-failed/20 p-4 rounded-md">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-status-failed flex items-center gap-2">
              <XCircle size={16} />
              4. What Failed / Needs Attention
            </h2>
            <ul className="space-y-2 text-sm mt-3">
              {[...failedChecks, ...warningChecks].map((c: any, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className={`shrink-0 w-24 font-medium ${c.status === 'warning' ? 'text-status-warning' : 'text-status-failed'}`}>
                    {c.type}:
                  </span>
                  <span>{c.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 5. What remains unknown */}
        {passport.unknowns.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-muted flex items-center gap-2">
              <AlertTriangle size={16} className="text-status-conditional" />
              5. What Remains Unknown
            </h2>
            <ul className="space-y-1 text-sm list-disc list-inside">
              {passport.unknowns.map((u: string, i: number) => (
                <li key={i} className="text-muted">{u}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 6. What decision is requested */}
        <section className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-muted">6. Decision Requested</h2>
          
          {passport.status === 'HUMAN_REVIEW_REQUIRED' ? (
            <div className="print:hidden">
              <DecisionForm passportId={passport.id} />
            </div>
          ) : (
            <p className="text-sm font-medium">No human review is currently required for this passport.</p>
          )}
          
          <div className="pt-6 print:hidden">
            <Link 
              href={`/passports/${passport.id}`}
              className="text-sm text-accent hover:underline font-medium inline-flex items-center gap-1.5"
            >
              View Full Passport <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
