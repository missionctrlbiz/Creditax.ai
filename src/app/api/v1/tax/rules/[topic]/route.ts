import { NextResponse, type NextRequest } from 'next/server';
import { retrieve } from '@/ai/rag';
import { PIT_BANDS, WHT_RATES, VAT_RATE, fmtNaira } from '@/ai/tax-rules';

/**
 * GET /api/v1/tax/rules/:topic — topic-scoped rule retrieval.
 *
 * Returns the rules for a known topic: the deterministic reference tables
 * (PAYE bands, VAT rate, WHT rates) plus semantically retrieved KB chunks
 * for that topic, with citations. Unknown topics get retrieval only.
 *
 * Topics: paye | vat | wht | tcc | nta | ntaa | filing
 * Naira-only, demo-labeled — re-verify against the current NTA schedule before
 * production use.
 */

const TOPIC_TO_KB_QUERY: Record<string, string> = {
  paye: 'PAYE personal income tax salary graduated bands relief',
  vat: 'VAT value added tax rate 7.5 input output filing',
  wht: 'withholding tax WHT rates credit notes recovery',
  tcc: 'tax clearance certificate TCC readiness checklist',
  nta: 'Nigeria Tax Act NTA 2023 corporate income tax',
  ntaa: 'tax administration act NTAA filing deadlines penalties TIN',
  filing: 'filing deadlines PAYE VAT WHT remittance',
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ topic: string }> }) {
  const { topic: rawTopic } = await params;
  const topic = (rawTopic || '').toLowerCase().trim();
  const known = Object.keys(TOPIC_TO_KB_QUERY);
  if (!topic || !known.includes(topic)) {
    return NextResponse.json(
      {
        error: `Unknown topic "${rawTopic}". Supported: ${known.join(', ')}`,
        topics: known,
        demo_seed: true,
      },
      { status: 404 }
    );
  }

  // Semantic retrieval for this topic (vector store → seeded fallback offline).
  const { chunks, embedding, demo_seed } = await retrieve(TOPIC_TO_KB_QUERY[topic], 4);

  // Deterministic reference tables where the topic has one.
  const reference: Record<string, unknown> = {};
  if (topic === 'paye') {
    reference.pitBands = PIT_BANDS.map((b) => ({
      band: `${fmtNaira(b.from)}–${b.to === Infinity ? 'and above' : fmtNaira(b.to)}`,
      rate: b.rate,
    }));
    reference.consolidatedRelief = 'max(₦200,000, 20% of gross), minimum 1% of gross';
  } else if (topic === 'vat') {
    reference.vatRate = VAT_RATE;
    reference.filingDeadline = '21st of the following month';
  } else if (topic === 'wht') {
    reference.typicalRates = WHT_RATES;
    reference.note = 'Rates vary by category; confirm the current FIRS circular.';
  }

  return NextResponse.json({
    topic,
    reference,
    retrievedRules: chunks.map((c) => ({ text: c.text, source: c.source, section: c.section, score: c.score })),
    citations: chunks.map((c) => `${c.source} — ${c.section}`),
    embedding_provider: embedding,
    reference_sources: ['NTA 2023', 'FIRS guides', 'NTAA 2023'],
    demo_seed,
  });
}

export const dynamic = 'force-dynamic';
