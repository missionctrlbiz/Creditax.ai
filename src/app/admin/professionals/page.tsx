'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const statusTabs = [
  { label: 'All', count: 89, value: 'all' },
  { label: 'Pending', count: 3, value: 'pending', variant: 'warning' as const },
  { label: 'Verified', count: 83, value: 'verified', variant: 'success' as const },
  { label: 'Rejected', count: 3, value: 'rejected', variant: 'error' as const },
];

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'error'> = {
  verified: 'success',
  pending: 'warning',
  rejected: 'error',
};

export default function AdminProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPro, setSelectedPro] = useState<typeof professionals[0] | null>(null);

  const filteredPros = professionals.filter((pro) => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || pro.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-sans font-bold text-text-primary">Tax Professionals</h1>
        <p className="text-text-muted mt-1">Manage verification and professional accounts</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Pros</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1">89</p>
          <p className="text-xs text-text-muted mt-1">+3 this month</p>
        </Card>
        <Card accent="amber" className="p-4 ring-1 ring-[var(--color-warning-border)]">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Pending Verification</p>
          <p className="text-2xl font-mono font-bold text-[var(--color-warning-text)] mt-1">3</p>
          <p className="text-xs text-text-muted mt-1">Requires review</p>
        </Card>
        <Card accent="green" className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Verified</p>
          <p className="text-2xl font-mono font-bold text-[var(--color-success-text)] mt-1">83</p>
          <p className="text-xs text-text-muted mt-1">Active professionals</p>
        </Card>
        <Card accent="red" className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-mono font-bold text-[var(--color-error-text)] mt-1">3</p>
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
        <Button variant="primary" size="md">+ Add Professional</Button>
      </motion.div>

      {/* Status Tabs */}
      <motion.div variants={itemVariants}>
        <div className="flex gap-2 border-b border-border-default">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${
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
              onClick={() => setSelectedPro(pro)}
              className={`p-4 rounded-lg bg-surface-overlay border cursor-pointer transition-all duration-150 hover:border-border-strong ${
                selectedPro?.id === pro.id ? 'border-brand-primary ring-1 ring-brand-primary-border' : 'border-border-default'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-inset flex items-center justify-center flex-shrink-0">
                    <span className="text-text-muted text-sm">🎓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{pro.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{pro.email}</p>
                    <p className="text-xs text-text-muted mt-0.5">📍 {pro.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={statusBadgeVariant[pro.status]} className="text-[10px]">
                    {pro.status.charAt(0).toUpperCase() + pro.status.slice(1)}
                  </Badge>
                  {pro.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--color-warning)]">★</span>
                      <span className="text-sm text-text-primary">{pro.rating}</span>
                      <span className="text-xs text-text-muted">({pro.reviews})</span>
                    </div>
                  )}
                </div>
              </div>
              {pro.status === 'pending' && (
                <button className="mt-3 text-sm text-brand-primary hover:underline">
                  View application →
                </button>
              )}
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
                    <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
                      <span className="text-text-inverse font-semibold">
                        {selectedPro.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
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
                          <span className={`text-xs ${
                            doc.status === 'verified' ? 'text-[var(--color-success-text)]' : 'text-[var(--color-warning-text)]'
                          }`}>
                            {doc.status === 'verified' ? '✓ Verified' : '⏳ Under Review'}
                          </span>
                          <button className="text-brand-primary text-xs hover:underline">View ↗</button>
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
                          <span className={`text-sm ${check.status ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                            {check.status ? '✓' : '⏳'}
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

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button variant="primary" size="lg" fullWidth>
                      ✓ Approve & Verify
                    </Button>
                    <Button variant="danger" size="lg" fullWidth>
                      ✗ Reject Application
                    </Button>
                    <button className="w-full text-center text-sm text-brand-primary hover:underline mt-2">
                      Request More Info →
                    </button>
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