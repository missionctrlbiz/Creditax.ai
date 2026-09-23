import { NextResponse, type NextRequest } from 'next/server';
import { processDocument, seedDocumentsForUser } from '@/ai/documents';

/**
 * POST /api/v1/documents/upload — process an uploaded document.
 *
 * Body: { name: string, rawBody?: string, userId?: string }
 *
 * Runs the deterministic extractor (Track A: filename + heuristics, no OCR),
 * returns the extracted fields + confidence, flagged `demo_seed: true`.
 *
 * Track B swaps the extractor for Google Document AI / vision LLM behind this
 * same route — the response shape is stable.
 */
export async function POST(req: NextRequest) {
  let body: { name?: string; rawBody?: string; userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const name = (body.name ?? '').trim();
  if (!name) {
    return NextResponse.json({ error: '`name` (the uploaded filename) is required' }, { status: 400 });
  }
  const doc = await processDocument({ name, rawBody: body.rawBody, userId: body.userId });
  return NextResponse.json({ ...doc, async: true, note: 'Extraction completes near-instantly in Track A; a worker polls this record in Track B.' });
}

/**
 * GET /api/v1/documents?userId=demo — list processed documents.
 * P8: demo seed accounts are lazily seeded with the fixture docs (from the
 * store, not a static array) so the canvas library reflects live data.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') ?? 'demo';
  const documents = seedDocumentsForUser(userId);
  return NextResponse.json({ userId, documents, demo_seed: true });
}

export const dynamic = 'force-dynamic';
