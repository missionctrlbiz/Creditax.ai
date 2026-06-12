'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

export default function DocumentUploadPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Receipts' | 'Invoices' | 'Tax Forms' | 'Recently Processed'>('All');
  const [dragOver, setDragOver] = useState(false);
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
      amount: '₦? 95,000 (unconfirmed)',
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      addNewFile(file.name, file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addNewFile(file.name, file.size);
    }
  };

  const addNewFile = (fileName: string, fileSize: number) => {
    const sizeFormatted = (fileSize / (1024 * 1024)).toFixed(1) + 'MB';
    const newDocId = String(documents.length + 1);
    
    const newDoc: DocumentFile = {
      id: newDocId,
      name: fileName,
      format: fileName.split('.').pop()?.toUpperCase() || 'FILE',
      size: sizeFormatted,
      uploadedTime: 'Just now',
      status: 'processing',
      progress: 10,
      progressLabel: 'Uploading file...',
      group: 'receipt',
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Simulate progress upload
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDocuments((prev) => 
          prev.map((doc) => 
            doc.id === newDocId 
              ? { 
                  ...doc, 
                  status: 'extracted', 
                  progress: undefined,
                  progressLabel: undefined,
                  amount: '₦125,000',
                  category: 'Mock Category' 
                } 
              : doc
          )
        );
      } else {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDocId
              ? {
                  ...doc,
                  progress: currentProgress,
                  progressLabel: currentProgress > 50 ? 'AI extracting data...' : 'Uploading file...',
                }
              : doc
          )
        );
      }
    }, 600);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocs = documents.filter((doc) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Receipts') return doc.group === 'receipt';
    if (activeFilter === 'Invoices') return doc.group === 'invoice';
    if (activeFilter === 'Tax Forms') return doc.group === 'tax-form';
    if (activeFilter === 'Recently Processed') return doc.status === 'extracted';
    return true;
  });

  return (
    <div className="p-8 md:p-10 select-none">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">Upload Documents</h1>
        <p className="text-text-secondary text-sm">
          Upload receipts, invoices, or tax forms — our AI extracts data automatically.
        </p>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-surface-overlay rounded-[20px] border-2 border-dashed h-[220px] flex flex-col items-center justify-center text-center p-8 transition-all duration-150 relative ${
          dragOver 
            ? 'border-brand-primary bg-[rgba(13,115,119,0.06)]' 
            : 'border-[rgba(13,115,119,0.5)] hover:border-[rgba(13,115,119,0.7)] hover:bg-[rgba(13,115,119,0.03)]'
        }`}
      >
        <input 
          type="file" 
          id="file-input" 
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <div className="text-brand-primary mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 mx-auto">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="text-lg font-semibold text-text-primary mb-1">Drag &amp; drop files here</div>
        <div className="text-text-muted text-xs mb-3">or</div>
        <div className="flex gap-3 justify-center flex-wrap relative z-10">
          <label htmlFor="file-input" className="inline-flex items-center gap-1.5 px-6 h-11 rounded-[10px] border border-brand-primary text-brand-primary font-semibold text-xs cursor-pointer hover:bg-brand-primary-bg transition-all">
            Browse Files
          </label>
          <button className="inline-flex items-center gap-1.5 px-6 h-11 rounded-[10px] border border-border-strong text-text-primary font-semibold text-xs cursor-pointer hover:border-text-muted bg-transparent transition-all">
            Capture with Camera
          </button>
        </div>
        <div className="text-text-muted text-xs mt-3">
          Supported: JPG · PNG · PDF · Max 10MB per file
        </div>
      </div>

      {/* Filter and Content Header */}
      <div className="flex items-center justify-between mt-10 mb-3">
        <h2 className="text-lg font-semibold text-text-primary">Recent Uploads</h2>
        <a href="#" className="text-brand-primary text-xs font-semibold hover:underline">
          View all in Documents →
        </a>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['All', 'Receipts', 'Invoices', 'Tax Forms', 'Recently Processed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-brand-primary text-text-primary border-brand-primary'
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
            <div 
              key={doc.id}
              className="bg-surface-overlay border border-transparent hover:border-border-subtle rounded-xl p-5 md:p-6 flex items-start gap-4 transition-all duration-150 shadow-card"
            >
              {/* Document Thumb Icon */}
              <div className={`w-12 h-12 rounded-lg grid place-items-center flex-shrink-0 text-[11px] font-bold font-mono ${
                doc.format === 'PDF' 
                  ? 'bg-[rgba(245,158,11,0.15)] text-status-warning' 
                  : 'bg-[rgba(50,232,117,0.15)] text-brand-action'
              }`}>
                {doc.format}
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate mb-0.5">
                  {doc.name}
                </div>
                <div className="text-text-secondary text-xs">
                  Uploaded {doc.uploadedTime} · {doc.size}
                </div>

                {/* Progress bar state */}
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

                {/* Warning strip */}
                {doc.status === 'needs-review' && doc.warning && (
                  <div className="mt-2.5 border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] rounded-md p-2 px-3 text-xs text-status-warning flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    {doc.warning}
                  </div>
                )}

                {/* Extraction chips */}
                {doc.status !== 'processing' && (doc.amount || doc.category) && (
                  <div className="flex gap-1.5 flex-wrap mt-2.5">
                    {doc.amount && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-action-bg text-brand-action">
                        {doc.amount}
                      </span>
                    )}
                    {doc.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-primary-bg text-brand-primary">
                        {doc.category}
                      </span>
                    )}
                    {doc.period && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-border-strong text-text-secondary bg-[rgba(255,255,255,0.04)]">
                        {doc.period}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {doc.status === 'processing' && (
                  <>
                    <div className="text-brand-primary text-xs font-semibold flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 border-2 border-[rgba(13,115,119,0.2)] border-t-brand-primary rounded-full animate-spin" />
                      Processing...
                    </div>
                    <button 
                      onClick={() => deleteDocument(doc.id)} 
                      className="text-text-muted text-xs hover:text-text-primary transition-colors cursor-pointer"
                    >
                      Cancel ✕
                    </button>
                  </>
                )}

                {doc.status === 'extracted' && (
                  <>
                    <div className="text-brand-action text-xs font-semibold flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Extracted
                    </div>
                    <div className="flex gap-3 text-xs">
                      <a href="#" className="text-brand-primary font-semibold hover:underline">View</a>
                      <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Download</a>
                      <button 
                        onClick={() => deleteDocument(doc.id)} 
                        className="text-status-error font-semibold hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

                {doc.status === 'needs-review' && (
                  <>
                    <div className="text-status-warning text-xs font-semibold flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      Needs Review
                    </div>
                    <button 
                      onClick={() => {
                        setDocuments((prev) => 
                          prev.map((d) => 
                            d.id === doc.id 
                              ? { 
                                  ...d, 
                                  status: 'extracted', 
                                  amount: '₦95,000', 
                                  category: 'Operations', 
                                  warning: undefined 
                                } 
                              : d
                          )
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-status-warning text-status-warning font-semibold text-[11px] cursor-pointer hover:bg-[rgba(245,158,11,0.1)] transition-all bg-transparent"
                    >
                      Review &amp; Confirm →
                    </button>
                  </>
                )}
              </div>
            </div>
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
