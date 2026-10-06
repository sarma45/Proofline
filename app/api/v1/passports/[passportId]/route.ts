import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { retrieveEvidenceBlob } from '../../../../../lib/blobStorage';
import crypto from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;

    // MVP: Simulate resolving tenant/project from Auth context (e.g. JWT)
    const mockSessionProjectId = (await prisma.project.findFirst())?.id;

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
      baseCommit: passport.pullRequest?.baseCommit || 'unknown',
      proposedCommit: passport.pullRequest?.proposedCommit || 'unknown',
      status: passport.assuranceStatus,
      scopeSummary: passport.scopeSummary,
      policyVersion: passport.policyVersion,
      
      // Merge from Blob
      intent: evidenceData.plan || { summary: "No plan found" },
      changeMap: evidenceData.changeMap || [],
      unknowns: evidenceData.unknowns || [],

      // Reconstruct verification object
      verification: {
        checks: run?.results.map((r: any) => ({
          type: r.checkType,
          status: r.status,
          summary: r.message
        })) || []
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
