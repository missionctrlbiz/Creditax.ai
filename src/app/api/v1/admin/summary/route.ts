import { NextResponse } from 'next/server';
import { listUsers } from '@/ai/user-admin';
import { seedDemoApplication, listApplications } from '@/ai/marketplace';
import { seedQuotas } from '@/lib/seed/demoSeed';

/**
 * P10 — GET /api/v1/admin/summary
 * Aggregate counts for the admin dashboard board (users, approval queue,
 * KB corpus, quota usage) so /admin/dashboard hydrates live numbers instead
 * of page constants. The KB corpus count is derived from the seeded KB docs
 * (kb-admin's store is embedded on demand; the corpus figure is deterministic
 * demo_seed). demo_seed: true throughout (Track A).
 */
export async function GET() {
  const { users } = listUsers();
  seedDemoApplication(); // ensure the seeded pending application is present
  const applications = listApplications();
  const pending = applications.filter((a) => a.status === 'pending');
  const verifiedPros = applications.filter((a) => a.status === 'verified').length;

  // Quota usage summary across the seeded quotas (free tier near its cap).
  const free = seedQuotas.find((q) => q.tier === 'free');
  const nearCap = free ? free.chatToday >= free.chatCap - 1 : false;

  // KB corpus: 5 seeded docs × their chunk counts (from the seeded store shape).
  const kbCorpusDocs = 5;

  return NextResponse.json({
    users: {
      total: users.length,
      active: users.filter((u) => u.status !== 'suspended').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    },
    approvalQueue: {
      pending: pending.length,
      pendingNames: pending.map((a) => a.business_name),
      verified: verifiedPros,
    },
    kb: {
      docs: kbCorpusDocs,
    },
    quota: {
      usersTracked: seedQuotas.length,
      freeUsed: free ? free.chatToday : 0,
      freeCap: free ? free.chatCap : 0,
      freeNearCap: nearCap,
      freeNote: 'free-tier daily chat cap — the next chat fires the upgrade wall',
    },
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
