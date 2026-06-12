'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, UserCheck, Clock, Zap } from 'lucide-react';

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

const stats = [
  { label: 'Total Users', value: '1,247', change: '+43 today', icon: Users },
  { label: 'Active Professionals', value: '89', change: '3 pending', icon: UserCheck, highlight: true },
  { label: 'Pending Approvals', value: '12', change: 'Review needed', icon: Clock },
  { label: 'API Calls Today', value: '45,231', change: 'Peak: 2,847/hr', icon: Zap },
];

const recentActivity = [
  { type: 'signup', description: 'New user: Chioma B.', timeAgo: '3 hr ago' },
  { type: 'upload', description: 'Document uploaded: receipt_may.pdf', timeAgo: '5 hr ago' },
  { type: 'pro_approved', description: 'Tax Pro approved: Akinwale & Associates', timeAgo: '6 hr ago' },
  { type: 'question', description: 'Emeka O. asked about VAT rates', timeAgo: '8 hr ago' },
  { type: 'signup', description: 'New user: Ibrahim K.', timeAgo: '1 day ago' },
  { type: 'upload', description: 'Document uploaded: bank_statement.pdf', timeAgo: '1 day ago' },
];

const activityColors: Record<string, string> = {
  signup: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]',
  upload: 'bg-[var(--color-info-bg)] text-[var(--color-info-text)]',
  pro_approved: 'bg-brand-primary-bg text-brand-primary',
  question: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]',
};

const activityIcons: Record<string, string> = {
  signup: '+',
  upload: '↑',
  pro_approved: '✓',
  question: '?',
};

export default function AdminDashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Platform overview and management</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`p-5 ${stat.highlight ? 'ring-1 ring-[var(--color-warning-border)]' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-mono font-bold text-text-primary mt-2">{stat.value}</p>
                <p className={`text-xs mt-1 ${
                  stat.change.includes('pending') || stat.change.includes('Review')
                    ? 'text-[var(--color-warning-text)]'
                    : 'text-text-muted'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-primary-bg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
            <Badge variant="brand" className="text-xs">Live</Badge>
          </div>

          <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activityColors[item.type]}`}>
                  <span className="text-xs font-bold">{activityIcons[item.type]}</span>
                </div>
                <div className="flex-1 text-[13px] text-text-secondary">
                  <span className="text-text-primary font-medium">{item.description}</span>
                </div>
                <div className="text-[12px] text-text-muted font-mono flex-shrink-0">
                  {item.timeAgo}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}