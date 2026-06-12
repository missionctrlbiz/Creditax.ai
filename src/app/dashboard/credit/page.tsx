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

export default function CreditOverviewPage() {
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
  const scorePercentage = (currentScore / maxScore) * 100;

  return (
    <div className="p-8 max-xl:p-6 max-md:p-4">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-text-primary mb-2">Credit Score</h1>
        <p className="text-text-muted text-sm">Track your creditworthiness and understand what affects your score.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Score Gauge Card */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6 h-full">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
              CREDIT SCORE
            </div>
            <div className="flex flex-col items-center">
              {/* Semicircle Gauge */}
              <div className="relative w-48 h-24 mb-4">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Background arc */}
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="var(--color-surface-inset)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="url(#tealGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${scorePercentage * 2.51} 251`}
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                  <defs>
                    <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-brand-primary)" />
                      <stop offset="100%" stopColor="var(--color-brand-action)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                  <span className="text-4xl font-bold text-text-primary font-mono">{currentScore}</span>
                  <span className="text-sm text-text-muted">/ {maxScore}</span>
                </div>
              </div>
              <Badge variant="success" className="mb-2">+15 from last month</Badge>
              <span className="text-xs text-text-muted">VantageScore</span>
            </div>
          </Card>
        </motion.div>

        {/* Score Breakdown Card */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6 h-full">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
              WHAT IS BUILDING YOUR SCORE
            </div>
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
                  <div className="h-2 bg-surface-inset rounded-full overflow-hidden">
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

        {/* Quick Actions Card */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6 h-full flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
              QUICK ACTIONS
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <Button variant="secondary" size="md" className="w-full justify-start">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Upload Bank Statement
              </Button>
              <Button variant="primary" size="md" className="w-full justify-start">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Request Lender Match
              </Button>
              <Button variant="ghost" size="md" className="w-full justify-start">
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

      {/* Score History Chart */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Score History</h2>
              <p className="text-sm text-text-muted">Last 12 months</p>
            </div>
            <Badge variant="success">+40 points YoY</Badge>
          </div>
          
          {/* Simple Line Chart */}
          <div className="relative h-48">
            <svg viewBox="0 0 600 160" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[600, 700, 800].map((y, i) => (
                <g key={y}>
                  <line
                    x1="40"
                    y1={40 + i * 40}
                    x2="580"
                    y2={40 + i * 40}
                    stroke="var(--color-border-subtle)"
                    strokeWidth="1"
                  />
                  <text
                    x="30"
                    y={44 + i * 40}
                    textAnchor="end"
                    className="text-[10px] fill-text-muted"
                  >
                    {y}
                  </text>
                </g>
              ))}
              
              {/* Line path */}
              <path
                d={`M 50 ${scoreHistory.map((s, i) => {
                  const x = 50 + i * 48;
                  const y = 140 - ((s.score - 600) / 200) * 120;
                  return `${x} ${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Area fill */}
              <path
                d={`M 50 140 L ${scoreHistory.map((s, i) => {
                  const x = 50 + i * 48;
                  const y = 140 - ((s.score - 600) / 200) * 120;
                  return `${x} ${y}`;
                }).join(' L ')} L ${50 + (scoreHistory.length - 1) * 48} 140 Z`}
                fill="url(#areaGradient)"
                opacity="0.3"
              />
              
              {/* Data points */}
              {scoreHistory.map((s, i) => {
                const x = 50 + i * 48;
                const y = 140 - ((s.score - 600) / 200) * 120;
                return (
                  <g key={s.month}>
                    <circle
                      cx={x}
                      cy={y}
                      r={i === scoreHistory.length - 1 ? 6 : 4}
                      fill={i === scoreHistory.length - 1 ? 'var(--color-brand-action)' : 'var(--color-brand-primary)'}
                      className="transition-all duration-300"
                    />
                    {i === scoreHistory.length - 1 && (
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-[10px] fill-text-primary font-semibold"
                      >
                        {s.score}
                      </text>
                    )}
                  </g>
                );
              })}
              
              {/* X-axis labels */}
              {scoreHistory.map((s, i) => (
                <text
                  key={s.month}
                  x={50 + i * 48}
                  y="155"
                  textAnchor="middle"
                  className="text-[10px] fill-text-muted"
                >
                  {s.month}
                </text>
              ))}
              
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-brand-primary)" />
                  <stop offset="100%" stopColor="var(--color-brand-action)" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-brand-action)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>
      </motion.div>

      {/* View Detail Link */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mt-6 flex justify-end"
      >
        <Button variant="link" className="text-brand-primary">
          View detailed breakdown
        </Button>
      </motion.div>
    </div>
  );
}