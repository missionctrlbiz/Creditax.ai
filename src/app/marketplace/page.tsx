'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Search, MapPin, Star, ChevronDown, ExternalLink, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const professionals = [
  {
    id: 'adaeze-consulting',
    name: 'Adaeze Consulting Ltd',
    verified: true,
    rating: 4.9,
    reviews: 127,
    distance: '2.3 km',
    services: ['Income Tax', 'VAT', 'Payroll'],
    price: 'From ₦15,000/filing',
    featured: true,
  },
  {
    id: 'lagos-tax-partners',
    name: 'Lagos Tax Partners',
    verified: true,
    rating: 4.8,
    reviews: 89,
    distance: '5.1 km',
    services: ['CIT', 'Transfer Pricing', 'Audit'],
    price: 'From ₦45,000/filing',
    featured: false,
  },
  {
    id: 'quicktax-nigeria',
    name: 'QuickTax Nigeria',
    verified: true,
    rating: 4.6,
    reviews: 203,
    distance: '1.8 km',
    services: ['VAT', 'PAYE', 'WHT'],
    price: 'From ₦8,000/filing',
    featured: false,
  },
  {
    id: 'emeka-associates',
    name: 'Emeka & Associates',
    verified: true,
    rating: 4.7,
    reviews: 56,
    distance: '8.4 km',
    services: ['CIT', 'Income Tax'],
    price: 'From ₦25,000/filing',
    featured: false,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Lagos, Nigeria');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Search Header */}
      <section className="bg-[#0D1117] py-6 px-6 sticky top-0 z-40 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a trusted tax professional in Nigeria..."
                className="w-full h-14 pl-12 pr-32 rounded-card bg-surface-raised border border-border-strong text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-brand-action text-sm">
                <MapPin className="w-4 h-4" />
                <span>{selectedLocation}</span>
              </div>
            </div>
            <Button variant="brand" size="lg">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Row */}
      <section className="px-6 py-4 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-pill bg-surface-overlay border border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary transition-all text-sm">
            Service Type
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-pill bg-surface-overlay border border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary transition-all text-sm">
            Location
            <span className="text-brand-action">×</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-pill bg-surface-overlay border border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary transition-all text-sm">
            Rating
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-pill bg-surface-overlay border border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary transition-all text-sm">
            Price Range
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-pill border transition-all text-sm ${
              verifiedOnly
                ? 'bg-brand-action-bg border-brand-action text-brand-action'
                : 'bg-surface-overlay border-border-strong text-text-secondary hover:border-border-brand'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Verified Only
          </button>
          <span className="ml-auto text-sm text-text-muted">47 professionals found</span>
        </div>
      </section>

      {/* Split View Content */}
      <section className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Scrollable List (40%) */}
            <div className="lg:w-[40%]">
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {professionals.map((pro) => (
                  <motion.div key={pro.id} variants={fadeInUp}>
                    <Link href={`/marketplace/${pro.id}`}>
                      <Card
                        className={`p-5 cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                          pro.featured
                            ? 'border-border-brand bg-brand-primary-bg/20'
                            : 'hover:border-border-brand'
                        }`}
                        onMouseEnter={() => setHoveredCard(pro.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                            pro.featured
                              ? 'bg-brand-action-bg text-brand-action border-2 border-brand-action'
                              : 'bg-surface-deep text-text-secondary border-2 border-border-strong'
                          }`}>
                            {pro.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-text-primary font-semibold truncate">{pro.name}</h3>
                              {pro.verified && (
                                <svg className="w-4 h-4 text-brand-action flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-sm mb-2">
                              <span className="flex items-center gap-1 text-warning">
                                <Star className="w-4 h-4 fill-current" />
                                {pro.rating}
                              </span>
                              <span className="text-text-muted">({pro.reviews} reviews)</span>
                              <span className="text-text-muted">·</span>
                              <span className="text-text-muted flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {pro.distance}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {pro.services.map((service) => (
                                <Badge key={service} variant="brand" className="text-[10px]">
                                  {service}
                                </Badge>
                              ))}
                            </div>

                            <p className="text-brand-action font-semibold text-sm">{pro.price}</p>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredCard === pro.id ? 1 : 0 }}
                          className="absolute inset-0 bg-surface-deep/80 flex items-center justify-center"
                        >
                          <Button variant="primary" size="sm">
                            View Profile
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </Button>
                        </motion.div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Map (60%) */}
            <div className="lg:w-[60%]">
              <Card className="h-[600px] bg-surface-deep relative overflow-hidden">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-text-muted mb-2">Mapbox Dark Map</p>
                    <p className="text-xs text-text-muted">
                      {professionals.length} professionals in Lagos
                    </p>
                  </div>
                </div>

                {/* Map Markers (simulated) */}
                <div className="absolute top-1/4 left-1/4">
                  <div className="w-8 h-8 rounded-full bg-brand-action flex items-center justify-center text-surface-base text-xs font-bold shadow-lg animate-pulse">
                    1
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/3">
                  <div className="w-8 h-8 rounded-full bg-brand-action flex items-center justify-center text-surface-base text-xs font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/2">
                  <div className="w-8 h-8 rounded-full bg-brand-action flex items-center justify-center text-surface-base text-xs font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div className="absolute top-1/2 right-1/4">
                  <div className="w-8 h-8 rounded-full bg-brand-action flex items-center justify-center text-surface-base text-xs font-bold shadow-lg">
                    4
                  </div>
                </div>

                {/* Cluster Bubble */}
                <div className="absolute top-4 right-4 bg-surface-overlay border border-border-strong rounded-full px-3 py-1.5 text-sm text-text-primary">
                  <span className="text-brand-action font-bold">8</span> in area
                </div>

                {/* Selected Tooltip */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-surface-overlay border border-border-brand rounded-card px-4 py-3 shadow-modal">
                  <p className="text-text-primary font-medium text-sm">Adaeze Consulting Ltd</p>
                  <p className="text-text-muted text-xs">₦15,000/filing · 4.9 ★</p>
                </div>

                {/* Bottom Location Pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-overlay border border-border-strong rounded-pill px-4 py-2 text-sm text-text-secondary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-action" />
                  Showing results near Lagos Island
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}