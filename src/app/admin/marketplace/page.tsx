'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RejectModal } from '@/components/reject-modal';
import { DocumentViewerModal } from '@/components/document-viewer-modal';

interface Document {
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
}

interface MarketplaceApplication {
  id: string;
  businessName: string;
  ownerName: string;
  cacNumber: string;
  firsTin: string;
  phone: string;
  email: string;
  services: string[];
  city: string;
  state: string;
  description: string;
  documents: Document[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
}

interface Stats {
  pending: number;
  underReview: number;
  approvedToday: number;
  rejectedToday: number;
}

type FilterStatus = 'all' | 'pending' | 'under_review' | 'approved' | 'rejected';

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'warning' as const,
    icon: Clock,
    bgClass: 'bg-[var(--color-warning-bg)]',
    borderClass: 'border-[var(--color-warning-border)]',
    textClass: 'text-[var(--color-warning-text)]',
  },
  under_review: {
    label: 'Under Review',
    variant: 'info' as const,
    icon: Clock,
    bgClass: 'bg-[var(--color-info-bg)]',
    borderClass: 'border-[var(--color-info-border)]',
    textClass: 'text-[var(--color-info-text)]',
  },
  approved: {
    label: 'Approved',
    variant: 'success' as const,
    icon: CheckCircle,
    bgClass: 'bg-[var(--color-success-bg)]',
    borderClass: 'border-[var(--color-success-border)]',
    textClass: 'text-[var(--color-success-text)]',
  },
  rejected: {
    label: 'Rejected',
    variant: 'error' as const,
    icon: XCircle,
    bgClass: 'bg-[var(--color-error-bg)]',
    borderClass: 'border-[var(--color-error-border)]',
    textClass: 'text-[var(--color-error-text)]',
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function MarketplaceApprovalsPage() {
  const [applications, setApplications] = useState<MarketplaceApplication[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, underReview: 0, approvedToday: 0, rejectedToday: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; applicationId: string | null; businessName: string }>({
    isOpen: false,
    applicationId: null,
    businessName: '',
  });
  const [documentViewer, setDocumentViewer] = useState<{ isOpen: boolean; documents: Document[] }>({
    isOpen: false,
    documents: [],
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusParam = activeFilter === 'all' ? '' : `?status=${activeFilter}`;
      const res = await fetch(`/api/v1/admin/marketplace${statusParam}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setStats(data.stats || { pending: 0, underReview: 0, approvedToday: 0, rejectedToday: 0 });
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/marketplace/${id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Published successfully', 'success');
        fetchApplications();
      } else {
        showToast(data.message || 'Failed to approve', 'error');
      }
    } catch {
      showToast('Failed to approve application', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectModal.applicationId) return;
    setActionLoading(rejectModal.applicationId);
    try {
      const res = await fetch(`/api/v1/admin/marketplace/${rejectModal.applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Application rejected', 'success');
        fetchApplications();
      } else {
        showToast(data.message || 'Failed to reject', 'error');
      }
    } catch {
      showToast('Failed to reject application', 'error');
    } finally {
      setActionLoading(null);
      setRejectModal({ isOpen: false, applicationId: null, businessName: '' });
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openRejectModal = (id: string, businessName: string) => {
    setRejectModal({ isOpen: true, applicationId: id, businessName });
  };

  const openDocumentViewer = async (id: string) => {
    const res = await fetch(`/api/v1/admin/marketplace/${id}/documents`);
    const data = await res.json();
    setDocumentViewer({ isOpen: true, documents: data.documents || [] });
  };

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Marketplace Approvals</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Review and approve tax professional applications
          </p>
        </div>
        <Badge variant="warning" className="text-sm px-3 py-1">
          Pending: {stats.pending}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--color-warning-text)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.pending}</p>
              <p className="text-xs text-text-muted">Pending</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-info-bg)] border border-[var(--color-info-border)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--color-info-text)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.underReview}</p>
              <p className="text-xs text-text-muted">Under Review</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-success-bg)] border border-[var(--color-success-border)] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[var(--color-success-text)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.approvedToday}</p>
              <p className="text-xs text-text-muted">Approved Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-error-bg)] border border-[var(--color-error-border)] flex items-center justify-center">
              <XCircle className="w-5 h-5 text-[var(--color-error-text)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.rejectedToday}</p>
              <p className="text-xs text-text-muted">Rejected Today</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-2 p-1 bg-surface-raised rounded-input w-fit border border-border-default">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 text-sm font-medium rounded-badge transition-all ${
              activeFilter === filter.value
                ? 'bg-brand-primary-bg text-brand-primary border border-brand-primary-border'
                : 'text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary-bg border border-brand-primary-border grid place-items-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">No applications found</h2>
          <p className="text-text-muted text-sm">
            {activeFilter === 'all'
              ? 'No tax professional applications have been submitted yet.'
              : `No applications with status "${filters.find((f) => f.value === activeFilter)?.label}".`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {applications.map((application) => {
              const status = statusConfig[application.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary-bg border border-brand-primary-border flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-primary font-bold text-sm">
                          {getInitials(application.businessName)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-text-muted" />
                              {application.businessName}
                            </h3>
                            <p className="text-sm text-text-muted mt-0.5">
                              Submitted {formatRelativeTime(application.submittedAt)} by {application.ownerName}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-badge border ${status.bgClass} ${status.borderClass} ${status.textClass}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {status.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1">CAC Number</p>
                            <p className="text-sm text-text-primary font-mono">{application.cacNumber}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1">FIRS TIN</p>
                            <p className="text-sm text-text-primary font-mono">{application.firsTin}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-text-muted" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Phone</p>
                              <p className="text-sm text-text-primary">{application.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-text-muted" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Email</p>
                              <p className="text-sm text-text-primary truncate">{application.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-2">Services</p>
                          <div className="flex flex-wrap gap-2">
                            {application.services.map((service) => (
                              <span
                                key={service}
                                className="px-2.5 py-1 text-xs font-medium rounded-badge bg-surface-base border border-border-default text-text-secondary"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mb-4">
                          <MapPin className="w-4 h-4 text-text-muted" />
                          <span className="text-sm text-text-secondary">
                            {application.city}, {application.state}
                          </span>
                        </div>

                        <div className="bg-surface-base rounded-lg border border-border-default p-4 mb-4">
                          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-2">
                            Document Status
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {application.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-badge border ${
                                  doc.status === 'verified'
                                    ? 'bg-[var(--color-success-bg)] border-[var(--color-success-border)]'
                                    : doc.status === 'rejected'
                                    ? 'bg-[var(--color-error-bg)] border-[var(--color-error-border)]'
                                    : 'bg-[var(--color-warning-bg)] border-[var(--color-warning-border)]'
                                }`}
                              >
                                <FileText className={`w-4 h-4 ${
                                  doc.status === 'verified'
                                    ? 'text-[var(--color-success-text)]'
                                    : doc.status === 'rejected'
                                    ? 'text-[var(--color-error-text)]'
                                    : 'text-[var(--color-warning-text)]'
                                }`} />
                                <span className="text-xs font-medium text-text-primary">{doc.type}</span>
                                {doc.status === 'verified' ? (
                                  <CheckCircle className="w-3 h-3 text-[var(--color-success-text)]" />
                                ) : doc.status === 'rejected' ? (
                                  <XCircle className="w-3 h-3 text-[var(--color-error-text)]" />
                                ) : (
                                  <Clock className="w-3 h-3 text-[var(--color-warning-text)]" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border-default">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDocumentViewer(application.id)}
                          >
                            <FileText className="w-4 h-4" />
                            View Documents
                          </Button>

                          {application.status === 'pending' || application.status === 'under_review' ? (
                            <div className="flex items-center gap-3">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => openRejectModal(application.id, application.businessName)}
                                disabled={actionLoading === application.id}
                              >
                                {actionLoading === application.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                Reject
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApprove(application.id)}
                                disabled={actionLoading === application.id}
                              >
                                {actionLoading === application.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                Approve & Publish
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, applicationId: null, businessName: '' })}
        onConfirm={handleReject}
        professionalName={rejectModal.businessName}
      />

      <DocumentViewerModal
        isOpen={documentViewer.isOpen}
        onClose={() => setDocumentViewer({ isOpen: false, documents: [] })}
        documents={documentViewer.documents}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-card border shadow-modal ${
              toast.type === 'success'
                ? 'bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success-text)]'
                : 'bg-[var(--color-error-bg)] border-[var(--color-error-border)] text-[var(--color-error-text)]'
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}