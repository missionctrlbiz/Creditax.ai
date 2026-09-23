/**
 * P2 — LLM provider for the grounded answer step.
 *
 * Primary: Kimchi.dev (OpenAI-compatible, minimax-m2.7) using the KIMCHI_* env
 * vars already in .env. Fallback: a local "synthesizer" that composes a
 * useful answer from the top retrieved chunks + the deterministic tax rules
 * when Kimchi is unreachable / keyless — so the RAG demo always produces a
 * grounded, cited response. The provider used is returned so the caller can
 * tag responses with `llm_provider`.
 */

export interface LLMContext {
  /** Retrieved chunk texts, each prefixed with its source. */
  context: string[];
  question: string;
  /** User locale (en/yo/ha/ig). Fallback localizer only handles 'en'. */
  locale?: string;
}

export interface LLMResult {
  answer: string;
  provider: 'kimchi' | 'local-synthesizer';
  confidence: number; // 0..1 — heuristic in the local path
}

const KIMCHI_BASE =
  process.env.KIMCHI_BASE_URL || 'https://llm.kimchi.dev/openai/v1';
const KIMCHI_MODEL = process.env.KIMCHI_MODEL || 'minimax-m2.7';

function kimchiKey(): string | undefined {
  return process.env.KIMCHI_API_KEY;
}

export async function callLLM(ctx: LLMContext): Promise<LLMResult> {
  const key = kimchiKey();
  if (key) {
    try {
      const res = await fetch(`${KIMCHI_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: KIMCHI_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are a Nigerian tax law assistant. Answer using ONLY the provided ' +
                'context, which quotes published NTA/NTAA/FIRS material. If the context ' +
                'does not contain the answer, say so and do not invent law. Cite your ' +
                'sources with [Source: <name>] markers. Keep it concise and practical.',
            },
            {
              role: 'user',
              content:
                `Context:\n${ctx.context.join('\n\n---\n\n')}\n\n` +
                `Question: ${ctx.question}`,
            },
          ],
          temperature: 0.2,
          max_tokens: 900,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text: string | undefined = data?.choices?.[0]?.message?.content;
        if (text && text.trim()) {
          return { answer: text.trim(), provider: 'kimchi', confidence: 0.9 };
        }
      }
      console.warn(`[llm] Kimchi ${res.status}, using local synthesizer`);
    } catch (err) {
      console.warn('[llm] Kimchi unreachable, using local synthesizer', err);
    }
  }

  return localSynthesize(ctx);
}

/**
 * Deterministic answer synthesizer. Ranks the passed context against the
 * question by keyword overlap and assembles a short, cited answer. This is
 * the "knows nothing real but behaves" path — it never claims to be an LLM.
 */
function localSynthesize(ctx: LLMContext): LLMResult {
  const q = ctx.question.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 3);

  const scored = ctx.context
    .map((block) => {
      const src = (block.match(/^\[Source: ([^\]]+)\]/) || [])[1] ?? 'Tax reference';
      const text = block.replace(/^\[Source: [^\]]+\]\n?/, '').toLowerCase();
      let hits = 0;
      for (const w of words) if (text.includes(w)) hits += 1;
      return { src, text, hits };
    })
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 3);

  const confidence = scored.length > 0 ? Math.min(0.7, 0.3 + scored[0].hits * 0.08) : 0.2;

  if (scored.length === 0) {
    return {
      answer:
        'I could not find a matching rule in the current knowledge base for that. ' +
        'For a high-stakes or audit question, I would refer you to a verified tax professional.',
      provider: 'local-synthesizer',
      confidence,
    };
  }

  const sourceLines = scored.map((s) => `[Source: ${s.src}]`).join(' ');
  const body = scored
    .map((s) => s.text.slice(0, 320))
    .join('\n\n');

  return {
    answer: `${body}\n\n${sourceLines}`,
    provider: 'local-synthesizer',
    confidence,
  };
}
