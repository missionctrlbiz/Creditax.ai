/**
 * P2 — markdown chunker for the KB ingestion pipeline.
 *
 * Strategy (API-Research.md §3.4, simplified for the demo):
 *  - Split on H2 boundaries (each `## ` section = a candidate chunk).
 *  - Target ~500 tokens (≈ 2000 chars) with a 100-token overlap by carrying
 *    the last sentence of the previous chunk into the next.
 *  - Preserve headings in the chunk text so citations read naturally.
 *  - YAML frontmatter is stripped before chunking.
 */

export interface Chunk {
  text: string;
  section: string;
  tokenCount: number;
}

/** Rough token estimate — works well enough for demo-scale chunks. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).length * 1.3));
}

function stripFrontmatter(md: string): string {
  // Frontmatter is `---\n...\n---\n` at the very top of the file.
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? md.slice(m[0].length) : md;
}

function extractTitle(md: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Untitled';
}

/**
 * Chunk a markdown document. Returns an array of chunks ordered by position.
 * Single-line H1 titles are prepended to the first chunk for context.
 */
export function chunkMarkdown(md: string, targetTokens = 500): Chunk[] {
  const body = stripFrontmatter(md).trim();
  const title = extractTitle(md);

  // Split into H2 sections; content before the first H2 goes to "(intro)".
  const lines = body.split('\n');
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } = { heading: '(intro)', lines: [] };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current.lines.length > 0) sections.push(current);
      current = { heading: line.slice(3).trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length > 0 || current.heading !== '(intro)') sections.push(current);

  const chunks: Chunk[] = [];
  let carryOver = '';

  for (const sec of sections) {
    let sectionText = sec.lines.join('\n').trim();
    if (!sectionText) continue;
    if (sec.heading !== '(intro)') sectionText = `## ${sec.heading}\n\n${sectionText}`;

    // Sentence-level rolling window with overlap.
    const sentences = sectionText.match(/[^.!?]+[.!?]*/g)?.filter((s) => s.trim()) ?? [sectionText];
    let buf = carryOver || (sec.heading === '(intro)' ? `# ${title}\n\n` : '');
    let bufTokens = estimateTokens(buf);

    for (const sentence of sentences) {
      const sTokens = estimateTokens(sentence);
      if (bufTokens + sTokens > targetTokens && buf.trim()) {
        chunks.push(normalize(buf, sec.heading));
        // Overlap: keep the tail of the buffer (last ~100 tokens worth).
        const tailWords = buf.trim().split(/\s+/).slice(-Math.round(targetTokens * 0.2));
        buf = `${tailWords.join(' ')} ${sentence}`;
        bufTokens = estimateTokens(buf);
      } else {
        buf += sentence;
        bufTokens += sTokens;
      }
    }
    if (buf.trim()) {
      chunks.push(normalize(buf, sec.heading));
      // Carry only the last sentence into the next section for continuity.
      carryOver = sentences.length > 0 ? (sentences[sentences.length - 1] ?? '').slice(0, 200) : '';
    }
  }

  // Drop trivially empty chunks.
  return chunks.filter((c) => c.text.trim().length >= 40);
}

function normalize(text: string, section: string): Chunk {
  const clean = text.replace(/\n{3,}/g, '\n\n').trim();
  return { text: clean, section, tokenCount: estimateTokens(clean) };
}
