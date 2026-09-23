import { NextResponse, type NextRequest } from 'next/server';
import { connectService, listConnectors, connectorStatus, listServices, promptContext } from '@/ai/connectors';
import type { Tier, ConnectorService } from '@/lib/seed/demoSeed';

const VALID_TIERS: Tier[] = ['free', 'plus', 'professional', 'enterprise'];

/**
 * P6 F-19 — external AI connectors (product-foundation §10).
 *
 *   GET  /api/v1/connectors            connected apps + per-tier cap + context
 *   POST /api/v1/connectors            connect a service (enforces tier cap)
 *
 * Track A: in-memory over seedConnectors, demo_seed: true. Track B = real OAuth
 * + per-app token scoping.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') ?? 'u-consumer';
  const tierParam = req.nextUrl.searchParams.get('tier') as Tier | null;
  const tier = tierParam && VALID_TIERS.includes(tierParam) ? tierParam : 'free';
  return NextResponse.json({
    ...listConnectors(userId),
    status: connectorStatus(userId, tier),
    services: listServices(),
    context: promptContext(userId),
    tier,
    demo_seed: true,
  });
}

export async function POST(req: NextRequest) {
  let body: { userId?: string; service?: ConnectorService; tier?: Tier } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  if (!body.service) return NextResponse.json({ error: '`service` is required' }, { status: 400 });
  const tier = body.tier && VALID_TIERS.includes(body.tier) ? body.tier : 'free';
  const out = connectService({ userId: body.userId, service: body.service, tier });
  if (!out.ok) {
    return NextResponse.json({ ok: false, error: out.reason, used: out.used, cap: out.cap, upgradeTo: out.upgradeTo, demo_seed: true }, { status: 403 });
  }
  return NextResponse.json({ ok: true, connector: out.connector, used: out.used, cap: out.cap, demo_seed: true });
}

export const dynamic = 'force-dynamic';
