'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

const systemHealth = [
  { name: 'API Server', status: 'operational', detail: '99.97% uptime', statusColor: 'success' },
  { name: 'RAG Engine', status: 'operational', detail: 'p95: 420ms', statusColor: 'success' },
  { name: 'Database', status: 'operational', detail: '47ms query avg', statusColor: 'success' },
  { name: 'Auth Service', status: 'degraded', detail: 'Elevated latency', statusColor: 'warning' },
];

const statCards = [
  { label: 'Active Users', value: '1,247', change: '+43 today', accent: 'teal' as const },
  { label: 'Verified Tax Pros', value: '89', change: '3 pending approval', accent: 'green' as const, highlight: true },
  { label: 'API Calls Today', value: '45,231', change: 'Peak: 2,847/hr at 14:00', accent: 'teal' as const },
  { label: 'Platform Revenue', value: '₦2,400,000', change: 'June MTD · +18% vs May', accent: 'green' as const },
];

const systemEvents = [
  { icon: '🔐', event: 'Admin login', user: 'admin@creditax.ai', time: '2 min ago', type: 'auth' },
  { icon: '✓', event: 'Pro verified: Akinwale & Associates', user: 'system', time: '5 min ago', type: 'success' },
  { icon: '↑', event: 'User Emeka Obi updated profile', user: 'emeka@email.com', time: '12 min ago', type: 'update' },
  { icon: '🗑', event: 'Document deleted: old-form-2023.pdf', user: 'admin@creditax.ai', time: '18 min ago', type: 'delete' },
  { icon: '🔄', event: 'RAG index refreshed', user: 'system', time: '1 hr ago', type: 'system' },
  { icon: '⚠', event: 'Rate limit hit: 192.168.1.1', user: 'api:free_tier', time: '2 hr ago', type: 'warning' },
  { icon: '+', event: 'New user registered: Chioma B.', user: 'chioma@email.com', time: '3 hr ago', type: 'create' },
  { icon: '⚙', event: 'API key rotated: mk_live_...x9k2', user: 'admin@creditax.ai', time: '4 hr ago', type: 'config' },
];

const pendingApprovals = [
  { name: 'Benson Tax Consultants', applied: 'Jun 10, 2025', docs: ['CAC ✓', 'FIRS ✓', 'ID ✓'] },
  { name: 'Okonkwo & Partners', applied: 'Jun 9, 2025', docs: ['CAC ✓', 'FIRS ✓', 'ID ⏳'] },
  { name: 'Lagos Tax Solutions', applied: 'Jun 8, 2025', docs: ['CAC ✓', 'FIRS ✓', 'ID ✓'] },
];

const eventTypeColors: Record<string, string> = {
  auth: 'text-[var(--color-warning)]',
  success: 'text-[var(--color-success)]',
  update: 'text-[var(--color-brand-primary)]',
  delete: 'text-[var(--color-error)]',
  system: 'text-[var(--color-info)]',
  warning: 'text-[var(--color-warning)]',
  create: 'text-[var(--color-success)]',
  config: 'text-[var(--color-info)]',
};

export default function AdminDashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-sans font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Platform overview and management</p>
      </motion.div>

      {/* System Health Row */}
      <motion.div variants={itemVariants}>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-text-primary">System Health</h2>
              <span className="text-xs text-text-muted">2 seconds ago</span>
            </div>
            <Badge variant="success" className="text-xs">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mr-1.5 animate-pulse" />
              Live
            </Badge>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealth.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-base border border-border-default"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.statusColor === 'success' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'
                }`} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.name}</p>
                  <p className={`text-xs ${
                    item.status === 'operational' ? 'text-[var(--color-success-text)]' : 'text-[var(--color-warning-text)]'
                  }`}>
                    {item.status === 'operational' ? 'Operational' : 'Degraded'}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            accent={stat.accent}
            className={`p-5 hover:border-border-strong transition-all duration-150 ${
              stat.highlight ? 'ring-1 ring-[var(--color-warning-border)]' : ''
            }`}
          >
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-mono font-bold text-text-primary mt-2">{stat.value}</p>
            <p className={`text-xs mt-1 ${
              stat.change.includes('pending') ? 'text-[var(--color-warning-text)]' : 'text-text-muted'
            }`}>
              {stat.change}
            </p>
          </Card>
        ))}
      </motion.div>

      {/* Two Column Layout: Activity Feed + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Events Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">System Events</h2>
              <Badge variant="success" className="text-xs">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mr-1.5 animate-pulse" />
                Live
              </Badge>
            </div>
            <div className="space-y-3">
              {systemEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-base border border-border-subtle hover:border-border-default transition-all duration-150"
                >
                  <span className="text-base flex-shrink-0">{event.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{event.event}</p>
                    <p className="text-xs text-text-muted mt-0.5">{event.user}</p>
                  </div>
                  <span className={`text-xs flex-shrink-0 ${eventTypeColors[event.type]}`}>
                    {event.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div variants={itemVariants}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">Marketplace Approvals</h2>
              <Badge variant="warning" className="text-xs">3 pending</Badge>
            </div>
            <div className="space-y-4">
              {pendingApprovals.map((approval, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-surface-base border border-border-default hover:border-border-strong transition-all duration-150"
                >
                  <p className="text-sm font-medium text-text-primary">{approval.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">Applied {approval.applied}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {approval.docs.map((doc, j) => (
                      <span
                        key={j}
                        className={`text-[10px] px-2 py-0.5 rounded-badge border ${
                          doc.includes('✓')
                            ? 'bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success-text)]'
                            : 'bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning-text)]'
                        }`}
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="danger" size="sm" className="flex-1">Reject</Button>
                    <Button variant="primary" size="sm" className="flex-1">Approve ✓</Button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-brand-primary hover:underline">
              View all applications →
            </button>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}