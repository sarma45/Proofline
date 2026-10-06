import React from 'react';
import { PRGateSummary } from '../../components/PRGateSummary';

export default function PRGateDemo() {
  return (
    <div className="min-h-screen bg-[#0d1117] p-12 space-y-8">
      <div className="max-w-3xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl font-semibold text-white">GitHub PR Gate Mocks</h1>
        <p className="text-sm text-[#8b949e]">Simulated appearance of Proofline inside a GitHub Pull Request timeline.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-sm font-semibold text-[#8b949e] mb-3 uppercase tracking-wider">State: Human Review Required</h3>
        <PRGateSummary 
          status="HUMAN_REVIEW_REQUIRED"
          repo="acme-corp/api-gateway"
          prNumber={42}
          checksPassed={7}
          checksTotal={7}
          issuesFound={0}
          passportUrl="/passports/pass_123abc"
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-sm font-semibold text-[#8b949e] mb-3 uppercase tracking-wider">State: Verified for Scope</h3>
        <PRGateSummary 
          status="VERIFIED_FOR_SCOPE"
          repo="acme-corp/api-gateway"
          prNumber={43}
          checksPassed={8}
          checksTotal={8}
          issuesFound={0}
          passportUrl="/passports/pass_456def"
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-sm font-semibold text-[#8b949e] mb-3 uppercase tracking-wider">State: Blocked</h3>
        <PRGateSummary 
          status="BLOCKED"
          repo="acme-corp/api-gateway"
          prNumber={44}
          checksPassed={5}
          checksTotal={8}
          issuesFound={2}
          passportUrl="/passports/pass_789ghi"
        />
      </div>
    </div>
  );
}
