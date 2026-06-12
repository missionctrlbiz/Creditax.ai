'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Document, DocumentStatus } from '@/lib/types';
import { formatFileSize, getFileTypeFromMime } from '@/lib/storage';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const statusConfig: Record<DocumentStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'brand' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  complete: { label: 'Complete', variant: 'success' },
  failed: { label: 'Failed', variant: 'error' },
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('supabase-token');
      const response = await fetch('/api/v1/documents', {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    if (!cancelled) {
      loadDocuments();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('supabase-token');
      const response = await fetch(`/api/v1/documents?id=${id}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        setSelectedDocs((prev) => prev.filter((docId) => docId !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((d) => d.id));
    }
  };

  const getFileIcon = (mimeType: string) => {
    const type = getFileTypeFromMime(mimeType);
    if (type === 'pdf') {
      return (
        <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    );
  };

  const filteredDocs = documents.filter((doc) => {
    if (selectedFilter !== 'All') {
      const statusMatch = selectedFilter.toLowerCase() === doc.status.toLowerCase();
      if (!statusMatch) return false;
    }
    if (searchQuery && !doc.filename.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filters = ['All', 'pending', 'processing', 'complete', 'failed'];

  return (
    <div className="p-8 max-xl:p-6 max-md:p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">My Documents</h1>
          <p className="text-text-muted text-sm">Manage and track all your uploaded documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => (window.location.href = '/dashboard/upload')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            Upload
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-wrap items-center gap-4 mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === filter
                  ? 'bg-[#0D7377] text-white'
                  : 'bg-surface-overlay text-text-muted hover:bg-surface-inset border border-border-default'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[rgba(13,115,119,0.1)] border border-[#0D7377]/30 rounded-lg p-3 mb-6 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary font-medium">
              {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => selectedDocs.forEach((id) => handleDelete(id))}
                className="text-sm text-red-400 hover:underline"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedDocs([])}
                className="text-sm text-text-muted hover:text-text-primary"
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[rgba(13,115,119,0.2)] border-t-[#0D7377] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="secondary" onClick={loadDocuments}>
            Retry
          </Button>
        </Card>
      ) : filteredDocs.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-[#0D7377] mb-4">
            <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M12 18v-6M9 15h6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No documents yet</h3>
          <p className="text-text-muted text-sm mb-4">Upload your first document to get started.</p>
          <Button variant="primary" onClick={() => (window.location.href = '/dashboard/upload')}>
            Upload Document
          </Button>
        </Card>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-default bg-surface-inset/50">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedDocs.length === documents.length && documents.length > 0}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-border-strong bg-surface-base cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Document
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-border-subtle hover:bg-surface-inset/30 transition-colors ${
                        selectedDocs.includes(doc.id) ? 'bg-[rgba(13,115,119,0.05)]' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => toggleDoc(doc.id)}
                          className="w-4 h-4 rounded border-border-strong bg-surface-base cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-inset flex items-center justify-center">
                            {getFileIcon(doc.mime_type)}
                          </div>
                          <div>
                            <p className="text-sm text-text-primary font-medium truncate max-w-[200px]">
                              {doc.filename}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-muted">{formatFileSize(doc.file_size)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-muted">
                          {new Date(doc.created_at).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[doc.status].variant}>
                          {statusConfig[doc.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#0D7377] hover:underline"
                            >
                              View
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {filteredDocs.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-6 flex items-center justify-between"
        >
          <p className="text-sm text-text-muted">
            Showing {filteredDocs.length} of {documents.length} documents
          </p>
        </motion.div>
      )}
    </div>
  );
}