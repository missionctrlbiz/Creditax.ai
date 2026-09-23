/**
 * P1 feature flag + PocketBase health probe.
 *
 * Track A rule (mvp-demo-plan.md §2): the demo must *behave* correctly while
 * *knowing* nothing real. So the app reads from PocketBase when it is reachable,
 * and silently falls back to the inlined demo seed (`src/lib/seed/demoSeed.ts`)
 * when it is not — never blocking the UI on infra, matching the existing
 * waitlist/login_log queue-fallback behaviour in pocketbase.ts.
 *
 * The flag is opt-in so the current mock build stays byte-identical until the
 * flag (and a running PocketBase) are both present:
 *   - NEXT_PUBLIC_USE_POCKETBASE=true   → prefer PocketBase, fall back to seed
 *   - unset/false                      → use the inlined seed directly
 */

const PB_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ||
  process.env.POCKETBASE_URL ||
  'http://127.0.0.1:8090';

/** True only when the founder has explicitly turned Track A data on. */
export function pocketbaseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_POCKETBASE === 'true';
}

export function pocketbaseUrl(): string {
  return PB_URL;
}

let cached: boolean | null = null;

/**
 * Probe PocketBase health. Result is memoised for the life of the client
 * bundle (demo is single-session) so repeated data calls don't re-ping.
 * Server components should call this once and pass the result down.
 */
export async function probePocketBase(): Promise<boolean> {
  if (!pocketbaseEnabled()) {
    cached = false;
    return false;
  }
  if (cached !== null) return cached;
  try {
    const res = await fetch(`${PB_URL}/api/health`, { cache: 'no-store' });
    cached = res.ok;
  } catch {
    cached = false;
  }
  return cached;
}

/** Reset the memoised probe (used by dev tooling / explicit re-check). */
export function resetPocketBaseProbe(): void {
  cached = null;
}
