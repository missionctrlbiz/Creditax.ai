import { NextResponse, type NextRequest } from 'next/server';
import { submitApplication, type ProApplication } from '@/ai/marketplace';

/**
 * POST /api/v1/pro/apply — submit a tax-pro application (Track A demo).
 *
 * Body: { businessName, ownerName?, cacNumber, services?, city?, state? }
 *
 * CAC "verification" is simulated (format check) and tagged `cac_lookup:
 * "demo"`. Track B calls Mono CAC lookup + stores the uploaded certificate and
 * moves the application to the admin queue. The returned application is the
 * seed the admin approval queue (below) reads.
 */
export async function POST(req: NextRequest) {
  let body: {
    businessName?: string;
    ownerName?: string;
    cacNumber?: string;
    services?: string[];
    city?: string;
    state?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.businessName?.trim() || !body.cacNumber?.trim()) {
    return NextResponse.json(
      { error: '`businessName` and `cacNumber` are required' },
      { status: 400 }
    );
  }
  const app: ProApplication = submitApplication({
    businessName: body.businessName,
    ownerName: body.ownerName,
    cacNumber: body.cacNumber,
    services: body.services,
    city: body.city,
    state: body.state,
  });
  return NextResponse.json({
    application: app,
    status: app.status,
    cac_lookup: app.cac_lookup,
    note: 'Demo: CAC lookup simulated. An admin review will flip this pro to verified.',
    demo_seed: app.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
