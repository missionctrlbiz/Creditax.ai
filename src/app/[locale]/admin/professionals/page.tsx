'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Clock,
  ExternalLink,
  Eye,
  MapPin,
  MessageSquare,
  Star,
  UserPlus,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import type { ProApplication } from '@/ai/marketplace';

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

const professionals = [
  { id: 1, name: 'Akinwale & Associates', email: 'akinwale@taxpro.ng', status: 'verified', rating: 4.8, reviews: 127, location: 'Lagos Island', applied: 'Jun 5, 2025' },
  { id: 2, name: 'Benson Tax Consultants', email: 'info@bensontax.com', status: 'pending', rating: null, reviews: 0, location: 'Abuja', applied: 'Jun 10, 2025' },
  { id: 3, name: 'Okonkwo & Partners', email: 'okonkwo@partners.ng', status: 'pending', rating: null, reviews: 0, location: 'Lagos', applied: 'Jun 9, 2025' },
  { id: 4, name: 'Lagos Tax Solutions', email: 'contact@lagostax.com', status: 'pending', rating: null, reviews: 0, location: 'Victoria Island', applied: 'Jun 8, 2025' },
  { id: 5, name: 'Nigerian Tax Advisors', email: 'advisors@nta.com.ng', status: 'verified', rating: 4.6, reviews: 89, location: 'Port Harcourt', applied: 'May 20, 2025' },
  { id: 6, name: 'Delta Finance Group', email: 'finance@delta.ng', status: 'verified', rating: 4.9, reviews: 203, location: 'Warri', applied: 'May 15, 2025' },
  { id: 7, name: 'Kano Tax Bureau', email: 'kano@taxbureau.ng', status: 'rejected', rating: null, reviews: 0, location: 'Kano', applied: 'May 10, 2025' },
  { id: 8, name: 'Ibadan Tax Services', email: 'ibadan@taxservices.ng', status: 'verified', rating: 4.7, reviews: 156, location: 'Ibadan', applied: 'May 5, 2025' },
];


const statusBadgeVariant: Record<string, 'success' | 'warning' | 'error'> = {
  verified: 'success',
  pending: 'warning',
  rejected: 'error',
};

function proImage(id: number): string {
  return `/images/marketplace/pro-team-${String(((id - 1) % 5) + 1).padStart(2, '0')}.jpg`;
}

export default function AdminProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPro, setSelectedPro] = useState<typeof professionals[0] | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // P10 — the live application store (demo_seed) drives the pending queue +
  // counts; the page fallback list keeps the board complete offline.
  const [liveApps, setLiveApps] = useState<ProApplication[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/admin/marketplace')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { applications?: ProApplication[] } | null) => {
        if (!active || !d?.applications?.length) return;
        setLiveApps(d.applications);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Merge live pending applications into the review list (by name) so the
  // "Pending" tab reflects the real application store, not just the fallback.
  const livePending = (liveApps ?? []).filter((a) => a.status === 'pending');
  const proStatus = (name: string): 'verified' | 'pending' | 'rejected' => {
    const match = livePending.find((a) => a.business_name === name);
    if (match) return match.status;
    return (professionals.find((p) => p.name === name)?.status as 'verified' | 'pending' | 'rejected') ?? 'verified';
  };
  const mergedPros = professionals.map((p) => ({ ...p, status: proStatus(p.name) }));

  const pendingCount = livePending.length || mergedPros.filter((p) => p.status === 'pending').length;
  const verifiedCount = mergedPros.filter((p) => p.status === 'verified').length;
  const rejectedCount = mergedPros.filter((p) => p.status === 'rejected').length;

  // P10 — status tabs with live counts (the "All" tab shows the total).
  const liveStatusTabs = [
    { label: 'All', value: 'all', count: mergedPros.length },
    { label: 'Pending', value: 'pending', variant: 'warning' as const, count: pendingCount },
    { label: 'Verified', value: 'verified', variant: 'success' as const, count: verifiedCount },
    { label: 'Rejected', value: 'rejected', variant: 'error' as const, count: rejectedCount },
  ];

  const filteredPros = mergedPros.filter((pro) => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || pro.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // P12 — real decision handlers (was dead Approve/Reject buttons). Calls the
  // live marketplace decision endpoint (best-effort, Track A demo_seed) and
  // reflects the outcome locally; clears the selection on bulk actions.
  const [statusOverrides, setStatusOverrides] = useState<Record<number, string>>({});

  function decide(id: number, decision: 'approve' | 'reject') {
    setStatusOverrides((prev) => ({ ...prev, [id]: decision === 'approve' ? 'verified' : 'rejected' }));
    // Best-effort against the live store; demo application ids may not match.
    fetch(`/api/v1/admin/marketplace/${id}/${decision}`, { method: 'POST' }).catch(() => {});
    setSelectedPro(null);
  }
  function bulkDecide(decision: 'approve' | 'reject') {
    selectedIds.forEach((id) =>
      setStatusOverrides((prev) => ({ ...prev, [id]: decision === 'approve' ? 'verified' : 'rejected' }))
    );
    selectedIds.forEach((id) => fetch(`/api/v1/admin/marketplace/${id}/${decision}`, { method: 'POST' }).catch(() => {}));
    setSelectedIds([]);
    setSelectedPro(null);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1>Tax Professionals</h1>
        <p className="text-text-muted mt-1">Manage verification and professional accounts</p>
      </motion.div>

      {/* Stats — P10: hydrated from the live application store */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Pros</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1 tabular-nums">{mergedPros.length}</p>
          <p className="text-xs text-text-muted mt-1">{liveApps ? 'from application store · demo_seed' : '+3 this month'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Pending Verification</p>
          <p className="text-2xl font-mono font-bold text-warning-text mt-1 tabular-nums">{pendingCount}</p>
          <p className="text-xs text-text-muted mt-1">Requires review</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Verified</p>
          <p className="text-2xl font-mono font-bold text-success-text mt-1 tabular-nums">{verifiedCount}</p>
          <p className="text-xs text-text-muted mt-1">Active professionals</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-mono font-bold text-error-text mt-1 tabular-nums">{rejectedCount}</p>
          <p className="text-xs text-text-muted mt-1">Applications denied</p>
        </Card>
      </motion.div>

      {/* Header Controls */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Search professionals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
        <Button variant="primary" size="md" onClick={() => toast('Demo build — professional onboarding is mocked', { description: 'New pros apply via /pro/apply and appear in the approval queue.' })}>
          <UserPlus size={15} />
          Add Professional
        </Button>
      </motion.div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Card className="p-3 flex items-center justify-between gap-4">
              <p className="text-sm text-text-secondary">
                <span className="font-mono tabular-nums text-text-primary">{selectedIds.length}</span> selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" onClick={() => bulkDecide('reject')}>
                  <X size={14} />
                  Reject
                </Button>
                <Button variant="primary" size="sm" onClick={() => bulkDecide('approve')}>
                  <Check size={14} />
                  Approve
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Tabs — P10: live counts from the application store */}
      <motion.div variants={itemVariants}>
        <div className="flex gap-2 border-b border-border-default">
          {liveStatusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px cursor-pointer ${
                activeTab === tab.value
                  ? 'text-brand-primary border-brand-primary'
                  : 'text-text-muted border-transparent hover:text-text-primary hover:border-border-strong'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <Badge
                  variant={tab.variant || 'brand'}
                  className="ml-2 text-[10px]"
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pro List */}
        <div className="lg:col-span-3 space-y-3">
          {filteredPros.map((pro, i) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-lg bg-surface-overlay border transition-all duration-150 ${
                selectedPro?.id === pro.id ? 'border-brand-primary ring-1 ring-brand-primary-border' : 'border-border-default hover:border-border-strong'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(pro.id)}
                  onChange={() => toggleSelected(pro.id)}
                  aria-label={`Select ${pro.name}`}
                  className="mt-1 w-4 h-4 rounded border-border-strong bg-surface-base text-brand-primary accent-brand-primary cursor-pointer flex-shrink-0"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proImage(pro.id)}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                />
                <button
                  onClick={() => setSelectedPro(pro)}
                  className="flex-1 min-w-0 text-left cursor-pointer"
                >
                  <p className="text-sm font-medium text-text-primary">{pro.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{pro.email}</p>
                  <p className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {pro.location}
                  </p>
                </button>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge variant={statusBadgeVariant[statusOverrides[pro.id] ?? pro.status]} className="text-[10px]">
                    {(statusOverrides[pro.id] ?? pro.status).charAt(0).toUpperCase() + (statusOverrides[pro.id] ?? pro.status).slice(1)}
                  </Badge>
                  {pro.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="text-sm font-mono tabular-nums text-text-primary">{pro.rating}</span>
                      <span className="text-xs text-text-muted">({pro.reviews})</span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedPro(pro)}
                    aria-label={`View application for ${pro.name}`}
                    title="View application"
                    className="p-1.5 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedPro ? (
              <motion.div
                key={selectedPro.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="p-5 sticky top-6">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Verification Review</h3>

                  {/* Applicant Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-border-default">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proImage(selectedPro.id)}
                      alt=""
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{selectedPro.name}</p>
                      <p className="text-xs text-text-muted">{selectedPro.email}</p>
                      <p className="text-xs text-text-muted">Applied {selectedPro.applied}</p>
                    </div>
                  </div>

                  {/* Document Verification */}
                  <div className="py-4 border-b border-border-default space-y-3">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Documents</p>
                    {[
                      { name: 'CAC Certificate', status: 'verified' },
                      { name: 'FIRS Tax Clearance', status: 'verified' },
                      { name: 'NIN Slip', status: selectedPro.status === 'pending' ? 'review' : 'verified' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-text-primary">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 text-xs ${
                            doc.status === 'verified' ? 'text-success-text' : 'text-warning-text'
                          }`}>
                            {doc.status === 'verified'
                              ? <><Check className="w-3 h-3" /> Verified</>
                              : <><Clock className="w-3 h-3" /> Under Review</>}
                          </span>
                          <button
                            aria-label={`View ${doc.name}`}
                            title={`View ${doc.name}`}
                            onClick={() =>
                              toast(`Viewing ${doc.name} (demo)`, {
                                description: 'Verification document preview opens in the Track B admin viewer.',
                              })
                            }
                            className="p-1 rounded-btn text-text-muted hover:text-brand-primary hover:bg-hover-overlay transition-colors cursor-pointer"
                          >
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verification Checklist */}
                  <div className="py-4 border-b border-border-default">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Checklist</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { item: 'CAC', status: true },
                        { item: 'FIRS TIN', status: true },
                        { item: 'ID', status: selectedPro.status !== 'pending' },
                        { item: 'Profile', status: true },
                      ].map((check, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={check.status ? 'text-success' : 'text-warning'}>
                            {check.status
                              ? <Check className="w-4 h-4" />
                              : <Clock className="w-4 h-4" />}
                          </span>
                          <span className="text-sm text-text-primary">{check.item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Note */}
                  <div className="py-4">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Admin Note (Optional)</p>
                    <textarea
                      placeholder="Add a note about this application..."
                      className="w-full h-20 px-3 py-2 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm placeholder:text-text-placeholder resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                    />
                  </div>

                  {/* Action Buttons — labeled icons, one row, no cluster */}
                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="lg" className="flex-1" onClick={() => decide(selectedPro!.id, 'approve')}>
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button variant="danger" size="lg" className="flex-1" onClick={() => decide(selectedPro!.id, 'reject')}>
                      <X size={16} />
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      aria-label="Request more info"
                      title="Request more info"
                      className="px-3"
                      onClick={() => toast('Info request sent (demo)', { description: `The ${selectedPro!.name} team will be prompted to re-upload documents.` })}
                    >
                      <MessageSquare size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center p-8"
              >
                <p className="text-text-muted text-sm">Select a professional to review</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
