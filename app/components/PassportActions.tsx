'use client';

import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PassportActions({ passportId }: { passportId: string }) {
  const router = useRouter();
  const [isReverifying, setIsReverifying] = useState(false);

  const handleReverify = async () => {
    try {
      setIsReverifying(true);
      const res = await fetch(`/api/v1/passports/${passportId}/reverify`, {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      } else {
        console.error('Failed to reverify');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReverifying(false);
    }
  };

  return (
    <>
      <a 
        href={`/api/v1/passports/${passportId}/export`} 
        download
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-md hover:bg-background-elevated"
      >
        <Download size={14} /> Export JSON
      </a>
      <button 
        onClick={handleReverify}
        disabled={isReverifying}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-md hover:bg-background-elevated disabled:opacity-50"
      >
        <RefreshCw size={14} className={isReverifying ? "animate-spin" : ""} /> 
        {isReverifying ? 'Re-verifying...' : 'Re-verify'}
      </button>
    </>
  );
}
