'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const reportTypes = [
  { id: 'tax', name: 'Tax Summary', description: 'Annual & quarterly tax breakdown', icon: '📊', color: 'teal' },
  { id: 'expense', name: 'Expense Report', description: 'All deductible expenses by category.', icon: '💰', color: 'amber' },
  { id: 'credit', name: 'Credit Report', description: 'Score history & factor analysis.', icon: '📈', color: 'green' },
  { id: 'custom', name: 'Custom Report', description: 'Choose your own date range & metrics.', icon: '⚙️', color: 'blue' },
];

const reports = [
  { id: 1, name: 'Annual Tax Summary 2024', type: 'Tax Summary', date: 'Jun 10, 2025', size: '2.4MB' },
  { id: 2, name: 'Expense Report — Q2 2025', type: 'Expense', date: 'Jun 8, 2025', size: '4.1MB' },
  { id: 3, name: 'Credit Health Report — June 2025', type: 'Credit', date: 'Jun 1, 2025', size: '1.8MB' },
  { id: 4, name: 'Tax Summary — Q1 2025', type: 'Tax Summary', date: 'Apr 5, 2025', size: '1.2MB' },
  { id: 5, name: 'Expense Report — Q1 2025', type: 'Expense', date: 'Apr 3, 2025', size: '3.5MB' },
  { id: 6, name: 'Annual Tax Summary 2023', type: 'Tax Summary', date: 'Jan 15, 2025', size: '2.1MB' },
];

const previewData = {
  name: 'Annual Tax Summary 2024',
  grossIncome: 12000000,
  totalTax: 2387500,
  effectiveRate: 19.9,
  monthlyIncome: [850000, 920000, 1100000, 980000, 1050000, 1200000, 1150000, 1080000, 1020000, 950000, 880000, 1050000],
  taxBreakdown: [
    { name: 'Income Tax', amount: 1312125, percentage: 55, color: 'brand' },
    { name: 'VAT', amount: 596875, percentage: 25, color: 'success' },
    { name: 'WHT', amount: 478500, percentage: 20, color: 'warning' },
  ],
};

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('tax');
  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Tax Summary':
        return <Badge variant="brand">Tax Summary</Badge>;
      case 'Expense':
        return <Badge variant="warning">Expense</Badge>;
      case 'Credit':
        return <Badge variant="success">Credit</Badge>;
      default:
        return <Badge variant="info">Custom</Badge>;
    }
  };

  const maxMonthlyIncome = Math.max(...previewData.monthlyIncome);

  return (
    <div className="p-8 max-xl:p-6 max-md:p-4">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Reports</h1>
          <p className="text-text-muted text-sm">Generate and manage your tax and credit reports.</p>
        </div>
        <Button variant="primary" size="md">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Generate New Report
        </Button>
      </motion.div>

      {/* Report Type Selector */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {reportTypes.map((type) => (
          <motion.button
            key={type.id}
            variants={fadeInUp}
            onClick={() => setSelectedType(type.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedType === type.id
                ? 'border-brand-primary bg-brand-primary-bg shadow-lg'
                : 'border-border-default bg-surface-overlay hover:border-border-strong hover:bg-surface-inset/30'
            }`}
          >
            <span className="text-2xl mb-2 block">{type.icon}</span>
            <h3 className={`text-sm font-semibold mb-1 ${
              selectedType === type.id ? 'text-brand-primary' : 'text-text-primary'
            }`}>
              {type.name}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">{type.description}</p>
          </motion.button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[55%_45%] gap-6">
        {/* Left Column - Reports List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Your Reports <span className="text-text-muted font-normal">({reports.length} reports)</span>
            </h2>
          </motion.div>

          <Card className="overflow-hidden">
            <div className="divide-y divide-border-subtle">
              {reports.map((report, index) => (
                <motion.button
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full p-4 text-left flex items-center justify-between hover:bg-surface-inset/30 transition-colors ${
                    selectedReport.id === report.id ? 'bg-brand-primary-bg/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedReport.id === report.id ? 'bg-brand-primary' : 'bg-surface-inset'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        selectedReport.id === report.id ? 'text-text-inverse' : 'text-text-muted'
                      }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{report.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getTypeBadge(report.type)}
                        <span className="text-xs text-text-muted">{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-text-muted">{report.size}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-surface-inset transition-colors">
                        <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded hover:bg-surface-inset transition-colors">
                        <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded hover:bg-surface-inset transition-colors">
                        <svg className="w-4 h-4 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          <motion.div variants={fadeInUp} className="mt-4 text-center">
            <button className="text-sm text-brand-primary hover:underline">
              View all 34 reports →
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column - Preview Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedReport.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="mb-4">
                  <Badge variant="brand" className="mb-2">Preview</Badge>
                  <h2 className="text-lg font-semibold text-text-primary">{selectedReport.name}</h2>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-surface-inset rounded-lg">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Gross Income</p>
                    <p className="text-sm font-mono font-semibold text-text-primary">{formatCurrency(previewData.grossIncome)}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-inset rounded-lg">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Total Tax</p>
                    <p className="text-sm font-mono font-semibold text-text-primary">{formatCurrency(previewData.totalTax)}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-inset rounded-lg">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Effective Rate</p>
                    <p className="text-sm font-mono font-semibold text-success">{previewData.effectiveRate}%</p>
                  </div>
                </div>

                {/* Mini Bar Chart */}
                <div className="mb-6">
                  <p className="text-[11px] uppercase tracking-wider text-text-muted mb-3">Monthly Income</p>
                  <div className="flex items-end justify-between gap-1 h-20">
                    {previewData.monthlyIncome.map((amount) => {
                      const height = (amount / maxMonthlyIncome) * 100;
                      const isDecember = i === 11;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t transition-all ${
                              isDecember ? 'bg-success' : 'bg-brand-primary'
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-text-muted">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {previewData.taxBreakdown.reduce((acc, item) => {
                        const dashArray = `${(item.percentage / 100) * 251} 251`;
                        const dashOffset = -acc.offset;
                        acc.elements.push(
                          <circle
                            key={item.name}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={`var(--color-${item.color === 'brand' ? 'brand-primary' : item.color === 'success' ? 'success' : 'warning'})`}
                            strokeWidth="12"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                          />
                        );
                        acc.offset += (item.percentage / 100) * 251;
                        return acc;
                      }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                    </svg>
                  </div>
                  <div className="space-y-2">
                    {previewData.taxBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${
                          item.color === 'brand' ? 'brand-primary' : item.color === 'success' ? 'success' : 'warning'
                        }`} />
                        <span className="text-xs text-text-muted">{item.name}</span>
                        <span className="text-xs text-text-primary font-medium">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breakdown Table */}
                <div className="space-y-2 mb-6">
                  {previewData.taxBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-primary">{item.name}</span>
                        <span className="text-xs text-text-muted">{item.percentage}%</span>
                      </div>
                      <span className="text-sm font-mono text-text-primary">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="h-px bg-border-default my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">Total</span>
                    <span className="text-sm font-mono font-semibold text-text-primary">{formatCurrency(previewData.totalTax)}</span>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-3 mb-4">
                  <Button variant="primary" size="md" className="flex-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    PDF
                  </Button>
                  <Button variant="secondary" size="md" className="flex-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    CSV
                  </Button>
                  <Button variant="ghost" size="md" className="flex-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                    </svg>
                    Share
                  </Button>
                </div>

                <button className="w-full text-center text-sm text-brand-primary hover:underline">
                  View full report →
                </button>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}