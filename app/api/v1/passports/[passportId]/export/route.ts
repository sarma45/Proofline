import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { retrieveEvidenceBlob } from '../../../../../../lib/blobStorage';

export async function GET(
  request: Request,
  { params }: { params: { passportId: string } }
) {
  try {
    const { passportId } = params;

    // MVP: Simulate resolving tenant/project from Auth context
    const mockSessionProjectId = (await prisma.project.findFirst())?.id;

    if (!mockSessionProjectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passport = await prisma.passport.findUnique({
      where: { 
        id: passportId,
        projectId: mockSessionProjectId
      },
      include: {
        EvidenceArtifact: true,
        pullRequest: true
      }
    });

    if (!passport) {
      return NextResponse.json({ error: "Passport not found or unauthorized" }, { status: 404 });
    }

    // Load blobs
    const evidenceBlobs = await Promise.all(
      passport.EvidenceArtifact.map(async (artifact: any) => ({
        type: artifact.contentType,
        data: JSON.parse(await retrieveEvidenceBlob(artifact.uri))
      }))
    );

    // Filter and redact secrets (for export safety)
    const sanitizedEvidence = evidenceBlobs.map((blob: any) => {
      // Very basic MVP redaction
      const stringified = JSON.stringify(blob.data);
      const redacted = stringified.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED]');
      return { type: blob.type, data: JSON.parse(redacted) };
    });

    // Assemble export package
    const exportData = {
      id: passport.id,
      schema_version: passport.version,
      status: passport.assuranceStatus,
      repository: passport.pullRequest?.githubPrId.split('-')[0],
      pull_request: passport.pullRequest?.number,
      evidence: sanitizedEvidence,
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
