'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  professionalName: string;
}

export function RejectModal({ isOpen, onClose, onConfirm, professionalName }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (reason.length < 20) return;
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-surface-raised rounded-card border border-border-default shadow-modal p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Reject {professionalName}?
              </h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-text-secondary text-sm mb-4">
              Please provide a reason for rejection. This will be sent to the applicant via email
              and should explain why their application was declined.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 20 characters)..."
              className="w-full h-32 px-4 py-3 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm placeholder:text-text-placeholder resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all"
            />

            <div className="flex items-center justify-between mt-2 mb-6">
              <span className={`text-xs ${reason.length < 20 ? 'text-[var(--color-warning-text)]' : 'text-[var(--color-success-text)]'}`}>
                {reason.length}/20 minimum characters
              </span>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSubmit}
                disabled={reason.length < 20 || isSubmitting}
              >
                {isSubmitting ? 'Rejecting...' : 'Reject Application'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}