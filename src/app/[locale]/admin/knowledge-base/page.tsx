'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePlus, FileText, Pencil, RefreshCw, SearchX, UploadCloud, CheckCircle2, ScrollText, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface KbDoc {
  id: string;
  title: string;
  slug: string;
  status: string;
  chunks: number;
  demo_seed?: boolean;
}
interface AuditLine {
  id: string;
  at: string;
  action: string;
  title: string;
  chunks: number;
  embeddingProvider: string;
  demo_seed: boolean;
}
interface PublishProof {
  title: string;
  chunksIndexed: number;
  embeddingProvider: string;
  searchableNow: boolean;
  topHit: string | null;
  demo_seed: boolean;
}

// Default editor sample — the demo admin "saves a published doc".
const SAMPLE_DOC = {
  title: 'TCC Deadlines 2026',
  slug: 'tcc-deadlines-2026',
  markdown: `# TCC Deadlines 2026

A Tax Clearance Certificate (TCC) confirms good compliance as of a date.
FIRS issues it after a compliance review.

- Apply via the FIRS portal; valid for 12 months.
- Required for government contracts, tenders, and loan due diligence.
- Missing: any unpaid assessment or outstanding WHT remittance blocks issuance.`,
};

export default function AdminKnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState<KbDoc[]>([]);
  const [audit, setAudit] = useState<AuditLine[]>([]);
  const [live, setLive] = useState(false);

  // Editor state (F-16 publish flow).
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState(SAMPLE_DOC.title);
  const [slug, setSlug] = useState(SAMPLE_DOC.slug);
  const [markdown, setMarkdown] = useState(SAMPLE_DOC.markdown);
  const [publishing, setPublishing] = useState(false);
  const [proof, setProof] = useState<PublishProof | null>(null);

  useEffect(() => {
    fetch('/api/v1/admin/kb')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setDocs(d.documents ?? []);
          setAudit((d.audit ?? []).map((a: AuditLine) => a));
          setLive(true);
        }
      })
      .catch(() => setLive(true));
  }, []);

  const filtered = docs.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()));

  async function publish() {
    if (!title.trim() || !slug.trim() || !markdown.trim()) return;
    setPublishing(true);
    setProof(null);
    try {
      const res = await fetch('/api/v1/admin/kb/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, markdown, actor: 'admin' }),
      });
      const data = await res.json();
      if (res.ok) {
        setProof({
          title: data.documentId ? title : title,
          chunksIndexed: data.chunksIndexed,
          embeddingProvider: data.embeddingProvider,
          searchableNow: data.searchableNow,
          topHit: data.topHit,
          demo_seed: data.demo_seed,
        });
        // Refresh the corpus + audit from the endpoint.
        const r2 = await fetch('/api/v1/admin/kb');
        if (r2.ok) {
          const d2 = await r2.json();
          setDocs(d2.documents ?? []);
          setAudit((d2.audit ?? []).map((a: AuditLine) => a));
        }
      }
    } catch {
      /* offline — keep the editor open; the demo still shows the proof panel on next load */
    } finally {
      setPublishing(false);
      setEditorOpen(false);
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Knowledge Base</h1>
          <p className="text-text-muted mt-1">What the agent is allowed to know — every doc published here is searchable by chat on the next question.</p>
        </div>
        <Button variant="primary" size="md" className="self-start" onClick={() => setEditorOpen((v) => !v)}>
          <FilePlus size={15} />
          {editorOpen ? 'Close Editor' : 'Add Document'}
        </Button>
      </motion.div>

      {/* F-16 — the money shot: publish → chat improves */}
      {editorOpen && (
        <motion.div variants={itemVariants}>
          <Card className="p-5 mb-6 border-brand-primary-border">
            <div className="flex items-center gap-2 mb-3">
              <UploadCloud size={16} className="text-brand-primary" />
              <h2 className="font-semibold text-text-primary">Publish a rule (F-16)</h2>
              <span className="text-[11px] text-text-muted">saves → re-embeds → instantly searchable in chat</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-[12px] text-text-muted">
                Title
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 mt-1" />
              </label>
              <label className="text-[12px] text-text-muted">
                Slug
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-9 mt-1 font-mono" />
              </label>
            </div>
            <label className="block text-[12px] text-text-muted mt-3">
              Markdown
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={5}
                className="w-full mt-1 rounded-btn border border-border-strong bg-surface-base px-3 py-2 text-sm text-text-primary font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              />
            </label>
            <div className="mt-3 flex gap-2">
              <Button variant="primary" size="sm" onClick={publish} disabled={publishing}>
                {publishing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {publishing ? 'Publishing…' : 'Publish + Re-embed'}
              </Button>
            </div>
          </Card>

          {/* F-16 proof panel: "chat improves" */}
          <AnimatePresence>
            {proof && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-5 border-brand-action-bg/40">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-brand-action" />
                    <h3 className="font-semibold text-text-primary">Now live in the assistant</h3>
                    <Badge variant="brand">{proof.demo_seed ? 'demo_seed' : 'live embeddings'}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary">
                    &ldquo;{proof.title}&rdquo; indexed <span className="font-mono">{proof.chunksIndexed}</span> chunks
                    via <span className="font-mono">{proof.embeddingProvider}</span>. A chat asking about it now cites this doc
                    {proof.searchableNow ? ' (verified top-5 hit)' : ''}.
                    {proof.topHit && (
                      <>
                        {' '}
                        Top hit: <span className="text-brand-primary font-medium">{proof.topHit}</span>
                      </>
                    )}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* F-16 audit log */}
      {audit.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ScrollText size={16} className="text-text-muted" />
              <h3 className="text-sm font-semibold text-text-primary">Publish audit</h3>
            </div>
            <ul className="space-y-1.5">
              {audit.map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-[12px] text-text-secondary">
                  <Badge variant={a.action === 'published' ? 'success' : 'brand'}>{a.action}</Badge>
                  <span className="font-medium text-text-primary">{a.title}</span>
                  <span className="font-mono text-text-muted">{a.chunks} chunks · {a.embeddingProvider}</span>
                  <span className="ml-auto text-[10px] text-text-muted">{new Date(a.at).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <motion.div variants={itemVariants} className="max-w-md">
        <Input placeholder="Search documents..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-10" />
      </motion.div>

      {/* Document Grid */}
      {filtered.length > 0 ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-inset flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{doc.title}</h3>
                    <p className="text-[11px] text-text-muted font-mono">{doc.slug}</p>
                  </div>
                </div>
                <Badge variant={doc.status === 'published' ? 'success' : 'warning'} className="flex-shrink-0">
                  {doc.status}
                </Badge>
              </div>
              <p className="text-text-muted text-sm mt-3">
                <span className="font-mono tabular-nums">{doc.chunks}</span> chunks indexed
                {doc.demo_seed && <span className="ml-2 text-[11px]">· demo_seed</span>}
              </p>
              <div className="flex items-center gap-1 mt-4">
                <button
                  aria-label={`Edit ${doc.title}`}
                  title="Edit"
                  onClick={() => {
                    setSlug(doc.slug);
                    setEditorOpen(true);
                  }}
                  className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  aria-label={`Re-index ${doc.title}`}
                  title="Re-index"
                  onClick={() =>
                    toast(`Re-indexing ${doc.title} (demo)`, {
                      description:
                        'Vector re-embedding runs on the Track B ingestion worker; rules are searchable in chat afterwards.',
                    })
                  }
                  className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </Card>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="p-10 text-center">
            <SearchX className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">
              {live ? 'No documents match' : 'Loading…'}
              {query ? ` "${query}"` : ''}
              {!live ? ' — the live corpus is loading.' : '.'}
            </p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
