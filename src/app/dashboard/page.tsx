'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('Thursday, 12 June 2026');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    setCurrentDate(new Date().toLocaleDateString('en-NG', options));
  }, []);

  return (
    <div className="p-8 md:p-10">
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">
          Welcome back, Emeka
        </h1>
        <span className="text-text-secondary text-sm font-mono bg-surface-overlay border border-border-default px-3.5 py-1.5 rounded-[10px]">
          {currentDate}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Tax Health Score */}
        <Card className="p-7">
          <div className="text-text-muted text-[11px] font-semibold tracking-wider uppercase mb-5">
            TAX HEALTH SCORE
          </div>
          <div className="relative w-full h-[90px] mb-2 flex items-center justify-center">
            <svg viewBox="0 0 200 100" className="w-[180px] h-[90px]" preserveAspectRatio="xMidYMid meet">
              <path d="M20 90 A80 80 0 0 1 180 90" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="16" strokeLinecap="round" />
              <path d="M20 90 A80 80 0 0 1 155 40" fill="none" stroke="url(#gTeal)" strokeWidth="16" strokeLinecap="round" />
              <defs>
                <linearGradient id="gTeal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0D7377" />
                  <stop offset="100%" stopColor="#32E875" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-2">
              <span className="text-4xl font-bold text-text-primary leading-none">78</span>
              <span className="text-[12px] text-text-muted">/100</span>
            </div>
          </div>
          <div className="text-center mt-3">
            <Badge variant="success">✓ On Track</Badge>
          </div>
        </Card>

        {/* Card 2: Credit Score */}
        <Card className="p-7">
          <div className="text-text-muted text-[11px] font-semibold tracking-wider uppercase mb-5">
            CREDIT SCORE
          </div>
          <div className="relative w-full h-[90px] mb-2 flex items-center justify-center">
            <svg viewBox="0 0 200 100" className="w-[180px] h-[90px]" preserveAspectRatio="xMidYMid meet">
              <path d="M20 90 A80 80 0 0 1 180 90" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="16" strokeLinecap="round" />
              <path d="M20 90 A80 80 0 0 1 145 47" fill="none" stroke="url(#gTeal)" strokeWidth="16" strokeLinecap="round" />
            </svg>
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-2">
              <span className="text-4xl font-bold text-text-primary leading-none">720</span>
              <div className="text-[10px] text-text-muted">VantageScore</div>
            </div>
          </div>
          <div className="text-center mt-3">
            <Badge variant="success">↑ +15 from last month</Badge>
          </div>
        </Card>

        {/* Card 3: 2025 Tax Filing */}
        <Card className="p-7">
          <div className="text-text-muted text-[11px] font-semibold tracking-wider uppercase mb-5">
            2025 TAX FILING
          </div>
          <div className="flex items-stretch gap-5 min-h-[90px]">
            {/* Vertical Progress Bar */}
            <div className="w-2 rounded-full bg-[rgba(255,255,255,0.06)] relative flex-shrink-0">
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-brand-primary to-brand-action" 
                style={{ height: '60%' }} 
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold text-text-primary leading-none">60%</div>
                <div className="text-xs text-status-warning mt-2.5 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  3 documents still needed
                </div>
              </div>
              
              <div className="flex gap-1.5 flex-wrap mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-border-strong text-text-secondary bg-[rgba(255,255,255,0.03)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-error" />
                  Bank Statement
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-border-strong text-text-secondary bg-[rgba(255,255,255,0.03)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-error" />
                  PAYE Receipt
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-border-strong text-text-secondary bg-[rgba(255,255,255,0.03)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-error" />
                  Utility Bill
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Card */}
      <Card className="p-6 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
          <a href="#" className="text-brand-primary text-xs font-semibold hover:underline">View all →</a>
        </div>
        
        <div className="flex flex-col">
          {/* Row 1 */}
          <div className="flex items-center gap-4.5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 bg-brand-action-bg text-brand-action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex-1 text-[13px] text-text-secondary">
              <strong className="text-text-primary font-medium">Tax Health Score</strong> updated to 78/100
            </div>
            <div className="text-[12px] text-text-muted font-mono flex-shrink-0">2 hours ago</div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-4.5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 bg-brand-primary-bg text-brand-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
              </svg>
            </div>
            <div className="flex-1 text-[13px] text-text-secondary">
              Document uploaded: <strong className="text-text-primary font-medium">Bank_Statement.pdf</strong>
            </div>
            <div className="text-[12px] text-text-muted font-mono flex-shrink-0">Yesterday</div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-4.5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 bg-brand-action-bg text-brand-action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex-1 text-[13px] text-text-secondary">
              <strong className="text-text-primary font-medium">Credit Score</strong> increased by +15 points
            </div>
            <div className="text-[12px] text-text-muted font-mono flex-shrink-0">3 days ago</div>
          </div>

          {/* Row 4 */}
          <div className="flex items-center gap-4.5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 bg-brand-primary-bg text-brand-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div className="flex-1 text-[13px] text-text-secondary">
              AI Tax Bot answered: <strong className="text-text-primary font-medium">VAT deduction query</strong>
            </div>
            <div className="text-[12px] text-text-muted font-mono flex-shrink-0">5 days ago</div>
          </div>

          {/* Row 5 */}
          <div className="flex items-center gap-4.5 py-4">
            <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 bg-[rgba(255,255,255,0.06)] text-text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1 text-[13px] text-text-secondary">
              <strong className="text-text-primary font-medium">Account</strong> created and verified
            </div>
            <div className="text-[12px] text-text-muted font-mono flex-shrink-0">Jun 1, 2026</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
