'use client';

import { useState, type DragEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Paperclip,
  Sparkles,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from 'lucide-react';

interface DocumentFile {
  id: string;
  name: string;
  format: string;
  size: string;
  uploadedTime: string;
  status: 'processing' | 'extracted' | 'needs-review';
  progress?: number;
  progressLabel?: string;
  amount?: string;
  category?: string;
  period?: string;
  warning?: string;
  group: 'receipt' | 'invoice' | 'tax-form';
}

const FILTERS = ['All', 'Receipts', 'Invoices', 'Tax Forms', 'Recently Processed'] as const;

export default function DocumentUploadPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All');
  const [task, setTask] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [pending, setPending] = useState<{ name: string; size: string }[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      id: '1',
      name: 'VAT_Invoice_Zenith_Jun2025.pdf',
      format: 'PDF',
      size: '1.2MB',
      uploadedTime: '2 mins ago',
      status: 'processing',
      progress: 67,
      progressLabel: 'AI extracting data...',
      group: 'invoice',
    },
    {
      id: '2',
      name: 'Bank_Statement_May2025.pdf',
      format: 'PDF',
      size: '3.4MB',
      uploadedTime: '15 mins ago',
      status: 'extracted',
      amount: '₦2,400,000',
      category: 'Income',
      period: 'May 2025',
      group: 'tax-form',
    },
    {
      id: '3',
      name: 'Generator_Fuel_Receipt.jpg',
      format: 'JPG',
      size: '800KB',
      uploadedTime: '2 hours ago',
      status: 'extracted',
      amount: '₦180,000',
      category: 'Operations',
      group: 'receipt',
    },
    {
      id: '4',
      name: 'Unclear_Receipt_0043.jpg',
      format: 'IMG',
      size: '1.1MB',
      uploadedTime: 'yesterday',
      status: 'needs-review',
      amount: '₦95,000 (unconfirmed)',
      warning: 'Low confidence extraction — please verify the detected amount.',
      group: 'receipt',
    },
    {
      id: '5',
      name: 'PAYE_Certificate_2024.pdf',
      format: 'PDF',
      size: '2.8MB',
      uploadedTime: '3 days ago',
      status: 'extracted',
      amount: '₦4,800,000',
      category: 'Payroll',
      group: 'tax-form',
    },
  ]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const sizeFormatted = (n: number) => `${(n / (1024 * 1024)).toFixed(1)}MB`;
    setPending((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({ name: f.name, size: sizeFormatted(f.size) })),
    ]);
  }

  function removePending(name: string) {
    setPending((prev) => prev.filter((p) => p.name !== name));
  }

  function runTask() {
    if (pending.length === 0) return;
    const queued = [...pending];
    setPending([]);
    setTask('');
    const newDocs: DocumentFile[] = queued.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      format: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: f.size,
      uploadedTime: 'Just now',
      status: 'processing',
      progress: 10,
      progressLabel: 'Uploading file...',
      group: 'receipt',
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
    // Simulate extraction per queued file
    newDocs.forEach((doc) => {
      let progress = 10;
      const interval = setInterval(() => {
        progress += 15;
        if (progress >= 100) {
          clearInterval(interval);
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? { ...d, status: 'extracted', progress: undefined, progressLabel: undefined, amount: '₦125,000', category: 'Operations' }
                : d
            )
          );
        } else {
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? { ...d, progress, progressLabel: progress > 50 ? 'AI extracting data...' : 'Uploading file...' }
                : d
            )
          );
        }
      }, 600);
    });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  const filteredDocs = documents.filter((doc) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Receipts') return doc.group === 'receipt';
    if (activeFilter === 'Invoices') return doc.group === 'invoice';
    if (activeFilter === 'Tax Forms') return doc.group === 'tax-form';
    if (activeFilter === 'Recently Processed') return doc.status === 'extracted';
    return true;
  });

  return (
    <div className="select-none">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2">Upload Documents</h1>
        <p className="text-text-secondary text-sm">
          Drop files or describe the task — the agent extracts amounts, categories and filing-ready figures.
        </p>
      </div>

      {/* ── Canvas Task Box (composer) ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-card border bg-surface-overlay p-5 transition-colors duration-150 ${
          dragActive ? 'border-brand-action bg-brand-action-bg/40' : 'border-border-default'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-lg bg-brand-primary-bg text-brand-primary grid place-items-center">
            <Sparkles size={14} />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Task box — extract, categorize, file
          </span>
        </div>

        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={2}
          placeholder="Describe the task, e.g. “Extract this receipt and add it to my 2025 filing”"
          aria-label="Task description"
          className="w-full rounded-btn bg-surface-base border border-border-strong px-4 py-3 text-sm text-text-primary placeholder:text-text-placeholder resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-colors"
        />

        {/* Pending file chips */}
        {pending.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {pending.map((p) => (
              <span
                key={p.name}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-brand-primary-bg border border-brand-primary-border text-[12px] text-text-primary"
              >
                <Paperclip size={11} className="text-brand-primary" />
                <span className="max-w-[180px] truncate">{p.name}</span>
                <span className="text-text-muted text-[10px] font-mono">{p.size}</span>
                <button
                  type="button"
                  onClick={() => removePending(p.name)}
                  aria-label={`Remove ${p.name}`}
                  className="p-0.5 rounded-full hover:bg-hover-overlay text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Composer toolbar */}
        <div className="flex items-center gap-3 mt-4">
          <label className="inline-flex items-center gap-1.5 h-10 px-4 rounded-btn border border-border-strong text-sm font-semibold text-text-primary cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors">
            <Upload size={14} />
            Add files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
          <span className="text-text-muted text-xs">JPG · PNG · PDF · max 10MB per file</span>
          <div className="flex-1" />
          <button
            type="button"
            onClick={runTask}
            disabled={pending.length === 0}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-btn bg-brand-action text-text-inverse font-semibold text-sm shadow-btn-action hover:brightness-105 active:brightness-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Run task <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Filter and Content Header */}
      <div className="flex items-center justify-between mt-10 mb-3">
        <h2 className="text-lg font-semibold text-text-primary">Recent Uploads</h2>
        <Link href="/dashboard/documents" className="text-brand-primary text-xs font-semibold hover:underline">
          View all in Documents →
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-brand-primary text-text-inverse border-brand-primary'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary bg-transparent'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="flex flex-col gap-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-overlay border border-transparent hover:border-border-subtle rounded-xl p-5 md:p-6 flex items-start gap-4 transition-all duration-150 shadow-card"
            >
              {/* Document thumb */}
              <div
                className={`w-12 h-12 rounded-lg grid place-items-center flex-shrink-0 text-[11px] font-bold font-mono ${
                  doc.format === 'PDF'
                    ? 'bg-[rgba(245,158,11,0.15)] text-warning-text'
                    : 'bg-brand-action-bg text-brand-action'
                }`}
              >
                {doc.format}
              </div>

              {/* Document info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate mb-0.5">{doc.name}</div>
                <div className="text-text-secondary text-xs">
                  Uploaded {doc.uploadedTime} · {doc.size}
                </div>

                {doc.status === 'processing' && doc.progress !== undefined && (
                  <div className="mt-2.5">
                    <div className="w-full h-1 bg-border-strong rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-300"
                        style={{ width: `${doc.progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-text-muted mt-1.5">
                      {doc.progressLabel} ({doc.progress}%)
                    </div>
                  </div>
                )}

                {doc.status === 'needs-review' && doc.warning && (
                  <div className="mt-2.5 border border-warning-border bg-warning-bg rounded-md p-2 px-3 text-xs text-warning-text flex items-center gap-1.5">
                    <TriangleAlert size={13} className="flex-shrink-0" />
                    {doc.warning}
                  </div>
                )}

                {doc.status !== 'processing' && (doc.amount || doc.category) && (
                  <div className="flex gap-1.5 flex-wrap mt-2.5">
                    {doc.amount && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-action-bg text-brand-action font-mono">
                        {doc.amount}
                      </span>
                    )}
                    {doc.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-primary-bg text-brand-primary">
                        {doc.category}
                      </span>
                    )}
                    {doc.period && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-border-strong text-text-secondary">
                        {doc.period}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status + icon actions */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {doc.status === 'processing' && (
                  <>
                    <div className="text-brand-primary text-xs font-semibold flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 border-2 border-brand-primary-border border-t-brand-primary rounded-full animate-spin" />
                      Processing
                    </div>
                    <button
                      onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                      aria-label="Cancel upload"
                      title="Cancel"
                      className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}

                {doc.status === 'extracted' && (
                  <>
                    <div className="text-brand-action text-xs font-semibold flex items-center gap-1">
                      <Check size={13} /> Extracted
                    </div>
                    <div className="flex gap-1">
                      <Link
                        href="/dashboard/documents"
                        aria-label="View document"
                        title="View"
                        className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors"
                      >
                        <FileText size={14} />
                      </Link>
                      <button
                        onClick={() => {
                          const summary = `Creditax.ai — Document Summary\nName: ${doc.name}\nStatus: ${doc.status}\nExported: ${new Date().toLocaleString('en-NG')}\n`;
                          const url = URL.createObjectURL(new Blob([summary], { type: 'text/plain' }));
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${doc.name}.summary.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        aria-label="Download summary"
                        title="Download"
                        className="p-1.5 rounded-btn text-text-muted hover:text-text-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                        aria-label="Delete document"
                        title="Delete"
                        className="p-1.5 rounded-btn text-text-muted hover:text-error-text hover:bg-error-bg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}

                {doc.status === 'needs-review' && (
                  <>
                    <div className="text-warning-text text-xs font-semibold flex items-center gap-1">
                      <TriangleAlert size={13} /> Needs review
                    </div>
                    <button
                      onClick={() =>
                        setDocuments((prev) =>
                          prev.map((d) =>
                            d.id === doc.id
                              ? { ...d, status: 'extracted', amount: '₦95,000', category: 'Operations', warning: undefined }
                              : d
                          )
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-warning-border text-warning-text font-semibold text-[11px] cursor-pointer hover:bg-warning-bg transition-all bg-transparent"
                    >
                      Review &amp; confirm →
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 border border-border-default rounded-xl bg-surface-overlay text-text-secondary text-sm">
            No matching documents found.
          </div>
        )}
      </div>
    </div>
  );
}
