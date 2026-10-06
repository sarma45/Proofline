import React from 'react';
import { AlertCircle, Clock, ShieldX, RefreshCw, XCircle } from 'lucide-react';

export function StaleBanner({ currentHead }: { currentHead: string }) {
  return (
    <div className="bg-status-expired/10 border-l-4 border-status-expired p-4 mb-6 rounded-r-md flex items-start gap-3">
      <Clock className="text-status-expired shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h3 className="font-semibold text-status-expired">Stale Passport</h3>
        <p className="text-sm mt-1 text-muted">
          This passport was generated for a previous commit. The PR head has moved to <code className="font-mono bg-background px-1 py-0.5 rounded text-foreground">{currentHead}</code>.
        </p>
      </div>
      <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-background border border-border rounded-md hover:bg-background-elevated transition-colors shrink-0">
        <RefreshCw size={14} /> Re-verify
      </button>
    </div>
  );
}

export function PartialEvidenceBanner({ pendingChecks }: { pendingChecks: string[] }) {
  return (
    <div className="bg-status-collecting/10 border-l-4 border-status-collecting p-4 mb-6 rounded-r-md flex items-start gap-3">
      <RefreshCw className="text-status-collecting shrink-0 mt-0.5 animate-spin" size={20} />
      <div>
        <h3 className="font-semibold text-status-collecting">Partial Evidence</h3>
        <p className="text-sm mt-1 text-muted">
          Some checks are still running or timed out. 
          Pending: <span className="text-foreground">{pendingChecks.join(', ')}</span>
        </p>
      </div>
    </div>
  );
}

export function PermissionDeniedBanner({ requiredScope, fixLink }: { requiredScope: string, fixLink: string }) {
  return (
    <div className="bg-status-failed/10 border-l-4 border-status-failed p-4 mb-6 rounded-r-md flex items-start gap-3">
      <ShieldX className="text-status-failed shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h3 className="font-semibold text-status-failed">Permission Denied</h3>
        <p className="text-sm mt-1 text-muted">
          Proofline lacks the <code className="font-mono bg-background px-1 py-0.5 rounded text-foreground">{requiredScope}</code> permission to verify this surface.
        </p>
      </div>
      <a href={fixLink} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-background border border-border rounded-md hover:bg-background-elevated transition-colors shrink-0">
        Grant Permission
      </a>
    </div>
  );
}

export function ErrorState({ message, requestId }: { message: string, requestId?: string }) {
  return (
    <div className="max-w-xl mx-auto mt-12 bg-background-elevated border border-status-failed/30 rounded-md p-6 text-center space-y-4">
      <XCircle className="text-status-failed mx-auto" size={48} />
      <h2 className="text-xl font-semibold">Verification Failed</h2>
      <p className="text-muted">{message}</p>
      {requestId && (
        <p className="text-xs text-muted font-mono bg-background p-2 rounded inline-block">
          Request ID: {requestId}
        </p>
      )}
      <div>
        <button className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors">
          <RefreshCw size={14} /> Retry Verification
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, actionLabel, onAction }: { title: string, description: string, actionLabel: string, onAction?: () => void }) {
  return (
    <div className="max-w-xl mx-auto mt-24 bg-background-elevated border border-border rounded-md p-8 text-center space-y-4">
      <AlertCircle className="text-muted mx-auto" size={48} />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted">{description}</p>
      <button 
        onClick={onAction}
        className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}
