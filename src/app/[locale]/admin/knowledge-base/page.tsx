'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FilePlus, FileText, Pencil, RefreshCw, SearchX } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

const documents = [
  { id: 1, title: 'VAT Guide 2025 — FIRS', chunks: 48, updated: 'Jun 10, 2026', status: 'Published' },
  { id: 2, title: 'PAYE Bands & Reliefs', chunks: 32, updated: 'Jun 8, 2026', status: 'Published' },
  { id: 3, title: 'WHT Rates by Transaction', chunks: 21, updated: 'Jun 5, 2026', status: 'Draft' },
  { id: 4, title: 'TIN Registration Steps', chunks: 12, updated: 'Jun 1, 2026', status: 'Published' },
];

export default function AdminKnowledgeBasePage() {
  const [query, setQuery] = useState('');

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Knowledge Base</h1>
          <p className="text-text-muted mt-1">Documents that power the AI Tax Assistant&apos;s answers.</p>
        </div>
        <Button variant="primary" size="md" className="self-start">
          <FilePlus size={15} />
          Add Document
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="max-w-md">
        <Input
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10"
        />
      </motion.div>

      {/* Document Grid */}
      {filtered.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-inset flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-text-muted" />
                  </div>
                  <h3 className="font-semibold text-text-primary">{doc.title}</h3>
                </div>
                <Badge variant={doc.status === 'Published' ? 'success' : 'warning'} className="flex-shrink-0">
                  {doc.status}
                </Badge>
              </div>
              <p className="text-text-muted text-sm mt-3">
                <span className="font-mono tabular-nums">{doc.chunks}</span> chunks · updated {doc.updated}
              </p>
              <div className="flex items-center gap-1 mt-4">
                <button
                  aria-label={`Edit ${doc.title}`}
                  title="Edit"
                  className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  aria-label={`Re-index ${doc.title}`}
                  title="Re-index"
                  className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-10 text-center">
            <SearchX className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No documents match &quot;{query}&quot;.</p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
