import { NextResponse } from 'next/server';
import { rejectApplication, seedDemoApplication } from '@/ai/marketplace';

/**
 * POST /api/v1/admin/marketplace/:id/reject — reject a pro application.
 * demo_seed: true. Track B persists + notifies the pro of the outcome.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  seedDemoApplication();
  const app = rejectApplication(id);
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  return NextResponse.json({ application: app, rejected: true, demo_seed: app.demo_seed });
}

export const dynamic = 'force-dynamic';
