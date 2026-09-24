'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const documents = [
  { id: 1, name: 'VAT_Invoice_Zenith_Jun2025.pdf', pages: 3, size: '1.2MB', category: 'Tax Forms', amount: null, date: '2 mins ago', status: 'processing' },
  { id: 2, name: 'Bank_Statement_May2025.pdf', pages: 8, size: '3.4MB', category: 'Receipts', amount: 2400000, date: '15 mins ago', status: 'verified' },
  { id: 3, name: 'Generator_Fuel_Receipt.jpg', pages: 1, size: '0.8MB', category: 'Receipts', amount: 180000, date: '1 hour ago', status: 'verified' },
  { id: 4, name: 'Unclear_Receipt_0043.jpg', pages: 1, size: '0.5MB', category: 'Receipts', amount: null, date: '2 hours ago', status: 'needs-review' },
  { id: 5, name: 'PAYE_Certificate_2024.pdf', pages: 2, size: '1.1MB', category: 'Tax Forms', amount: 4800000, date: 'Yesterday', status: 'verified' },
  { id: 6, name: 'Office_Rent_Q2_2024.pdf', pages: 4, size: '2.1MB', category: 'Invoices', amount: 600000, date: 'Jun 10, 2025', status: 'verified' },
  { id: 7, name: 'Internet_Bill_Apr2025.pdf', pages: 1, size: '0.3MB', category: 'Utilities', amount: 45000, date: 'Jun 8, 2025', status: 'failed' },
  { id: 8, name: 'Travel_Expense_Lagos_Abuja.pdf', pages: 2, size: '1.5MB', category: 'Travel', amount: 320000, date: 'Jun 5, 2025', status: 'verified' },
];

const filters = ['All', 'Receipts', 'Invoices', 'Tax Forms', 'Recently Processed', 'Needs Review'];

export default function DocumentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [page, setPage] = useState(1);

  const toggleDoc = (id: number) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(d => d.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">✓ Verified</Badge>;
      case 'processing':
        return <Badge variant="brand">🔄 Processing</Badge>;
      case 'needs-review':
        return <Badge variant="warning">⚠ Needs Review</Badge>;
      case 'failed':
        return <Badge variant="error">❌ Failed</Badge>;
      default:
        return null;
    }
  };

  const filteredDocs = documents.filter(doc => {
    if (selectedFilter !== 'All' && doc.category !== selectedFilter) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalExtracted = documents.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-text-primary mb-2">My Documents</h1>
          <p className="text-text-muted text-sm">Manage and track all your uploaded documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              // Real page: the upload journey routes through POST /api/v1/documents/upload.
              window.location.href = '/dashboard/documents/upload';
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            Upload Document
          </Button>
          <div className="flex border border-border-default rounded-btn overflow-hidden" role="group" aria-label="View mode">
            <button
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
              onClick={() => setViewMode('table')}
              className={`p-2.5 ${viewMode === 'table' ? 'bg-brand-primary-bg text-brand-primary' : 'text-text-muted hover:bg-surface-inset'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18" />
              </svg>
            </button>
            <button
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-brand-primary-bg text-brand-primary' : 'text-text-muted hover:bg-surface-inset'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v18H3zM9 3v18M15 3v18" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filter + Search Row */}
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
                  ? 'bg-brand-primary text-text-inverse'
                  : 'bg-surface-overlay text-text-muted hover:bg-surface-inset border border-border-default'
              }`}
            >
              {filter}
              {filter === 'Needs Review' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-warning-bg text-warning text-[10px]">2</span>
              )}
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
        <select className="h-9 px-3 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
          <option>Date: Newest</option>
          <option>Date: Oldest</option>
          <option>Name: A-Z</option>
          <option>Name: Z-A</option>
        </select>
      </motion.div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-brand-primary-bg border border-brand-primary-border rounded-lg p-3 mb-6 flex items-center justify-between"
          >
            <span className="text-sm text-text-primary font-medium">
              {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-3">
              <button
                className="text-sm text-brand-primary hover:underline cursor-pointer"
                onClick={() =>
                  toast(`${selectedDocs.length} document${selectedDocs.length > 1 ? 's' : ''} queued for download (demo)`, {
                    description: 'Bulk export streams from Backblaze B2 on Track B.',
                  })
                }
              >
                Download Selected
              </button>
              <button
                className="text-sm text-error hover:underline cursor-pointer"
                onClick={() => {
                  toast(`${selectedDocs.length} document${selectedDocs.length > 1 ? 's' : ''} deleted (demo)`, {
                    description: 'Deletion propagates to the storage layer on Track B.',
                  });
                  setSelectedDocs([]);
                }}
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedDocs([])}
                className="text-sm text-text-muted hover:text-text-primary cursor-pointer"
              >
                Clear Selection ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset/50">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDocs.length === documents.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-border-strong bg-surface-base checked:bg-brand-action cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Document</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Amount Extracted</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Date Uploaded</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-0">
                      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/dashboard/empty-documents.png"
                          alt="No documents match the current filters"
                          width={140}
                          height={140}
                          className="w-[140px] h-[140px] object-contain mb-4 opacity-90"
                        />
                        <p className="text-sm font-semibold text-text-primary mb-1">No documents match this view</p>
                        <p className="text-text-muted text-xs max-w-[280px]">
                          Adjust the filters above, or upload receipts and invoices to get started.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredDocs.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-border-subtle hover:bg-surface-inset/30 transition-colors ${
                      selectedDocs.includes(doc.id) ? 'bg-brand-primary-bg/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleDoc(doc.id)}
                        className="w-4 h-4 rounded border-border-strong bg-surface-base checked:bg-brand-action cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-inset flex items-center justify-center">
                          <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-text-primary font-medium truncate max-w-[200px]">{doc.name}</p>
                          <p className="text-xs text-text-muted">{doc.pages} pages · {doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="brand">{doc.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {doc.amount ? (
                        <span className="text-sm text-success font-mono font-semibold">{formatCurrency(doc.amount)}</span>
                      ) : (
                        <span className="text-sm text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-muted">{doc.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xs text-brand-primary hover:underline cursor-pointer"
                          onClick={() =>
                            toast(`Viewing ${doc.name} (demo)`, {
                              description: 'Document preview opens in the Track B viewer.',
                            })
                          }
                        >
                          View
                        </button>
                        <button
                          className="text-xs text-brand-primary hover:underline cursor-pointer"
                          onClick={() =>
                            toast(`Downloading ${doc.name} (demo)`, {
                              description: 'Files stream from Backblaze B2 on Track B.',
                            })
                          }
                        >
                          Download
                        </button>
                        <button
                          className="text-xs text-error hover:underline cursor-pointer"
                          onClick={() =>
                            toast(`${doc.name} deleted (demo)`, {
                              description: 'Deletion propagates to the storage layer on Track B.',
                            })
                          }
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

      {/* Summary Footer */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mt-6 flex items-center justify-between"
      >
        <p className="text-sm text-text-muted">
          Showing {filteredDocs.length} of {documents.length} documents
        </p>
        <p className="text-sm text-success font-semibold">
          Total extracted value: {formatCurrency(totalExtracted)}
        </p>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mt-6 flex items-center justify-center gap-2"
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <button
          onClick={() => setPage(1)}
          aria-pressed={page === 1}
          className={`w-8 h-8 rounded-btn text-sm font-semibold cursor-pointer ${page === 1 ? 'bg-brand-primary text-text-inverse' : 'text-text-muted hover:bg-surface-inset'}`}
        >
          1
        </button>
        <button
          onClick={() => setPage(2)}
          aria-pressed={page === 2}
          className={`w-8 h-8 rounded-btn text-sm cursor-pointer ${page === 2 ? 'bg-brand-primary text-text-inverse' : 'text-text-muted hover:bg-surface-inset'}`}
        >
          2
        </button>
        <button
          onClick={() => setPage(3)}
          aria-pressed={page === 3}
          className={`w-8 h-8 rounded-btn text-sm cursor-pointer ${page === 3 ? 'bg-brand-primary text-text-inverse' : 'text-text-muted hover:bg-surface-inset'}`}
        >
          3
        </button>
        <span className="px-2 text-text-muted">...</span>
        <button
          onClick={() => setPage(6)}
          aria-pressed={page === 6}
          className={`w-8 h-8 rounded-btn text-sm cursor-pointer ${page === 6 ? 'bg-brand-primary text-text-inverse' : 'text-text-muted hover:bg-surface-inset'}`}
        >
          6
        </button>
        <button
          onClick={() => setPage((p) => Math.min(6, p + 1))}
          disabled={page === 6}
          className="px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </motion.div>
    </div>
  );
}