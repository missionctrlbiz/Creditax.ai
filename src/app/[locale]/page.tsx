import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { SmoothScroll } from '@/components/shared/SmoothScroll';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import { CinematicFlow } from '@/components/shared/CinematicFlow';
import { Hero } from '@/components/landing/Hero';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { StatsSection } from '@/components/landing/StatsSection';
import { PublicationsCarousel } from '@/components/landing/PublicationsCarousel';
import { StakeholderSections } from '@/components/landing/StakeholderSections';
import { MarketplacePricingStrip } from '@/components/landing/MarketplacePricingStrip';
import { NewsletterSection } from '@/components/landing/NewsletterSection';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* P22: Lenis smooth wheel synced to the GSAP ticker (SmoothScroll) plus
          the cinematic ScrollTrigger engine (CinematicFlow) — the whole page
          plays as one continuous film: hero load sequence, word-assembled
          headlines, a pinned horizontal how-it-works stage, masked imagery,
          magnetic CTAs and a cursor spotlight. */}
      <SmoothScroll />
      <CinematicFlow />
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <StatsSection />
        <PublicationsCarousel />
        <StakeholderSections />
        <MarketplacePricingStrip />
        <NewsletterSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
