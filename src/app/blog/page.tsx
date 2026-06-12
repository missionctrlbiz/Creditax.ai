'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Search, Clock, Bookmark, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['All', 'Tax Tips', 'Product Updates', 'API Guides', 'Nigerian Finance', 'Credit & Borrowing'];

const featuredPost = {
  category: 'Tax Tips',
  title: "How Nigeria's New Tax Reform Act 2024 Affects Your Business — What Every SME Owner Needs to Know",
  excerpt: "FIRS has introduced sweeping changes to corporate income tax, VAT thresholds, and transfer pricing rules. Here's a plain-English breakdown for Nigerian entrepreneurs.",
  author: 'Adaeze Obi',
  authorRole: 'Product Team',
  date: 'June 10, 2025',
  readTime: '8 min read',
};

const posts = [
  {
    category: 'Product Updates',
    title: 'Introducing the Creditax RAG Engine: Ask Any Nigerian Tax Question',
    excerpt: 'Our new AI-powered knowledge base can answer complex tax questions instantly.',
    author: 'Adaeze Nwosu',
    date: 'June 8, 2025',
    readTime: '5 min read',
  },
  {
    category: 'Credit & Borrowing',
    title: '5 Documents Every Nigerian Freelancer Should Upload for Maximum Credit Score',
    excerpt: 'Boost your creditworthiness by submitting the right financial documentation.',
    author: 'Chidinma Eze',
    date: 'June 5, 2025',
    readTime: '6 min read',
  },
  {
    category: 'API Guides',
    title: 'API v2.0 Released: Faster, Cheaper, and WHT Support',
    excerpt: 'Major improvements to our API including Withholding Tax calculation support.',
    author: 'Tunde Bakare',
    date: 'June 1, 2025',
    readTime: '4 min read',
  },
  {
    category: 'Nigerian Finance',
    title: 'Understanding PITA: Personal Income Tax Act Explained Simply',
    excerpt: 'A comprehensive guide to navigating personal income tax in Nigeria.',
    author: 'Chukwuemeka Obi',
    date: 'May 28, 2025',
    readTime: '10 min read',
  },
  {
    category: 'Credit & Borrowing',
    title: 'How Tax Compliance Beats Traditional Credit Scoring in Nigeria',
    excerpt: 'Why your tax history matters more than your bank balance for loans.',
    author: 'Adaeze Nwosu',
    date: 'May 22, 2025',
    readTime: '7 min read',
  },
  {
    category: 'Product Updates',
    title: 'Creditax x Mono Integration: Bank Data Now Automatic',
    excerpt: 'Connect your bank account for seamless financial tracking and analysis.',
    author: 'Chidinma Eze',
    date: 'May 18, 2025',
    readTime: '3 min read',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-surface-base">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--ambient-glow)' }} />

      {/* Blog Header */}
      <section className="pt-32 pb-12 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="brand" className="mb-4">BLOG</Badge>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
          >
            Creditax.ai Blog
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-text-secondary mb-8"
          >
            Tax insights, product updates, and financial guides for Nigeria.
          </motion.p>
          <motion.div variants={fadeInUp} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Search articles..."
              className="pl-12"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Category Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex gap-2 overflow-x-auto pb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  index === 0
                    ? 'bg-brand-primary text-text-inverse'
                    : 'bg-transparent text-text-secondary border border-border-strong hover:border-border-brand hover:text-text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden hover:border-border-brand transition-all duration-200 group">
              <div className="grid md:grid-cols-2">
                {/* Image placeholder */}
                <div className="bg-surface-deep h-48 md:h-auto flex items-center justify-center">
                  <div className="text-text-muted text-lg">Featured Image</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="success">FEATURED</Badge>
                    <Badge variant="brand">{featuredPost.category}</Badge>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4 group-hover:text-brand-action transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-text-secondary mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary-bg flex items-center justify-center text-brand-primary text-xs font-bold">
                        {featuredPost.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm">
                        <span className="text-text-primary">{featuredPost.author}</span>
                        <span className="text-text-muted"> · {featuredPost.authorRole}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>{featuredPost.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                  <button className="mt-6 text-brand-action font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Grid Posts */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {posts.map((post, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="overflow-hidden hover:border-border-brand transition-all duration-200 group h-full flex flex-col">
                  {/* Image placeholder */}
                  <div className="bg-surface-deep h-40 flex items-center justify-center">
                    <div className="text-text-muted text-sm">Post Image</div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Badge variant="brand" className="w-fit mb-3">{post.category}</Badge>
                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-action transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary-bg flex items-center justify-center text-brand-primary text-[10px] font-bold">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs text-text-muted">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <button className="absolute top-4 right-4 text-text-muted hover:text-brand-action transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pagination */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 rounded-btn bg-brand-primary text-text-inverse font-medium">1</button>
              <button className="w-10 h-10 rounded-btn text-text-secondary hover:bg-surface-overlay transition-colors">2</button>
              <button className="w-10 h-10 rounded-btn text-text-secondary hover:bg-surface-overlay transition-colors">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-text-muted">...</span>
              <button className="w-10 h-10 rounded-btn text-text-secondary hover:bg-surface-overlay transition-colors">12</button>
            </div>
            <Button variant="ghost" size="sm">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}