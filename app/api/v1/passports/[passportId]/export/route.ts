import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { retrieveEvidenceBlob } from '../../../../../../lib/blobStorage';

import { getSessionProjectId } from '../../../../../../lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;

    const projectId = await getSessionProjectId(request);
    if (!projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passport = await prisma.passport.findUnique({
      where: { 
        id: passportId,
        projectId
      },
      include: {
        EvidenceArtifact: true,
        pullRequest: true,
        auditEvents: true,
        humanDecisions: true
      }
    });

    if (!passport) {
      return NextResponse.json({ error: "Passport not found" }, { status: 404 });
    }

    // Load blobs
    const evidenceBlobs = await Promise.all(
      passport.EvidenceArtifact.map(async (artifact: any) => {
        const raw = await retrieveEvidenceBlob(artifact.uri);
        return {
          id: artifact.id,
          type: artifact.contentType,
          hash: artifact.hash,
          data: raw ? JSON.parse(raw) : null
        };
      })
    );

    // Filter and redact secrets (for export safety)
    const sanitizedEvidence = evidenceBlobs.map((blob: any) => {
      if (!blob.data) return blob;
      const stringified = JSON.stringify(blob.data);
      const redacted = stringified.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED]');
      return { ...blob, data: JSON.parse(redacted) };
    });

    // Assemble Canonical Export Package v1.0
    const exportData = {
      schema_version: "1.0",
      id: passport.id,
      status: passport.assuranceStatus,
      scope_summary: passport.scopeSummary,
      policy_version: passport.policyVersion,
      created_at: passport.createdAt.toISOString(),
      updated_at: passport.updatedAt.toISOString(),
      repository: {
        id: passport.pullRequest?.repositoryId,
        full_name: passport.pullRequest?.githubPrId.split('-')[0]
      },
      pull_request: {
        id: passport.pullRequest?.id,
        number: passport.pullRequest?.number,
        base_commit: passport.pullRequest?.baseCommit,
        proposed_commit: passport.pullRequest?.proposedCommit
      },
      evidence: sanitizedEvidence,
      decisions: passport.humanDecisions.map(d => ({
        id: d.id,
        decision: d.decision,
        actor: d.actor,
        rationale: d.rationale,
        reviewed_hash: d.reviewedHash,
        created_at: d.createdAt.toISOString()
      })),
      audit_events: passport.auditEvents.map(a => ({
        id: a.id,
        action: a.action,
        actor: a.actor,
        details: JSON.parse(a.details),
        created_at: a.createdAt.toISOString()
      })),
      exported_at: new Date().toISOString()
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="proofline-passport-${passport.id}.json"`,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Failed to export passport:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
