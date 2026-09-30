import { NextResponse, type NextRequest } from 'next/server';
import { processDocument, seedDocumentsForUser } from '@/ai/documents';
import { guard } from '@/lib/rate-limit';
import { meter } from '@/ai/quota';

/**
 * POST /api/v1/documents — process an uploaded document.
 *
 * Body: { name: string, rawBody?: string, userId?: string }
 *
 * Runs the deterministic extractor (Track A: filename + heuristics, no OCR),
 * returns the extracted fields + confidence, flagged `demo_seed: true`.
 * P19: uploads are metered server-side (3 credits, upload cap/day) when a
 * userId is present — previously only chat enforced the quota engine.
 *
 * Track B swaps the extractor for Google Document AI / vision LLM behind this
 * same route — the response shape is stable.
 */
export async function POST(req: NextRequest) {
  const limited = guard(req);
  if (limited) return limited;

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
  if (body.userId) {
    const gate = meter(body.userId, 'upload');
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: gate.reason,
          blocked: true,
          upgrade: gate.status.upgradeHint,
          status: gate.status,
          demo_seed: true,
        },
        { status: 403, headers: { 'X-Creditax-Quota': gate.reason ?? 'limit' } }
      );
    }
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
