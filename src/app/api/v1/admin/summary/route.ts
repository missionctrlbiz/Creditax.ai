import { NextResponse } from 'next/server';
import { listUsers } from '@/ai/user-admin';
import { seedDemoApplication, listApplications } from '@/ai/marketplace';
import { seedQuotas } from '@/lib/seed/demoSeed';
import { getVectorStore } from '@/ai/rag/vector-store';
import { quotaStatus } from '@/ai/quota';

/**
 * P10 — GET /api/v1/admin/summary
 * Aggregate counts for the admin dashboard board (users, approval queue,
 * KB corpus, quota usage) so /admin/dashboard hydrates live numbers instead
 * of page constants. P19: the KB corpus figure now reads the LIVE vector
 * store (it used to be a hardcoded 5 — admin numbers drifted the moment KB
 * publish added a doc), and quota figures read the live quota store rather
 * than the seed array. demo_seed: true throughout (Track A).
 */
export async function GET() {
  const { users } = listUsers();
  seedDemoApplication(); // ensure the seeded pending application is present
  const applications = listApplications();
  const pending = applications.filter((a) => a.status === 'pending');
  const verifiedPros = applications.filter((a) => a.status === 'verified').length;

  // Quota usage from the LIVE store (u-consumer is the free-tier demo user).
  const freeStatus = quotaStatus('u-consumer');
  const nearCap = freeStatus.chats.cap !== -1 && freeStatus.chats.today >= freeStatus.chats.cap - 1;

  // KB corpus: live document count from the active vector store (admin KB
  // publishes land here instantly); fall back to the seed count offline.
  let kbCorpusDocs = 5;
  try {
    const store = await getVectorStore();
    kbCorpusDocs = (await store.listDocuments()).length;
  } catch {
    // offline — keep the deterministic seed figure
  }

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
      freeUsed: freeStatus.chats.today,
      freeCap: freeStatus.chats.cap,
      freeNearCap: nearCap,
      freeNote: 'free-tier daily chat cap — the next chat fires the upgrade wall',
    },
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
