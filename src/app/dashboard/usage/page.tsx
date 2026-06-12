'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Download, TrendingUp, Clock, Zap, FileText, MessageCircle, CreditCard } from 'lucide-react';

interface DailyUsage {
  date: string;
  count: number;
}

interface FeatureUsage {
  feature: string;
  tokens: number;
  icon: React.ElementType;
}

interface HistoryEntry {
  date: string;
  time: string;
  tokens: number;
  feature: string;
  cost: number;
}

const MOCK_TODAY = {
  used: 34,
  limit: 50,
  resetsAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
};

const MOCK_MONTHLY: DailyUsage[] = [
  { date: 'Jun 1', count: 12 },
  { date: 'Jun 2', count: 8 },
  { date: 'Jun 3', count: 15 },
  { date: 'Jun 4', count: 22 },
  { date: 'Jun 5', count: 18 },
  { date: 'Jun 6', count: 6 },
  { date: 'Jun 7', count: 9 },
  { date: 'Jun 8', count: 14 },
  { date: 'Jun 9', count: 19 },
  { date: 'Jun 10', count: 11 },
  { date: 'Jun 11', count: 25 },
  { date: 'Jun 12', count: 34 },
];

const MOCK_FEATURES: FeatureUsage[] = [
  { feature: 'RAG Chat', tokens: 180, icon: MessageCircle },
  { feature: 'Document Processing', tokens: 54, icon: FileText },
  { feature: 'Credit Score', tokens: 0, icon: CreditCard },
];

const MOCK_HISTORY: HistoryEntry[] = [
  { date: 'Jun 12', time: '14:32', tokens: 12, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 12', time: '12:18', tokens: 8, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 11', time: '16:45', tokens: 15, feature: 'Document Processing', cost: 0 },
  { date: 'Jun 11', time: '10:22', tokens: 10, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 10', time: '09:15', tokens: 5, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 9', time: '14:30', tokens: 8, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 9', time: '11:20', tokens: 11, feature: 'Document Processing', cost: 0 },
  { date: 'Jun 8', time: '15:40', tokens: 6, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 7', time: '10:05', tokens: 9, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 6', time: '16:22', tokens: 6, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 5', time: '13:18', tokens: 18, feature: 'Document Processing', cost: 0 },
  { date: 'Jun 4', time: '09:30', tokens: 14, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 3', time: '14:15', tokens: 15, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 2', time: '11:45', tokens: 8, feature: 'RAG Chat', cost: 0 },
  { date: 'Jun 1', time: '10:20', tokens: 12, feature: 'RAG Chat', cost: 0 },
];

function getUsageColor(percentage: number): string {
  if (percentage < 50) return '#32E875';
  if (percentage < 80) return '#F59E0B';
  return '#EF4444';
}

function formatResetsIn(isoTimestamp: string): string {
  const resetsAt = new Date(isoTimestamp);
  const now = new Date();
  const diffMs = resetsAt.getTime() - now.getTime();
  const hours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function UsageProgressCard() {
  const percentage = Math.round((MOCK_TODAY.used / MOCK_TODAY.limit) * 100);
  const color = getUsageColor(percentage);
  const resetsIn = formatResetsIn(MOCK_TODAY.resetsAt);

  return (
    <Card className="p-6">
      <div className="text-[11px] font-semibold tracking-wider uppercase text-text-muted mb-4">
        Today's Usage
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="relative h-4 rounded-full bg-[var(--color-surface-inset)] overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-text-primary font-mono">
              {MOCK_TODAY.used}
            </span>
            <span className="text-text-muted">of {MOCK_TODAY.limit} tokens</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Resets in</span>
            <Clock className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary font-medium font-mono">{resetsIn}</span>
          </div>
        </div>

        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--color-surface-inset)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={`${(percentage / 100) * 213.6} 213.6`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-text-primary">{percentage}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PlanCard() {
  return (
    <Card className="p-6">
      <div className="text-[11px] font-semibold tracking-wider uppercase text-text-muted mb-4">
        Your Plan
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Badge variant="brand">Free</Badge>
        <span className="text-text-primary font-semibold">50 tokens/day</span>
      </div>

      <p className="text-text-muted text-sm mb-4">
        Collect tax docs and build history to unlock higher limits
      </p>

      <Button variant="primary" size="sm" fullWidth>
        Upgrade
      </Button>
    </Card>
  );
}

function MonthlyChart() {
  const maxCount = Math.max(...MOCK_MONTHLY.map((d) => d.count));

  return (
    <Card className="p-6">
      <div className="text-[11px] font-semibold tracking-wider uppercase text-text-muted mb-6">
        Token Usage This Month
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_MONTHLY} barCategoryGap="20%">
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-overlay)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              cursor={{ fill: 'var(--color-surface-inset)', opacity: 0.3 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {MOCK_MONTHLY.map((entry, index) => (
                <Cell key={index} fill="#0D7377" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between">
        <span className="text-text-muted text-xs">Total this month:</span>
        <span className="text-text-primary font-semibold font-mono">
          {MOCK_MONTHLY.reduce((sum, d) => sum + d.count, 0)} tokens
        </span>
      </div>
    </Card>
  );
}

function FeatureBreakdown() {
  const total = MOCK_FEATURES.reduce((sum, f) => sum + f.tokens, 0);

  return (
    <Card className="p-6">
      <div className="text-[11px] font-semibold tracking-wider uppercase text-text-muted mb-6">
        Usage by Feature
      </div>

      <div className="space-y-4">
        {MOCK_FEATURES.map((feature) => {
          const percentage = total > 0 ? Math.round((feature.tokens / total) * 100) : 0;
          const Icon = feature.icon;

          return (
            <div key={feature.feature} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-surface-inset flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-primary text-sm font-medium">{feature.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-xs font-mono">{feature.tokens}</span>
                    <span className="text-text-muted text-xs">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-surface-inset overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function UsageHistoryTable() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(MOCK_HISTORY.length / pageSize);
  const paginatedData = MOCK_HISTORY.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Tokens', 'Feature', 'Cost'];
    const rows = MOCK_HISTORY.map((h) => [h.date, h.time, h.tokens, h.feature, `$${h.cost.toFixed(2)}`]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-text-muted">
          Token History
        </div>
        <Button variant="ghost" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-1" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted border-b border-border-default">
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Time</th>
              <th className="pb-3 pr-4">Tokens</th>
              <th className="pb-3 pr-4">Feature</th>
              <th className="pb-3">Cost</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((entry, index) => (
              <motion.tr
                key={`${entry.date}-${entry.time}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border-subtle last:border-0"
              >
                <td className="py-3 pr-4 text-text-primary text-sm font-mono">{entry.date}</td>
                <td className="py-3 pr-4 text-text-muted text-sm font-mono">{entry.time}</td>
                <td className="py-3 pr-4 text-text-primary text-sm font-mono">{entry.tokens}</td>
                <td className="py-3 pr-4 text-text-secondary text-sm">{entry.feature}</td>
                <td className="py-3 text-text-muted text-sm font-mono">${entry.cost.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-default">
          <span className="text-text-muted text-xs">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, MOCK_HISTORY.length)} of {MOCK_HISTORY.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-text-muted text-xs font-mono">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function UsagePage() {
  const [chartView, setChartView] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Usage
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Track your token consumption and limits
          </p>
        </div>

        <div className="flex gap-1 bg-surface-inset rounded-lg p-1">
          <button
            onClick={() => setChartView('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              chartView === 'daily'
                ? 'bg-brand-primary text-text-inverse'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setChartView('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              chartView === 'weekly'
                ? 'bg-brand-primary text-text-inverse'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UsageProgressCard />
        </div>
        <div>
          <PlanCard />
        </div>
      </div>

      <MonthlyChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureBreakdown />
        <Card className="p-6">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-text-muted mb-4">
            Quick Stats
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-action-bg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-action" />
                </div>
                <div>
                  <div className="text-text-primary font-medium">Total Tokens Used</div>
                  <div className="text-text-muted text-xs">This billing cycle</div>
                </div>
              </div>
              <span className="text-2xl font-bold text-text-primary font-mono">234</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-primary-bg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <div className="text-text-primary font-medium">Avg. Daily Usage</div>
                  <div className="text-text-muted text-xs">Last 30 days</div>
                </div>
              </div>
              <span className="text-2xl font-bold text-text-primary font-mono">19</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-inset flex items-center justify-center">
                  <Clock className="w-5 h-5 text-text-muted" />
                </div>
                <div>
                  <div className="text-text-primary font-medium">Days Until Reset</div>
                  <div className="text-text-muted text-xs">Billing cycle</div>
                </div>
              </div>
              <span className="text-2xl font-bold text-text-primary font-mono">19</span>
            </div>
          </div>
        </Card>
      </div>

      <UsageHistoryTable />
    </div>
  );
}