import type { SearchResult } from './types';
import { getServiceSupabase } from './supabase';

const VERTEX_AI_PROJECT_ID = process.env.VERTEX_AI_PROJECT_ID;
const EMBEDDING_MODEL = 'text-embedding-005';

async function getVertexAccessToken(): Promise<string> {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentials) throw new Error('GOOGLE_APPLICATION_CREDENTIALS not set');
  
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token || '';
}

export async function embedText(text: string): Promise<number[]> {
  if (!VERTEX_AI_PROJECT_ID) {
    throw new Error('VERTEX_AI_PROJECT_ID not configured');
  }
  
  const accessToken = await getVertexAccessToken();
  
  const response = await fetch(
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${VERTEX_AI_PROJECT_ID}/locations/us-central1:predict`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: `projects/${VERTEX_AI_PROJECT_ID}/locations/us-central1/publishers/google/models/${EMBEDDING_MODEL}`,
        instances: [{ content: text }],
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI embedding failed: ${error}`);
  }
  
  const data = await response.json();
  return data.predictions[0].embeddings.values;
}

export async function searchVectors(
  embedding: number[],
  limit: number = 5
): Promise<SearchResult[]> {
  const supabaseAdmin = getServiceSupabase();
  
  const { data, error } = await supabaseAdmin
    .rpc('match_tax_chunks', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit,
    });
  
  if (error) throw new Error(`Vector search failed: ${error.message}`);
  
  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    content: row.content as string,
    metadata: row.metadata as { title: string; url?: string; chunk_index: number },
    similarity: row.similarity as number,
  }));
}

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateResponse(
  question: string,
  context: string,
  history: LLMMessage[] = []
): Promise<{ reply: string; tokensUsed: number }> {
  const apiKey = process.env.KIMCHI_API_KEY;
  const baseUrl = process.env.KIMCHI_BASE_URL || 'https://api.kimchi.ai/v1';
  
  if (!apiKey) {
    throw new Error('KIMCHI_API_KEY not configured');
  }
  
  const systemPrompt = `You are Creditax Tax Assistant, an expert in Nigerian tax law. Use the provided context to answer user questions accurately. Always cite your sources when providing specific information from the tax documents.

Guidelines:
- Be precise and cite specific sections, articles, or regulations
- If the context doesn't contain enough information, say so honestly
- Use a friendly but professional tone
- Format your response clearly with bullet points or numbered lists when appropriate
- When citing sources, mention the document title and relevant section

Context from tax documents:
${context}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: question },
  ];
  
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'kimchi-minimax',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kimchi LLM failed: ${error}`);
  }
  
  const data = await response.json();
  const usage = data.usage || {};
  
  return {
    reply: data.choices[0].message.content,
    tokensUsed: usage.total_tokens || 0,
  };
}

export function buildContextFromResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant documents found in the knowledge base.';
  }
  
  return results
    .map((result, index) => {
      return `[Source ${index + 1}: ${result.metadata.title}]\n${result.content}`;
    })
    .join('\n\n');
}