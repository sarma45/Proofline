import React from 'react';
import { ArrowRight, FileJson, GitCommit, CheckCircle, Search, ShieldCheck } from 'lucide-react';

export function EvidenceGraph({ passport }: { passport: any }) {
  // Determine Intent Node state
  const intentStatus = passport?.intent?.source === 'declared' || passport?.intent?.source === 'inferred' ? 'verified' : 'pending';
  const intentColor = intentStatus === 'verified' ? 'text-status-verified' : 'text-muted';

  // Determine Plan Node state
  const hasPlan = !!passport?.planAlignment?.planHash;
  const planStatus = hasPlan ? 'verified' : 'pending';
  const planColor = hasPlan ? 'text-status-verified' : 'text-muted';

  // Determine Change Map Node state
  const hasChanges = passport?.changeMap?.files?.length > 0;
  const changeStatus = hasChanges ? 'verified' : 'pending';
  const changeColor = hasChanges ? 'text-status-verified' : 'text-muted';

  // Determine Verification Node state
  const checksFailed = passport?.verification?.checks?.some((c: any) => c.status === 'failed');
  const allChecksPassed = passport?.verification?.checks?.every((c: any) => c.status === 'passed' || c.status === 'skipped');
  const verifStatus = checksFailed ? 'failed' : (allChecksPassed && passport?.verification?.checks?.length > 0 ? 'verified' : 'pending');
  const verifColor = verifStatus === 'failed' ? 'text-status-failed' : (verifStatus === 'verified' ? 'text-status-verified' : 'text-status-review');

  // Determine Review Node state
  const latestDecision = passport?.decisions?.[0];
  const reviewStatus = latestDecision?.decision === 'approve' ? 'verified' : (latestDecision?.decision === 'block' ? 'failed' : (passport?.status === 'HUMAN_REVIEW_REQUIRED' ? 'pending' : 'skipped'));
  const reviewColor = reviewStatus === 'verified' ? 'text-status-verified' : (reviewStatus === 'failed' ? 'text-status-failed' : (reviewStatus === 'pending' ? 'text-status-review' : 'text-muted'));

  const nodes = [
    { id: 'intent', label: 'Intent', icon: Search, status: intentStatus, color: intentColor },
    { id: 'plan', label: 'Plan', icon: FileJson, status: planStatus, color: planColor },
    { id: 'change-map', label: 'Change Map', icon: GitCommit, status: changeStatus, color: changeColor },
    { id: 'verification', label: 'Verification', icon: CheckCircle, status: verifStatus, color: verifColor },
    { id: 'review', label: 'Review', icon: ShieldCheck, status: reviewStatus, color: reviewColor }
  ];

  return (
    <div className="evidence-graph-container w-full overflow-x-auto pb-4">
      <div className="min-w-[600px] flex items-center justify-between p-8 bg-background-elevated border border-border rounded-xl">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <a 
              href={`#${node.id}`} 
              className="flex flex-col items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-accent p-2 rounded-lg"
              aria-label={`Jump to ${node.label} section`}
            >
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors
                ${node.status === 'verified' ? 'border-status-verified bg-status-verified/10' : 
                  node.status === 'pending' ? 'border-status-review bg-status-review/10 border-dashed' : 
                  'border-border bg-background group-hover:border-accent'}`}>
                <node.icon className={`${node.color} ${node.status === 'pending' ? 'opacity-70' : ''}`} size={20} />
              </div>
              <span className="text-sm font-medium whitespace-nowrap text-muted group-hover:text-foreground transition-colors">
                {node.label}
              </span>
            </a>
            
            {index < nodes.length - 1 && (
              <div className="flex-1 px-4 flex items-center">
                <div className="h-px bg-border w-full flex items-center justify-center relative">
                  <ArrowRight size={14} className="text-border absolute bg-background-elevated px-1" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Screen reader textual fallback */}
      <div className="sr-only">
        <h3>Workflow Sequence</h3>
        <ol>
          {nodes.map((node) => (
            <li key={node.id}>{node.label}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
