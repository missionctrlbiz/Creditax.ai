'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this will send the passwordless magic link.
    // For now, let's redirect to dashboard.
    window.location.href = '/dashboard';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Theme Toggle Positioned in Top Corner */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel: Brand Panel (Hidden on Mobile) */}
      <div className="bg-surface-base flex flex-col items-center justify-center relative p-10 max-md:hidden select-none">
        {/* SVG Decorative Background */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-no-repeat bg-contain pointer-events-none opacity-50"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'80\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.08\' stroke-width=\'1\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'60\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.06\' stroke-width=\'.8\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'40\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.05\' stroke-width=\'.6\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'20\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.04\' stroke-width=\'.4\'/%3E%3Cpath d=\'M100 20 L180 70 L180 130 L100 180 L20 130 L20 70Z\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.04\' stroke-width=\'.5\'/%3E%3Cpath d=\'M100 40 L160 80 L160 120 L100 160 L40 120 L40 80Z\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.03\' stroke-width=\'.4\'/%3E%3C/svg%3E")'
          }} 
        />
        <div className="w-[140px] relative z-10">
          <img src="/logo.png" alt="Creditax.ai" className="w-full h-auto" />
        </div>
        <div className="text-brand-primary text-base tracking-[0.08em] mt-4 text-center relative z-10 font-semibold font-sans">
          Tax Smart. Borrow Smart.
        </div>
        <div className="absolute bottom-10 text-text-secondary text-[13px] text-center max-w-[320px]">
          Trusted by 2,400+ Nigerian developers and accountants
        </div>
      </div>

      {/* Right Panel: Form Panel */}
      <div className="bg-surface-raised flex flex-col items-center justify-center p-10 relative min-h-screen max-sm:px-5">
        <div className="bg-surface-overlay border border-border-default rounded-[20px] p-10 w-full max-w-[400px] shadow-card">
          <h1 className="text-3xl font-bold mb-2 font-sans tracking-tight">Welcome back</h1>
          <p className="text-text-secondary text-[15px] mb-6">Sign in to your Creditax account</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input 
              type="email" 
              placeholder="you@company.com" 
              label="Email address"
              required 
            />
            
            <Button type="submit" variant="primary" fullWidth size="xl">
              Send Magic Link →
            </Button>
          </form>
          
          <p className="text-text-muted text-xs text-center mt-3">
            We'll send a one-time sign-in link to your email.
          </p>
          
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-[1px] bg-border-strong" />
            <span className="text-text-muted text-[13px] whitespace-nowrap">or</span>
            <div className="flex-1 h-[1px] bg-border-strong" />
          </div>
          
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full h-12 bg-transparent border border-border-strong rounded-[10px] text-text-primary text-[15px] flex items-center justify-center gap-2.5 hover:bg-hover-overlay hover:border-text-muted transition-colors cursor-pointer"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          
          <p className="text-text-secondary text-sm text-center mt-6">
            Don't have an account? <Link href="#" className="text-brand-primary font-semibold hover:underline">Sign up →</Link>
          </p>
        </div>
        <div className="absolute bottom-6 text-text-muted text-xs text-center">
          © 2026 Creditax.ai · Privacy · Terms
        </div>
      </div>
    </div>
  );
}
