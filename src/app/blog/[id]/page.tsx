'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { blogPosts, getPostById, getRelatedPosts } from '@/data/blog';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string | string[] | undefined;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '');

  const post = getPostById(id);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-base">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Article not found</h1>
          <p className="mt-2 text-sm text-text-muted">
            This post may have been moved. Browse all {blogPosts.length} master posts.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-action hover:underline"
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
  const initials = post.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--ambient-glow)' }}
      />

      <main className="relative w-full max-w-4xl mx-auto px-6 md:px-8 pt-24 pb-16">
        <button
          onClick={() => router.push('/blog')}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>

        <div className="mt-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium border text-teal-300 border-teal-500/30 bg-teal-500/10">
            {post.category}
          </span>
        </div>
        <h1 className="mt-4 text-3xl md:text-[38px] leading-[1.2] font-bold text-text-primary">
          {post.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
          {post.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="text-sm leading-tight">
              <div className="text-text-primary font-medium">
                {post.author}{' '}
                <span className="text-text-muted font-normal">· {post.authorRole}</span>
              </div>
              <div className="text-text-muted text-xs mt-0.5 flex items-center gap-1.5">
                {post.date}
                <span>·</span>
                <Clock className="w-3 h-3" />
                {post.readTime}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="h-9 px-3 rounded-lg border border-border-strong text-text-secondary hover:text-text-primary text-[13px] flex items-center gap-1.5 transition-colors"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).catch(() => {});
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              className="h-9 w-9 rounded-lg border border-border-strong text-text-secondary hover:text-brand-action flex items-center justify-center transition-colors"
              aria-label="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border-default">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover" />
        </div>

        <div className="mt-8 space-y-5">
          {post.content.map((para, i) => (
            <p key={i} className="text-[15px] leading-[1.8] text-text-secondary">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-brand-primary-border bg-brand-primary-bg p-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Key takeaways
          </h3>
          <ul className="mt-4 space-y-3">
            {post.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-action shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs border border-border-strong text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <Link
            href={`/blog/${prev.id}`}
            className="group rounded-xl border border-border-default bg-surface-raised p-5 hover:border-border-brand transition-colors"
          >
            <span className="text-[11px] font-medium text-text-muted flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </span>
            <span className="mt-2 block text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-brand-action">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/blog/${next.id}`}
            className="group rounded-xl border border-border-default bg-surface-raised p-5 hover:border-border-brand transition-colors text-right"
          >
            <span className="text-[11px] font-medium text-text-muted flex items-center justify-end gap-1.5">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="mt-2 block text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-brand-action">
              {next.title}
            </span>
          </Link>
        </div>

        <div className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Related articles</h2>
            <Link href="/blog" className="text-sm font-medium text-brand-action hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.id}`}
                className="group overflow-hidden rounded-xl border border-border-default bg-surface-raised hover:border-border-brand transition-colors"
              >
                <div className="relative h-28 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[11px] font-medium text-brand-primary">{r.category}</div>
                  <div className="mt-1.5 text-[13px] font-semibold text-text-primary line-clamp-2 group-hover:text-brand-action">
                    {r.title}
                  </div>
                  <div className="mt-2 text-[11px] text-text-muted">
                    {r.date} · {r.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
