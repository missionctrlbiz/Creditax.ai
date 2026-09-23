import { NextResponse } from 'next/server';
import { seedDemoApplication } from '@/ai/marketplace';

/**
 * Admin marketplace approval queue (Track A).
 *
 *   GET /api/v1/admin/marketplace               list pending + decided applications
 *   POST /api/v1/admin/marketplace/:id/approve   approve (flip pro to verified)
 *   POST /api/v1/admin/marketplace/:id/reject    reject
 *
 * demo_seed: true. Track B persists to the `professionals`/application
 * collections and notifies the pro.
 */
export async function GET() {
  const apps = seedDemoApplication();
  return NextResponse.json({
    applications: apps,
    pending: apps.filter((a) => a.status === 'pending').length,
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
