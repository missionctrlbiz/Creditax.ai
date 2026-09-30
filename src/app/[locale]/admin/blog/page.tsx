'use client';

/**
 * Author Blog board — the content workflow for the Author role (P10 scoped
 * grant). Lists seed-published posts + the author's own queue (drafts and
 * published), with create / edit / publish actions. Posts persist to
 * localStorage via @/ai/blog-admin (Track A demo pattern, same as mock-auth);
 * published posts surface on the public /blog board after a reload.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  Clock,
  FilePlus2,
  Pencil,
  Rocket,
  Save,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import {
  allPosts,
  createDraft,
  publishPost,
  updatePost,
  type AuthorPost,
} from '@/ai/blog-admin';
import { categories, type BlogPost } from '@/data/blog';

const EDITABLE_CATEGORIES = categories.filter((c) => c !== 'All') as BlogPost['category'][];

const CATEGORY_DOT: Record<string, string> = {
  'Tax Tips': 'bg-brand-primary',
  'Product Updates': 'bg-info',
  'API Guides': 'bg-brand-action',
  'Nigerian Finance': 'bg-warning',
  'Credit & Borrowing': 'bg-success',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

interface EditorState {
  id: number | null;
  title: string;
  category: BlogPost['category'];
  excerpt: string;
  content: string; // one paragraph per line
  keyPoints: string; // one per line
  tags: string; // comma-separated
}

const BLANK_EDITOR: EditorState = {
  id: null,
  title: '',
  category: 'Tax Tips',
  excerpt: '',
  content: '',
  keyPoints: '',
  tags: '',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AuthorPost[]>([]);
  const [live, setLive] = useState(false);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);

  // Hydrate the merged corpus (seed + author localStorage queue) after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setPosts(allPosts());
      setLive(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  const drafts = posts.filter((p) => p.status === 'draft').length;
  const published = posts.filter((p) => p.status === 'published').length;

  function openEditor(post?: AuthorPost) {
    setEditor(
      post
        ? {
            id: post.id,
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content.join('\n'),
            keyPoints: post.keyPoints.join('\n'),
            tags: post.tags.join(', '),
          }
        : { ...BLANK_EDITOR }
    );
  }

  function splitLines(text: string): string[] {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  }

  function saveDraft(publish: boolean) {
    if (!editor) return;
    const content = splitLines(editor.content);
    const keyPoints = splitLines(editor.keyPoints);
    const tags = editor.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!editor.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (content.length === 0) {
      toast.error('Body is required — add at least one paragraph');
      return;
    }

    if (editor.id == null) {
      const created = createDraft({
        title: editor.title.trim(),
        category: editor.category,
        excerpt: editor.excerpt.trim() || `${content[0].slice(0, 140)}…`,
        content,
        keyPoints,
        tags,
      });
      if (publish) publishPost(created.id);
      toast(
        publish ? `“${created.title.slice(0, 40)}…” is live on /blog` : 'Draft saved',
        { description: publish ? 'Author-published post now appears on the public board.' : 'Find it under Drafts above.' }
      );
    } else {
      const saved = updatePost(editor.id, {
        title: editor.title.trim(),
        category: editor.category,
        excerpt: editor.excerpt.trim(),
        content,
        keyPoints,
        tags,
      });
      if (saved && publish) {
        publishPost(saved.id);
        toast(`“${saved.title.slice(0, 40)}…” is live on /blog`);
      } else {
        toast('Changes saved to draft');
      }
    }
    setEditor(null);
    setPosts(allPosts());
  }

  function quickPublish(id: number) {
    const p = publishPost(id);
    if (p) {
      setPosts(allPosts());
      toast(`“${p.title.slice(0, 48)}…” is now live on /blog`, {
        description: 'The public board picks it up after a reload (Track A demo store).',
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Blog</h2>
          <p className="text-[13px] text-text-muted mt-0.5">
            Write, queue and publish Creditax Journal posts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={drafts > 0 ? 'warning' : 'info'}>
            {drafts} {drafts === 1 ? 'draft' : 'drafts'}
          </Badge>
          <Badge variant="success">{published} published</Badge>
          <Button variant="primary" size="sm" onClick={() => openEditor()}>
            <FilePlus2 size={14} /> New post
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title, excerpt or tag…"
          className="pl-9"
        />
      </div>

      {/* Queue */}
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2.5"
      >
        {filtered.map((post) => (
          <motion.li key={post.id} variants={item}>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[post.category] ?? 'bg-brand-primary'}`}
                      aria-hidden
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      {post.category}
                    </span>
                    {post.status === 'draft' ? (
                      <Badge variant="warning">Draft</Badge>
                    ) : (
                      <Badge variant="success">Live</Badge>
                    )}
                    {post.featured && (
                      <Badge variant="brand">
                        <Sparkles size={10} /> Featured
                      </Badge>
                    )}
                    {post.demo_seed && (
                      <span className="text-[10px] text-text-muted font-mono">seed</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[14px] font-semibold text-text-primary leading-snug line-clamp-2">
                    {post.title}
                  </p>
                  <p className="mt-1 text-[12.5px] text-text-secondary line-clamp-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} /> {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} /> {post.readTime}
                    </span>
                    <span>{post.author}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {post.status === 'draft' ? (
                    <Button variant="secondary" size="sm" onClick={() => quickPublish(post.id)} title="Publish now">
                      <Rocket size={13} /> Publish
                    </Button>
                  ) : (
                    <Link href={`/blog/${post.id}`} target="_blank" aria-label={`Open ${post.title}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight size={13} />
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEditor(post)} title="Edit">
                    <Pencil size={13} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.li>
        ))}
      </motion.ul>

      {!live && (
        <p className="text-[12px] text-text-muted">Loading post queue…</p>
      )}
      {live && filtered.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-text-secondary">No posts match “{query}”.</p>
        </Card>
      )}

      {/* Editor drawer */}
      <AnimatePresence>
        {editor && (
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[440px] bg-surface-raised border-l border-border-default shadow-modal flex flex-col"
            role="dialog"
            aria-label={editor.id == null ? 'New post' : 'Edit post'}
          >
            <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-border-subtle">
              <p className="text-sm font-bold text-text-primary">
                {editor.id == null ? 'New post' : 'Edit post'}
              </p>
              <button
                type="button"
                onClick={() => setEditor(null)}
                aria-label="Close editor"
                className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Title
                </label>
                <Input
                  value={editor.title}
                  onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                  placeholder="e.g. VAT changes every freelancer should know"
                  className="mt-1.5"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Category
                </label>
                <select
                  value={editor.category}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      category: e.target.value as BlogPost['category'],
                    })
                  }
                  className="mt-1.5 w-full h-10 rounded-input bg-surface-base border border-border-strong px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] cursor-pointer"
                >
                  {EDITABLE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Excerpt
                </label>
                <textarea
                  value={editor.excerpt}
                  onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })}
                  rows={2}
                  placeholder="One-sentence tease shown in the card grid…"
                  className="mt-1.5 w-full rounded-input bg-surface-base border border-border-strong px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Body <span className="normal-case font-normal text-text-muted">(one paragraph per line)</span>
                </label>
                <textarea
                  value={editor.content}
                  onChange={(e) => setEditor({ ...editor, content: e.target.value })}
                  rows={8}
                  placeholder={'First paragraph…\nSecond paragraph…\nThird…'}
                  className="mt-1.5 w-full rounded-input bg-surface-base border border-border-strong px-3 py-2 text-sm leading-relaxed text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] resize-y font-mono text-[12.5px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Key points <span className="normal-case font-normal text-text-muted">(one per line)</span>
                </label>
                <textarea
                  value={editor.keyPoints}
                  onChange={(e) => setEditor({ ...editor, keyPoints: e.target.value })}
                  rows={3}
                  placeholder={'Point one\nPoint two'}
                  className="mt-1.5 w-full rounded-input bg-surface-base border border-border-strong px-3 py-2 text-sm leading-relaxed text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Tags <span className="normal-case font-normal text-text-muted">(comma-separated)</span>
                </label>
                <Input
                  value={editor.tags}
                  onChange={(e) => setEditor({ ...editor, tags: e.target.value })}
                  placeholder="VAT, Freelancer, FIRS"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-border-subtle p-4 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => saveDraft(false)}>
                <Save size={13} /> Save draft
              </Button>
              <Button variant="primary" size="sm" onClick={() => saveDraft(true)}>
                <Rocket size={13} /> {editor.id == null ? 'Create + publish' : 'Publish'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
