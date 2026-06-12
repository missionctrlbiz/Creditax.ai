'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Clock,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Share2,
  Bookmark,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface TaxProfessional {
  id: string;
  slug: string;
  businessName: string;
  description: string;
  services: string[];
  priceMin: number;
  priceMax: number;
  city: string;
  state: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  cacVerified: boolean;
  firsRegistered: boolean;
  memberSince: string;
}

interface Service {
  name: string;
  turnaround: string;
  price: string;
}

const mockReviews = [
  {
    name: 'Chinedu A.',
    location: 'Lagos',
    rating: 5,
    date: '2 weeks ago',
    text: 'Akinwale made my tax filing so easy. Professional service and very responsive to questions.',
  },
  {
    name: 'Blessing O.',
    location: 'Abuja',
    rating: 5,
    date: '1 month ago',
    text: 'Exceptional expertise in VAT filing. Helped me recover significant overpayments.',
  },
  {
    name: 'Emeka N.',
    location: 'Port Harcourt',
    rating: 4,
    date: '2 months ago',
    text: 'Great service overall. Quick turnaround and very thorough with the documentation.',
  },
];

export default function ProProfilePage() {
  const params = useParams();
  const proId = params.proId as string;
  const [professional, setProfessional] = useState<TaxProfessional | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const res = await fetch(`/api/v1/marketplace?search=${proId}`);
        const data = await res.json();
        if (data.professionals?.length > 0) {
          const pro = data.professionals.find(
            (p: TaxProfessional) => p.slug === proId || p.id === proId
          );
          setProfessional(pro || data.professionals[0]);
        }
      } catch (error) {
        console.error('Failed to fetch professional:', error);
      } finally {
        setLoading(false);
      }
    };

    if (proId) {
      fetchProfessional();
    }
  }, [proId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: professional?.businessName,
          url,
        });
      } catch (err) {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatPrice = (price: number): string => {
    return `₦${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-base">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-action border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-base">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-text-primary">Professional Not Found</h1>
          <p className="text-text-secondary">The tax professional you&apos;re looking for doesn&apos;t exist.</p>
          <Button variant="brand" onClick={() => (window.location.href = '/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const services: Service[] = [
    { name: 'Personal Income Tax', turnaround: '3 days', price: formatPrice(professional.priceMin) },
    { name: 'Business Tax Filing', turnaround: '5 days', price: formatPrice(Math.round(professional.priceMin * 3)) },
    { name: 'VAT Return', turnaround: '2 days', price: formatPrice(Math.round(professional.priceMin * 1.5)) },
    { name: 'Tax Audit Support', turnaround: '7 days', price: formatPrice(professional.priceMax) },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1 pb-24">
        <section className="bg-[var(--color-surface-deep)] py-8 px-6 border-b border-border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => (window.location.href = '/marketplace')}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-brand-action-bg border-2 border-brand-action flex items-center justify-center text-brand-action text-2xl font-bold flex-shrink-0">
                {professional.businessName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                      {professional.businessName}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {professional.cacVerified && (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          CAC Verified
                        </Badge>
                      )}
                      {professional.firsRegistered && (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          FIRS Registered
                        </Badge>
                      )}
                      <Badge variant="brand" className="text-xs">
                        Member since {professional.memberSince}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-brand-action" />
                        {professional.city}, {professional.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[var(--color-warning)] fill-current" />
                        {professional.rating} ({professional.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-surface-overlay border border-border-strong text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 rounded-full border transition-colors ${
                        isBookmarked
                          ? 'bg-brand-action-bg border-brand-action text-brand-action'
                          : 'bg-surface-overlay border-border-strong text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">Location</h2>
                  <div className="bg-surface-deep rounded-card h-48 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-5xl mb-2">📍</div>
                      <p className="text-text-muted text-sm">{professional.city}, {professional.state}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">About</h2>
                  <p
                    className={`text-text-secondary text-sm leading-relaxed ${
                      !showFullAbout && 'line-clamp-6'
                    }`}
                  >
                    {professional.description}
                  </p>
                  {professional.description.length > 200 && (
                    <button
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="mt-2 text-brand-action text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      {showFullAbout ? (
                        <>
                          Show less
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Read more
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Services & Pricing
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-subtle">
                          <th className="text-left text-text-muted text-xs font-semibold uppercase tracking-wider pb-3">
                            Service
                          </th>
                          <th className="text-left text-text-muted text-xs font-semibold uppercase tracking-wider pb-3">
                            Turnaround
                          </th>
                          <th className="text-right text-text-muted text-xs font-semibold uppercase tracking-wider pb-3">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service, index) => (
                          <tr
                            key={index}
                            className="border-b border-border-subtle last:border-0"
                          >
                            <td className="py-4 text-text-primary font-medium text-sm">
                              {service.name}
                            </td>
                            <td className="py-4 text-text-muted text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.turnaround}
                            </td>
                            <td className="py-4 text-brand-action font-semibold text-sm text-right">
                              {service.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Reviews ({professional.reviewCount})
                  </h2>
                  <div className="space-y-4">
                    {mockReviews.map((review, index) => (
                      <div
                        key={index}
                        className="pb-4 border-b border-border-subtle last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary-bg flex items-center justify-center text-brand-primary font-bold text-sm">
                              {review.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <p className="text-text-primary font-medium text-sm">
                                {review.name}
                              </p>
                              <p className="text-text-muted text-xs">{review.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-[var(--color-warning)] fill-current'
                                    : 'text-text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm">{review.text}</p>
                        <p className="text-text-muted text-xs mt-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Contact</h3>
                  <div className="space-y-3">
                    <a href={`tel:${professional.phone}`}>
                      <Button variant="secondary" size="md" fullWidth>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </a>
                    <a href={`mailto:${professional.email}`}>
                      <Button variant="secondary" size="md" fullWidth>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                    </a>
                    <a
                      href={`https://wa.me/${professional.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="md" fullWidth>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>
                    {professional.website && (
                      <a
                        href={professional.website.startsWith('http') ? professional.website : `https://${professional.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="md" fullWidth>
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </a>
                    )}
                  </div>
                </Card>

                <Card className="p-6 bg-surface-deep">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Why Choose {professional.businessName.split(' ')[0]}?
                  </h3>
                  <div className="space-y-4">
                    {professional.cacVerified && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-brand-action" />
                        </div>
                        <div>
                          <p className="text-text-primary text-sm font-medium">CAC Registered</p>
                          <p className="text-text-muted text-xs">Officially registered business</p>
                        </div>
                      </div>
                    )}
                    {professional.firsRegistered && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-brand-action" />
                        </div>
                        <div>
                          <p className="text-text-primary text-sm font-medium">FIRS Registered</p>
                          <p className="text-text-muted text-xs">Authorized tax practitioner</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-action-bg flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-brand-action" />
                      </div>
                      <div>
                        <p className="text-text-primary text-sm font-medium">
                          {professional.rating} Rating
                        </p>
                        <p className="text-text-muted text-xs">
                          {professional.reviewCount} verified reviews
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-surface-overlay border-t border-border-strong p-4 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-text-primary font-semibold">{professional.businessName}</p>
            <p className="text-brand-action text-sm">
              From {formatPrice(professional.priceMin)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="lg">
              Request Consultation
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}