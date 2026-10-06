import React from 'react';
import { AssuranceStatus } from '../lib/types';
import { Circle, Loader2, Eye, AlertTriangle, ShieldX, CheckCircle, Clock, XCircle, Minus } from 'lucide-react';

interface StatusPillProps {
  status: AssuranceStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<AssuranceStatus, { label: string; icon: React.ElementType; colorClass: string }> = {
  UNASSESSED: { label: 'Unassessed', icon: Circle, colorClass: 'text-status-unassessed border-status-unassessed' },
  EVIDENCE_COLLECTING: { label: 'Evidence Collecting', icon: Loader2, colorClass: 'text-status-collecting border-status-collecting' },
  HUMAN_REVIEW_REQUIRED: { label: 'Human Review Required', icon: Eye, colorClass: 'text-status-review border-status-review bg-status-review/10' },
  CONDITIONAL_PASS: { label: 'Conditional Pass', icon: AlertTriangle, colorClass: 'text-status-conditional border-status-conditional bg-status-conditional/10' },
  BLOCKED: { label: 'Blocked', icon: ShieldX, colorClass: 'text-status-blocked border-status-blocked bg-status-blocked/10' },
  VERIFIED_FOR_SCOPE: { label: 'Verified for Scope', icon: CheckCircle, colorClass: 'text-status-verified border-status-verified bg-status-verified/10' },
  EXPIRED: { label: 'Expired', icon: Clock, colorClass: 'text-status-expired border-status-expired' },
  FAILED: { label: 'Failed', icon: XCircle, colorClass: 'text-status-failed border-status-failed bg-status-failed/10' },
  CANCELLED: { label: 'Cancelled', icon: Minus, colorClass: 'text-status-cancelled border-status-cancelled' },
};

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-medium'
  };

  return (
    <div className={`inline-flex items-center gap-2 border rounded-full ${config.colorClass} ${sizeClasses[size]}`} role="status" aria-label={`Status: ${config.label}`}>
      <Icon className={status === 'EVIDENCE_COLLECTING' ? 'animate-spin' : ''} size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
      <span>{config.label}</span>
    </div>
  );
}
