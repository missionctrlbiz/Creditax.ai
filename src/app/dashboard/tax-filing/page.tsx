'use client';

import { motion } from 'framer-motion';
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

const expenses = [
  { name: 'Generator Fuel — Aug 2024', category: 'Operations', amount: 180000, eligible: true },
  { name: 'Office Rent — Q3 2024', category: 'Overhead', amount: 600000, eligible: true },
  { name: 'Internet & Utilities', category: 'Utilities', amount: 95000, eligible: true },
  { name: 'Staff Training Workshop', category: 'HR', amount: 275000, eligible: true },
  { name: 'Professional Services (Legal)', category: 'Services', amount: 450000, eligible: true },
  { name: 'Business Travel — Lagos-Abuja', category: 'Travel', amount: 320000, eligible: true },
  { name: 'Personal Grocery Purchase', category: 'Not Eligible', amount: 85000, eligible: false },
];

export default function TaxFilingStep3Page() {
  const grossIncome = 12000000;
  const totalDeductions = 2450000;
  const taxableIncome = grossIncome - totalDeductions;
  const estimatedTax = 2387500;
  const taxSavings = 612500;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8 max-xl:p-6 max-md:p-4">
      {/* Step Indicator Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <div className="bg-surface-raised rounded-xl p-4 border border-border-default">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { step: 1, label: 'Income Details', completed: true },
              { step: 2, label: 'Upload Documents', completed: true },
              { step: 3, label: 'Review Deductions', active: true },
              { step: 4, label: 'Tax Summary', pending: true },
              { step: 5, label: 'Submit & Pay', pending: true },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    item.completed
                      ? 'bg-brand-primary text-text-inverse'
                      : item.active
                      ? 'bg-brand-action text-text-inverse'
                      : 'bg-surface-inset text-text-muted'
                  }`}>
                    {item.completed ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      item.step
                    )}
                  </div>
                  <span className={`text-[10px] mt-1.5 ${
                    item.active ? 'text-text-primary font-medium' : 'text-text-muted'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`w-16 h-0.5 mx-2 mb-4 ${
                    item.completed ? 'bg-brand-primary' : 'bg-surface-inset'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-text-muted">Step 3 of 5</span>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-text-primary mb-2">Review Deductions</h1>
        <p className="text-text-muted text-sm">AI has detected deductible expenses from your uploaded documents.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-6">
        {/* Left Column - AI Bubble + Expense List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* AI Bubble */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6 bg-gradient-to-br from-brand-primary-bg/30 to-brand-action-bg/20 border-brand-primary/30">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-text-inverse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary text-sm leading-relaxed mb-4">
                    Based on your uploaded receipts and invoices, I found <span className="text-brand-action font-semibold">{formatCurrency(totalDeductions)}</span> in potentially deductible business expenses. Would you like me to add all of these to your filing?
                  </p>
                  <div className="flex gap-3">
                    <Button variant="primary" size="sm">
                      ✓ Yes, add all
                    </Button>
                    <Button variant="secondary" size="sm">
                      Review each one
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Expense List */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Detected Deductible Expenses</h2>
                  <p className="text-xs text-text-muted">Tap any item to edit or remove</p>
                </div>
                <Badge variant="success">{expenses.filter(e => e.eligible).length} eligible</Badge>
              </div>
              
              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer hover:bg-surface-inset ${
                      expense.eligible
                        ? 'border-border-default bg-surface-overlay'
                        : 'border-warning-border/50 bg-warning-bg/20 opacity-60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      expense.eligible
                        ? 'border-brand-action bg-brand-action'
                        : 'border-warning bg-transparent'
                    }`}>
                      {expense.eligible && (
                        <svg className="w-3 h-3 text-text-inverse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        expense.eligible ? 'text-text-primary' : 'text-warning'
                      }`}>
                        {expense.name}
                      </p>
                      <Badge
                        variant={expense.eligible ? 'brand' : 'warning'}
                        className="mt-1"
                      >
                        {expense.category}
                      </Badge>
                    </div>
                    <div className={`text-sm font-mono font-semibold ${
                      expense.eligible ? 'text-success' : 'text-warning'
                    }`}>
                      {formatCurrency(expense.amount)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Right Column - Running Total + AI Insight */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Running Total Card */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Tax Calculation</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Gross Income</span>
                  <span className="text-sm text-text-primary font-mono">{formatCurrency(grossIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Total Deductions</span>
                  <span className="text-sm text-success font-mono font-semibold">-{formatCurrency(totalDeductions)}</span>
                </div>
                <div className="h-px bg-border-default" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Taxable Income</span>
                  <span className="text-sm text-text-primary font-mono">{formatCurrency(taxableIncome)}</span>
                </div>
                <div className="h-px bg-border-default" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Estimated Tax Due</span>
                  <span className="text-xl text-text-primary font-mono font-bold">{formatCurrency(estimatedTax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Estimated Tax Savings</span>
                  <span className="text-xl text-success font-mono font-bold flex items-center gap-1">
                    {formatCurrency(taxSavings)} ↑
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-text-muted mt-4">
                Based on 2024 PITA rates for Lagos State
              </p>
            </Card>
          </motion.div>

          {/* AI Insight Card */}
          <motion.div variants={fadeInUp}>
            <Card accent="teal" className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-action text-sm">✨</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">AI Insight</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Adding the Professional Services deduction alone saves you <span className="text-success font-semibold">{formatCurrency(112500)}</span> in taxes. This is your highest-impact deduction.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="fixed bottom-0 left-0 right-0 bg-surface-raised border-t border-border-default p-4 z-20"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-sm text-text-muted">
            Step 3 of 5
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="lg">
              ← Back
            </Button>
            <Button variant="primary" size="lg">
              Continue to Summary →
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-24" />
    </div>
  );
}