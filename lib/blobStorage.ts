import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { prisma } from './prisma';

// Ensure the local blob directory exists
const BLOB_DIR = path.join(process.cwd(), '.data', 'blobs');

async function ensureBlobDir() {
  try {
    await fs.access(BLOB_DIR);
  } catch {
    await fs.mkdir(BLOB_DIR, { recursive: true });
  }
}

/**
 * Stores a rich evidence payload (JSON string or Buffer) into local storage
 * and returns the corresponding EvidenceArtifact Prisma record.
 */
export async function storeEvidenceBlob({
  passportId,
  verificationRunId,
  content,
  contentType = 'application/json',
  sensitivity = 'internal'
}: {
  passportId?: string;
  verificationRunId?: string;
  content: string | Buffer;
  contentType?: string;
  sensitivity?: string;
}) {
  await ensureBlobDir();

  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  
  // Calculate SHA256 Hash
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const sizeBytes = buffer.length;

  // We use the hash as the filename to natively deduplicate
  const filename = `${hash}.blob`;
  const filepath = path.join(BLOB_DIR, filename);

  // Write to disk if it doesn't already exist
  try {
    await fs.access(filepath);
  } catch {
    await fs.writeFile(filepath, buffer);
  }

  // Record it in the database
  const artifact = await prisma.evidenceArtifact.create({
    data: {
      hash,
      uri: `local://${filename}`,
      sizeBytes,
      contentType,
      sensitivity,
      passportId,
      verificationRunId
    }
  });

  return artifact;
}

/**
 * Retrieves a stored blob based on its URI
 */
export async function retrieveEvidenceBlob(uri: string): Promise<string> {
  if (!uri.startsWith('local://')) {
    throw new Error('Only local:// URIs are supported in MVP');
  }

  const filename = uri.replace('local://', '');
  const filepath = path.join(BLOB_DIR, filename);

  const content = await fs.readFile(filepath, 'utf8');
  return content;
}
