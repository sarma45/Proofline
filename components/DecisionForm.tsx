"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DecisionForm({ passportId }: { passportId: string }) {
  const router = useRouter();
  const [decision, setDecision] = useState<string | null>(null);
  const [rationale, setRationale] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="bg-status-verified/10 border border-status-verified text-status-verified p-4 rounded-md flex items-center gap-3">
        <div className="font-medium">Decision recorded successfully.</div>
        <div className="text-sm">Status will update momentarily.</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/passports/${passportId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decision, // 'approve', 'request_changes', 'block', or 'escalate'
          rationale
        })
      });

      if (response.ok) {
        setSubmitted(true);
        // Force refresh to update the banner and status pills
        setTimeout(() => router.refresh(), 1000);
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'An error occurred while submitting your decision.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      className="space-y-4 bg-background-elevated p-5 rounded-md border border-border"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-semibold">Submit Review Decision</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors ${decision === 'approve' ? 'border-status-verified bg-status-verified/10 text-status-verified' : 'border-border hover:border-muted'}`}>
          <input type="radio" name="decision" value="approve" className="sr-only" onChange={() => setDecision('approve')} />
          <div className={`w-4 h-4 rounded-full border ${decision === 'approve' ? 'border-status-verified bg-status-verified' : 'border-muted'}`}></div>
          <span className="font-medium">Approve</span>
        </label>
        
        <label className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors ${decision === 'request_changes' ? 'border-status-review bg-status-review/10 text-status-review' : 'border-border hover:border-muted'}`}>
          <input type="radio" name="decision" value="request_changes" className="sr-only" onChange={() => setDecision('request_changes')} />
          <div className={`w-4 h-4 rounded-full border ${decision === 'request_changes' ? 'border-status-review bg-status-review' : 'border-muted'}`}></div>
          <span className="font-medium">Request Changes</span>
        </label>
        
        <label className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors ${decision === 'block' ? 'border-status-blocked bg-status-blocked/10 text-status-blocked' : 'border-border hover:border-muted'}`}>
          <input type="radio" name="decision" value="block" className="sr-only" onChange={() => setDecision('block')} />
          <div className={`w-4 h-4 rounded-full border ${decision === 'block' ? 'border-status-blocked bg-status-blocked' : 'border-muted'}`}></div>
          <span className="font-medium">Block</span>
        </label>

        <label className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors ${decision === 'escalate' ? 'border-status-conditional bg-status-conditional/10 text-status-conditional' : 'border-border hover:border-muted'}`}>
          <input type="radio" name="decision" value="escalate" className="sr-only" onChange={() => setDecision('escalate')} />
          <div className={`w-4 h-4 rounded-full border ${decision === 'escalate' ? 'border-status-conditional bg-status-conditional' : 'border-muted'}`}></div>
          <span className="font-medium">Escalate</span>
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="rationale" className="block text-sm font-medium">Rationale (Optional for Approve)</label>
        <textarea 
          id="rationale"
          className="w-full bg-background border border-border rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Explain your decision..."
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {error && (
          <div className="text-status-failed text-sm font-medium p-3 rounded-md bg-status-failed/10 border border-status-failed">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-background-elevated transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={!decision || loading}
            className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {loading ? 'Submitting...' : 'Submit Decision'}
          </button>
        </div>
      </div>
    </form>
  );
}
