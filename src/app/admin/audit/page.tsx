'use client';

import React, { useState } from 'react';
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

const auditLogs = [
  {
    id: 1,
    timestamp: 'Jun 12, 2025 14:32:15',
    user: 'admin@creditax.ai',
    action: 'Approved',
    entityType: 'Professional',
    entityName: 'Akinwale & Associates',
    ip: '192.168.1.100',
    details: {
      before: { status: 'pending' },
      after: { status: 'verified' },
      reason: 'All documents verified, CAC and FIRS TIN confirmed valid.',
    },
  },
  {
    id: 2,
    timestamp: 'Jun 12, 2025 14:28:03',
    user: 'admin@creditax.ai',
    action: 'Updated',
    entityType: 'User',
    entityName: 'Emeka Obi',
    ip: '192.168.1.100',
    details: {
      before: { role: 'Admin' },
      after: { role: 'Super Admin' },
      reason: 'Elevated privileges for full system access.',
    },
  },
  {
    id: 3,
    timestamp: 'Jun 12, 2025 13:45:22',
    user: 'system',
    action: 'Re-indexed',
    entityType: 'Knowledge Base',
    entityName: 'NTA 2023',
    ip: 'internal',
    details: {
      before: { chunks: 1247 },
      after: { chunks: 1289 },
      reason: 'Document updated with latest amendments.',
    },
  },
  {
    id: 4,
    timestamp: 'Jun 12, 2025 12:15:08',
    user: 'admin@creditax.ai',
    action: 'Deleted',
    entityType: 'Document',
    entityName: 'old-form-2023.pdf',
    ip: '192.168.1.100',
    details: {
      before: { size: '2.4 MB', uploaded: 'Jan 15, 2024' },
      after: null,
      reason: 'Outdated form replaced with new version.',
    },
  },
  {
    id: 5,
    timestamp: 'Jun 12, 2025 11:30:45',
    user: 'chioma.a@email.com',
    action: 'Login',
    entityType: 'Auth',
    entityName: 'Session',
    ip: '105.112.34.78',
    details: {
      before: null,
      after: { method: 'password', mfa: true },
      reason: 'Successful login with 2FA.',
    },
  },
  {
    id: 6,
    timestamp: 'Jun 12, 2025 10:22:11',
    user: 'admin@creditax.ai',
    action: 'Config',
    entityType: 'API Settings',
    entityName: 'Rate Limits',
    ip: '192.168.1.100',
    details: {
      before: { default: 60, pro: 300 },
      after: { default: 60, pro: 300, enterprise: 'unlimited' },
      reason: 'Added enterprise tier with unlimited rate limit.',
    },
  },
  {
    id: 7,
    timestamp: 'Jun 12, 2025 09:18:33',
    user: 'api:free_tier',
    action: 'Error',
    entityType: 'API',
    entityName: 'Rate Limit Exceeded',
    ip: '41.203.78.45',
    details: {
      before: { requests: 60 },
      after: { blocked: true },
      reason: 'Rate limit exceeded for free tier key.',
    },
  },
  {
    id: 8,
    timestamp: 'Jun 12, 2025 08:45:19',
    user: 'ngozi.m@email.com',
    action: 'Created',
    entityType: 'Professional',
    entityName: 'Ngozi Marcus Tax Services',
    ip: '197.210.76.123',
    details: {
      before: null,
      after: { status: 'pending', plan: 'pro' },
      reason: 'New professional registration submitted.',
    },
  },
  {
    id: 9,
    timestamp: 'Jun 11, 2025 18:22:07',
    user: 'admin@creditax.ai',
    action: 'Approved',
    entityType: 'Professional',
    entityName: 'Delta Finance Group',
    ip: '192.168.1.100',
    details: {
      before: { status: 'pending' },
      after: { status: 'verified' },
      reason: 'All verification checks passed.',
    },
  },
  {
    id: 10,
    timestamp: 'Jun 11, 2025 16:10:44',
    user: 'system',
    action: 'Re-indexed',
    entityType: 'Knowledge Base',
    entityName: 'FIRS VAT Guide 2024',
    ip: 'internal',
    details: {
      before: { chunks: 892 },
      after: { chunks: 901 },
      reason: 'Added new VAT rate updates.',
    },
  },
  {
    id: 11,
    timestamp: 'Jun 11, 2025 14:55:31',
    user: 'admin@creditax.ai',
    action: 'Updated',
    entityType: 'User',
    entityName: 'Grace Okonkwo',
    ip: '192.168.1.100',
    details: {
      before: { status: 'Active' },
      after: { status: 'Suspended' },
      reason: 'Suspended due to ToS violation.',
    },
  },
  {
    id: 12,
    timestamp: 'Jun 11, 2025 12:30:00',
    user: 'admin@creditax.ai',
    action: 'Config',
    entityType: 'Integration',
    entityName: 'Mono API',
    ip: '192.168.1.100',
    details: {
      before: { status: 'connected' },
      after: { status: 'connected', key_rotated: true },
      reason: 'Rotated API key for security.',
    },
  },
];

const actionBadgeVariant: Record<string, 'success' | 'brand' | 'error' | 'info' | 'warning'> = {
  Approved: 'success',
  Updated: 'brand',
  Deleted: 'error',
  'Re-indexed': 'info',
  Login: 'warning',
  Config: 'info',
  Error: 'error',
  Created: 'success',
};

export default function AdminAuditPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(1);
  const [dateFrom, setDateFrom] = useState('Jun 1, 2025');
  const [dateTo, setDateTo] = useState('Jun 12, 2025');
  const [userFilter, setUserFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [entityFilter, setEntityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const totalPages = Math.ceil(auditLogs.length / perPage);
  const paginatedLogs = auditLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-sans font-bold text-text-primary">Audit Log</h1>
          <p className="text-text-muted mt-1">Track all system changes and user actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">↓ Export CSV</Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">System Changes Only</span>
            <button className="w-12 h-6 rounded-full bg-surface-inset relative transition-colors">
              <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-text-muted transition-all" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10 w-40"
              />
              <span className="text-text-muted">→</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10 w-40"
              />
            </div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm"
            >
              <option>All</option>
              <option>Admin</option>
              <option>User</option>
              <option>System</option>
            </select>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm"
            >
              <option>All</option>
              <option>Approved</option>
              <option>Updated</option>
              <option>Deleted</option>
              <option>Created</option>
              <option>Login</option>
              <option>Config</option>
              <option>Error</option>
            </select>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-10 px-4 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm"
            >
              <option>All</option>
              <option>User</option>
              <option>Professional</option>
              <option>Document</option>
              <option>Knowledge Base</option>
              <option>API Settings</option>
              <option>Integration</option>
            </select>
            <button className="text-sm text-brand-primary hover:underline">Clear Filters</button>
          </div>
          <p className="text-xs text-text-muted mt-3">
            Showing {auditLogs.length} events in last 12 days
          </p>
        </Card>
      </motion.div>

      {/* Audit Table */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-inset">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Entity Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Entity Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log, i) => (
                  <React.Fragment key={log.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`border-b border-border-subtle transition-colors cursor-pointer ${
                        expandedRow === log.id ? 'bg-surface-inset' : 'hover:bg-[var(--color-hover-overlay)]'
                      }`}
                      onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-text-secondary">{log.timestamp}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-primary">{log.user}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={actionBadgeVariant[log.action]}>{log.action}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-secondary">{log.entityType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-text-primary">{log.entityName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-text-muted">{log.ip}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-brand-primary hover:underline">
                          {expandedRow === log.id ? '▲ Hide' : '▼ View'}
                        </button>
                      </td>
                    </motion.tr>

                    {/* Expanded Row Details */}
                    <AnimatePresence>
                      {expandedRow === log.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-b border-border-default bg-surface-base"
                        >
                          <td colSpan={7} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {log.details.before && (
                                <div>
                                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Before</p>
                                  <pre className="text-sm font-mono text-[var(--color-error-text)] bg-[var(--color-error-bg)] p-3 rounded-lg overflow-x-auto">
{JSON.stringify(log.details.before, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.details.after && (
                                <div>
                                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">After</p>
                                  <pre className="text-sm font-mono text-[var(--color-success-text)] bg-[var(--color-success-bg)] p-3 rounded-lg overflow-x-auto">
{JSON.stringify(log.details.after, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                            {log.details.reason && (
                              <div className="mt-4">
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Reason</p>
                                <p className="text-sm text-text-primary">{log.details.reason}</p>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-default bg-surface-inset">
            <p className="text-sm text-text-muted">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, auditLogs.length)} of {auditLogs.length} events
            </p>
            <div className="flex items-center gap-3">
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="h-8 px-2 rounded-input bg-surface-base border border-border-strong text-text-primary text-xs"
              >
                <option value={12}>12 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-btn text-sm transition-all ${
                        currentPage === page
                          ? 'bg-brand-primary text-text-inverse'
                          : 'text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-btn text-text-muted hover:text-text-primary hover:bg-[var(--color-hover-overlay)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}