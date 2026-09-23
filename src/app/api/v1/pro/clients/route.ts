import { NextResponse, type NextRequest } from 'next/server';
import { listProClients, getProClient } from '@/ai/pro-portal';

/**
 * P9 — Pro client book (seeded, demo_seed: true).
 *   GET /api/v1/pro/clients?proId=u-pro
 *   GET /api/v1/pro/clients/[id]   (handled below by ?id=)
 */
export async function GET(req: NextRequest) {
  const proId = req.nextUrl.searchParams.get('proId') ?? 'u-pro';
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const client = getProClient(id, proId);
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    return NextResponse.json(client);
  }
  return NextResponse.json({ proId, clients: listProClients(proId), demo_seed: true });
}

export const dynamic = 'force-dynamic';
