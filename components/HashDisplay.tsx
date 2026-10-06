"use client";

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface HashDisplayProps {
  hash: string;
  label?: string;
  shorten?: boolean;
}

export function HashDisplay({ hash, label, shorten = true }: HashDisplayProps) {
  const [copied, setCopied] = useState(false);
  const displayHash = shorten && hash.length > 8 ? `${hash.substring(0, 8)}...` : hash;

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-muted bg-background-elevated px-2 py-0.5 rounded border border-border">
      {label && <span className="font-medium mr-1 text-foreground">{label}:</span>}
      <code className="font-mono">{displayHash}</code>
      <button 
        onClick={handleCopy}
        className="text-muted hover:text-foreground transition-colors p-0.5"
        title="Copy to clipboard"
        aria-label="Copy hash"
      >
        {copied ? <Check size={14} className="text-status-verified" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
