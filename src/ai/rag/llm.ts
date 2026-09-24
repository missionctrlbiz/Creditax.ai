/**
 * P13 — LLM provider for the grounded answer step (canon-reconciled).
 *
 * Provider order (OpenAI-compatible chat/completions, first live success wins):
 *   1. LITELLM  — canonical primary per `.env.example` header + live .env
 *                 ("LITELLM.dev primary, OpenAI-compatible"). Read from
 *                 LITELLM_API_KEY / LITELLM_BASE_URL / LITELLM_MODEL.
 *   2. KIMCHI   — legacy second leg (the committed P2 default). Read from
 *                 KIMCHI_* . Kept as a fallback, not removed, so a working
 *                 Kimchi key still answers if the LITELLM leg is down.
 *   3. local-synthesizer — deterministic offline path that composes a
 *                 useful, cited answer from the top retrieved chunks.
 *
 * The chosen provider + model are returned so the caller can tag responses
 * with `llm_provider` / `llm_model` (P13 provider-health logging) and keep
 * the demo_seed honesty flag truthful (true only on the local-synthesizer).
 *
 * Model resolution: LITELLM_MODEL → KIMCHI_MODEL → 'minimax-m2.7'. In the
 * live .env, LITELLM_MODEL is empty and KIMCHI_MODEL is a model id that the
 * LITELLM host actually serves, so the resolved model tracks the live key.
 */

export interface LLMContext {
  /** Retrieved chunk texts, each prefixed with its source. */
  context: string[];
  question: string;
  /** User locale (en/yo/ha/ig). Fallback localizer only handles 'en'. */
  locale?: string;
}

export type LLMProvider = 'litellm' | 'kimchi' | 'local-synthesizer';

export interface LLMResult {
  answer: string;
  provider: LLMProvider;
  /** The concrete model id used (empty string for the local synthesizer). */
  model: string;
  confidence: number; // 0..1 — heuristic in the local path
}

interface LLMEndpoint {
  provider: Exclude<LLMProvider, 'local-synthesizer'>;
  base: string;
  model: string;
  key: string;
}

function resolvedModel(): string {
  return (
    process.env.LITELLM_MODEL ||
    process.env.KIMCHI_MODEL ||
    'minimax-m2.7'
  );
}

/** The live, key-backed LLM legs in canonical order. Keyless legs are skipped. */
function llmEndpoints(): LLMEndpoint[] {
  const model = resolvedModel();
  const endpoints: LLMEndpoint[] = [];

  const litellmKey = process.env.LITELLM_API_KEY;
  if (litellmKey) {
    endpoints.push({
      provider: 'litellm',
      base:
        process.env.LITELLM_BASE_URL || 'https://llm.LITELLM.dev/openai/v1',
      model,
      key: litellmKey,
    });
  }

  const kimchiKey = process.env.KIMCHI_API_KEY;
  if (kimchiKey) {
    endpoints.push({
      provider: 'kimchi',
      base: process.env.KIMCHI_BASE_URL || 'https://llm.kimchi.dev/openai/v1',
      model: process.env.KIMCHI_MODEL || model,
      key: kimchiKey,
    });
  }

  return endpoints;
}

/** Language name per locale — drives the "answer in this language" instruction. */
const LOCALE_LANGUAGE: Record<string, string> = {
  en: 'English',
  yo: 'Yoruba',
  ha: 'Hausa',
  ig: 'Igbo',
};

/** Short localized lead-in so the offline synthesizer returns a real localized answer (not just English). */
const LOCALE_LEAD: Record<string, string> = {
  en: '',
  yo: 'Ní ètò àṣàwáwhélẹ̀ (demo), \n',
  ha: '(Demo) — don\'da ciki, \n',
  ig: '(Demo) — azịza, \n',
};

async function callOpenAICompatible(
  endpoint: LLMEndpoint,
  ctx: LLMContext
): Promise<string | null> {
  const lang = LOCALE_LANGUAGE[ctx.locale ?? 'en'] ?? 'English';
  const res = await fetch(`${endpoint.base.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${endpoint.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: endpoint.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a Nigerian tax law assistant. Answer using ONLY the provided ' +
            'context, which quotes published NTA/NTAA/FIRS material. If the context ' +
            'does not contain the answer, say so and do not invent law. Cite your ' +
            'sources with [Source: <name>] markers. Keep it concise and practical. ' +
            `Respond in ${lang}.`,
        },
        {
          role: 'user',
          content:
            `Context:\n${ctx.context.join('\n\n---\n\n')}\n\n` +
            `Question: ${ctx.question}\n\nAnswer in ${lang}.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 900,
    }),
  });

  if (!res.ok) {
    // Surface the provider status but never leak the key into the log line.
    console.warn(`[llm] ${endpoint.provider} ${res.status}, trying next leg`);
    return null;
  }

  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  if (text && text.trim()) return text.trim();
  console.warn(`[llm] ${endpoint.provider} returned no content, trying next leg`);
  return null;
}

export async function callLLM(ctx: LLMContext): Promise<LLMResult> {
  const endpoints = llmEndpoints();
  for (const endpoint of endpoints) {
    try {
      const text = await callOpenAICompatible(endpoint, ctx);
      if (text) {
        return { answer: text, provider: endpoint.provider, model: endpoint.model, confidence: 0.9 };
      }
    } catch (err) {
      console.warn(`[llm] ${endpoint.provider} unreachable, trying next leg`, err);
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

  const localeLead = LOCALE_LEAD[ctx.locale ?? 'en'] ?? '';
  const noMatch =
    'I could not find a matching rule in the current knowledge base for that. ' +
    'For a high-stakes or audit question, I would refer you to a verified tax professional.';

  if (scored.length === 0) {
    return {
      answer: localeLead ? `${localeLead}${noMatch}` : noMatch,
      provider: 'local-synthesizer',
      model: '',
      confidence,
    };
  }

  const sourceLines = scored.map((s) => `[Source: ${s.src}]`).join(' ');
  const body = scored
    .map((s) => s.text.slice(0, 320))
    .join('\n\n');

  return {
    answer: `${localeLead}${body}\n\n${sourceLines}`,
    provider: 'local-synthesizer',
    model: '',
    confidence,
  };
}
