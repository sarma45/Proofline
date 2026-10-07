import { get, put } from '@vercel/blob';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from './prisma';

const BLOB_DIR = path.join(process.cwd(), '.data', 'blobs');

async function ensureBlobDir() {
  try {
    await fs.access(BLOB_DIR);
  } catch {
    await fs.mkdir(BLOB_DIR, { recursive: true });
  }
}

/**
 * Stores an evidence payload in private Vercel Blob storage when available.
 * Local disk is retained only as a development fallback when Blob credentials
 * are not present, since the Vercel filesystem is ephemeral in production.
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
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const sizeBytes = buffer.length;
  const filename = `${hash}.blob`;

  let uri: string;
  if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`proofline/evidence/${filename}`, buffer, {
      access: 'private',
      addRandomSuffix: false,
      contentType
    });
    uri = blob.url;
  } else {
    await ensureBlobDir();
    const filepath = path.join(BLOB_DIR, filename);
    try {
      await fs.access(filepath);
    } catch {
      await fs.writeFile(filepath, buffer);
    }
    uri = `local://${filename}`;
  }

  return prisma.evidenceArtifact.create({
    data: {
      hash,
      uri,
      sizeBytes,
      contentType,
      sensitivity,
      passportId,
      verificationRunId
    }
  });
}

/**
 * Retrieves an evidence payload from private Vercel Blob or local development storage.
 */
export async function retrieveEvidenceBlob(uri: string): Promise<string> {
  if (uri.startsWith('local://')) {
    await ensureBlobDir();
    const filename = uri.replace('local://', '');
    return fs.readFile(path.join(BLOB_DIR, filename), 'utf8');
  }

  const blob = await get(uri, { access: 'private' });
  if (!blob) {
    throw new Error(`Evidence blob not found: ${uri}`);
  }

  return new Response(blob.stream).text();
}
