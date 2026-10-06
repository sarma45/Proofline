import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { retrieveEvidenceBlob } from '../../../../../lib/blobStorage';
import crypto from 'crypto';
import { getSessionProjectId } from '../../../../../lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;

    // MVP: Resolve tenant/project from Auth context (e.g. JWT or header)
    const mockSessionProjectId = await getSessionProjectId(request);

    if (!mockSessionProjectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Passport from Database WITH Tenant Isolation
    const passport = await prisma.passport.findUnique({
      where: { 
        id: passportId,
        projectId: mockSessionProjectId // Prevents cross-tenant read
      },
      include: {
        pullRequest: {
          include: { repository: true }
        },
        verificationRuns: {
          include: { results: true },
          orderBy: { createdAt: 'desc' },
          take: 1 // Get latest run
        },
        EvidenceArtifact: {
          take: 1 // Get the associated evidence blob
        },
        humanDecisions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!passport) {
      return NextResponse.json({
        code: "not_found",
        message: "Passport not found",
        retryable: false,
        request_id: crypto.randomUUID()
      }, { status: 404 });
    }

    // Try to load the rich evidence payload from blob storage
    let evidenceData: any = {};
    if (passport.EvidenceArtifact && passport.EvidenceArtifact.length > 0) {
      try {
        const rawBlob = await retrieveEvidenceBlob(passport.EvidenceArtifact[0].uri);
        evidenceData = JSON.parse(rawBlob);
      } catch (err) {
        console.error("Failed to load evidence blob:", err);
      }
    }

    // Map DB entity and blob back to the expected UI schema
    const run = passport.verificationRuns[0];
    const uiPayload = {
      id: passport.id,
      repo: passport.pullRequest?.repository?.fullName || 'unknown/repo',
      pullRequestNumber: passport.pullRequest?.number || null,
      baseCommit: passport.pullRequest?.baseCommit || 'unknown',
      proposedCommit: passport.pullRequest?.proposedCommit || 'unknown',
      status: passport.assuranceStatus,
      scopeSummary: passport.scopeSummary,
      policyVersion: passport.policyVersion,
      reviewedHash: passport.humanDecisions?.[0]?.reviewedHash || '', // Just for UI match check
      mergeHash: passport.pullRequest?.proposedCommit || '',
      
      // Merge from Blob
      intent: evidenceData.intent || evidenceData.plan || { summary: "No plan found", source: "unknown", successCriteria: [], nonGoals: [], assumptions: [] },
      changeMap: evidenceData.changeMap || { files: [], dependencies: [] },
      planAlignment: evidenceData.planAlignment || { 
        plannedFileChanged: false, unplannedFileChanged: false, unplannedFiles: [],
        plannedBehaviorEvidenced: "unknown", testAddedOrUpdated: false, scopeExpanded: false,
        planVersion: "", planHash: ""
      },
      unknowns: evidenceData.unknowns || [],

      // Reconstruct verification object
      verification: {
        checks: run?.results.map((r: any) => ({
          type: r.checkType,
          status: r.status,
          summary: r.message
        })) || []
      },
      decisions: passport.humanDecisions || [],
      audit: evidenceData.audit || {
        requestId: crypto.randomUUID(),
        provenanceLevel: 'l1',
        skillVersions: ['v1.0.0']
      }
    };

    return NextResponse.json(uiPayload);
  } catch (error) {
    console.error('Passport Fetch Error:', error);
    return NextResponse.json({
      code: "internal_error",
      message: "An error occurred fetching the passport",
      retryable: true,
      retry_class: "backoff",
      request_id: crypto.randomUUID()
    }, { status: 500 });
  }
}
