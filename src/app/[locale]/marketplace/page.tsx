'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Locate,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CONTACT_TOAST = 'Demo build — contact actions are mocked';
const MAP_TOAST_TITLE = 'Live location search arrives with the full map build';
const MAP_TOAST_BODY = 'This preview uses a static Lagos map — no live location requests yet.';

type Pro = {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  reviews: number;
  distance: string;
  services: string[];
  price: string;
  priceNote: string;
  image: string;
  phone: string;
  email: string;
  featured: boolean;
  pin: { top: string; left: string };
};

const professionals: Pro[] = [
  {
    id: 'adaeze-consulting',
    name: 'Adaeze Consulting Ltd',
    verified: true,
    rating: 4.9,
    reviews: 127,
    distance: '2.3 km',
    services: ['Income Tax', 'VAT', 'Payroll'],
    price: '₦15,000',
    priceNote: 'from · per filing',
    image: '/images/marketplace/pro-team-01.jpg',
    phone: '+234 801 234 5678',
    email: 'hello@adaezeconsulting.ng',
    featured: true,
    pin: { top: '32%', left: '30%' },
  },
  {
    id: 'lagos-tax-partners',
    name: 'Lagos Tax Partners',
    verified: true,
    rating: 4.8,
    reviews: 89,
    distance: '5.1 km',
    services: ['CIT', 'Transfer Pricing', 'Audit'],
    price: '₦45,000',
    priceNote: 'from · per filing',
    image: '/images/marketplace/pro-team-02.jpg',
    phone: '+234 802 555 0143',
    email: 'contact@lagostaxpartners.ng',
    featured: false,
    pin: { top: '55%', left: '58%' },
  },
  {
    id: 'quicktax-nigeria',
    name: 'QuickTax Nigeria',
    verified: true,
    rating: 4.6,
    reviews: 203,
    distance: '1.8 km',
    services: ['VAT', 'PAYE', 'WHT'],
    price: '₦8,000',
    priceNote: 'from · per filing',
    image: '/images/marketplace/pro-team-03.jpg',
    phone: '+234 803 771 9902',
    email: 'support@quicktax.ng',
    featured: false,
    pin: { top: '22%', left: '62%' },
  },
  {
    id: 'emeka-associates',
    name: 'Emeka & Associates',
    verified: true,
    rating: 4.7,
    reviews: 56,
    distance: '8.4 km',
    services: ['CIT', 'Income Tax'],
    price: '₦25,000',
    priceNote: 'from · per filing',
    image: '/images/marketplace/pro-team-04.jpg',
    phone: '+234 805 220 4471',
    email: 'hello@emekaassociates.ng',
    featured: false,
    pin: { top: '68%', left: '26%' },
  },
  {
    id: 'abuja-tax-clinic',
    name: 'Abuja Tax Clinic',
    verified: true,
    rating: 4.5,
    reviews: 41,
    distance: '12.6 km',
    services: ['PAYE', 'WHT', 'Audit'],
    price: '₦12,000',
    priceNote: 'from · per filing',
    image: '/images/marketplace/pro-team-05.jpg',
    phone: '+234 806 100 8823',
    email: 'hello@abujataxclinic.ng',
    featured: false,
    pin: { top: '44%', left: '76%' },
  },
  {
    id: 'island-advisory',
    name: 'Island Advisory Group',
    verified: false,
    rating: 4.3,
    reviews: 18,
    distance: '3.4 km',
    services: ['VAT', 'Bookkeeping'],
    price: '₦6,500',
    priceNote: 'from · per filing',
    image: '/images/marketplace/office-01.jpg',
    phone: '+234 807 664 2209',
    email: 'team@islandadvisory.ng',
    featured: false,
    pin: { top: '80%', left: '52%' },
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

function ContactIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={label}
      className="w-9 h-9 rounded-btn border border-border-strong bg-surface-inset text-text-secondary hover:text-brand-action hover:border-border-brand flex items-center justify-center transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

export default function MarketplacePage() {
  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [activeProId, setActiveProId] = useState<string | null>(professionals[0].id);
  // User feedback: show the pros 4-up in a 2×2 grid and paginate the rest.
  const PROS_PER_PAGE = 4;
  const [proPage, setProPage] = useState(1);

  // P14 — live pro book (real lat/lng from /marketplace/pros). When the store
  // hydrates we place map markers on true coordinates instead of the
  // display list's percentage offsets; the display list is the offline fallback.
  const [livePros, setLivePros] = useState<
    { id: string; name: string; location: { lat: number; lng: number }; verified: boolean }[]
  >([]);

  // P14 — last "near me" result (browser geolocation → Mapbox reverse geocode).
  const [nearMe, setNearMe] = useState<{ lat: number; lng: number; label: string; geo_source: string } | null>(null);
  const [locating, setLocating] = useState(false);
  // P14 — whether the live Mapbox static raster actually loaded (a 401/invalid
  // token must not leave the user staring at a broken image; the static PNG
  // base layer shows through and the "demo" chip stays honest).
  const [mapboxImgOk, setMapboxImgOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    // P14 — hydrate the full pro book (verified + unverified) so every pin
    // gets a real coordinate; the verified-only filter is applied in the view.
    fetch('/api/v1/marketplace/pros')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && Array.isArray(d?.pros) && d.pros.length) setLivePros(d.pros);
      })
      .catch(() => {
        /* offline — keep the static display list */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Bounding box of the coords actually shown — INFLATED so the static map
  // reads as a region, not a tight pin cluster (user feedback: "zoom out the
  // map"). ONE box is shared by the Mapbox raster AND the overlay pin
  // projection so the pins stay exactly aligned with the raster.
  const coordBox = useMemo(() => {
    const withCoords = (livePros.length > 0 ? livePros : []) as { location: { lat: number; lng: number } }[];
    if (withCoords.length === 0) return null;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;
    for (const p of withCoords) {
      minLat = Math.min(minLat, p.location.lat);
      maxLat = Math.max(maxLat, p.location.lat);
      minLng = Math.min(minLng, p.location.lng);
      maxLng = Math.max(maxLng, p.location.lng);
    }
    // At least 1.5° of context (~Lagos region) even for a tight city cluster,
    // and 1.8× the raw span so a mixed Lagos+Abuja result breathes.
    const MIN_SPAN = 1.5;
    const spanLat = Math.max(MIN_SPAN, (maxLat - minLat) * 1.8);
    const spanLng = Math.max(MIN_SPAN, (maxLng - minLng) * 1.8);
    const cLat = (minLat + maxLat) / 2;
    const cLng = (minLng + maxLng) / 2;
    return { minLat: cLat - spanLat / 2, maxLat: cLat + spanLat / 2, minLng: cLng - spanLng / 2, maxLng: cLng + spanLng / 2 };
  }, [livePros]);

  // Project one pro's real coords to an overlay top/left percentage.
  const projectPin = (lat: number, lng: number): { top: string; left: string } => {
    if (!coordBox) return { top: '50%', left: '50%' };
    const top = 100 - ((lat - coordBox.minLat) / (coordBox.maxLat - coordBox.minLat)) * 100;
    const left = ((lng - coordBox.minLng) / (coordBox.maxLng - coordBox.minLng)) * 100;
    return { top: `${Math.max(2, Math.min(98, top)).toFixed(1)}%`, left: `${Math.max(2, Math.min(98, left)).toFixed(1)}%` };
  };

  // P14 — Mapbox Static raster built from the real pro coordinates when the
  // client token is present; otherwise the static Lagos PNG fallback.
  // Overlay uses `pin-s+COLOR(lat,lng)` and size is `WxH` (not `W/H`).
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  const mapSrc = useMemo(() => {
    if (!mapboxToken) return null;
    if (!coordBox) return null;
    const markers = livePros
      .map((p) => `pin-s+0D7377(${p.location.lng.toFixed(5)},${p.location.lat.toFixed(5)})`)
      .join(';');
    // Explicit inflated bbox (same box the pin overlay projects against)
    // instead of `auto`, which hugged the markers — user wanted the map
    // zoomed out to regional/national context.
    const bbox = `${coordBox.minLng.toFixed(4)},${coordBox.minLat.toFixed(4)},${coordBox.maxLng.toFixed(4)},${coordBox.maxLat.toFixed(4)}`;
    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${markers}/${bbox}/800x620?access_token=${encodeURIComponent(
      mapboxToken
    )}`;
  }, [mapboxToken, coordBox, livePros]);

  const serviceOptions = Array.from(
    new Set(professionals.flatMap((pro) => pro.services))
  ).sort();

  const visiblePros = professionals.filter((pro) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      pro.name.toLowerCase().includes(q) ||
      pro.services.some((service) => service.toLowerCase().includes(q));
    const matchesService = !serviceFilter || pro.services.includes(serviceFilter);
    const matchesVerified = !verifiedOnly || pro.verified;
    return matchesQuery && matchesService && matchesVerified;
  });

  // 2×2 pagination — the last pros land on the next page. Page resets live in
  // the filter wrappers below (no setState-in-effect).
  const totalProPages = Math.max(1, Math.ceil(visiblePros.length / PROS_PER_PAGE));
  const safeProPage = Math.min(proPage, totalProPages);
  const pagedPros = visiblePros.slice((safeProPage - 1) * PROS_PER_PAGE, safeProPage * PROS_PER_PAGE);
  const updateQuery = (q: string) => { setQuery(q); setProPage(1); };
  const updateServiceFilter = (s: string | null) => { setServiceFilter(s); setProPage(1); };
  const updateVerifiedOnly = (v: boolean) => { setVerifiedOnly(v); setProPage(1); };

  const activePro = professionals.find((pro) => pro.id === activeProId) ?? null;

  const showContactToast = () => {
    toast(CONTACT_TOAST, {
      description: 'Wiring happens once the marketplace backend ships.',
    });
  };

  // P14 — "Near me": ask the browser for the real location, reverse-geocode
  // it through Mapbox (server), then run the live nearest-pro search from
  // that origin. Every step degrades honestly to the demo toast.
  const locateNearMe = async () => {
    if (!('geolocation' in navigator)) {
      void showMapToast();
      return;
    }
    setLocating(true);
    try {
      const pos = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          (err) => reject(err),
          { timeout: 8000 }
        );
      });

      let label: string | null = null;
      let geoSource = 'demo';
      try {
        const revRes = await fetch(
          `/api/v1/marketplace/reverse?lat=${pos.lat}&lng=${pos.lng}`
        );
        if (revRes.ok) {
          const rev = await revRes.json();
          if (rev?.label) {
            label = rev.label;
            geoSource = rev.geo_source ?? 'demo';
          }
        }
      } catch {
        /* offline reverse-geocode — keep the raw coords */
      }

      setNearMe({ ...pos, label: label ?? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`, geo_source: geoSource });

      // Now find the nearest verified pro from this real origin.
      try {
        const res = await fetch('/api/v1/marketplace/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verifiedOnly: true, lat: pos.lat, lng: pos.lng, radiusKm: 250, topK: 1 }),
        });
        if (res.ok) {
          const d = await res.json();
          const top = d.results?.[0];
          if (top) {
            toast('Near you', {
              description: `Nearest verified pro: ${top.name}${top.distanceKm ? ` · ${top.distanceKm.toFixed(1)} km (${top.location.city})` : ''}.${
                geoSource === 'mapbox' ? '' : ' (demo geo)'
              }`,
              icon: <Locate className="w-4 h-4 text-brand-action" />,
            });
            return;
          }
        }
      } catch {
        /* offline search — keep the geolocation toast */
      }

      toast('Near you', {
        description: label ? `You are near: ${label}` : 'Location locked — no verified pros within radius.',
        icon: <Locate className="w-4 h-4 text-brand-action" />,
      });
    } catch {
      setLocating(false);
      void showMapToast();
    }
  };
  // P14 — the "Search" button fallback. Uses the last "near me" location when
  // one was locked, otherwise the deterministic Lagos-Island demo origin.
  const showMapToast = async () => {
    const origin = nearMe ? { lat: nearMe.lat, lng: nearMe.lng } : { lat: 6.4281, lng: 3.4214 };
    const source = nearMe ? nearMe.geo_source : 'demo';
    try {
      const res = await fetch('/api/v1/marketplace/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verifiedOnly: true,
          lat: origin.lat,
          lng: origin.lng,
          radiusKm: 250,
          topK: 1,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        const top = d.results?.[0];
        if (top) {
          toast('Near you', {
            description: `Nearest verified pro: ${top.name}${top.distanceKm ? ` · ${top.distanceKm.toFixed(1)} km (${top.location.city})` : ''}.${
              source === 'mapbox' ? '' : ' (demo geo)'
            }`,
            icon: <Locate className="w-4 h-4 text-brand-action" />,
          });
          return;
        }
      }
    } catch {
      /* offline — fall through to the demo toast */
    }
    toast(MAP_TOAST_TITLE, {
      description: source === 'mapbox' ? 'Live location locked — no pros within radius.' : MAP_TOAST_BODY,
      icon: <Locate className="w-4 h-4 text-brand-action" />,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-base">
      <Header />

      <main className="flex-1">
        {/* ── Page header + search ── */}
        <section className="border-b border-border-subtle">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-10 pb-6">
            <p className="text-brand-primary font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
              Marketplace
            </p>
            <h1 className="mb-3">Find a tax professional you can trust</h1>
            <p className="text-text-secondary max-w-[640px]">
              CAC-registered and Creditax-verified pros across Nigeria. Compare services,
              ratings, and starting prices before you make contact.
            </p>

            <div className="mt-7 flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  placeholder="Search by firm name or service — VAT, PAYE, audit..."
                  aria-label="Search tax professionals"
                  className="w-full h-12 pl-12 pr-4 rounded-input bg-surface-raised border border-border-strong text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all"
                />
              </div>
              <div className="relative sm:w-[220px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-action pointer-events-none" />
                <select
                  aria-label="Filter by location"
                  defaultValue="lagos"
                  className="w-full h-12 pl-11 pr-10 rounded-input bg-surface-raised border border-border-strong text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-brand-primary transition-all cursor-pointer"
                >
                  <option value="lagos">Lagos, Nigeria</option>
                  <option value="abuja">Abuja, Nigeria</option>
                  <option value="ph">Port Harcourt, Nigeria</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={showMapToast}
                className="h-12 px-6 rounded-input bg-brand-primary text-text-inverse font-semibold shadow-btn-brand hover:brightness-110 active:brightness-90 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ── Filter row ── */}
        <section className="border-b border-border-subtle sticky top-16 z-30 bg-surface-base/90 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-3 flex flex-wrap items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-text-muted">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {serviceOptions.map((service) => {
                const active = serviceFilter === service;
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => updateServiceFilter(active ? null : service)}
                    aria-pressed={active}
                    className={`px-3.5 py-1.5 rounded-pill border text-[13px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-brand-action-bg border-brand-action-border text-brand-action'
                        : 'bg-surface-overlay border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary'
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => updateVerifiedOnly(!verifiedOnly)}
              aria-pressed={verifiedOnly}
              className={`ml-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill border text-[13px] font-medium transition-colors cursor-pointer ${
                verifiedOnly
                  ? 'bg-success-bg border-success-border text-success-text'
                  : 'bg-surface-overlay border-border-strong text-text-secondary hover:border-border-brand hover:text-text-primary'
              }`}
            >
              {verifiedOnly ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              Verified only
            </button>

            <span className="text-[13px] text-text-muted font-mono tabular-nums">
              {visiblePros.length} of {professionals.length} pros
            </span>
          </div>
        </section>

        {/* ── Split view: map (left) + pro list (right) ── */}
        <section className="py-6">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Map panel — live Mapbox static raster when the client token +
                  real pro coords are present; static Lagos PNG fallback. */}
              <div className="lg:w-[42%] lg:sticky lg:top-[124px] self-start">
                <Card className="relative overflow-hidden bg-surface-raised border-border-default p-0">
                  <div className="relative h-[380px] sm:h-[440px] lg:h-[620px]">
                    {/* Base layer: guaranteed static Lagos raster. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/marketplace/map-lagos.png"
                      alt="Map of Lagos showing the locations of listed tax professionals"
                      width={1280}
                      height={716}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay: live Mapbox static raster with real pro
                        coordinates. Rendered on top of the base layer and
                        self-hides on load error (e.g. 401/invalid token), so
                        the guaranteed PNG always shows through. */}
                    {mapSrc && mapboxImgOk !== false && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={mapSrc}
                        alt=""
                        width={800}
                        height={620}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onLoad={() => setMapboxImgOk(true)}
                        onError={() => setMapboxImgOk(false)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />

                    {/* Top row: count chip + near me */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-overlay border border-border-strong px-3 py-1.5 text-[12px] text-text-secondary backdrop-blur-sm">
                        <MapPin className="w-3.5 h-3.5 text-brand-action" />
                        {nearMe
                          ? `${visiblePros.length} verified pros near ${nearMe.label}`
                          : `${visiblePros.length} verified pros near Lagos Island`}
                        {(!mapSrc || mapboxImgOk !== true) && (
                          <span className="ml-1 font-mono text-[10px] text-text-muted">demo</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={locateNearMe}
                        disabled={locating}
                        title={locating ? 'Locating…' : 'Use my location'}
                        aria-label={locating ? 'Locating…' : 'Use my location'}
                        className="inline-flex items-center gap-1.5 rounded-pill bg-surface-overlay/90 border border-border-strong px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary hover:border-border-brand backdrop-blur-sm transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/icons/icon-near-me.png"
                          alt=""
                          width={15}
                          height={15}
                          className="w-[15px] h-[15px] object-contain"
                        />
                        {locating ? 'Locating…' : 'Near me'}
                      </button>
                    </div>

                    {/* Pins — projected from real lat/lng when the live book
                        has hydrated, otherwise the display-list percentages. */}
                    {professionals.map((pro) => {
                      const isActive = activeProId === pro.id;
                      const isVisible = visiblePros.some((p) => p.id === pro.id);
                      const liveCoord = livePros.find((p) => p.id === pro.id);
                      const pin = liveCoord?.location
                        ? projectPin(liveCoord.location.lat, liveCoord.location.lng)
                        : { top: pro.pin.top, left: pro.pin.left };
                      return (
                        <button
                          key={pro.id}
                          type="button"
                          title={`${pro.name} — ${pro.services.join(', ')}`}
                          aria-label={`Show ${pro.name} on the map`}
                          aria-pressed={isActive}
                          onClick={() => setActiveProId(pro.id)}
                          style={{ top: pin.top, left: pin.left }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'w-9 h-9 bg-brand-action border-white/70 shadow-modal z-10'
                              : 'w-7 h-7 bg-surface-overlay border-border-strong hover:border-brand-action z-0'
                          } ${isVisible ? 'opacity-100' : 'opacity-40'}`}
                        >
                          {pro.verified ? (
                            <ShieldCheck
                              className={`w-4 h-4 ${isActive ? 'text-text-inverse' : 'text-brand-action'}`}
                            />
                          ) : (
                            <MapPin
                              className={`w-4 h-4 ${isActive ? 'text-text-inverse' : 'text-text-muted'}`}
                            />
                          )}
                          {isActive && (
                            <span className="absolute inset-0 rounded-full border-2 border-brand-action/60 animate-ping pointer-events-none" />
                          )}
                        </button>
                      );
                    })}

                    {/* Selected pro callout */}
                    {activePro && (
                      <div className="absolute bottom-14 left-4 right-4 rounded-card border border-border-brand bg-surface-overlay/95 backdrop-blur-sm p-3.5 shadow-modal flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activePro.image}
                          alt=""
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-border-strong"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-text-primary truncate">
                            {activePro.name}
                          </p>
                          <p className="text-[11px] text-text-muted flex items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                              <Star className="w-3 h-3 text-warning fill-current" />
                              <span className="font-mono tabular-nums">{activePro.rating}</span>
                            </span>
                            <span className="font-mono tabular-nums">{activePro.distance}</span>
                            <span className="font-mono tabular-nums text-brand-action">
                              {activePro.price}
                            </span>
                          </p>
                        </div>
                        <Link
                          href={`/marketplace/${activePro.id}`}
                          className="text-[12px] font-semibold text-brand-action hover:underline shrink-0"
                        >
                          View
                        </Link>
                      </div>
                    )}

                    {/* Bottom disclaimer */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-overlay/90 border border-border-subtle px-3 py-1.5 text-[11px] text-text-muted backdrop-blur-sm">
                        <MapPin className="w-3 h-3" />
                        Static demo map — pins are illustrative
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Pro list */}
              <div className="flex-1 min-w-0">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 className="mb-1">Verified professionals</h2>
                    <p className="text-[13px] text-text-muted">
                      Contact details unlock after you sign in — until then, every contact
                      action is demo-only.
                    </p>
                  </div>
                </div>

                {visiblePros.length === 0 ? (
                  <Card className="p-10 text-center border-dashed">
                    <div className="mx-auto w-12 h-12 rounded-full bg-surface-inset flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-text-muted" />
                    </div>
                    <h3 className="mb-1">No professionals match those filters</h3>
                    <p className="text-sm text-text-muted mb-5">
                      Try a broader service or turn off “Verified only”.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        updateQuery('');
                        updateServiceFilter(null);
                        updateVerifiedOnly(false);
                      }}
                      className="h-10 px-5 rounded-btn text-sm font-semibold bg-brand-primary text-text-inverse shadow-btn-brand hover:brightness-110 transition-all cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </Card>
                ) : (
                  <motion.div
                    key={`${serviceFilter ?? 'all'}-${verifiedOnly}-${query}`}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {pagedPros.map((pro) => (
                      <motion.article
                        key={pro.id}
                        variants={fadeInUp}
                        onMouseEnter={() => setActiveProId(pro.id)}
                        className="group relative"
                      >
                        <Card
                          className={`h-full p-5 flex flex-col transition-colors ${
                            activeProId === pro.id
                              ? 'border-border-brand'
                              : 'hover:border-border-brand'
                          }`}
                        >
                          <Link
                            href={`/marketplace/${pro.id}`}
                            className="absolute inset-0 z-10"
                            aria-label={`View profile: ${pro.name}`}
                          />

                          <div className="flex items-start gap-3.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pro.image}
                              alt=""
                              width={56}
                              height={56}
                              loading="lazy"
                              className="w-14 h-14 rounded-full object-cover border border-border-strong shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate group-hover:text-brand-action transition-colors">
                                {pro.name}
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-muted">
                                <span className="inline-flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-warning fill-current" />
                                  <span className="font-mono tabular-nums text-text-secondary">
                                    {pro.rating}
                                  </span>
                                  ({pro.reviews})
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="font-mono tabular-nums">
                                    {pro.distance}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {pro.verified ? (
                            <div className="mt-3 self-start flex flex-wrap gap-1.5">
                              <Badge variant="success">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                              </Badge>
                              {/* pricing §2 priority placement (was the dead `featured` flag) */}
                              {pro.featured && (
                                <Badge variant="brand">
                                  <ArrowUpRight className="w-3 h-3" />
                                  Priority
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <Badge variant="warning" className="mt-3 self-start">
                              Unverified
                            </Badge>
                          )}

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {pro.services.map((service) => (
                              <span
                                key={service}
                                className="px-2 py-0.5 rounded-badge border border-border-subtle bg-surface-inset text-[11px] font-medium text-text-secondary"
                              >
                                {service}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-border-subtle flex flex-wrap items-end justify-between gap-3">
                            <div>
                              <p className="price-figure text-[15px] text-brand-action">
                                {pro.price.startsWith('₦') ? (
                                  <>
                                    <span className="naira">₦</span>
                                    {pro.price.slice(1)}
                                  </>
                                ) : (
                                  pro.price
                                )}
                              </p>
                              <p className="text-[11px] text-text-muted">{pro.priceNote}</p>
                            </div>
                            <div className="relative z-20 flex items-center gap-2">
                              <ContactIconButton
                                label={`Call ${pro.name} (demo)`}
                                onClick={showContactToast}
                              >
                                <Phone className="w-4 h-4" />
                              </ContactIconButton>
                              <ContactIconButton
                                label={`Email ${pro.name} (demo)`}
                                onClick={showContactToast}
                              >
                                <Mail className="w-4 h-4" />
                              </ContactIconButton>
                              <ContactIconButton
                                label={`Message ${pro.name} (demo)`}
                                onClick={showContactToast}
                              >
                                <MessageCircle className="w-4 h-4" />
                              </ContactIconButton>
                            </div>
                          </div>
                        </Card>
                      </motion.article>
                    ))}
                  </motion.div>
                )}

                {/* 2×2 pagination — the last pros land on the next page */}
                {totalProPages > 1 && (
                  <div className="flex items-center justify-between gap-3 mt-5">
                    <p className="text-[12px] text-text-muted">
                      Page {safeProPage} of {totalProPages} · {visiblePros.length} pros
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Previous page"
                        disabled={safeProPage <= 1}
                        onClick={() => setProPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft size={14} /> Prev
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        aria-label="Next page"
                        disabled={safeProPage >= totalProPages}
                        onClick={() => setProPage((p) => Math.min(totalProPages, p + 1))}
                      >
                        Next <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
