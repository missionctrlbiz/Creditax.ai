'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { LogoGraphic } from '@/components/shared/LogoGraphic';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-1 md:grid-cols-[40%_60%] items-center">
            {/* Left Column: Hero Content */}
            <div className="relative z-10 max-w-[620px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-primary-bg border border-brand-primary-border rounded-full text-[11px] font-bold uppercase tracking-[0.12em] text-brand-primary mb-7">
                <span className="w-1.5 h-1.5 bg-brand-action rounded-full animate-pulse" />
                Now in Beta · Nigeria's First AI Tax-Credit Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-[1.04] mb-5 tracking-tight font-sans">
                Tax Smart.<br />
                <span className="text-brand-action">Borrow Smart.</span>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-[520px] mb-8">
                The AI platform bridging tax compliance and creditworthiness for Nigeria.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/login">
                  <Button variant="primary">Get Early Access →</Button>
                </Link>
                <Link href="#">
                  <Button variant="secondary">View API Docs</Button>
                </Link>
              </div>
              <div className="flex items-center gap-3 mt-8">
                <div className="flex">
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-surface-base grid place-items-center text-[11px] font-semibold text-text-primary bg-brand-primary">E</div>
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-surface-base grid place-items-center text-[11px] font-semibold text-text-primary bg-[#1a8a6e] -ml-2">A</div>
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-surface-base grid place-items-center text-[11px] font-semibold text-text-primary bg-[#2d6b8a] -ml-2">K</div>
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-surface-base grid place-items-center text-[11px] font-semibold text-text-primary bg-[#4a5a8a] -ml-2">O</div>
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-surface-base grid place-items-center text-[11px] font-semibold text-text-primary bg-[#6b4a7a] -ml-2">T</div>
                </div>
                <span className="text-text-secondary text-[13px]">
                  Trusted by 2,400+ developers and accountants in Nigeria
                </span>
              </div>
            </div>

            {/* Right Column: Logo Network Graphic */}
            <div className="relative w-full min-h-[300px] md:min-h-[400px] max-md:mt-12 overflow-visible">
              <div className="absolute top-1/2 left-1/2 md:left-auto md:right-0 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 w-[380px] md:w-[600px] lg:w-[680px] aspect-square md:-mr-24 pointer-events-none">
                <LogoGraphic className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 border-t border-border-default bg-surface-base">
          <div className="max-w-[1440px] mx-auto px-10">
            <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
              PLATFORM FEATURES
            </p>
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything your tax and credit stack needs
            </h2>
            <p className="text-center text-text-secondary text-base max-w-[560px] mx-auto">
              Built for Nigerian developers, accountants, and financial institutions. Production-ready APIs with AI at the core.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
              {/* Card 1: Tax Calculation API */}
              <Card className="p-7 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 grid place-items-center rounded-[12px] bg-brand-primary-bg border border-brand-primary-border text-brand-primary mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
                      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
                      <circle cx="17" cy="17" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Tax Calculation API</h3>
                  <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                    Calculate income tax, VAT, WHT in milliseconds. Supports all Nigerian tax jurisdictions.
                  </p>
                </div>
                <div className="bg-surface-base rounded-[10px] p-4 border border-[rgba(255,255,255,0.04)] mt-auto">
                  <div className="font-mono text-[12px] leading-relaxed">
                    <span className="text-text-muted">{"{"}</span><br />
                    &nbsp;&nbsp;<span className="text-brand-primary">"tax"</span>: <span className="text-brand-action">"4,800,000"</span>,<br />
                    &nbsp;&nbsp;<span className="text-brand-primary">"rate"</span>: <span className="text-brand-action">0.07</span><br />
                    <span className="text-text-muted">{"}"}</span>
                  </div>
                </div>
              </Card>

              {/* Card 2: AI Tax Assistant */}
              <Card className="p-7 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 grid place-items-center rounded-[12px] bg-brand-primary-bg border border-brand-primary-border text-brand-primary mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Tax Assistant</h3>
                  <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                    Ask any question about Nigerian tax law. Get instant, cited answers powered by our RAG model trained on FIRS guidelines.
                  </p>
                </div>
                <div className="bg-surface-base rounded-[10px] p-4 border border-[rgba(255,255,255,0.04)] mt-auto">
                  <div className="flex flex-col gap-2.5">
                    <div className="p-2.5 px-3 rounded-[10px] text-[12px] leading-relaxed bg-[rgba(13,115,119,0.15)] text-text-primary self-start border-l-2 border-brand-primary">
                      Can I claim VAT on imported goods?
                    </div>
                    <div className="p-2.5 px-3 rounded-[10px] text-[12px] leading-relaxed bg-surface-overlay text-text-secondary self-end border border-[rgba(255,255,255,0.06)]">
                      Under Section 8 of the VAT Act, imported goods are subject to 7.5% VAT...
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 3: Credit Health Score */}
              <Card className="p-7 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 grid place-items-center rounded-[12px] bg-brand-primary-bg border border-brand-primary-border text-brand-primary mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
                      <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Credit Health Score</h3>
                  <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                    Your tax compliance history becomes your creditworthiness. A better tax record unlocks better borrowing rates.
                  </p>
                </div>
                <div className="bg-surface-base rounded-[10px] p-4 border border-[rgba(255,255,255,0.04)] mt-auto">
                  <div className="w-full h-16 relative">
                    <svg viewBox="0 0 120 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                      <path d="M15 55 A50 50 0 0 1 105 55" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" strokeLinecap="round" />
                      <path d="M15 55 A50 50 0 0 1 88 22" fill="none" stroke="url(#gMini)" strokeWidth="10" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gMini" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0D7377" />
                          <stop offset="100%" stopColor="#32E875" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-1">
                      <div className="text-[18px] font-bold text-text-primary leading-none">742</div>
                      <div className="text-[9px] text-brand-action">Good Standing</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
