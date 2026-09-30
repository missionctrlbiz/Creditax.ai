/**
 * Author blog workflow — in-memory post store merged over the seed corpus.
 *
 * Track A pattern (same as kb-admin): posts created on this board are kept in
 * a process-level Map, so "author publishes → public blog shows it" is real
 * within one server process. Track B swap: PocketBase blog_posts table.
 *
 * The public /blog board reads the seed array directly (static import); the
 * admin board and the published-post check go through this module so authors
 * see their queue and publish proof without touching the seed data.
 */

import { blogPosts, type BlogPost } from '@/data/blog';

export type BlogStatus = 'draft' | 'published';

export interface AuthorPost extends BlogPost {
  status: BlogStatus;
  createdAt: string;
  authorRole: string;
  demo_seed: boolean;
}

const KEY = 'creditax_blog_posts';

// Seed-published corpus (mirrors data/blog.ts so admin lists need no import churn).
function seedPosts(): AuthorPost[] {
  return blogPosts.map((p) => ({
    ...p,
    status: 'published' as const,
    createdAt: p.date,
    authorRole: p.authorRole,
    demo_seed: true,
  }));
}

function loadAuthorPosts(): AuthorPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthorPost[]) : [];
  } catch {
    return [];
  }
}

function persistAuthorPosts(posts: AuthorPost[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(KEY, JSON.stringify(posts));
  }
}

/** All posts (seed + author-created), newest first. */
export function allPosts(): AuthorPost[] {
  return [...loadAuthorPosts(), ...seedPosts()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Author-created posts only (the editable queue). */
export function authorPosts(): AuthorPost[] {
  return loadAuthorPosts();
}

/** Client lookup by numeric id or slug (author posts live in localStorage). */
export function findAuthorPost(idOrSlug: number | string): AuthorPost | undefined {
  const needle = String(idOrSlug);
  return loadAuthorPosts().find(
    (p) => String(p.id) === needle || p.slug === needle
  );
}

let nextId = 1000;

export function createDraft(input: {
  title: string;
  category: BlogPost['category'];
  excerpt: string;
  content: string[];
  keyPoints: string[];
  image?: string;
  tags?: string[];
}): AuthorPost {
  const post: AuthorPost = {
    id: nextId++,
    slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: input.category,
    title: input.title,
    excerpt: input.excerpt,
    author: 'Nneka Eze',
    authorRole: 'Content Author',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: `${Math.max(1, Math.round(input.content.join(' ').split(/\s+/).length / 200))} min read`,
    image: input.image ?? '',
    tags: input.tags ?? [],
    content: input.content,
    keyPoints: input.keyPoints,
    status: 'draft',
    createdAt: new Date().toISOString(),
    demo_seed: false,
  };
  const posts = [...loadAuthorPosts(), post];
  persistAuthorPosts(posts);
  return post;
}

export function updatePost(
  id: number,
  patch: Partial<Pick<AuthorPost, 'title' | 'category' | 'excerpt' | 'content' | 'keyPoints' | 'status' | 'tags' | 'image'>>
): AuthorPost | null {
  const posts = loadAuthorPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...patch };
  persistAuthorPosts(posts);
  return posts[idx];
}

/** Publish a draft (or re-publish an edited post). */
export function publishPost(id: number): AuthorPost | null {
  return updatePost(id, { status: 'published' });
}
