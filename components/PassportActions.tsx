'use client';

import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

export function PassportActions({ passportId }: { passportId: string }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/passports/${passportId}/export`, { method: 'POST' });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passport-${passportId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export passport');
    } finally {
      setLoading(false);
    }
  };

  const handleReverify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/passports/${passportId}/reverify`, { method: 'POST' });
      if (!res.ok) throw new Error('Reverify failed');
      window.location.reload();
    } catch (err) {
      alert('Failed to re-verify passport');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleReverify}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors px-3 py-1.5 border border-border bg-background rounded-md hover:bg-background-elevated font-medium disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        Re-verify
      </button>
      <button 
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/80 transition-colors px-3 py-1.5 border border-border bg-background rounded-md hover:bg-background-elevated font-medium disabled:opacity-50"
      >
        <Download size={14} />
        Export
      </button>
    </>
  );
}
