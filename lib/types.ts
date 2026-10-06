export type AssuranceStatus = 
  | "UNASSESSED"
  | "EVIDENCE_COLLECTING"
  | "HUMAN_REVIEW_REQUIRED"
  | "CONDITIONAL_PASS"
  | "BLOCKED"
  | "VERIFIED_FOR_SCOPE"
  | "EXPIRED"
  | "FAILED"
  | "CANCELLED";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface ChangePassport {
  id: string;
  repo: string;
  baseCommit: string;
  proposedCommit: string;
  status: AssuranceStatus;
  scopeSummary: string;
  policyVersion: string;
  updatedAt: string;
  reviewedHash: string;
  mergeHash: string;
  intent: {
    summary: string;
    successCriteria: string[];
    nonGoals: string[];
    assumptions: string[];
    source: "declared" | "inferred" | "unknown";
  };
  changeMap: {
    files: { path: string; changeType: "added" | "modified" | "deleted"; unplanned?: boolean; linesAdded: number; linesRemoved: number }[];
    dependencies: { name: string; type: "added" | "updated" | "removed" }[];
  };
  planAlignment: {
    plannedFileChanged: boolean;
    unplannedFileChanged: boolean;
    unplannedFiles: string[];
    plannedBehaviorEvidenced: "yes" | "no" | "unknown";
    testAddedOrUpdated: boolean;
    scopeExpanded: boolean;
    newDependencyIntroduced: boolean;
    externalSideEffectAttempted: boolean;
    planVersion: string;
    planHash: string;
  };
  verification: {
    checks: {
      type: string;
      version: string;
      status: "passed" | "failed" | "blocked" | "skipped" | "unknown";
      summary: string;
      limitations?: string;
      scope: string;
    }[];
  };
  unknowns: string[];
  decisions: {
    id: string;
    action: "approve" | "request_changes" | "block" | "escalate";
    actor: string;
    timestamp: string;
    rationale?: string;
  }[];
  audit: {
    requestId: string;
    provenanceLevel: "full" | "partial" | "unavailable";
    skillVersions: string[];
  };
}
