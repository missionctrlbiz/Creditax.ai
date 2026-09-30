import { NextResponse, type NextRequest } from 'next/server';
import { retrieve } from '@/ai/rag';

/**
 * POST /api/v1/rag/search — semantic search over the knowledge base.
 *
 * Body: { query: string, topK?: number }
 * Returns the top-k chunks with their source + section, in descending score
 * order. Used by the admin KB publish flow (P5) to verify a new rule is
 * actually searchable, and by the "find a rule" affordances in the canvas.
 */
export async function POST(req: NextRequest) {
  let body: { query?: string; topK?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const query = (body.query ?? '').trim();
  if (!query) {
    return NextResponse.json({ error: '`query` is required' }, { status: 400 });
  }
  const topK = Math.min(8, Math.max(1, body.topK ?? 5));

  const result = await retrieve(query, topK);
  return NextResponse.json({
    query,
    embedding_provider: result.embedding,
    results: result.chunks.map((c) => ({ text: c.text, source: c.source, section: c.section })),
    demo_seed: result.embedding === 'local-hash',
  });
}

export const dynamic = 'force-dynamic';
