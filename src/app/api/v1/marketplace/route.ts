import { NextRequest, NextResponse } from 'next/server';

export interface TaxProfessional {
  id: string;
  slug: string;
  businessName: string;
  description: string;
  services: string[];
  priceMin: number;
  priceMax: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
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

interface TaxProfessionalWithDistance extends TaxProfessional {
  distance: number;
}

type TaxProfessionalResponse = Omit<TaxProfessional, 'lat' | 'lng' | 'phone' | 'email' | 'whatsapp' | 'website'> & {
  priceDisplay: string;
  distanceDisplay?: string;
};

const mockProfessionals: TaxProfessional[] = [
  {
    id: '1',
    slug: 'akinwale-associates',
    businessName: 'Akinwale & Associates',
    description: 'Professional tax services for individuals and businesses. Specializing in VAT, income tax, and FIRS compliance. Former FIRS officer with 8+ years of experience.',
    services: ['Personal Income Tax', 'Business Tax', 'VAT Filing', 'Audit Support'],
    priceMin: 50000,
    priceMax: 500000,
    city: 'Lagos',
    state: 'Lagos',
    lat: 6.4541,
    lng: 3.3947,
    phone: '08012345678',
    email: 'akin@taxpro.com',
    whatsapp: '08012345678',
    website: 'www.akinwaletax.com',
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    cacVerified: true,
    firsRegistered: true,
    memberSince: '2022',
  },
  {
    id: '2',
    slug: 'green-tax-solutions',
    businessName: 'Green Tax Solutions',
    description: 'Eco-conscious tax firm focused on sustainability and compliance. We help SMEs navigate Nigerian tax laws while optimizing for efficiency.',
    services: ['Business Tax', 'VAT Filing', 'Tax Planning'],
    priceMin: 35000,
    priceMax: 300000,
    city: 'Abuja',
    state: 'FCT',
    lat: 9.0579,
    lng: 7.4951,
    phone: '08098765432',
    email: 'info@greentax.ng',
    whatsapp: '08098765432',
    website: 'www.greentax.ng',
    rating: 4.6,
    reviewCount: 89,
    verified: true,
    cacVerified: true,
    firsRegistered: true,
    memberSince: '2021',
  },
  {
    id: '3',
    slug: 'precision-accountants',
    businessName: 'Precision Accountants & Tax Consultants',
    description: 'Meticulous tax preparation and filing services. Our team of chartered accountants ensures accuracy and compliance for every client.',
    services: ['Personal Income Tax', 'Business Tax', 'Audit Support', 'Bookkeeping'],
    priceMin: 25000,
    priceMax: 750000,
    city: 'Lagos',
    state: 'Lagos',
    lat: 6.4698,
    lng: 3.5852,
    phone: '08055555555',
    email: 'contact@precisionacct.com',
    whatsapp: '08055555555',
    website: 'www.precisionaccountants.ng',
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    cacVerified: true,
    firsRegistered: true,
    memberSince: '2020',
  },
  {
    id: '4',
    slug: 'nigerian-tax-hub',
    businessName: 'Nigerian Tax Hub',
    description: 'Your one-stop shop for all tax-related matters. From startups to established businesses, we provide comprehensive tax solutions.',
    services: ['Business Registration', 'Tax Filing', 'VAT Returns', 'WHT Processing'],
    priceMin: 15000,
    priceMax: 250000,
    city: 'Port Harcourt',
    state: 'Rivers',
    lat: 4.7774,
    lng: 7.0134,
    phone: '08022222222',
    email: 'hello@nigeriantaxhub.com',
    whatsapp: '08022222222',
    website: 'www.nigeriantaxhub.com',
    rating: 4.5,
    reviewCount: 67,
    verified: true,
    cacVerified: true,
    firsRegistered: false,
    memberSince: '2023',
  },
  {
    id: '5',
    slug: 'eagle-eye-tax-services',
    businessName: 'Eagle Eye Tax Services',
    description: 'Former Lagos State Internal Revenue Service inspector providing expert tax advisory and representation. Deep expertise in state and federal taxes.',
    services: ['Personal Income Tax', 'Business Tax', 'State Tax', 'Tax Dispute Resolution'],
    priceMin: 75000,
    priceMax: 1000000,
    city: 'Lagos',
    state: 'Lagos',
    lat: 6.5244,
    lng: 3.3792,
    phone: '08033333333',
    email: 'eyetax@eagleeyeng.com',
    whatsapp: '08033333333',
    website: 'www.eagleeyetax.com',
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    cacVerified: true,
    firsRegistered: true,
    memberSince: '2019',
  },
  {
    id: '6',
    slug: 'first-city-tax-advisors',
    businessName: 'First City Tax Advisors',
    description: 'Serving clients across Nigeria with expertise in corporate tax, transfer pricing, and international tax matters. Ideal for multinational subsidiaries.',
    services: ['Corporate Tax', 'Transfer Pricing', 'International Tax', 'Audit Support'],
    priceMin: 150000,
    priceMax: 5000000,
    city: 'Lagos',
    state: 'Lagos',
    lat: 6.4281,
    lng: 3.4219,
    phone: '08044444444',
    email: 'advisory@firstcitytax.com',
    whatsapp: '08044444444',
    website: 'www.firstcitytaxadvisors.com',
    rating: 4.8,
    reviewCount: 91,
    verified: true,
    cacVerified: true,
    firsRegistered: true,
    memberSince: '2018',
  },
  {
    id: '7',
    slug: 'swift-tax-ibadan',
    businessName: 'Swift Tax Services',
    description: 'Oyo State\'s trusted tax partner. Fast, reliable tax filing and advisory services for individuals and businesses in the Southwest region.',
    services: ['Personal Income Tax', 'VAT Filing', 'Business Tax'],
    priceMin: 20000,
    priceMax: 150000,
    city: 'Ibadan',
    state: 'Oyo',
    lat: 7.3964,
    lng: 3.9213,
    phone: '08066666666',
    email: 'info@swifttaxibadan.com',
    whatsapp: '08066666666',
    website: '',
    rating: 4.4,
    reviewCount: 45,
    verified: false,
    cacVerified: false,
    firsRegistered: false,
    memberSince: '2024',
  },
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `₦${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `₦${Math.round(price / 1000)}k`;
  }
  return `₦${price}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const service = searchParams.get('service') || '';
    const location = searchParams.get('location') || '';
    const verified = searchParams.get('verified') === 'true';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const nearMe = searchParams.get('nearMe') === 'true';
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let filtered = [...mockProfessionals];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (pro) =>
          pro.businessName.toLowerCase().includes(searchLower) ||
          pro.description.toLowerCase().includes(searchLower) ||
          pro.services.some((s) => s.toLowerCase().includes(searchLower)) ||
          pro.city.toLowerCase().includes(searchLower) ||
          pro.state.toLowerCase().includes(searchLower)
      );
    }

    if (service) {
      const serviceLower = service.toLowerCase();
      filtered = filtered.filter((pro) =>
        pro.services.some((s) => s.toLowerCase().includes(serviceLower))
      );
    }

    if (location) {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter(
        (pro) =>
          pro.city.toLowerCase().includes(locationLower) ||
          pro.state.toLowerCase().includes(locationLower)
      );
    }

    if (verified) {
      filtered = filtered.filter((pro) => pro.verified);
    }

    if (minRating > 0) {
      filtered = filtered.filter((pro) => pro.rating >= minRating);
    }

    if (nearMe && lat && lng) {
      filtered = (filtered as TaxProfessional[])
        .map((pro) => ({
          ...pro,
          distance: calculateDistance(lat, lng, pro.lat, pro.lng),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    const professionals: TaxProfessionalResponse[] = paginated.map((pro) => {
      const p = pro as TaxProfessionalWithDistance;
      return {
        id: pro.id,
        slug: pro.slug,
        businessName: pro.businessName,
        description: pro.description,
        services: pro.services,
        priceMin: pro.priceMin,
        priceMax: pro.priceMax,
        city: pro.city,
        state: pro.state,
        rating: pro.rating,
        reviewCount: pro.reviewCount,
        verified: pro.verified,
        cacVerified: pro.cacVerified,
        firsRegistered: pro.firsRegistered,
        memberSince: pro.memberSince,
        priceDisplay: `From ${formatPrice(pro.priceMin)}`,
        ...(p.distance !== undefined && {
          distanceDisplay: `${p.distance.toFixed(1)}km`,
        }),
      };
    });

    return NextResponse.json({
      professionals,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Marketplace API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}