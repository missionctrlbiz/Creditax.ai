'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { LogoGraphic } from '@/components/shared/LogoGraphic';
import { MessageSquare, Upload, CreditCard, ArrowRight } from 'lucide-react';

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

        {/* How It Works Section */}
        <section className="py-20 md:py-24 border-t border-border-default">
          <div className="max-w-[1440px] mx-auto px-10">
            <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
              HOW IT WORKS
            </p>
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Three simple steps to tax intelligence
            </h2>
            <p className="text-center text-text-secondary text-base max-w-[560px] mx-auto mb-14">
              Get started in minutes. No complex setup, no lengthy onboarding.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary-bg border border-brand-primary-border flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-brand-action" />
                </div>
                <div className="text-brand-action font-mono text-sm mb-3">Step 01</div>
                <h3 className="text-xl font-semibold mb-3">Ask Your Question</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                  Type your Nigerian tax question into our RAG-powered chat. Get answers from NTA, NTAA, and FIRS guidelines.
                </p>
                <div className="mt-4 w-8 h-[2px] bg-gradient-to-r from-brand-action to-brand-primary rounded-full hidden md:block" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary-bg border border-brand-primary-border flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-brand-action" />
                </div>
                <div className="text-brand-action font-mono text-sm mb-3">Step 02</div>
                <h3 className="text-xl font-semibold mb-3">Get Instant Answers</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                  Receive accurate, sourced answers from our knowledge base. Every response is cited and traceable.
                </p>
                <div className="mt-4 w-8 h-[2px] bg-gradient-to-r from-brand-action to-brand-primary rounded-full hidden md:block" />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary-bg border border-brand-primary-border flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8 text-brand-action" />
                </div>
                <div className="text-brand-action font-mono text-sm mb-3">Step 03</div>
                <h3 className="text-xl font-semibold mb-3">Take Action</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                  Upload documents, check your credit score, or connect with a verified tax professional near you.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-14">
              <Link href="/login">
                <Button variant="primary" size="lg">
                  Start Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* More Features Section */}
        <section className="py-20 md:py-24 border-t border-border-default bg-surface-base">
          <div className="max-w-[1440px] mx-auto px-10">
            <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
              MORE FEATURES
            </p>
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything you need for tax compliance
            </h2>
            <p className="text-center text-text-secondary text-base max-w-[560px] mx-auto">
              From document processing to expert marketplace, we have you covered.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
              {/* Card 4: Document Processing */}
              <Card className="p-7 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 grid place-items-center rounded-[12px] bg-brand-primary-bg border border-brand-primary-border text-brand-primary mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
                      <path d="M9 17v-2m3 2v-4m3 4v-6M5 17h14M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Document Processing</h3>
                  <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                    Upload receipts and invoices. We extract the data automatically using AI OCR.
                  </p>
                </div>
                <div className="bg-surface-base rounded-[10px] p-4 border border-[rgba(255,255,255,0.04)] mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(50,232,117,0.15)] flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-action" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-[12px] text-text-secondary">
                      Receipts, invoices, forms supported
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 5: Expert Marketplace */}
              <Card className="p-7 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 grid place-items-center rounded-[12px] bg-brand-primary-bg border border-brand-primary-border text-brand-primary mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Expert Marketplace</h3>
                  <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                    Connect with verified tax professionals near you. CAC verified, FIRS registered.
                  </p>
                </div>
                <div className="bg-surface-base rounded-[10px] p-4 border border-[rgba(255,255,255,0.04)] mt-auto">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-surface-base flex items-center justify-center text-[10px] font-semibold">A</div>
                    <div className="w-8 h-8 rounded-full bg-[#1a8a6e] border-2 border-surface-base flex items-center justify-center text-[10px] font-semibold">G</div>
                    <div className="w-8 h-8 rounded-full bg-[#2d6b8a] border-2 border-surface-base flex items-center justify-center text-[10px] font-semibold">K</div>
                    <div className="w-8 h-8 rounded-full bg-[#4a5a8a] border-2 border-surface-base flex items-center justify-center text-[10px] font-semibold">T</div>
                    <div className="w-8 h-8 rounded-full bg-brand-action border-2 border-surface-base flex items-center justify-center text-[10px] font-semibold text-black">+</div>
                  </div>
                  <p className="text-[11px] text-text-muted mt-2">50+ verified professionals</p>
                </div>
              </Card>

              {/* Card 6: Always Free Tier */}
              <Card className="p-7 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 grid place-items-center rounded-[12px] bg-brand-primary-bg border border-brand-primary-border text-brand-primary mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[22px]">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Always Free Tier</h3>
                  <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                    Start with 50 free queries per day. No credit card required. Upgrade when you need more.
                  </p>
                </div>
                <div className="bg-surface-base rounded-[10px] p-4 border border-[rgba(255,255,255,0.04)] mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-text-muted">Daily queries</span>
                    <span className="text-[12px] font-semibold text-brand-action">50 free</span>
                  </div>
                  <div className="w-full h-2 bg-surface-overlay rounded-full mt-2 overflow-hidden">
                    <div className="w-[15%] h-full bg-brand-action rounded-full" />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">Pro: 500 queries/day</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-24 border-t border-border-default bg-surface-base">
          <div className="max-w-[1440px] mx-auto px-10">
            <p className="text-center text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
              TESTIMONIALS
            </p>
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Trusted by professionals across Nigeria
            </h2>
            <p className="text-center text-text-secondary text-base max-w-[560px] mx-auto mb-14">
              Join thousands of developers and accountants using Creditax.ai daily.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Testimonial 1 */}
              <Card className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-brand-action" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-primary text-base leading-relaxed mb-6">
                  &quot;Creditax helped me understand my VAT obligations in minutes. Would have taken days to research manually through FIRS publications.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-sm font-semibold">
                    CO
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Chinedu O.</p>
                    <p className="text-text-muted text-xs">Accountant, Lagos</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 2 */}
              <Card className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-brand-action" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-primary text-base leading-relaxed mb-6">
                  &quot;The tax health score prompted me to file my returns on time. Saved me from potential penalties and stress. Highly recommend.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a8a6e] flex items-center justify-center text-sm font-semibold">
                    AK
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Amina K.</p>
                    <p className="text-text-muted text-xs">Software Developer, Abuja</p>
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