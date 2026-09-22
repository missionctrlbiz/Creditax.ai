'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { blogPosts, categories, type BlogPost } from '@/data/blog';
import {
  Search,
  X,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';

const POSTS_PER_PAGE = 6;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const categoryPillStyles: Record<string, string> = {
  'Tax Tips': 'text-teal-300 border-teal-500/30 bg-teal-500/10',
  'Product Updates': 'text-teal-300 border-teal-500/30 bg-teal-500/10',
  'API Guides': 'text-sky-300 border-sky-500/30 bg-sky-500/10',
  'Nigerian Finance': 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  'Credit & Borrowing': 'text-green-300 border-green-500/30 bg-green-500/10',
};

const categoryDot: Record<string, string> = {
  'Tax Tips': 'bg-teal-400',
  'Product Updates': 'bg-teal-400',
  'API Guides': 'bg-sky-400',
  'Nigerian Finance': 'bg-amber-400',
  'Credit & Borrowing': 'bg-green-400',
};

function CategoryPill({ category, large = false }: { category: string; large?: boolean }) {
  const style =
    categoryPillStyles[category] ?? 'text-teal-300 border-teal-500/30 bg-teal-500/10';
  const dot = categoryDot[category] ?? 'bg-teal-400';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border backdrop-blur-sm ${style} ${
        large ? 'px-3.5 py-1.5 text-xs' : 'px-3 py-1 text-[11px]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {category}
    </span>
  );
}

function AuthorAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const dims =
    size === 'sm'
      ? 'w-8 h-8 text-[10px]'
      : size === 'lg'
        ? 'w-12 h-12 text-sm'
        : 'w-10 h-10 text-xs';
  return (
    <div
      className={`${dims} rounded-full bg-gradient-to-br from-brand-primary to-brand-action flex items-center justify-center text-white font-bold shrink-0 ring-2 ring-white/10`}
    >
      {initials}
    </div>
  );
}

/* ── Featured carousel: auto-scrolling spotlight (3 stories) ─────────── */
const AUTOPLAY_MS = 6500;

const imageSlide: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 90 : -90, opacity: 0, scale: 1.06 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  exit: (dir: number) => ({
    x: dir >= 0 ? -90 : 90,
    opacity: 0,
    scale: 1.04,
    transition: { duration: 0.45, ease: EASE },
  }),
};

const textSlide: Variants = {
  enter: { y: 26, opacity: 0 },
  center: { y: 0, opacity: 1, transition: { duration: 0.55, ease: EASE } },
  exit: { y: -18, opacity: 0, transition: { duration: 0.35, ease: EASE } },
};

function FeaturedCarousel({
  posts,
  bookmarks,
  onBookmark,
}: {
  posts: BlogPost[];
  bookmarks: Set<number>;
  onBookmark: (id: number) => void;
}) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const count = posts.length;
  const post = posts[index % count];
  const bookmarked = bookmarks.has(post.id);

  const paginate = (dir: number) =>
    setIndex(([i]) => [(i + dir + count) % count, dir]);
  const goTo = (i: number) =>
    setIndex(([cur]) => [i, i === cur ? 0 : i > cur ? 1 : -1]);

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, count, index]);

  return (
    <motion.article
      variants={rise}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative overflow-hidden rounded-[24px] border border-border-default bg-surface-raised shadow-card hover:shadow-modal hover:border-border-brand transition-[border-color,box-shadow] duration-300"
    >
      <Link href={`/blog/${post.id}`} className="absolute inset-0 z-10" aria-label={post.title} />
      {/* glow wash */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-primary/15 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="grid lg:grid-cols-5 lg:h-[480px] items-stretch">
        {/* ── Image panel ── */}
        <div className="relative h-72 sm:h-96 lg:h-full lg:col-span-3 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={post.id}
              custom={direction}
              variants={imageSlide}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--color-surface-raised)]/20 hidden lg:block pointer-events-none" />

          <div className="absolute top-5 left-5 flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={post.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] bg-brand-action text-text-inverse shadow-btn-action"
              >
                <Sparkles className="w-3 h-3" />
                {post.featured ? 'FEATURED' : "EDITOR'S PICK"}
              </motion.span>
            </AnimatePresence>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark(post.id);
            }}
            aria-label="Bookmark featured article"
            className={`absolute top-5 right-5 z-20 w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 ${
              bookmarked
                ? 'bg-brand-action border-transparent text-text-inverse'
                : 'bg-black/30 border-white/20 text-white hover:bg-black/50 hover:border-white/40'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* arrows — vertically centered on the image */}
          <div className="absolute z-20 bottom-5 left-5 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                paginate(-1);
              }}
              aria-label="Previous story"
              className="w-10 h-10 rounded-full backdrop-blur-md bg-black/35 border border-white/20 text-white flex items-center justify-center hover:bg-brand-primary hover:border-transparent transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                paginate(1);
              }}
              aria-label="Next story"
              className="w-10 h-10 rounded-full backdrop-blur-md bg-black/35 border border-white/20 text-white flex items-center justify-center hover:bg-brand-primary hover:border-transparent transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="ml-1 text-[12px] font-semibold text-white/85 tabular-nums">
              {String((index % count) + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ── Content panel — same height as image ── */}
        <div className="lg:col-span-2 lg:h-full flex flex-col p-8 sm:p-10 lg:p-11">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={post.id}
              custom={direction}
              variants={textSlide}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <CategoryPill category={post.category} large />
                {/* read-time chip with its own entrance pop */}
                <motion.span
                  key={`rt-${post.id}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-text-secondary bg-surface-inset border border-border-subtle"
                >
                  <Clock className="w-3.5 h-3.5 text-brand-action" />
                  {post.readTime}
                </motion.span>
              </div>

              <h2 className="mt-5 text-[24px] sm:text-[28px] leading-[1.28] font-bold tracking-tight text-text-primary group-hover:text-brand-action transition-colors duration-300 line-clamp-3">
                {post.title}
              </h2>
              <p className="mt-3.5 text-[14.5px] leading-[1.75] text-text-secondary line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-3.5">
                <AuthorAvatar name={post.author} />
                <div className="leading-snug min-w-0">
                  <div className="text-[14px] font-semibold text-text-primary truncate">
                    {post.author}
                  </div>
                  <div className="text-[12.5px] text-text-muted truncate">
                    {post.authorRole} · {post.date}
                  </div>
                </div>
              </div>

              {/* pinned footer: progress + read more */}
              <div className="mt-auto pt-7">
                {/* progress track */}
                <div className="flex items-center gap-1.5 mb-5" aria-hidden>
                  {posts.map((p, i) => (
                    <div
                      key={p.id}
                      className="h-1 rounded-full bg-surface-inset overflow-hidden flex-1"
                    >
                      {i === index % count ? (
                        <motion.div
                          key={`progress-${index}`}
                          initial={{ width: paused ? undefined : '0%' }}
                          animate={{ width: paused ? '0%' : '100%' }}
                          transition={{
                            duration: paused ? 0.3 : AUTOPLAY_MS / 1000,
                            ease: 'linear',
                          }}
                          className="h-full rounded-full bg-brand-action"
                        />
                      ) : (
                        <div
                          className={`h-full rounded-full ${
                            i < index % count ? 'bg-brand-action/50 w-full' : 'w-0'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-5 border-t border-border-subtle flex items-center justify-between gap-3">
                  {/* animated read-more */}
                  <motion.span
                    key={`cta-${post.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
                    className="inline-flex items-center gap-3 text-[15px] font-semibold text-brand-action"
                  >
                    <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-action-bg border border-brand-action-border overflow-hidden">
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </span>
                    <span className="relative">
                      Read full article
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
                        className="absolute -bottom-1 left-0 h-px w-full origin-left bg-brand-action"
                      />
                    </span>
                  </motion.span>
                  {/* dots */}
                  <div className="flex items-center gap-1.5">
                    {posts.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={(e) => {
                          e.preventDefault();
                          goTo(i);
                        }}
                        aria-label={`Go to story ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                          i === index % count
                            ? 'w-7 h-2 bg-brand-action'
                            : 'w-2 h-2 bg-border-strong hover:bg-text-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Grid card: airy, hover lift + glow ────────────────────────────── */
function GridCard({
  post,
  index,
  bookmarked,
  onBookmark,
}: {
  post: BlogPost;
  index: number;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <motion.article
      variants={rise}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-border-default bg-surface-raised shadow-card hover:shadow-modal hover:border-border-brand transition-[border-color,box-shadow] duration-300"
      style={{ transitionDelay: `${(index % 6) * 15}ms` }}
    >
      <Link href={`/blog/${post.id}`} className="absolute inset-0 z-10" aria-label={post.title} />
      <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-action/10 blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-52 overflow-hidden bg-surface-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-raised)] via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <CategoryPill category={post.category} />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onBookmark();
          }}
          aria-label={`Bookmark ${post.title}`}
          className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 ${
            bookmarked
              ? 'bg-brand-action border-transparent text-text-inverse'
              : 'bg-black/30 border-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium tracking-wide uppercase">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-border-strong" />
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        <h3 className="mt-3 text-[17px] leading-[1.45] font-semibold tracking-tight text-text-primary line-clamp-2 group-hover:text-brand-action transition-colors duration-300 min-h-[50px]">
          {post.title}
        </h3>
        <p className="mt-2.5 text-[13.5px] leading-[1.7] text-text-secondary line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="mt-6 pt-5 border-t border-border-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <AuthorAvatar name={post.author} size="sm" />
            <div className="min-w-0 leading-tight">
              <div className="text-[13px] font-semibold text-text-primary truncate">
                {post.author}
              </div>
              <div className="text-[11px] text-text-muted truncate">{post.authorRole}</div>
            </div>
          </div>
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border-strong text-text-muted group-hover:bg-brand-primary group-hover:border-transparent group-hover:text-white transition-all duration-300 shrink-0">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Newsletter CTA ────────────────────────────────────────────────── */
function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: EASE }}
      className="relative mt-20 overflow-hidden rounded-[24px] border border-brand-primary-border bg-gradient-to-br from-brand-primary-bg via-surface-raised to-brand-action-bg p-8 sm:p-12"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-primary/20 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-action/15 blur-[90px]" />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.1em] bg-brand-action text-text-inverse">
            <Send className="w-3 h-3" />
            NEWSLETTER
          </div>
          <h2 className="mt-4 text-2xl sm:text-[28px] font-bold tracking-tight text-text-primary">
            Tax tips worth reading, monthly.
          </h2>
          <p className="mt-2.5 text-[14px] leading-relaxed text-text-secondary max-w-md">
            FIRS deadlines, compliance checklists, and product drops — no spam, unsubscribe anytime.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          {done ? (
            <div className="flex items-center gap-3 rounded-2xl border border-success-border bg-success-bg px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-success-text shrink-0" />
              <p className="text-sm text-success-text font-medium">
                You&apos;re in! Watch your inbox for the next issue.
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim().includes('@')) setDone(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ng"
                className="h-12 flex-1 rounded-xl px-4 text-sm bg-surface-base border border-border-strong text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-xl text-sm font-semibold bg-brand-action text-text-inverse shadow-btn-action hover:brightness-105 active:brightness-95 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.section>
  );
}

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];

  // Spotlight rotation: featured + two category-varied stories (deterministic order).
  const carouselPosts = useMemo(() => {
    const rest = blogPosts.filter((p) => p.id !== featuredPost.id);
    const seen = new Set<string>([featuredPost.category]);
    const varied = rest.filter((p) => {
      if (seen.has(p.category)) return false;
      seen.add(p.category);
      return true;
    });
    return [featuredPost, ...varied.slice(0, 2)];
  }, [featuredPost]);

  const toggleBookmark = (id: number) =>
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const isDefaultView =
    activeCategory === 'All' && query.trim() === '' && filtered.length === blogPosts.length;

  const gridPool = isDefaultView
    ? filtered.filter((p) => p.id !== featuredPost.id)
    : filtered;

  const totalPages = Math.max(1, Math.ceil(gridPool.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const visibleCards = gridPool.slice(start, start + POSTS_PER_PAGE);
  const showFeatured = isDefaultView && safePage === 1;

  const goToPage = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-base overflow-x-clip">
      <Header />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--ambient-glow)' }}
      />
      {/* ambient orbs */}
      <div className="pointer-events-none absolute top-40 -left-40 w-[480px] h-[480px] rounded-full bg-brand-primary/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[720px] -right-40 w-[420px] h-[420px] rounded-full bg-brand-action/[0.07] blur-[140px]" />

      <main className="relative w-full max-w-[1280px] mx-auto px-6 md:px-10 pt-24 pb-8">
        {/* ── Compact title row — featured banner follows immediately ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.div
              variants={rise}
              className="text-[12px] font-bold tracking-[0.16em] text-brand-primary"
            >
              BLOG
            </motion.div>
            <motion.h1
              variants={rise}
              className="mt-2 text-4xl md:text-[44px] leading-[1.1] font-bold tracking-tight text-text-primary"
            >
              Creditax.ai Blog
            </motion.h1>
            <motion.p variants={rise} className="mt-2 text-[15px] text-text-secondary">
              Tax insights, product updates, and financial guides for Nigeria.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="relative w-full lg:w-[340px] shrink-0"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles..."
              className="h-11 w-full rounded-xl pl-11 pr-10 text-sm bg-surface-raised border border-border-strong text-text-primary placeholder:text-text-placeholder shadow-card focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-inset text-text-muted hover:text-text-primary flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        </div>

        {/* ── Category filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-6 flex gap-2 overflow-x-auto pb-1"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 border ${
                  active
                    ? 'bg-brand-primary text-white border-transparent shadow-btn-brand'
                    : 'bg-transparent text-text-secondary border-border-strong hover:border-border-brand hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-12 rounded-[24px] border border-dashed border-border-strong bg-surface-raised p-14 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-surface-inset flex items-center justify-center">
              <Search className="w-6 h-6 text-text-muted" />
            </div>
            <p className="mt-5 text-lg font-semibold text-text-primary">No articles found</p>
            <p className="mt-1.5 text-sm text-text-muted">
              Try “VAT”, “Mono”, or “freelancer” — or browse a different category.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveCategory('All');
                setPage(1);
              }}
              className="mt-6 h-11 px-6 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:brightness-110 transition-all"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <>
            {showFeatured && (
              <div className="mt-6">
                <motion.div variants={container} initial="hidden" animate="visible">
                  <FeaturedCarousel
                    posts={carouselPosts}
                    bookmarks={bookmarks}
                    onBookmark={toggleBookmark}
                  />
                </motion.div>
              </div>
            )}

            <div className="mt-14 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[22px] sm:text-2xl font-bold tracking-tight text-text-primary">
                  {isDefaultView ? 'Latest articles' : 'Results'}
                </h2>
                <p className="mt-1 text-[13px] text-text-muted">
                  Showing {visibleCards.length} of {gridPool.length}{' '}
                  {gridPool.length === 1 ? 'article' : 'articles'}
                  {activeCategory !== 'All' && (
                    <>
                      {' '}in <span className="text-text-primary font-medium">{activeCategory}</span>
                    </>
                  )}
                </p>
              </div>
              {(query || activeCategory !== 'All') && (
                <button
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('All');
                    setPage(1);
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-action hover:underline"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            <motion.div
              key={`${activeCategory}-${query}-${safePage}`}
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
            >
              {visibleCards.map((post, i) => (
                <GridCard
                  key={post.id}
                  post={post}
                  index={i}
                  bookmarked={bookmarks.has(post.id)}
                  onBookmark={() => toggleBookmark(post.id)}
                />
              ))}
            </motion.div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-12 flex items-center justify-center gap-2"
              >
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="h-10 pl-3 pr-4 rounded-xl text-[13px] font-semibold border border-border-default bg-surface-raised text-text-secondary hover:text-text-primary hover:border-border-brand hover:-translate-y-px disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-card"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => goToPage(n)}
                      className={`min-w-10 h-10 px-2 rounded-xl text-[13px] font-semibold transition-all ${
                        n === safePage
                          ? 'bg-brand-primary text-white shadow-btn-brand scale-105'
                          : 'text-text-secondary border border-border-default bg-surface-raised hover:text-text-primary hover:border-border-brand hover:-translate-y-px shadow-card'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="h-10 pl-4 pr-3 rounded-xl text-[13px] font-semibold border border-border-default bg-surface-raised text-text-secondary hover:text-text-primary hover:border-border-brand hover:-translate-y-px disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-card"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </>
        )}

        <NewsletterCTA />
      </main>
      <Footer />
    </div>
  );
}
