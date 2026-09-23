'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Eye,
  Inbox,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
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

const applications = [
  { id: 1, business: 'Akinwale & Associates', owner: 'Tunde Akinwale', city: 'Lagos', service: 'VAT Filing', status: 'Pending', submitted: '2 hours ago' },
  { id: 2, business: 'Balogun Tax Consult', owner: 'Aisha Balogun', city: 'Abuja', service: 'Audit Support', status: 'Pending', submitted: '5 hours ago' },
  { id: 3, business: 'NaijaBooks Pro', owner: 'Chidi Eze', city: 'Port Harcourt', service: 'Bookkeeping', status: 'Under Review', submitted: '1 day ago' },
];

const statusBadgeVariant: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
  'Pending': 'warning',
  'Under Review': 'info',
  'Approved': 'success',
  'Rejected': 'error',
};

function proImage(id: number): string {
  return `/images/marketplace/pro-team-${String(((id - 1) % 5) + 1).padStart(2, '0')}.jpg`;
}

export default function AdminMarketplacePage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // marketplace P5: local status overrides so approve/reject reflect in the list
  // immediately (and the live endpoint is best-effort for the admin queue).
  const [statusOverrides, setStatusOverrides] = useState<Record<number, string>>({});

  const handleDecision = (id: number, decision: 'approve' | 'reject') => {
    setStatusOverrides((prev) => ({ ...prev, [id]: decision === 'approve' ? 'Approved' : 'Rejected' }));
    // The live admin endpoint owns the shared application store; the demo
    // application ids don't match, so this is a best-effort call.
    fetch(`/api/v1/admin/marketplace/${id}/${decision}`, { method: 'POST' }).catch(() => {});
  };

  const effectiveStatus = (app: (typeof applications)[number]) => statusOverrides[app.id] ?? app.status;

  const filtered = applications.filter((app) => {
    const matchesSearch = app.business.toLowerCase().includes(query.toLowerCase()) ||
      app.owner.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'All' || effectiveStatus(app) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
          <h1>Marketplace Approvals</h1>
          <p className="text-text-muted mt-1">Review tax pro applications before they go live on the marketplace.</p>
        </div>
        <Badge variant="warning" className="self-start">2 pending</Badge>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Search applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Under Review</option>
        </select>
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
                <Button variant="danger" size="sm">
                  <X size={14} />
                  Reject
                </Button>
                <Button variant="primary" size="sm">
                  <Check size={14} />
                  Approve
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval Queue */}
      {filtered.length > 0 ? (
        <motion.div variants={itemVariants} className="space-y-4">
          {filtered.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app.id)}
                      onChange={() => toggleSelected(app.id)}
                      aria-label={`Select ${app.business}`}
                      className="mt-1 w-4 h-4 rounded border-border-strong bg-surface-base text-brand-primary accent-brand-primary cursor-pointer flex-shrink-0"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proImage(app.id)}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-border-subtle"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-text-primary">{app.business}</h3>
                        <Badge variant="success" className="text-[10px]">
                          <ShieldCheck size={11} />
                          CAC
                        </Badge>
                        <Badge variant={statusBadgeVariant[effectiveStatus(app)]}>{effectiveStatus(app)}</Badge>
                      </div>
                      <p className="text-text-muted text-sm mt-1 flex items-center gap-1.5 flex-wrap">
                        <span>{app.owner}</span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} />
                          {app.city}
                        </span>
                        <span aria-hidden>·</span>
                        <span>{app.service}</span>
                        <span aria-hidden>·</span>
                        <span>submitted {app.submitted}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href="/admin/professionals" aria-label={`View profile for ${app.business}`}>
                      <Button variant="ghost" size="icon" title={`View ${app.business}`}>
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Reject ${app.business}`}
                      title={`Reject ${app.business}`}
                      className="hover:text-error-text"
                      onClick={() => handleDecision(app.id, 'reject')}
                    >
                      <X size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Approve ${app.business}`}
                      title={`Approve ${app.business}`}
                      className="hover:text-success-text"
                      onClick={() => handleDecision(app.id, 'approve')}
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div variants={itemVariants}>
          <Card className="p-10 text-center">
            <Inbox className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No applications match your filters.</p>
          </Card>
        </motion.div>
      )}

      {/* Marketplace Link */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">See everyone already live on the public marketplace.</p>
          <Link href="/marketplace">
            <Button variant="secondary" size="sm">
              Open Marketplace
              <ArrowUpRight size={14} />
            </Button>
          </Link>
        </Card>
      </motion.div>
    </motion.div>
  );
}
