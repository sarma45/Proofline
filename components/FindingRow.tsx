import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export interface VerificationCheck {
  type: string;
  version: string;
  status: 'passed' | 'failed' | 'unknown' | 'running';
  summary: string;
  limitations?: string;
  scope: string;
}

export function FindingRow({ check }: { check: VerificationCheck }) {
  return (
    <div className="border border-border bg-background-elevated rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold">{check.type}</h3>
          <span className="text-xs text-muted font-mono bg-background border border-border px-1.5 py-0.5 rounded">v{check.version}</span>
        </div>
        <p className="text-sm text-muted">{check.summary}</p>
        {check.limitations && (
          <p className="text-xs text-status-review mt-2 flex items-center gap-1">
            <AlertCircle size={12}/> {check.limitations}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:items-end gap-2 shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
          ${check.status === 'passed' ? 'bg-status-verified/10 text-status-verified border border-status-verified/20' : 
            check.status === 'failed' ? 'bg-status-failed/10 text-status-failed border border-status-failed/20' : 
            'bg-background border border-border text-muted'}
        `}>
          {check.status === 'passed' && <CheckCircle size={14} />}
          {check.status === 'failed' && <XCircle size={14} />}
          {check.status === 'unknown' && <AlertCircle size={14} />}
          {check.status}
        </span>
        <span className="text-xs text-muted font-mono">{check.scope}</span>
      </div>
    </div>
  );
}
