'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Search, MapPin, Star, Filter, X, Navigation } from 'lucide-react';
import Link from 'next/link';

interface TaxProfessional {
  id: string;
  slug: string;
  businessName: string;
  description: string;
  services: string[];
  priceDisplay: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  distanceDisplay?: string;
}

const SERVICE_TYPES = [
  'Personal Income Tax',
  'Business Tax',
  'VAT Filing',
  'Audit Support',
  'Tax Planning',
  'Bookkeeping',
];

const LOCATIONS = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [professionals, setProfessionals] = useState<TaxProfessional[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedService) params.set('service', selectedService);
      if (selectedLocation) params.set('location', selectedLocation);
      if (minRating > 0) params.set('minRating', minRating.toString());
      if (verifiedOnly) params.set('verified', 'true');
      if (nearMe && userLocation) {
        params.set('nearMe', 'true');
        params.set('lat', userLocation.lat.toString());
        params.set('lng', userLocation.lng.toString());
      }

      const res = await fetch(`/api/v1/marketplace?${params.toString()}`);
      const data = await res.json();
      setProfessionals(data.professionals || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [selectedService, selectedLocation, minRating, verifiedOnly, nearMe, userLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfessionals();
  };

  const handleNearMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setNearMe(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleServiceClick = (service: string) => {
    setSelectedService(selectedService === service ? '' : service);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-[var(--color-surface-deep)] to-surface-base pt-16 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Find a Trusted Tax Professional
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Verified experts ready to help with your taxes, audits & compliance
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="flex items-center bg-surface-overlay rounded-card border border-border-strong overflow-hidden shadow-card">
                <Search className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="I need help with VAT filing in Lagos"
                  className="w-full h-14 pl-12 pr-32 bg-transparent text-text-primary placeholder:text-text-placeholder focus:outline-none"
                />
                <Button type="submit" variant="brand" size="md" className="absolute right-2">
                  Search
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-3 mt-4">
              <Button variant="secondary" size="md" onClick={handleNearMe}>
                <Navigation className="w-4 h-4" />
                Use my location
              </Button>
              <Button variant="ghost" size="md" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4" />
                Filters
                {showFilters && <X className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 border-b border-border-subtle">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-muted text-sm">
                <span className="text-brand-action font-semibold">{total}</span> professionals found
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {SERVICE_TYPES.map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceClick(service)}
                  className={`px-4 py-2 rounded-pill text-sm font-medium transition-all ${
                    selectedService === service
                      ? 'bg-brand-action text-[var(--color-text-inverse)] border border-brand-action'
                      : 'bg-surface-overlay border border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>

            {showFilters && (
              <Card className="p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-10 px-3 rounded-input bg-surface-raised border border-border-strong text-text-primary text-sm focus:outline-none focus:border-brand-primary"
                    >
                      <option value="">All Locations</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                      Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="w-full h-10 px-3 rounded-input bg-surface-raised border border-border-strong text-text-primary text-sm focus:outline-none focus:border-brand-primary"
                    >
                      <option value="0">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                      Verification
                    </label>
                    <div className="flex items-center h-10">
                      <button
                        onClick={() => setVerifiedOnly(!verifiedOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-pill border text-sm transition-all ${
                          verifiedOnly
                            ? 'bg-brand-action-bg border-brand-action text-brand-action'
                            : 'bg-surface-overlay border-border-strong text-text-secondary'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified only
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                      Near Me
                    </label>
                    <div className="flex items-center h-10">
                      <button
                        onClick={handleNearMe}
                        className={`flex items-center gap-2 px-4 py-2 rounded-pill border text-sm transition-all ${
                          nearMe
                            ? 'bg-brand-action-bg border-brand-action text-brand-action'
                            : 'bg-surface-overlay border-border-strong text-text-secondary'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        {nearMe ? 'Location On' : 'Near me'}
                      </button>
                    </div>
                  </div>
                </div>

                {(selectedLocation || minRating > 0 || verifiedOnly) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-subtle">
                    <span className="text-text-muted text-sm">Active filters:</span>
                    {selectedLocation && (
                      <Badge variant="brand" className="gap-1">
                        {selectedLocation}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setSelectedLocation('')}
                        />
                      </Badge>
                    )}
                    {minRating > 0 && (
                      <Badge variant="brand" className="gap-1">
                        {minRating}+ Stars
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setMinRating(0)}
                        />
                      </Badge>
                    )}
                    {verifiedOnly && (
                      <Badge variant="success" className="gap-1">
                        Verified
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setVerifiedOnly(false)}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-[45%]">
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-brand-action border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : professionals.length === 0 ? (
                    <Card className="p-12 text-center">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-text-secondary">No professionals found matching your criteria.</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedService('');
                          setSelectedLocation('');
                          setMinRating(0);
                          setVerifiedOnly(false);
                          setNearMe(false);
                        }}
                      >
                        Clear filters
                      </Button>
                    </Card>
                  ) : (
                    professionals.map((pro, index) => (
                      <Link key={pro.id} href={`/marketplace/${pro.slug}`}>
                        <Card
                          className={`p-5 cursor-pointer transition-all duration-200 hover:border-border-brand ${
                            pro.verified ? 'border-border-brand bg-brand-primary-bg/10' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex gap-4">
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                                pro.verified
                                  ? 'bg-brand-action-bg text-brand-action border-2 border-brand-action'
                                  : 'bg-surface-deep text-text-secondary border-2 border-border-strong'
                              }`}
                            >
                              {pro.businessName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-text-primary font-semibold truncate">
                                  {pro.businessName}
                                </h3>
                                {pro.verified && (
                                  <svg
                                    className="w-4 h-4 text-brand-action flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-sm mb-2">
                                <span className="flex items-center gap-1 text-[var(--color-warning)]">
                                  <Star className="w-4 h-4 fill-current" />
                                  {pro.rating}
                                </span>
                                <span className="text-text-muted">({pro.reviewCount} reviews)</span>
                                {pro.distanceDisplay && (
                                  <>
                                    <span className="text-text-muted">·</span>
                                    <span className="text-text-muted flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {pro.distanceDisplay}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {pro.services.slice(0, 3).map((service) => (
                                  <Badge key={service} variant="brand" className="text-[10px]">
                                    {service}
                                  </Badge>
                                ))}
                              </div>

                              <p className="text-brand-action font-semibold text-sm">
                                {pro.priceDisplay}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:w-[55%]">
                <Card className="h-[500px] bg-surface-deep relative overflow-hidden sticky top-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-text-muted mb-2">Interactive Map</p>
                      <p className="text-xs text-text-muted">
                        {professionals.length} professionals in Nigeria
                      </p>
                    </div>
                  </div>

                  {professionals.slice(0, 4).map((pro, index) => {
                    const positions = [
                      { top: '25%', left: '30%' },
                      { top: '35%', right: '25%' },
                      { top: '60%', left: '45%' },
                      { top: '45%', right: '30%' },
                    ];
                    const pos = positions[index] || positions[0];
                    return (
                      <div
                        key={pro.id}
                        className="absolute w-8 h-8 rounded-full bg-brand-action flex items-center justify-center text-surface-base text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        style={pos}
                      >
                        {index + 1}
                      </div>
                    );
                  })}

                  <div className="absolute top-4 right-4 bg-surface-overlay border border-border-strong rounded-full px-3 py-1.5 text-sm">
                    <span className="text-brand-action font-bold">{professionals.length}</span>{' '}
                    <span className="text-text-secondary">in area</span>
                  </div>

                  {nearMe && userLocation && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-overlay border border-border-brand rounded-pill px-4 py-2 text-sm flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-brand-action" />
                      <span className="text-text-secondary">Showing results near you</span>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}