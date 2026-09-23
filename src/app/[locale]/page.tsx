import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
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
    </div>
  );
}
