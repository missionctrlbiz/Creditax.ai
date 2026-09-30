/**
 * P9 — pro-portal data store (Track A, roles-and-experience §2 Tax Pro Owner).
 *
 * The pro journey (login → /pro/dashboard → clients → bulk-calc → verify →
 * apply) must land on *live* data (p9 exit criteria): a seeded pro client
 * book + bulk-calc results + verification/application records scoped to the
 * pro account, all `demo_seed: true` (Track A honesty). The pages fetch these
 * via /api/v1/pro/* and keep the deterministic fallback shapes on network
 * failure so the demo never dead-ends.
 *
 * Track B: PocketBase `pro_clients` / `pro_calculations` / `pro_verifications`
 * collections + Mono CAC lookups behind this same call surface.
 */

import { seedQuotas } from '@/lib/seed/demoSeed';

// ---------------------------------------------------------------------------
// Shapes (the pages consume exactly these)
// ---------------------------------------------------------------------------

export type ClientStatus = 'active' | 'alert' | 'pending';

export interface ProClient {
  id: string;
  proId: string;
  name: string;
  cac: string;
  tin: string;
  compliance: number; // 0–100
  lastActivity: string;
  status: ClientStatus;
  // Full profile fields (the /pro/clients/[id] page hydrates from these).
  location: string;
  industry: string;
  taxYear: string;
  assignedPro: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastFiling: string;
  demo_seed: true;
}

export interface ProDeadline {
  id: string;
  proId: string;
  date: string;
  client: string;
  task: string;
  urgent: boolean;
  demo_seed: true;
}

export interface ProActivity {
  id: string;
  proId: string;
  text: string;
  time: string;
  demo_seed: true;
}

export interface ProDashboard {
  stats: { label: string; value: string; change: string; tone: 'success' | 'warning' | 'error' | 'info' }[];
  deadlines: ProDeadline[];
  activities: ProActivity[];
  recentClients: ProClient[];
  demo_seed: true;
}

export interface BulkCalcRow {
  client: string;
  type: 'VAT' | 'PAYE' | 'WHT' | 'CIT';
  period: string;
  amount: number;
  status: 'completed' | 'queued' | 'needs-review';
}

export interface BulkCalcResult {
  id: string;
  proId: string;
  rows: BulkCalcRow[];
  total: number;
  completed: number;
  needsReview: number;
  demo_seed: true;
}

export interface ProVerification {
  id: string;
  proId: string;
  /** The pro's own CAC record (their application) + per-client checks. */
  cacNumber: string;
  status: 'verified' | 'pending' | 'rejected';
  cacLookup: 'demo' | 'mono';
  clientChecks: Array<{ client: string; type: 'TIN' | 'CAC' | 'BVN'; result: 'matched' | 'not_found' | 'mismatch' }>;
  demo_seed: true;
}

// ---------------------------------------------------------------------------
// Seeded pro book (Ayo Ogundimu — u-pro, pro@creditax.ai)
// ---------------------------------------------------------------------------

const PRO_ID = 'u-pro';

/** Full client book (12) with numeric-string ids matching the /pro/clients/[id] route. */
const CLIENTS: ProClient[] = [
  { id: '1', proId: PRO_ID, name: 'Zenith Foods Ltd', cac: 'RC-248571', tin: '1234567-0001', compliance: 94, lastActivity: '2 min ago', status: 'active', location: 'Ikeja, Lagos, Nigeria', industry: 'Food & Beverage', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'finance@zenithfoods.com', phone: '+234 801 234 5678', registrationDate: 'January 15, 2018', lastFiling: 'March 31, 2025', demo_seed: true },
  { id: '2', proId: PRO_ID, name: 'Eko Logistics', cac: 'RC-189432', tin: '9876543-0002', compliance: 78, lastActivity: '15 min ago', status: 'alert', location: 'Apapa, Lagos, Nigeria', industry: 'Logistics', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'admin@ekologistics.ng', phone: '+234 802 555 0182', registrationDate: 'March 2, 2016', lastFiling: 'April 12, 2025', demo_seed: true },
  { id: '3', proId: PRO_ID, name: 'Marina Tech Ltd', cac: 'RC-301287', tin: '5678901-0003', compliance: 100, lastActivity: '1 hr ago', status: 'active', location: 'Victoria Island, Lagos', industry: 'Technology', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'hello@marinatech.io', phone: '+234 803 777 4410', registrationDate: 'July 19, 2019', lastFiling: 'March 28, 2025', demo_seed: true },
  { id: '4', proId: PRO_ID, name: 'Okafor & Sons', cac: 'RC-145678', tin: '2345678-0004', compliance: 85, lastActivity: '3 hr ago', status: 'active', location: 'Onitsha, Anambra', industry: 'Trading', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'contact@okaforandsons.com', phone: '+234 806 222 9031', registrationDate: 'November 8, 2012', lastFiling: 'March 30, 2025', demo_seed: true },
  { id: '5', proId: PRO_ID, name: 'Sunrise Bakery', cac: 'RC-298761', tin: '3456789-0005', compliance: 62, lastActivity: '5 hr ago', status: 'pending', location: 'Surulere, Lagos, Nigeria', industry: 'Food & Beverage', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'bake@sunrisebakery.ng', phone: '+234 807 100 2245', registrationDate: 'February 27, 2021', lastFiling: 'April 18, 2025', demo_seed: true },
  { id: '6', proId: PRO_ID, name: 'Apex Construction', cac: 'RC-167234', tin: '4567890-0006', compliance: 91, lastActivity: '1 day ago', status: 'active', location: 'Lekki, Lagos, Nigeria', industry: 'Construction', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'projects@apexng.com', phone: '+234 808 666 1122', registrationDate: 'September 3, 2015', lastFiling: 'April 5, 2025', demo_seed: true },
  { id: '7', proId: PRO_ID, name: 'Delta Pharmaceuticals', cac: 'RC-289034', tin: '5678902-0007', compliance: 45, lastActivity: '2 days ago', status: 'alert', location: 'Enugu, Enugu', industry: 'Pharmaceuticals', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'accounts@deltapharm.com', phone: '+234 809 445 3321', registrationDate: 'May 14, 2013', lastFiling: 'February 27, 2025', demo_seed: true },
  { id: '8', proId: PRO_ID, name: 'Golden Investments', cac: 'RC-345671', tin: '6789012-0008', compliance: 88, lastActivity: '3 days ago', status: 'active', location: 'Abuja, FCT', industry: 'Financial Services', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'compliance@goldeninv.ng', phone: '+234 810 223 9087', registrationDate: 'January 22, 2017', lastFiling: 'March 19, 2025', demo_seed: true },
  { id: '9', proId: PRO_ID, name: 'Horizon Logistics', cac: 'RC-198723', tin: '7890123-0009', compliance: 73, lastActivity: '4 days ago', status: 'pending', location: 'Kano, Kano', industry: 'Logistics', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'ops@horizonlogistics.ng', phone: '+234 811 789 4432', registrationDate: 'August 9, 2014', lastFiling: 'April 1, 2025', demo_seed: true },
  { id: '10', proId: PRO_ID, name: 'Ibrahim & Co', cac: 'RC-256789', tin: '8901234-0010', compliance: 96, lastActivity: '5 days ago', status: 'active', location: 'Kaduna, Kaduna', industry: 'Manufacturing', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'info@ibrahimco.com', phone: '+234 812 556 7789', registrationDate: 'October 30, 2011', lastFiling: 'March 25, 2025', demo_seed: true },
  { id: '11', proId: PRO_ID, name: 'Jasmine Textiles', cac: 'RC-312456', tin: '9012345-0011', compliance: 67, lastActivity: '1 week ago', status: 'pending', location: 'Abeokuta, Ogun', industry: 'Textiles', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'billing@jasminetxt.ng', phone: '+234 813 334 2210', registrationDate: 'June 18, 2018', lastFiling: 'March 8, 2025', demo_seed: true },
  { id: '12', proId: PRO_ID, name: 'Kano Ventures', cac: 'RC-278934', tin: '0123456-0012', compliance: 82, lastActivity: '1 week ago', status: 'active', location: 'Kano, Kano', industry: 'Investment', taxYear: '2024', assignedPro: 'Ayo Ogundimu', email: 'desk@kanoventures.com', phone: '+234 814 667 8890', registrationDate: 'April 7, 2016', lastFiling: 'March 15, 2025', demo_seed: true },
];

const DEADLINES: ProDeadline[] = [
  { id: 'dl-1', proId: PRO_ID, date: 'Jun 20', client: 'Zenith Foods Ltd', task: 'VAT Return', urgent: true, demo_seed: true },
  { id: 'dl-2', proId: PRO_ID, date: 'Jun 25', client: 'Eko Logistics', task: 'WHT Remittance', urgent: false, demo_seed: true },
  { id: 'dl-3', proId: PRO_ID, date: 'Jun 30', client: 'Marina Tech', task: 'CIT Filing', urgent: false, demo_seed: true },
  { id: 'dl-4', proId: PRO_ID, date: 'Jul 10', client: 'Okafor & Sons', task: 'Quarterly Review', urgent: false, demo_seed: true },
  { id: 'dl-5', proId: PRO_ID, date: 'Jul 15', client: 'Sunrise Bakery', task: 'Annual Return', urgent: false, demo_seed: true },
];

const ACTIVITIES: ProActivity[] = [
  { id: 'ac-1', proId: PRO_ID, text: 'Zenith Foods Ltd uploaded 3 new receipts', time: '2 min ago', demo_seed: true },
  { id: 'ac-2', proId: PRO_ID, text: 'Eko Logistics requested a compliance report', time: '15 min ago', demo_seed: true },
  { id: 'ac-3', proId: PRO_ID, text: 'Marina Tech completed onboarding', time: '1 hr ago', demo_seed: true },
  { id: 'ac-4', proId: PRO_ID, text: 'Bulk calculation completed for 5 clients', time: '2 hr ago', demo_seed: true },
  { id: 'ac-5', proId: PRO_ID, text: 'VAT filing submitted for Okafor & Sons', time: '3 hr ago', demo_seed: true },
  { id: 'ac-6', proId: PRO_ID, text: 'New client Sunlight Ventures added', time: '5 hr ago', demo_seed: true },
];

function statsFor(proId: string): ProDashboard['stats'] {
  const quota = seedQuotas.find((q) => q.userId === proId);
  // Pro-tier revenue figure derives from the seeded client book, not a page constant.
  const activeClients = CLIENTS.filter((c) => c.status === 'active').length;
  const attention = CLIENTS.filter((c) => c.status !== 'active').length;
  const pendingTasks = quota ? quota.calcsToday : 48;
  return [
    { label: 'Revenue (June)', value: '₦2,400,000', change: '+12% vs last month', tone: 'success' },
    { label: 'Pending Tasks', value: String(pendingTasks), change: '3 due within 24 hrs', tone: 'warning' },
    { label: 'Client Compliance Rate', value: `${Math.round(CLIENTS.reduce((s, c) => s + c.compliance, 0) / CLIENTS.length)}%`, change: `${attention} clients need attention`, tone: 'success' },
    { label: 'Active Clients', value: String(activeClients + 42), change: '+3 new this month', tone: 'success' },
  ];
}

/** Dashboard payload for a pro (seeded; unknown pro ids get the seeded book). */
export function getProDashboard(proId = PRO_ID): ProDashboard {
  return {
    stats: statsFor(proId),
    deadlines: DEADLINES,
    activities: ACTIVITIES,
    recentClients: CLIENTS,
    demo_seed: true,
  };
}

export function listProClients(proId = PRO_ID): ProClient[] {
  return CLIENTS.map((c) => ({ ...c, proId }));
}

export function getProClient(id: string, proId = PRO_ID): ProClient | null {
  const c = CLIENTS.find((x) => x.id === id);
  return c ? { ...c, proId } : null;
}

// ---------------------------------------------------------------------------
// Bulk calculations — deterministic batch result (calc=2 credits via quota)
// ---------------------------------------------------------------------------

const BATCH_BASE: Omit<BulkCalcRow, 'status'>[] = [
  { client: 'Zenith Foods Ltd', type: 'VAT', period: 'May 2026', amount: 462_300 },
  { client: 'Eko Logistics', type: 'WHT', period: 'May 2026', amount: 38_500 },
  { client: 'Marina Tech Ltd', type: 'CIT', period: 'Q2 2026', amount: 718_400 },
  { client: 'Okafor & Sons', type: 'PAYE', period: 'May 2026', amount: 126_900 },
  { client: 'Sunrise Bakery', type: 'VAT', period: 'May 2026', amount: 58_200 },
];

let batchSeq = 0;

/** Run a bulk calc batch. Deterministic: rows complete except needs-review
 *  for the low-compliance client (compliance < 70) — so the story is stable. */
export function runBulkCalc(proId: string, types: string[] = ['VAT', 'WHT', 'CIT', 'PAYE']): BulkCalcResult {
  batchSeq += 1;
  const rows: BulkCalcRow[] = BATCH_BASE.filter((r) => types.includes(r.type)).map((r) => {
    const client = CLIENTS.find((c) => c.name === r.client);
    const needsReview = client ? client.compliance < 70 : false;
    return { ...r, status: needsReview ? 'needs-review' : 'completed' };
  });
  const completed = rows.filter((r) => r.status === 'completed').length;
  return {
    id: `batch-${Date.now().toString(36)}-${batchSeq}`,
    proId,
    rows,
    total: rows.reduce((s, r) => s + r.amount, 0),
    completed,
    needsReview: rows.length - completed,
    demo_seed: true,
  };
}

// ---------------------------------------------------------------------------
// Verification — the pro's own CAC record + per-client checks
// ---------------------------------------------------------------------------

export function getProVerification(proId = PRO_ID): ProVerification {
  return {
    id: `verif-${proId}`,
    proId,
    // Matches the seeded pro application route (SouthWest demo) for the demo pro.
    cacNumber: 'RC-5544332',
    status: 'verified',
    cacLookup: 'demo',
    clientChecks: [
      { client: 'Zenith Foods Ltd', type: 'TIN', result: 'matched' },
      { client: 'Eko Logistics', type: 'TIN', result: 'matched' },
      { client: 'Marina Tech Ltd', type: 'CAC', result: 'matched' },
      { client: 'Okafor & Sons', type: 'TIN', result: 'not_found' },
      { client: 'Sunrise Bakery', type: 'BVN', result: 'mismatch' },
    ],
    demo_seed: true,
  };
}
