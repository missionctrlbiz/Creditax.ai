import { NextResponse } from 'next/server';

/**
 * P11 — GET /api/v1/status
 *
 * Demo scope 10 (mvp-demo-plan): the status page is ALL-GREEN. This route is
 * the single source the /status page fetches (fetched, not hardcoded). Track A
 * honesty: every service is operational, demo_seed: true. Track B backs this
 * with real uptime + incident data.
 */
export async function GET() {
  const allGreen = (base: number): number[] =>
    Array.from({ length: 10 }, (_, i) => Math.min(100, base + (i % 3) * 0.01 + 0.01));
  return NextResponse.json({
    overall: 'operational',
    services: [
      {
        name: 'API Server',
        status: 'operational',
        uptime: '99.99%',
        detail: 'Median response 260ms across the tax-calculation endpoint.',
        history: allGreen(99.98),
      },
      {
        name: 'RAG Chat Engine',
        status: 'operational',
        uptime: '99.96%',
        detail: 'Grounded answers from the tax corpus, cited on every response.',
        history: allGreen(99.95),
      },
      {
        name: 'Document Processing',
        status: 'operational',
        uptime: '99.94%',
        detail: 'Receipt / invoice extraction pipeline healthy.',
        history: allGreen(99.9),
      },
      {
        name: 'Auth System',
        status: 'operational',
        uptime: '100%',
        detail: 'Direct-email sign-in and portal role routing healthy.',
        history: allGreen(100),
      },
      {
        name: 'Marketplace API',
        status: 'operational',
        uptime: '99.98%',
        detail: 'Professional listings and verification statuses live.',
        history: allGreen(99.97),
      },
    ],
    incidents: [
      {
        title: 'RAG Chat Intermittent Timeouts',
        status: 'resolved',
        kind: 'success',
        date: 'June 3, 2025 · 09:10 UTC',
        duration: '23 minutes',
        note: 'Vector search timeouts on one region. Resolved by shifting query routing.',
      },
    ],
    updated: new Date().toISOString(),
    demo_seed: true,
  });
}

export const dynamic = 'force-dynamic';
