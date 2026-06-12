'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Document {
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
}

export function DocumentViewerModal({ isOpen, onClose, documents }: DocumentViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  if (!documents.length) return null;

  const currentDoc = documents[currentIndex];
  const isPdf = currentDoc.url.toLowerCase().includes('.pdf');

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? documents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === documents.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleClose = () => {
    setCurrentIndex(0);
    setZoom(100);
    onClose();
  };

  const statusColors = {
    pending: 'bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning-text)]',
    verified: 'bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success-text)]',
    rejected: 'bg-[var(--color-error-bg)] border-[var(--color-error-border)] text-[var(--color-error-text)]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl h-[85vh] bg-surface-raised rounded-card border border-border-default shadow-modal flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Documents</h2>
                <div className="flex gap-1">
                  {documents.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-badge transition-all ${
                        idx === currentIndex
                          ? 'bg-brand-primary-bg text-brand-primary border border-brand-primary-border'
                          : 'bg-surface-base text-text-muted border border-border-default hover:text-text-primary'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-6 py-3 border-b border-border-default bg-surface-base">
              <span className="text-sm font-medium text-text-primary">{currentDoc.type}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-badge border ${statusColors[currentDoc.status]}`}>
                {currentDoc.status.charAt(0).toUpperCase() + currentDoc.status.slice(1)}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden bg-surface-deep p-4">
              {isPdf ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary text-sm mb-2">PDF Document</p>
                    <a
                      href={currentDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline text-sm"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              ) : (
                <img
                  src={currentDoc.url}
                  alt={currentDoc.type}
                  style={{ transform: `scale(${zoom / 100})` }}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                />
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border-default bg-surface-base">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all"
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-text-secondary w-12 text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all"
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrev} disabled={documents.length === 1}>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-text-muted">
                  {currentIndex + 1} / {documents.length}
                </span>
                <Button variant="ghost" size="sm" onClick={handleNext} disabled={documents.length === 1}>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}