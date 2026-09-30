import { NextResponse } from 'next/server';
import { approveApplication, seedDemoApplication } from '@/ai/marketplace';

/**
 * POST /api/v1/admin/marketplace/:id/approve — approve a pro application.
 *
 * Flips the application (and the matching seeded pro) to verified.
 * demo_seed: true. Track B persists + notifies the pro.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  seedDemoApplication(); // ensure the seed is present so demo ids resolve
  const app = approveApplication(id);
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  return NextResponse.json({
    application: app,
    verified: true,
    demo_seed: app.demo_seed,
  });
}

export const dynamic = 'force-dynamic';
