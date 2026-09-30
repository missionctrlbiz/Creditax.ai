import { NextResponse, type NextRequest } from 'next/server';
import { publishKbDoc } from '@/ai/kb-admin';

/**
 * P5 F-16 — POST /api/v1/admin/kb/publish — the money shot.
 *
 * Body: { title, slug, markdown, category?, actor? }
 *
 * Chunk + embed + upsert into the *active* vector store, verify the doc is now
 * retrievable by a topical query, and return the audit line. Because the store
 * is process-cached, the next `POST /api/v1/chat` already cites the new rules —
 * "admin publish → chat improves" is real within one server process.
 *
 * Track A: demo_seed flagged by the embedding provider (OpenRouter live = false,
 * local-hash fallback = true). Track B = PocketBase kb_docs + kb_chunks + a
 * Trigger.dev re-index job.
 */
export async function POST(req: NextRequest) {
  let body: { title?: string; slug?: string; markdown?: string; category?: string; actor?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.title?.trim() || !body.slug?.trim() || !body.markdown?.trim()) {
    return NextResponse.json({ error: '`title`, `slug` and `markdown` are required' }, { status: 400 });
  }

  const out = await publishKbDoc({
    title: body.title,
    slug: body.slug,
    markdown: body.markdown,
    category: body.category,
    actor: body.actor,
  });

  return NextResponse.json({
    published: true,
    documentId: out.result.documentId,
    chunksIndexed: out.result.chunksCreated,
    embeddingProvider: out.result.embeddingProvider,
    searchableNow: out.searchable,
    topHit: out.topHit,
    audit: out.audit,
    demo_seed: out.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
