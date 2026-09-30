import { NextResponse } from 'next/server';
import { seedProfessionals } from '@/lib/seed/demoSeed';
import { maskPhone, maskEmail } from '@/ai/contact-gate';

/**
 * GET /api/v1/marketplace/:slug — a single pro's public profile.
 *
 * Contacts ship MASKED (contact-gate rules): this is a public endpoint, so
 * raw phone/email/WhatsApp would bypass the tier-gated reveal that the
 * /marketplace/[proId] UI enforces. Track B reads the `professionals`
 * collection and applies per-tier reveal server-side.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pro = seedProfessionals.find((p) => p.slug === slug);
  if (!pro) {
    return NextResponse.json({ error: `Professional "${slug}" not found` }, { status: 404 });
  }
  return NextResponse.json({
    pro: {
      id: pro.id,
      slug: pro.slug,
      name: pro.name,
      services: pro.services,
      location: pro.location,
      rating: pro.rating,
      reviewCount: pro.reviewCount,
      verified: pro.verified,
      contact: {
        phone: maskPhone(pro.phone),
        email: maskEmail(pro.email),
        whatsapp: pro.whatsapp ? maskPhone(pro.whatsapp) : null,
        masked: true,
      },
    },
    demo_seed: pro.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
