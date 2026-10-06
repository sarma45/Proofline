import React from 'react';
import { StatusPill } from './StatusPill';
import { AssuranceStatus } from '../lib/types';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface PRGateSummaryProps {
  status: AssuranceStatus;
  repo: string;
  prNumber: number;
  checksPassed: number;
  checksTotal: number;
  issuesFound: number;
  passportUrl: string;
}

export function PRGateSummary({ 
  status, repo, prNumber, checksPassed, checksTotal, issuesFound, passportUrl 
}: PRGateSummaryProps) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] font-sans text-sm max-w-3xl overflow-hidden">
      <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-accent" size={18} />
          <span className="font-semibold text-white">Proofline Verification</span>
        </div>
        <StatusPill status={status} size="sm" />
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h4 className="font-medium text-white mb-1">Evidence OS</h4>
            <p className="text-muted text-xs leading-relaxed">
              Proofline generated a Change Passport for this PR. 
              {status === 'VERIFIED_FOR_SCOPE' 
                ? ' Code changes match the declared intent with no critical findings.'
                : status === 'HUMAN_REVIEW_REQUIRED'
                ? ' A reviewer must explicitly approve this passport before merging.'
                : ' There are blocking findings or incomplete evidence.'}
            </p>
          </div>
          <div className="shrink-0 flex gap-4 text-xs">
            <div className="flex flex-col items-center p-2 bg-[#21262d] rounded border border-[#30363d] min-w-[70px]">
              <span className="text-[#8b949e]">Checks</span>
              <span className="font-semibold text-white mt-0.5">{checksPassed}/{checksTotal}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#21262d] rounded border border-[#30363d] min-w-[70px]">
              <span className="text-[#8b949e]">Findings</span>
              <span className={`font-semibold mt-0.5 ${issuesFound > 0 ? 'text-[#f85149]' : 'text-white'}`}>
                {issuesFound}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#21262d] pt-4">
          <div className="text-xs text-[#8b949e]">
            {repo}#{prNumber} · Policy v3.1
          </div>
          <a 
            href={passportUrl} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#238636] text-white text-xs font-semibold rounded-md hover:bg-[#2ea043] transition-colors"
          >
            Review Passport <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
