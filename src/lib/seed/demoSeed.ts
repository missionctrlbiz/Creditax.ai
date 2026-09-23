/**
 * Inlined DEMO seed data — Track A (mvp-demo-plan.md §2).
 *
 * Every object is clearly a demo seed. These arrays are the offline fallback
 * for `pb-data.ts`: when PocketBase is unreachable (local dev without the
 * binary, or P1 not yet applied), the app renders these instead of throwing.
 * They also mirror what `scripts/seed-demo.ts` writes into PocketBase, so the
 * two stay behaviourally identical.
 *
 * Legal gate (legal-compliance.md §2/§7): all figures here are simulated.
 * No real BVN, bank link, or filing exists in Track A.
 */

export type SeedRole = 'consumer' | 'tax_pro' | 'admin' | 'author';
export type Tier = 'free' | 'plus' | 'professional' | 'enterprise';
export type LocaleCode = 'en' | 'yo' | 'ha' | 'ig';

/**
 * Role → home landing. roles-and-experience.md §1: Author signs into the admin
 * board with a scoped grant (blog/KB write), so its home is /admin too.
 */
export const ROLE_HOME: Record<SeedRole, string> = {
  consumer: '/dashboard',
  tax_pro: '/pro/dashboard',
  admin: '/admin/dashboard',
  author: '/admin/dashboard',
};

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: SeedRole;
  tier: Tier;
  locale: LocaleCode;
  demo_seed: true;
}

export interface DemoKbDoc {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  demo_seed: true;
  /** Light chunks for P2 chunk+embed; embedding filled in later by P2. */
  chunks: { text: string; section: string; embedding?: number[] }[];
}

export interface DemoProfessional {
  id: string;
  slug: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  whatsapp?: string;
  cacNumber: string;
  services: string[];
  location: { address: string; city: string; state: string; lat: number; lng: number };
  verified: boolean;
  rating: number;
  reviewCount: number;
  demo_seed: true;
}

export interface DemoMessage {
  id: string;
  role: 'user' | 'assistant';
  kind?: 'answer' | 'filing' | 'referral' | 'calc';
  text: string;
  sources?: string[];
}

export interface DemoQuota {
  userId: string;
  tier: Tier;
  chatToday: number;
  chatCap: number;
  lifetimeChats: number;
  lifetimeCap: number;
  calcsToday: number;
  uploadsToday: number;
  bvnsUsed: number;
  bvnsFreeTeaser: number;
  demo_seed: true;
}

export interface DemoNotification {
  id: string;
  userId: string;
  kind: 'filing_deadline' | 'document_processed' | 'score_change' | 'pro_referral';
  title: string;
  body: string;
  due?: string;
  read: boolean;
  demo_seed: true;
}

// ---------------------------------------------------------------------------
// Users — the 4 demo role accounts (mvp-demo-plan §3.2)
// ---------------------------------------------------------------------------
export const seedUsers: DemoUser[] = [
  { id: 'u-consumer', email: 'demo@creditax.ai', name: 'Emeka Okafor', role: 'consumer', tier: 'free', locale: 'en', demo_seed: true },
  { id: 'u-pro', email: 'pro@creditax.ai', name: 'Ayo Ogundimu', role: 'tax_pro', tier: 'professional', locale: 'en', demo_seed: true },
  { id: 'u-admin', email: 'admin@creditax.ai', name: 'Super Admin', role: 'admin', tier: 'enterprise', locale: 'en', demo_seed: true },
  { id: 'u-author', email: 'author@creditax.ai', name: 'Nneka Eze', role: 'author', tier: 'free', locale: 'en', demo_seed: true },
];

// ---------------------------------------------------------------------------
// Knowledge base — mirrors scripts/kb/*.md, lightly chunked.
// Embedding arrays are empty until P2 runs OpenRouter embeddings.
// ---------------------------------------------------------------------------
export const seedKbDocs: DemoKbDoc[] = [
  {
    id: 'kb-nta', title: 'Nigeria Tax Act 2023', slug: 'nta-2023', category: 'income_tax', status: 'published', demo_seed: true,
    chunks: [
      { text: 'PIT uses graduated bands from 7% to 24%. Consolidated Relief Allowance is the greater of 200,000 naira or 20% of gross income, minimum 1% of gross.', section: 'PIT bands' },
      { text: 'Standard corporate tax rate is 30%. Minimum tax applies to companies with no chargeable profit. Reduced rates apply to qualifying SMEs.', section: 'Companies' },
    ],
  },
  {
    id: 'kb-ntaa', title: 'NTAA 2023 — Filing & Compliance', slug: 'ntaa-2023', category: 'procedures', status: 'published', demo_seed: true,
    chunks: [
      { text: 'Filing deadlines: PAYE monthly by the 10th, VAT and WHT monthly by the 21st, CIT balance by 31 October. A TIN is mandatory for all taxpayers.', section: 'Deadlines' },
      { text: 'Objection within 30 days of assessment; appeal to the Tax Appeals Committee. Tax Clearance Certificates are required for contracts, procurement and loans.', section: 'Appeals & TCC' },
    ],
  },
  {
    id: 'kb-vat', title: 'FIRS VAT Guide', slug: 'firs-vat-guide', category: 'vat', status: 'published', demo_seed: true,
    chunks: [
      { text: 'VAT is charged at 7.5% on most taxable supplies. VAT returns are filed monthly by the 21st of the following month.', section: 'Rate & filing' },
      { text: 'Input VAT is deductible when a valid tax invoice is held. Basic food items, medical products and education are generally exempt.', section: 'Input/exemptions' },
    ],
  },
  {
    id: 'kb-paye', title: 'PAYE — Salaried Employees', slug: 'paye-pit-rates', category: 'income_tax', status: 'published', demo_seed: true,
    chunks: [
      { text: 'PAYE computation: gross emoluments minus CRA and statutory deductions, then apply graduated bands 7% to 24%. Employers remit monthly by the 10th.', section: 'Computation' },
      { text: 'Under-claimed relief can cause overpaid PAYE. A payslip decode flags lines that appear under-claimed for a lawful adjustment.', section: 'Relief' },
    ],
  },
  {
    id: 'kb-wht', title: 'Withholding Tax Circulars', slug: 'witholding-tax-circulars', category: 'withholding', status: 'published', demo_seed: true,
    chunks: [
      { text: 'WHT is an advance tax deducted at source. Typical rates: services 5-10%, professional fees 10%, dividends 10%, interest 15%, residential rent 10%.', section: 'Rates' },
      { text: 'Recipients are entitled to a WHT credit note. Many vendors never claim it, so the money is lost — a recovery schedule matches deductions to missing notes.', section: 'Credit notes' },
    ],
  },
  {
    id: 'kb-tcc', title: 'Tax Clearance Certificate', slug: 'tax-clearance-certificate', category: 'procedures', status: 'published', demo_seed: true,
    chunks: [
      { text: 'A TCC confirms good compliance as of a date. Required for government contracts, tenders, and lender due diligence.', section: 'Purpose' },
      { text: 'Readiness checklist: valid TIN, self-assessment filed, PAYE up to date, VAT reconciled, WHT remitted with credit notes, no outstanding balances.', section: 'Readiness' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Marketplace professionals (mvp-demo-plan §3.7) — seeded geocoords, mixed verified
// ---------------------------------------------------------------------------
export const seedProfessionals: DemoProfessional[] = [
  {
    id: 'p-1', slug: 'akinwale-associates', name: 'Akinwale & Associates', owner: 'Akinwale O.', email: 'hello@akinwale.tax', phone: '+2348011000001', whatsapp: '+2348011000001', cacNumber: 'BN-1234567',
    services: ['VAT Filing', 'Tax Audit', 'TCC'], location: { address: 'Admiralty Way, Lekki Phase 1', city: 'Lagos', state: 'Lagos', lat: 6.4485, lng: 3.4702 }, verified: true, rating: 4.8, reviewCount: 127, demo_seed: true,
  },
  {
    id: 'p-2', slug: 'greenleaf-tax', name: 'GreenLeaf Tax Services', owner: 'Grace I.', email: 'care@greenleaf.tax', phone: '+2348022000002', cacNumber: 'RC-7654321',
    services: ['PAYE', 'Corporate Tax', 'SME Setup'], location: { address: 'Ozorughodun Way, Ikoyi', city: 'Lagos', state: 'Lagos', lat: 6.5170, lng: 3.4700 }, verified: true, rating: 4.6, reviewCount: 89, demo_seed: true,
  },
  {
    id: 'p-3', slug: 'taxhub-abuja', name: 'TaxHub Professionals', owner: 'Femi A.', email: 'help@taxhub.ng', phone: '+2348033000003', cacNumber: 'RC-9988776',
    services: ['WHT Recovery', 'TCC', 'Advisory'], location: { address: 'Buchi Road, Maitama', city: 'Abuja', state: 'FCT', lat: 9.0763, lng: 7.3986 }, verified: true, rating: 4.9, reviewCount: 203, demo_seed: true,
  },
  {
    id: 'p-4', slug: 'southwest-tax', name: 'SouthWest Tax & Audit', owner: 'Bola T.', email: 'firm@southwest.tax', phone: '+2348044000004', cacNumber: 'RC-5544332',
    services: ['Tax Audit', 'VAT Filing'], location: { address: 'Adeola Odeku St, Victoria Island', city: 'Lagos', state: 'Lagos', lat: 6.4281, lng: 3.4214 }, verified: false, rating: 4.2, reviewCount: 31, demo_seed: true,
  },
];

// ---------------------------------------------------------------------------
// A seeded agent conversation so the canvas has real content offline (P2 will
// swap this for the RAG loop; shape stays the same).
// ---------------------------------------------------------------------------
export const seedConversation: DemoMessage[] = [
  { id: 'm-1', role: 'user', text: 'What is the VAT rate and when do I file my return?' },
  { id: 'm-2', role: 'assistant', kind: 'answer', text: 'Under the VAT Act, **VAT is charged at 7.5%** on most goods and services.\n\n- **Filing:** monthly to FIRS by the **21st** of the following month\n- **Input VAT:** deductible with a valid tax invoice\n- **Exempt:** basic food, medical, education\n\nWant me to check deductible VAT from your uploaded invoices?', sources: ['FIRS VAT Guide (demo)', 'NTAA 2023 §Filing (demo)'] },
  { id: 'm-3', role: 'user', text: 'How is my PAYE calculated on my salary?' },
  { id: 'm-4', role: 'assistant', kind: 'calc', text: '**PAYE** is deducted by your employer under PIT.\n\n| Item | Value |\n|---|---|\n| Graduated bands | 7% – 24% |\n| Consolidated Relief | ₦200,000 + 20% of gross |\n| Minimum CRA | 1% of gross |\n\nAttach your payslip and I will compute your relief.', sources: ['PIT Rates (demo)', 'FIRS PAYE Guide (demo)'] },
  { id: 'm-5', role: 'user', text: 'I got a notice from FIRS about an audit, help me' },
  { id: 'm-6', role: 'assistant', kind: 'referral', text: 'Audits are high-stakes — I can point you to a verified tax professional who handles FIRS audit support. Would you like a referral near Lagos?', sources: ['Marketplace (demo)'] },
];

// ---------------------------------------------------------------------------
// Quotas — free-tier counters that make upgrade walls real (pricing §4)
// ---------------------------------------------------------------------------
export const seedQuotas: DemoQuota[] = [
  { userId: 'u-consumer', tier: 'free', chatToday: 4, chatCap: 5, lifetimeChats: 54, lifetimeCap: 60, calcsToday: 3, uploadsToday: 2, bvnsUsed: 1, bvnsFreeTeaser: 2, demo_seed: true },
  { userId: 'u-pro', tier: 'professional', chatToday: 12, chatCap: 100000, lifetimeChats: 12, lifetimeCap: 999999, calcsToday: 48, uploadsToday: 90, bvnsUsed: 14, bvnsFreeTeaser: 0, demo_seed: true },
];

// ---------------------------------------------------------------------------
// Notifications — filing deadlines + events (roles doc §3.1 "deadlines")
// ---------------------------------------------------------------------------
export const seedNotifications: DemoNotification[] = [
  { id: 'n-1', userId: 'u-consumer', kind: 'filing_deadline', title: 'VAT return due', body: 'Your May VAT return is due by 21 June.', due: '2026-06-21', read: false, demo_seed: true },
  { id: 'n-2', userId: 'u-consumer', kind: 'document_processed', title: 'Invoice extracted', body: 'VAT_Invoice_Zenith_Jun2025.pdf · ₦620,500 extracted.', read: false, demo_seed: true },
  { id: 'n-3', userId: 'u-consumer', kind: 'score_change', title: 'Credit health up 4 pts', body: 'Your filing streak beat your balance this month.', read: true, demo_seed: true },
  { id: 'n-4', userId: 'u-consumer', kind: 'filing_deadline', title: 'WHT remittance due', body: 'May WHT (₦38,500) is due by 21 June.', due: '2026-06-21', read: false, demo_seed: true },
];
