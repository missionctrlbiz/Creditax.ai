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
    transition: { staggerChildren: 0.1 },
  },
};

export default function CreditDetailPage() {
  const scoreBreakdown = [
    { label: 'Tax Filing History', points: 45, percentage: 90, color: 'success' },
    { label: 'Document Consistency', points: 30, percentage: 65, color: 'brand' },
    { label: 'Income Stability', points: 25, percentage: 55, color: 'brand' },
    { label: 'Savings Pattern', points: 20, percentage: 40, color: 'warning' },
  ];

  const scoreHistory = [
    { month: 'Jul', score: 680 },
    { month: 'Aug', score: 695 },
    { month: 'Sep', score: 690 },
    { month: 'Oct', score: 685 },
    { month: 'Nov', score: 700 },
    { month: 'Dec', score: 705 },
    { month: 'Jan', score: 710 },
    { month: 'Feb', score: 715 },
    { month: 'Mar', score: 708 },
    { month: 'Apr', score: 718 },
    { month: 'May', score: 720 },
    { month: 'Jun', score: 720 },
  ];

  const maxScore = 850;
  const currentScore = 720;
  const scorePercentage = currentScore / maxScore;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference * (1 - scorePercentage);

  return (
    <div className="p-8 max-xl:p-6 max-md:p-4">
      {/* Breadcrumb */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">Dashboard</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary font-medium">Credit Score</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-text-primary mb-2">Credit Score Detail</h1>
        <p className="text-text-muted text-sm">Understand your credit score and how to improve it.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[55%_45%] gap-6">
        {/* Left Column */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Score Card */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <div className="flex flex-col items-center">
                {/* Full Circle Ring Gauge */}
                <div className="relative w-52 h-52 mb-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="var(--color-surface-inset)"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="url(#circleGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-brand-primary)" />
                        <stop offset="50%" stopColor="var(--color-brand-action)" />
                        <stop offset="100%" stopColor="var(--color-success)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-text-primary font-mono">{currentScore}</span>
                    <span className="text-sm text-text-muted">/ {maxScore}</span>
                    <Badge variant="success" className="mt-2">GOOD</Badge>
                  </div>
                </div>

                {/* Color Scale Bar */}
                <div className="w-full max-w-xs">
                  <div className="relative h-3 rounded-full overflow-hidden" style={{
                    background: 'linear-gradient(to right, var(--color-error), var(--color-warning), var(--color-success), var(--color-brand-action))'
                  }}>
                    <motion.div
                      initial={{ left: '10%' }}
                      animate={{ left: '72%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="absolute top-1/2 -translate-y-1/2 w-0 h-0"
                      style={{
                        borderLeft: '10px solid var(--color-text-primary)',
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-text-muted">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">What is Building Your Score</h2>
              <div className="space-y-4">
                {scoreBreakdown.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-primary">{item.label}</span>
                      <span className={`text-sm font-semibold ${
                        item.color === 'success' ? 'text-success' :
                        item.color === 'warning' ? 'text-warning' :
                        'text-brand-primary'
                      }`}>
                        +{item.points} pts
                      </span>
                    </div>
                    <div className="h-2.5 bg-surface-inset rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          item.color === 'success' ? 'bg-success' :
                          item.color === 'warning' ? 'bg-warning' :
                          'bg-brand-primary'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* What This Means Card */}
          <motion.div variants={fadeInUp}>
            <Card accent="teal" className="p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span>📌</span> What this means
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A score of 720 puts you in the &pos;’Good&pos;’ tier. Lenders on the Creditax platform will see you as a low-risk borrower. You qualify for loan rates starting from 12% per annum. Improving your filing consistency could push you to &pos;’Excellent&pos;’ within 3 months.
              </p>
            </Card>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Button variant="primary" size="xl" fullWidth>
              How to Improve My Score
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Score History Card */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text-primary">Score History</h2>
                <p className="text-sm text-text-muted">Last 12 months</p>
              </div>
              
              {/* Line Chart */}
              <div className="relative h-40">
                <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[600, 700, 800].map((y, i) => (
                    <g key={y}>
                      <line
                        x1="30"
                        y1={20 + i * 35}
                        x2="380"
                        y2={20 + i * 35}
                        stroke="var(--color-border-subtle)"
                        strokeWidth="1"
                      />
                      <text
                        x="20"
                        y={24 + i * 35}
                        textAnchor="end"
                        className="text-[9px] fill-text-muted"
                      >
                        {y}
                      </text>
                    </g>
                  ))}
                  
                  {/* Line path */}
                  <path
                    d={`M 35 ${scoreHistory.map((s, i) => {
                      const x = 35 + i * 31;
                      const y = 110 - ((s.score - 600) / 200) * 90;
                      return `${x} ${y}`;
                    }).join(' L ')}`}
                    fill="none"
                    stroke="url(#detailLineGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points */}
                  {scoreHistory.map((s, i) => {
                    const x = 35 + i * 31;
                    const y = 110 - ((s.score - 600) / 200) * 90;
                    return (
                      <circle
                        key={s.month}
                        cx={x}
                        cy={y}
                        r={i === scoreHistory.length - 1 ? 5 : 3}
                        fill={i === scoreHistory.length - 1 ? 'var(--color-brand-action)' : 'var(--color-brand-primary)'}
                      />
                    );
                  })}
                  
                  {/* X-axis labels */}
                  {scoreHistory.map((s, i) => (
                    <text
                      key={s.month}
                      x={35 + i * 31}
                      y="115"
                      textAnchor="middle"
                      className="text-[8px] fill-text-muted"
                    >
                      {s.month}
                    </text>
                  ))}
                  
                  <defs>
                    <linearGradient id="detailLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-brand-primary)" />
                      <stop offset="100%" stopColor="var(--color-brand-action)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </Card>
          </motion.div>

          {/* Areas to Watch Card */}
          <motion.div variants={fadeInUp}>
            <Card accent="amber" className="p-6">
              <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
                <span>⚠</span> Areas to Watch
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5" />
                  <div>
                    <p className="text-sm text-text-primary">Savings Pattern</p>
                    <p className="text-xs text-text-muted">Upload 3 months of savings statements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5" />
                  <div>
                    <p className="text-sm text-text-primary">Q3 2024 Filing</p>
                    <p className="text-xs text-text-muted">Late filing note, decay timeline</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" size="md" fullWidth className="justify-start">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  Upload Bank Statement
                </Button>
                <Button variant="primary" size="md" fullWidth className="justify-start">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Request Lender Match
                </Button>
                <Button variant="ghost" size="md" fullWidth className="justify-start">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  Download Score Report
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}