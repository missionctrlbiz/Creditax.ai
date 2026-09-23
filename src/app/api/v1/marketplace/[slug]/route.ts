import { NextResponse } from 'next/server';
import { seedProfessionals } from '@/lib/seed/demoSeed';

/**
 * GET /api/v1/marketplace/:slug — a single pro's public profile.
 *
 * Returns the seeded pro (contact + services + location) or 404. Track A:
 * demo_seed: true. Track B reads the `professionals` collection and only
 * reveals contact fields per tier rules.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pro = seedProfessionals.find((p) => p.slug === slug);
  if (!pro) {
    return NextResponse.json({ error: `Professional "${slug}" not found` }, { status: 404 });
  }
  return NextResponse.json({
    pro: {
      ...pro,
      // Contact reveal is gated by the viewer's tier in Track B; the demo
      // surfaces it for the click-through.
      contact: { phone: pro.phone, email: pro.email, whatsapp: pro.whatsapp ?? null },
    },
    demo_seed: pro.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
