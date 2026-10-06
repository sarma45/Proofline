import { ChangePassport } from "./types";

export const fixture1: ChangePassport = {
  id: "pass_123abc",
  repo: "acme-corp/api-gateway",
  baseCommit: "abc1234",
  proposedCommit: "def5678",
  status: "HUMAN_REVIEW_REQUIRED",
  scopeSummary: "Feature: add export endpoint — scoped to api/export + tests",
  policyVersion: "v3.1",
  updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  reviewedHash: "hash_0987",
  mergeHash: "hash_0987",
  intent: {
    summary: "Create a new CSV export endpoint for user data",
    successCriteria: ["Endpoint responds at GET /api/export", "Returns CSV format", "Requires admin token"],
    nonGoals: ["Do not support JSON export", "Do not add rate limiting yet"],
    assumptions: ["User ID is in token"],
    source: "declared",
  },
  changeMap: {
    files: [
      { path: "src/api/export.ts", changeType: "added", linesAdded: 45, linesRemoved: 0 },
      { path: "src/api/export.test.ts", changeType: "added", linesAdded: 60, linesRemoved: 0 },
      { path: "src/routes.ts", changeType: "modified", linesAdded: 1, linesRemoved: 0 },
    ],
    dependencies: [
      { name: "fast-csv", type: "added" }
    ]
  },
  planAlignment: {
    plannedFileChanged: true,
    unplannedFileChanged: false,
    unplannedFiles: [],
    plannedBehaviorEvidenced: "yes",
    testAddedOrUpdated: true,
    scopeExpanded: false,
    newDependencyIntroduced: true,
    externalSideEffectAttempted: false,
    planVersion: "plan_v1",
    planHash: "plan_hash_987",
  },
  verification: {
    checks: [
      {
        type: "Build",
        version: "1.0",
        status: "passed",
        summary: "Project builds successfully",
        scope: "entire project",
      },
      {
        type: "Type check",
        version: "1.0",
        status: "passed",
        summary: "No type errors found",
        scope: "entire project",
      },
      {
        type: "Unit tests",
        version: "2.1",
        status: "passed",
        summary: "12 tests passed, 0 failed",
        scope: "src/api/export.test.ts",
      },
      {
        type: "Security Static Analysis",
        version: "1.4",
        status: "passed",
        summary: "No high/critical issues found",
        limitations: "Dynamic execution not checked",
        scope: "changed files",
      }
    ]
  },
  unknowns: [
    "Load testing was not performed; performance impact of CSV generation under heavy load is unknown.",
    "Interaction with existing rate limiting middleware is unverified."
  ],
  decisions: [],
  audit: {
    requestId: "req_999abc",
    provenanceLevel: "full",
    skillVersions: ["skill_csv_generator_v1", "skill_test_writer_v2"]
  }
};

export const fixture2: ChangePassport = {
  id: "pass_456def",
  repo: "acme-corp/api-gateway",
  baseCommit: "abc1234",
  proposedCommit: "abc9999",
  status: "VERIFIED_FOR_SCOPE",
  scopeSummary: "Fix rate limit counter race condition",
  policyVersion: "v3.1",
  updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  reviewedHash: "hash_4567",
  mergeHash: "hash_4567",
  intent: {
    summary: "Fix race condition in Redis rate limiter",
    successCriteria: ["Counter increments atomically", "Tests pass under concurrent load"],
    nonGoals: [],
    assumptions: [],
    source: "inferred",
  },
  changeMap: {
    files: [
      { path: "src/middleware/rateLimit.ts", changeType: "modified", linesAdded: 5, linesRemoved: 3 },
    ],
    dependencies: []
  },
  planAlignment: {
    plannedFileChanged: true,
    unplannedFileChanged: false,
    unplannedFiles: [],
    plannedBehaviorEvidenced: "yes",
    testAddedOrUpdated: true,
    scopeExpanded: false,
    newDependencyIntroduced: false,
    externalSideEffectAttempted: false,
    planVersion: "plan_v1",
    planHash: "plan_hash_456",
  },
  verification: {
    checks: [
      { type: "Build", version: "1.0", status: "passed", summary: "Project builds successfully", scope: "entire project" },
      { type: "Unit tests", version: "2.1", status: "passed", summary: "Concurrent load tests pass", scope: "rateLimit.test.ts" },
    ]
  },
  unknowns: [],
  decisions: [{
    id: "dec_1", action: "approve", actor: "alice", timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString()
  }],
  audit: { requestId: "req_456def", provenanceLevel: "full", skillVersions: [] }
};

export const fixture3: ChangePassport = {
  id: "pass_789ghi",
  repo: "acme-corp/api-gateway",
  baseCommit: "abc1234",
  proposedCommit: "bad6666",
  status: "BLOCKED",
  scopeSummary: "Update dependencies and add monitoring",
  policyVersion: "v3.1",
  updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  reviewedHash: "hash_7890",
  mergeHash: "hash_7890",
  intent: {
    summary: "Bump all dependencies to latest",
    successCriteria: ["App starts", "Tests pass"],
    nonGoals: [],
    assumptions: [],
    source: "declared",
  },
  changeMap: {
    files: [
      { path: "package.json", changeType: "modified", linesAdded: 10, linesRemoved: 10 },
      { path: "src/utils/telemetry.ts", changeType: "added", linesAdded: 25, linesRemoved: 0, unplanned: true },
    ],
    dependencies: [
      { name: "telemetry-sdk-suspicious", type: "added" }
    ]
  },
  planAlignment: {
    plannedFileChanged: true,
    unplannedFileChanged: true,
    unplannedFiles: ["src/utils/telemetry.ts"],
    plannedBehaviorEvidenced: "unknown",
    testAddedOrUpdated: false,
    scopeExpanded: true,
    newDependencyIntroduced: true,
    externalSideEffectAttempted: true,
    planVersion: "plan_v1",
    planHash: "plan_hash_789",
  },
  verification: {
    checks: [
      { type: "Security Static Analysis", version: "1.4", status: "failed", summary: "Suspicious telemetry SDK detected", scope: "package.json" },
    ]
  },
  unknowns: ["Telemetry SDK behavior is unknown and unverified."],
  decisions: [],
  audit: { requestId: "req_789ghi", provenanceLevel: "partial", skillVersions: [] }
};

export const allFixtures = [fixture1, fixture2, fixture3];
