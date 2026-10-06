import React from 'react';
import { ArrowRight, FileJson, GitCommit, CheckCircle, Search, ShieldCheck } from 'lucide-react';

export function EvidenceGraph() {
  // A clean, SVG-based or flex-based horizontal workflow graph
  // intent → plan → changed file → verification case → result
  const nodes = [
    { id: 'intent', label: 'Intent Declared', icon: Search, status: 'active', color: 'text-accent' },
    { id: 'plan', label: 'Plan Generated', icon: FileJson, status: 'active', color: 'text-foreground' },
    { id: 'change-map', label: 'Files Changed', icon: GitCommit, status: 'active', color: 'text-foreground' },
    { id: 'verification', label: 'Verified', icon: CheckCircle, status: 'verified', color: 'text-status-verified' },
    { id: 'review', label: 'Human Review', icon: ShieldCheck, status: 'pending', color: 'text-status-review' }
  ];

  return (
    <div className="w-full overflow-x-auto pb-4">
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
