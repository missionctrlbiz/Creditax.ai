import { NextResponse, type NextRequest } from 'next/server';
import { meter, type MeteredAction, type Tier } from '@/ai/quota';

const VALID_ACTIONS: MeteredAction[] = ['chat', 'tax-calc', 'upload', 'report', 'credit-refresh', 'bvns', 'tin-cac', 'api'];
const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P4 F-11 — POST /api/v1/quota/meter — server-side credit enforcement.
 *
 * Query: ?action=chat[&userId=&tier=]
 * Returns allowed:true + fresh counters, or 403 + `reason` + `upgrade`
 * hint when a cap is hit — that 403 is the upgrade wall (F-12).
 *
 * Track A: in-memory, demo_seed: true. Track B = PocketBase `quotas`
 * with a daily WAT reset + Supabase-side enforcement.
 */
export async function POST(req: NextRequest) {
  const url = req.nextUrl;
  const action = (url.searchParams.get('action') ?? '') as MeteredAction;
  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
  }
  const userId = url.searchParams.get('userId') ?? 'u-consumer';
  const tierParam = url.searchParams.get('tier') as Tier | null;
  const tier = tierParam && VALID_TIERS.includes(tierParam) ? tierParam : undefined;

  const out = meter(userId, action, { tier });
  if (!out.allowed) {
    return NextResponse.json(
      { allowed: false, reason: out.reason, upgrade: out.status.upgradeHint, status: out.status, demo_seed: true, error: out.reason },
      { status: 403 }
    );
  }
  return NextResponse.json(out, { status: 200 });
}

export const dynamic = 'force-dynamic';
