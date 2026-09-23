import { NextResponse } from 'next/server';
import { listPublishedDocs, getKbAuditLog } from '@/ai/kb-admin';

/**
 * P5 F-16 — GET /api/v1/admin/kb — active KB corpus (the money-shot admin board).
 *
 * Returns the live vector-store documents with per-doc chunk counts, plus the
 * recent publish/republish audit log. Track A: when the store is the seeded
 * backend, `demo_seed: true` (Track B = PocketBase kb_docs + Trigger.dev
 * re-index).
 */
export async function GET() {
  const docs = await listPublishedDocs();
  const audit = getKbAuditLog(20);
  return NextResponse.json({
    documents: docs,
    audit,
    backend: 'pocketbase-or-seeded',
    demo_seed: docs[0]?.demo_seed ?? true,
  });
}

export const dynamic = 'force-dynamic';
