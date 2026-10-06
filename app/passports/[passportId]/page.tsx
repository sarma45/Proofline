import React from 'react';
import { StatusPill } from '../../../components/StatusPill';
import { HashDisplay } from '../../../components/HashDisplay';
import { DecisionForm } from '../../../components/DecisionForm';
import { StaleBanner, PartialEvidenceBanner, PermissionDeniedBanner, ErrorState, EmptyState } from '../../../components/Banners';
import { EvidenceGraph } from '../../../components/EvidenceGraph';
import { DataTable, FileChange } from '../../../components/DataTable';
import { FindingRow, VerificationCheck } from '../../../components/FindingRow';
import { ArrowRight, Download, RefreshCw, ExternalLink, ShieldAlert, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { PassportActions } from '../../../components/PassportActions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { headers } from 'next/headers';

async function getPassport(id: string) {
  // Use absolute URL since fetch in a Server Component requires it
  // Fallback to localhost:3000 during local dev
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id') || '';
  const cookieHeader = headersList.get('cookie') || '';

  const res = await fetch(`${baseUrl}/api/v1/passports/${id}`, { 
    cache: 'no-store',
    headers: {
      'x-tenant-id': tenantId,
      'cookie': cookieHeader
    }
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch passport');
  }
  
  return res.json();
}

export default async function PassportPage({ params }: { params: { passportId: string } }) {
  const passport = await getPassport(params.passportId);
  
  if (!passport) {
    return notFound();
  }

  const isMatch = passport.reviewedHash === passport.mergeHash;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* SECTION 1: Sticky Decision Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <StatusPill status={passport.status} size="lg" />
              <h1 className="text-xl font-semibold truncate max-w-[500px]" title={passport.scopeSummary}>
                {passport.scopeSummary}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/passports/${passport.id}/brief`} className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors px-3 py-1.5 border border-accent/20 bg-accent/5 rounded-md hover:bg-accent/10 font-medium">
                3-Min Brief
              </Link>
              <PassportActions passportId={passport.id} />
              {passport.pullRequestNumber ? (
                <a href={`https://github.com/${passport.repo}/pull/${passport.pullRequestNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium ml-2">
                  View PR on GitHub <ExternalLink size={14} />
                </a>
              ) : (
                <a href={`https://github.com/${passport.repo}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium ml-2">
                  View Repo on GitHub <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{passport.repo}</span>
            </div>
            <div className="flex items-center gap-2">
              <HashDisplay hash={passport.baseCommit} />
              <ArrowRight size={14} className="text-muted" />
              <HashDisplay hash={passport.proposedCommit} />
            </div>
            <div>Policy {passport.policyVersion}</div>
            <div className="flex items-center gap-2">
              <span>Reviewed ↔ Merge</span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${isMatch ? 'bg-status-verified/10 text-status-verified' : 'bg-status-conditional/10 text-status-conditional'}`}>
                {isMatch ? <CheckCircle size={12}/> : <AlertCircle size={12}/>} {isMatch ? 'Match' : 'Mismatch'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex mt-8 gap-8 px-4">
        {/* Left: Section Nav */}
        <nav className="hidden md:block w-48 shrink-0">
          <div className="sticky top-40 flex flex-col gap-1 border-l border-border pl-4 text-sm">
            <a href="#intent" className="py-1.5 text-muted hover:text-foreground transition-colors">1. Intent</a>
            <a href="#change-map" className="py-1.5 text-muted hover:text-foreground transition-colors">2. Change Map</a>
            <a href="#plan-alignment" className="py-1.5 text-muted hover:text-foreground transition-colors">3. Plan Alignment</a>
            <a href="#verification" className="py-1.5 text-muted hover:text-foreground transition-colors">4. Verification</a>
            <a href="#evidence-graph" className="py-1.5 text-muted hover:text-foreground transition-colors">5. Evidence Graph</a>
            <a href="#unknowns" className="py-1.5 text-muted hover:text-foreground transition-colors">6. Unknowns</a>
            <a href="#review" className="py-1.5 text-foreground font-medium transition-colors">7. Review Decision</a>
            <a href="#audit" className="py-1.5 text-muted hover:text-foreground transition-colors">8. Audit Details</a>
          </div>
        </nav>

        {/* Main: Passport Body */}
        <main id="main-content" className="flex-1 max-w-3xl space-y-12">
          
          {/* Contextual Banners based on Status */}
          <div className="empty:hidden">
            {passport.status === 'EXPIRED' && (
              <StaleBanner currentHead={passport.mergeHash || 'unknown'} />
            )}
            {passport.status === 'EVIDENCE_COLLECTING' && (
              <PartialEvidenceBanner pendingChecks={passport.verification.checks.filter((c: any) => c.status === 'pending' || c.status === 'running').map((c: any) => c.type).length > 0 ? passport.verification.checks.filter((c: any) => c.status === 'pending' || c.status === 'running').map((c: any) => c.type) : ['Unknown checks']} />
            )}
            {passport.status === 'FAILED' && passport.scopeSummary.toLowerCase().includes('permission') && (
              <PermissionDeniedBanner requiredScope="repo:status" fixLink={`https://github.com/apps/proofline/installations/new`} />
            )}
          </div>

          {/* SECTION 2: Intent */}
          <section id="intent" className="scroll-mt-40 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-xl font-semibold">Intent</h2>
              <span className="text-xs uppercase tracking-wider font-medium px-2 py-1 bg-background-elevated border border-border rounded text-muted">
                Source: {passport.intent.source}
              </span>
            </div>
            <p className="text-lg">{passport.intent.summary}</p>
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h3 className="text-sm font-medium text-muted mb-2 uppercase tracking-wider">Success Criteria</h3>
                <ul className="list-disc list-inside space-y-1">
                  {passport.intent.successCriteria.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted mb-2 uppercase tracking-wider">Non-goals</h3>
                <ul className="list-disc list-inside space-y-1 text-muted">
                  {passport.intent.nonGoals.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 3: Change Map */}
          <section id="change-map" className="scroll-mt-40 space-y-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2">Change Map</h2>
            <DataTable files={passport.changeMap.files as FileChange[]} />
          </section>

          {/* SECTION 4: Plan Alignment */}
          <section id="plan-alignment" className="scroll-mt-40 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-xl font-semibold">Plan Alignment</h2>
              <HashDisplay hash={passport.planAlignment.planHash} label="Plan" />
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm pt-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted">Planned file changed</span>
                {passport.planAlignment.plannedFileChanged ? <CheckCircle size={16} className="text-status-verified" /> : <XCircle size={16} className="text-status-failed" />}
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted">Unplanned file changed</span>
                {passport.planAlignment.unplannedFileChanged ? <AlertCircle size={16} className="text-status-review" /> : <CheckCircle size={16} className="text-status-verified" />}
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted">Test added or updated</span>
                {passport.planAlignment.testAddedOrUpdated ? <CheckCircle size={16} className="text-status-verified" /> : <AlertCircle size={16} className="text-status-review" />}
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted">Scope expanded</span>
                {passport.planAlignment.scopeExpanded ? <AlertCircle size={16} className="text-status-review" /> : <CheckCircle size={16} className="text-status-verified" />}
              </div>
            </div>
          </section>

          {/* SECTION 5: Verification */}
          <section id="verification" className="scroll-mt-40 space-y-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2">Verification</h2>
            <div className="space-y-3">
              {passport.verification.checks.map((check: any, i: number) => (
                <FindingRow key={i} check={check as VerificationCheck} />
              ))}
            </div>
          </section>

          {/* SECTION 6: Evidence Graph */}
          <section id="evidence-graph" className="scroll-mt-40 space-y-4 pt-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2">Evidence Graph</h2>
            <EvidenceGraph passport={passport} />
          </section>

          {/* SECTION 7: Unknowns */}
          <section id="unknowns" className="scroll-mt-40 space-y-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2 flex items-center gap-2">
              <ShieldAlert className="text-status-conditional" /> Unknowns & Limitations
            </h2>
            <ul className="space-y-3">
              {passport.unknowns.map((unknown: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm bg-status-conditional/5 border border-status-conditional/20 p-3 rounded-md">
                  <AlertCircle size={16} className="text-status-conditional shrink-0 mt-0.5" />
                  <span>{unknown}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION 8: Review Decision */}
          <section id="review" className="scroll-mt-40 space-y-4 pt-8">
            <h2 className="text-xl font-semibold border-b border-border pb-2">Review Decision</h2>
            {passport.status === 'HUMAN_REVIEW_REQUIRED' && (
              <DecisionForm passportId={passport.id} />
            )}
          </section>

          {/* SECTION 9: Audit Details */}
          <section id="audit" className="scroll-mt-40 space-y-4 pt-8 pb-16">
            <details className="group border border-border rounded-md bg-background-elevated">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
                Audit Details
                <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 pt-0 border-t border-border text-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-muted mb-1">Request ID</span>
                    <HashDisplay hash={passport.audit.requestId} shorten={false} />
                  </div>
                  <div>
                    <span className="block text-muted mb-1">Provenance Level</span>
                    <span className="capitalize">{passport.audit.provenanceLevel}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-muted mb-2">Active Skill Versions</span>
                  <div className="flex gap-2 flex-wrap">
                    {passport.audit.skillVersions.map((v: string) => (
                      <span key={v} className="bg-background border border-border px-2 py-1 rounded font-mono text-xs">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </section>

        </main>
      </div>
      
      {/* SECTION 10: Sticky Footer for Mobile (Review) */}
      {passport.status === 'HUMAN_REVIEW_REQUIRED' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-lg z-50 flex justify-between items-center">
          <span className="font-semibold text-sm">Decision Required</span>
          <a href="#review" className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
            Review Now
          </a>
        </div>
      )}
    </div>
  );
}
