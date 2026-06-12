'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type Period = '7d' | '30d' | '90d' | 'custom';

export default function UsagePage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [chartView, setChartView] = useState<'hourly' | 'daily' | 'weekly'>('daily');

  const stats = [
    {
      label: 'API Calls (June)',
      value: '45,231',
      change: '+12%',
      changeType: 'positive',
      hasSparkline: true,
    },
    {
      label: 'Monthly Limit',
      value: '45%',
      subValue: '45,231 / 100,000 calls',
      hasQuotaRing: true,
    },
    {
      label: 'Avg Response Time',
      value: '142ms',
      subValue: 'p99: 387ms',
      change: '↓ 18ms',
      changeType: 'positive',
    },
    {
      label: 'Success Rate',
      value: '99.6%',
      subValue: '180 errors in 45,231 calls',
      hasAlert: true,
    },
  ];

  const endpoints = [
    { endpoint: 'POST /v2/tax/calculate', calls: 15234, percent: 34, latency: '142ms', errorRate: '0.2%' },
    { endpoint: 'GET /v2/tax/brackets', calls: 12456, percent: 27, latency: '89ms', errorRate: '0.0%' },
    { endpoint: 'GET /v2/credit/score', calls: 10234, percent: 23, latency: '203ms', errorRate: '0.4%' },
    { endpoint: 'POST /v2/rag/chat', calls: 7307, percent: 16, latency: '387ms', errorRate: '1.2%', isAlert: true },
    { endpoint: 'POST /v2/documents/ocr', calls: 892, percent: 0, latency: '892ms', errorRate: '2.1%', isAlert: true },
  ];

  // Mock chart data - static for consistency
  const chartData = [
    { day: 1, total: 1523, success: 1519, errors: 4 },
    { day: 2, total: 1647, success: 1643, errors: 4 },
    { day: 3, total: 1489, success: 1485, errors: 4 },
    { day: 4, total: 1721, success: 1718, errors: 3 },
    { day: 5, total: 1598, success: 1594, errors: 4 },
    { day: 6, total: 1847, success: 1843, errors: 4 },
    { day: 7, total: 1654, success: 1650, errors: 4 },
    { day: 8, total: 1512, success: 1509, errors: 3 },
    { day: 9, total: 1789, success: 1785, errors: 4 },
    { day: 10, total: 1847, success: 1843, errors: 4 },
    { day: 11, total: 1698, success: 1694, errors: 4 },
    { day: 12, total: 1556, success: 1552, errors: 4 },
    { day: 13, total: 1623, success: 1619, errors: 4 },
    { day: 14, total: 1712, success: 1708, errors: 4 },
    { day: 15, total: 1845, success: 1841, errors: 4 },
    { day: 16, total: 1734, success: 1730, errors: 4 },
    { day: 17, total: 1598, success: 1594, errors: 4 },
    { day: 18, total: 1678, success: 1674, errors: 4 },
    { day: 19, total: 1823, success: 1819, errors: 4 },
    { day: 20, total: 1756, success: 1752, errors: 4 },
    { day: 21, total: 1689, success: 1685, errors: 4 },
    { day: 22, total: 1598, success: 1594, errors: 4 },
    { day: 23, total: 1723, success: 1719, errors: 4 },
    { day: 24, total: 1847, success: 1843, errors: 4 },
    { day: 25, total: 1765, success: 1761, errors: 4 },
    { day: 26, total: 1687, success: 1683, errors: 4 },
    { day: 27, total: 1598, success: 1594, errors: 4 },
    { day: 28, total: 1734, success: 1730, errors: 4 },
    { day: 29, total: 1823, success: 1819, errors: 4 },
    { day: 30, total: 1756, success: 1752, errors: 4 },
  ];

  const maxTotal = Math.max(...chartData.map((d) => d.total));

  return (
    <div className="p-8 md:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-text-primary mb-1">
            Usage & Analytics
          </h1>
          <p className="text-text-secondary text-sm">
            Monitor your API usage and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Period Pills */}
          <div className="flex gap-1 bg-surface-overlay rounded-[10px] p-1 border border-border-default">
            {(['7d', '30d', '90d', 'custom'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                  px-4 py-2 rounded-[8px] text-sm font-medium transition-all cursor-pointer
                  ${
                    period === p
                      ? 'bg-brand-primary text-text-inverse'
                      : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : p === '90d' ? '90 days' : 'Custom ▾'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="flex items-center justify-between mb-8 p-4 rounded-card bg-surface-overlay border border-border-default">
        <span className="text-text-secondary text-sm">Next billing: July 1, 2025</span>
        <Button variant="primary" size="sm">
          Upgrade Plan →
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6"
          >
            <div className="text-text-muted text-[11px] font-semibold tracking-wider uppercase mb-3">
              {stat.label}
            </div>

            {stat.hasQuotaRing ? (
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="var(--color-surface-inset)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="url(#quotaGradient)"
                      strokeWidth="6"
                      strokeDasharray={`${0.45 * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="quotaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-brand-primary)" />
                        <stop offset="100%" stopColor="var(--color-brand-action)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-text-primary">{stat.value}</span>
                  </div>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">{stat.subValue}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-text-primary">{stat.value}</span>
                  {stat.change && (
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-success' : 'text-error'
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                {stat.subValue && (
                  <p className="text-text-muted text-xs">{stat.subValue}</p>
                )}
                {stat.hasAlert && (
                  <p className="text-[var(--color-warning-text)] text-xs mt-1">
                    Most common: 429 Rate Limit
                  </p>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-primary font-semibold">API Calls Over Time</h3>
            <div className="flex gap-1 bg-surface-inset rounded-[10px] p-1">
              {(['hourly', 'daily', 'weekly'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setChartView(view)}
                  className={`
                    px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all cursor-pointer
                    ${
                      chartView === view
                        ? 'bg-brand-primary text-text-inverse'
                        : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px] relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-text-muted font-mono">
              <span>{maxTotal.toLocaleString()}</span>
              <span>{(maxTotal * 0.75).toLocaleString()}</span>
              <span>{(maxTotal * 0.5).toLocaleString()}</span>
              <span>{(maxTotal * 0.25).toLocaleString()}</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="ml-14 h-full flex items-end gap-1">
              {chartData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  {/* Stacked bars */}
                  <div className="w-full flex flex-col gap-px">
                    {/* Errors bar (red, at bottom) */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.errors / maxTotal) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.02 }}
                      className="bg-[var(--color-error)] rounded-t-sm min-h-[2px]"
                    />
                    {/* Success bar (green) */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${((data.success - data.errors) / maxTotal) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.02 }}
                      className="bg-gradient-to-t from-brand-primary to-brand-action rounded-t-sm min-h-[2px]"
                    />
                  </div>
                  {/* X-axis label (show every 5th) */}
                  {i % 5 === 0 && (
                    <span className="text-[10px] text-text-muted mt-2">Jun {data.day}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border-default">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-brand-primary to-brand-action" />
              <span className="text-text-muted text-xs">Total Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-brand-action" />
              <span className="text-text-muted text-xs">Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[var(--color-error)]" />
              <span className="text-text-muted text-xs">Errors</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Section: Endpoint Table + Quota Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Endpoint Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-text-primary font-semibold mb-4">Usage by Endpoint</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-text-muted text-[11px] font-semibold uppercase tracking-wider border-b border-border-default">
                    <th className="pb-3 pr-4">Endpoint</th>
                    <th className="pb-3 pr-4">Calls</th>
                    <th className="pb-3 pr-4 w-32">% of Total</th>
                    <th className="pb-3 pr-4">Avg Latency</th>
                    <th className="pb-3">Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((ep, index) => (
                    <motion.tr
                      key={ep.endpoint}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-border-default last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <span className="text-text-primary text-sm font-mono">{ep.endpoint}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-text-secondary text-sm">{ep.calls.toLocaleString()}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-surface-inset overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                ep.isAlert
                                  ? 'bg-[var(--color-warning)]'
                                  : 'bg-gradient-to-r from-brand-primary to-brand-action'
                              }`}
                              style={{ width: `${ep.percent}%` }}
                            />
                          </div>
                          <span className="text-text-muted text-xs w-8">{ep.percent}%</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`text-sm ${
                            ep.isAlert ? 'text-[var(--color-warning-text)]' : 'text-text-secondary'
                          }`}
                        >
                          {ep.latency}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-sm ${
                            ep.isAlert ? 'text-[var(--color-warning-text)]' : 'text-text-secondary'
                          }`}
                        >
                          {ep.errorRate}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Quota Card + Upgrade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="brand">Pro</Badge>
              <span className="text-text-primary font-semibold">Current Plan</span>
            </div>

            {/* Usage Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">45,231 / 100,000 calls</span>
                <span className="text-text-primary font-medium">45%</span>
              </div>
              <div className="h-3 rounded-full bg-surface-inset overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-action"
                />
              </div>
            </div>

            <p className="text-text-muted text-sm mb-4">
              54,769 calls remaining · Resets in 19 days
            </p>

            {/* Features */}
            <div className="space-y-2 pt-4 border-t border-border-default">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <span className="text-success">✓</span>
                100,000 API calls/month
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <span className="text-success">✓</span>
                Full RAG chat access
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <span className="text-success">✓</span>
                Credit score API
              </div>
            </div>
          </Card>

          {/* Upgrade Prompt */}
          <Card className="p-6 border border-brand-action/30">
            <h3 className="text-text-primary font-semibold mb-2">Upgrade to Enterprise</h3>
            <p className="text-text-muted text-sm mb-4">
              Get unlimited API calls, dedicated infrastructure, and custom rate limits.
            </p>
            <Button variant="primary" fullWidth>
              Talk to Sales →
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}