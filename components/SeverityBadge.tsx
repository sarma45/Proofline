import React from 'react';
import { Severity } from '../lib/types';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, Shield } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
}

const severityConfig: Record<Severity, { label: string; icon: React.ElementType; colorClass: string }> = {
  critical: { label: 'Critical', icon: ShieldAlert, colorClass: 'text-severity-critical border-severity-critical bg-severity-critical/10' },
  high: { label: 'High', icon: AlertCircle, colorClass: 'text-severity-high border-severity-high bg-severity-high/10' },
  medium: { label: 'Medium', icon: AlertTriangle, colorClass: 'text-severity-medium border-severity-medium bg-severity-medium/10' },
  low: { label: 'Low', icon: Shield, colorClass: 'text-severity-low border-severity-low bg-severity-low/10' },
  info: { label: 'Info', icon: Info, colorClass: 'text-severity-info border-severity-info bg-severity-info/10' },
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 border rounded-sm font-medium ${config.colorClass}`} role="status">
      <Icon size={12} />
      <span className="uppercase tracking-wider">{config.label}</span>
    </span>
  );
}
