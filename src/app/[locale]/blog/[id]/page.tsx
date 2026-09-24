'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { blogPosts, getPostById, getRelatedPosts } from '@/data/blog';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Share2,
  Bookmark,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Category tone: tokens only ─────────────────────────────────────────── */
const CATEGORY_TONE: Record<string, { pill: string; dot: string }> = {
  'Tax Tips': {
    pill: 'text-brand-primary border-brand-primary-border bg-brand-primary-bg',
    dot: 'bg-brand-primary',
  },
  'Product Updates': {
    pill: 'text-info-text border-info-border bg-info-bg',
    dot: 'bg-info',
  },
  'API Guides': {
    pill: 'text-brand-action border-brand-action-border bg-brand-action-bg',
    dot: 'bg-brand-action',
  },
  'Nigerian Finance': {
    pill: 'text-warning-text border-warning-border bg-warning-bg',
    dot: 'bg-warning',
  },
  'Credit & Borrowing': {
    pill: 'text-success-text border-success-border bg-success-bg',
    dot: 'bg-success',
  },
};

const AUTHOR_AVATARS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  blogPosts.forEach((post, index) => {
    if (!map[post.author]) {
      map[post.author] = `/images/avatars/avatar-${String((index % 10) + 1).padStart(2, '0')}.png`;
    }
  });
  return map;
})();

function CategoryPill({ category, large = false }: { category: string; large?: boolean }) {
  const tone = CATEGORY_TONE[category] ?? CATEGORY_TONE['Tax Tips'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${tone.pill} ${
        large ? 'px-3.5 py-1.5 text-xs' : 'px-3 py-1 text-[11px]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {category}
    </span>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '');

  const post = getPostById(id);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-base">
        <Header />
        <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-10 pt-24 pb-20 text-center">
          <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
            Blog
          </p>
          <h1 className="mb-3">Article not found</h1>
          <p className="text-text-secondary max-w-[520px] mx-auto">
            This post may have been moved or renamed. Browse all {blogPosts.length} articles
            on the blog instead.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-action hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = getRelatedPosts(post, 3);
  const idx = blogPosts.findIndex((p) => p.id === post.id);
  const prev = blogPosts[(idx - 1 + blogPosts.length) % blogPosts.length];
  const next = blogPosts[(idx + 1) % blogPosts.length];

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="relative w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-24 pb-16">
        {/* ── Prose container ── */}
        <article className="max-w-[720px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mt-6">
              <CategoryPill category={post.category} large />
            </div>
            <h1 className="mt-4">{post.title}</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={AUTHOR_AVATARS[post.author]}
                  alt=""
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover bg-surface-inset ring-2 ring-border-subtle"
                />
                <div className="text-sm leading-tight">
                  <div className="text-text-primary font-semibold">
                    {post.author}
                    <span className="text-text-muted font-normal"> · {post.authorRole}</span>
                  </div>
                  <div className="text-text-muted text-xs mt-0.5 flex items-center gap-1.5">
                    <span>{post.date}</span>
                    <span aria-hidden>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 px-3 rounded-input border border-border-strong text-text-secondary hover:text-text-primary text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  onClick={() => {
                    void navigator.clipboard?.writeText(window.location.href).catch(() => {});
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Copy link
                </button>
                <button
                  type="button"
                  aria-label="Bookmark article"
                  onClick={() =>
                    toast('Article bookmarked (demo)', {
                      description: 'Saved to your reading list on the Track B sync.',
                    })
                  }
                  className="h-9 w-9 rounded-input border border-border-strong text-text-secondary hover:text-brand-action flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Cover image */}
          <figure className="mt-8 overflow-hidden rounded-card border border-border-default bg-surface-raised">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full aspect-[16/9] object-cover"
            />
          </figure>

          {/* Body */}
          <div className="mt-8 space-y-5">
            {post.content.map((para, i) => (
              <p key={i} className="text-[15px] leading-[1.8] text-text-secondary">
                {para}
              </p>
            ))}
          </div>

          {/* Key takeaways */}
          <aside className="mt-9 rounded-card border border-brand-primary-border bg-brand-primary-bg p-6">
            <h2 className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-brand-action" />
              Key takeaways
            </h2>
            <ul className="space-y-3">
              {post.keyPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[14.5px] text-text-secondary leading-relaxed"
                >
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </aside>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-pill text-xs border border-border-strong text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* ── Prev / next ── */}
        <div className="max-w-[720px] mx-auto mt-10 grid sm:grid-cols-2 gap-4">
          <Link
            href={`/blog/${prev.id}`}
            className="group rounded-card border border-border-default bg-surface-raised p-5 hover:border-border-brand transition-colors"
          >
            <span className="text-[11px] font-medium text-text-muted flex items-center gap-1.5 uppercase tracking-wider">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </span>
            <span className="mt-2 block text-[14px] font-semibold text-text-primary line-clamp-2 group-hover:text-brand-action">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/blog/${next.id}`}
            className="group rounded-card border border-border-default bg-surface-raised p-5 hover:border-border-brand transition-colors text-right"
          >
            <span className="text-[11px] font-medium text-text-muted flex items-center justify-end gap-1.5 uppercase tracking-wider">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="mt-2 block text-[14px] font-semibold text-text-primary line-clamp-2 group-hover:text-brand-action">
              {next.title}
            </span>
          </Link>
        </div>

        {/* ── Sources & related ── */}
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold tracking-tight text-text-primary flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-action" />
                Sources & further reading
              </h2>
              <p className="mt-1 text-[13px] text-text-muted">
                Every answer in the Creditax knowledge base is grounded in these references.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-[13px] font-semibold text-brand-action hover:underline"
            >
              View all articles
            </Link>
          </div>
          <div className="mt-5 grid sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.id}`}
                className="group overflow-hidden rounded-card border border-border-default bg-surface-raised hover:border-border-brand hover:shadow-modal transition-all"
              >
                <div className="relative h-36 overflow-hidden bg-surface-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.title}
                    width={1200}
                    height={630}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute top-3 left-3">
                    <CategoryPill category={r.category} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="leading-[1.4] font-semibold text-text-primary line-clamp-2 group-hover:text-brand-action transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-[11px] text-text-muted flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {r.readTime} · {r.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
