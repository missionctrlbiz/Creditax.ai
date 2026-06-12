'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  MessageCircle,
  Upload,
  CreditCard,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react';

function formatDate(): string {
  return new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface StatCardProps {
  label: string;
  value?: string | number;
  status?: string;
  statusVariant?: 'success' | 'warning' | 'error' | 'info';
  children?: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, status, statusVariant = 'success', children, className }: StatCardProps) {
  return (
    <Card className={cn('p-6 flex flex-col', className)}>
      <span className="text-[11px] font-semibold tracking-wider uppercase text-text-muted mb-4">
        {label}
      </span>
      {children ? (
        <div className="flex-1 flex items-center justify-center">{children}</div>
      ) : (
        <div className="text-4xl font-bold text-text-primary mb-2">{value}</div>
      )}
      {status && (
        <div className="mt-3">
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
      )}
    </Card>
  );
}

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  primary?: boolean;
}

function QuickAction({ icon: Icon, title, description, href, primary = false }: QuickActionProps) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          'p-5 h-full transition-all duration-150 hover:scale-[1.02] hover:shadow-btn-brand cursor-pointer',
          primary && 'border-brand-primary-border bg-brand-primary-bg/30'
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
              primary ? 'bg-brand-primary text-text-inverse' : 'bg-surface-inset text-brand-primary'
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={cn('text-[14px] font-semibold mb-1', primary ? 'text-brand-primary' : 'text-text-primary')}>
              {title}
            </h3>
            <p className="text-[12px] text-text-muted leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface ActivityItem {
  id: string;
  type: 'question' | 'upload' | 'score' | 'filing';
  description: string;
  timeAgo: string;
}

const recentActivity: ActivityItem[] = [
  { id: '1', type: 'question', description: 'Asked about VAT rates', timeAgo: '2 hours ago' },
  { id: '2', type: 'upload', description: 'Uploaded receipt_kitchen.pdf', timeAgo: 'Yesterday' },
  { id: '3', type: 'question', description: 'Asked about PAYE deductions', timeAgo: '3 days ago' },
  { id: '4', type: 'upload', description: 'Uploaded bank_statement.pdf', timeAgo: '5 days ago' },
  { id: '5', type: 'score', description: 'Credit score updated to 720', timeAgo: '1 week ago' },
];

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'question':
      return <MessageCircle className="w-4 h-4" />;
    case 'upload':
      return <Upload className="w-4 h-4" />;
    case 'score':
      return <TrendingUp className="w-4 h-4" />;
    case 'filing':
      return <FileText className="w-4 h-4" />;
  }
}

function getActivityColor(type: ActivityItem['type']): string {
  switch (type) {
    case 'question':
      return 'bg-brand-primary-bg text-brand-primary';
    case 'upload':
      return 'bg-brand-action-bg text-brand-action';
    case 'score':
      return 'bg-success-bg text-success-text';
    case 'filing':
      return 'bg-info-bg text-info-text';
  }
}

function getTaxHealthStatus(score: number): { label: string; variant: 'success' | 'warning' | 'error' | 'info' } {
  if (score >= 80) return { label: 'Excellent', variant: 'success' };
  if (score >= 60) return { label: 'Good', variant: 'info' };
  if (score >= 40) return { label: 'Fair', variant: 'warning' };
  return { label: 'Needs Attention', variant: 'error' };
}

function CircularProgress({ value, max, size = 100, strokeWidth = 8 }: { value: number; max: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border-default)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0D7377" />
          <stop offset="100%" stopColor="#32E875" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [taxHealthScore] = useState(78);
  const [creditScore] = useState<number | null>(720);
  const [tokensUsed] = useState(23);
  const [tokenLimit] = useState(50);

  useEffect(() => {
    setCurrentDate(formatDate());
  }, []);

  const healthStatus = getTaxHealthStatus(taxHealthScore);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Welcome back, Emeka
          </h1>
          <div className="flex items-center gap-2 mt-2 text-text-muted text-sm">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{currentDate}</span>
          </div>
        </div>
        <Badge variant={healthStatus.variant} className="text-sm px-3 py-1.5">
          Your tax health is {healthStatus.label.toLowerCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Tax Health Score" value={taxHealthScore} status={healthStatus.label} statusVariant={healthStatus.variant}>
          <div className="relative flex items-center justify-center">
            <CircularProgress value={taxHealthScore} max={100} size={120} strokeWidth={10} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-text-primary">{taxHealthScore}</span>
            </div>
          </div>
        </StatCard>

        <StatCard label="Credit Score" value={creditScore ?? '—'}>
          {creditScore ? (
            <div className="relative flex items-center justify-center">
              <CircularProgress value={creditScore - 300} max={550} size={120} strokeWidth={10} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-primary">{creditScore}</span>
                <span className="text-[10px] text-text-muted">VantageScore</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-muted text-sm mb-3">Connect your account to see your credit score</p>
              <Button size="sm" variant="secondary">
                Check your credit
              </Button>
            </div>
          )}
        </StatCard>

        <StatCard label="Today's Usage">
          <div className="relative flex items-center justify-center">
            <CircularProgress value={tokensUsed} max={tokenLimit} size={120} strokeWidth={10} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-text-primary">{tokensUsed}</span>
              <span className="text-[10px] text-text-muted">of {tokenLimit}</span>
            </div>
          </div>
        </StatCard>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon={MessageCircle}
            title="Ask Tax Question"
            description="Get answers from our RAG knowledge base"
            href="/dashboard/chat"
            primary
          />
          <QuickAction
            icon={Upload}
            title="Upload Document"
            description="Upload receipts or invoices"
            href="/dashboard/documents"
          />
          <QuickAction
            icon={CreditCard}
            title="Check Your Score"
            description="See your credit health"
            href="#"
          />
          <QuickAction
            icon={FileText}
            title="View Reports"
            description="Generate tax summaries"
            href="#"
          />
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
          <a href="#" className="text-brand-primary text-xs font-semibold hover:underline">
            View all →
          </a>
        </div>

        <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', getActivityColor(item.type))}>
                {getActivityIcon(item.type)}
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
    </div>
  );
}