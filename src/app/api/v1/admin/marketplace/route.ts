import { NextRequest, NextResponse } from 'next/server';

export interface MarketplaceApplication {
  id: string;
  businessName: string;
  ownerName: string;
  cacNumber: string;
  firsTin: string;
  phone: string;
  email: string;
  services: string[];
  city: string;
  state: string;
  description: string;
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockApplications: MarketplaceApplication[] = [
  {
    id: '1',
    businessName: 'Akinwale & Associates',
    ownerName: 'Akinwale Johnson',
    cacNumber: 'BN-123456',
    firsTin: '12345678-0001',
    phone: '08012345678',
    email: 'akin@taxpro.com',
    services: ['Personal Income Tax', 'VAT Filing', 'Audit Support'],
    city: 'Lagos',
    state: 'Lagos',
    description: 'Professional tax services for individuals and small businesses with over 10 years of experience.',
    documents: [
      { type: 'CAC Certificate', url: '/docs/cac-1.pdf', status: 'verified' },
      { type: 'FIRS Certificate', url: '/docs/firs-1.pdf', status: 'verified' },
      { type: 'ID Document', url: '/docs/id-1.pdf', status: 'verified' },
    ],
    status: 'pending',
    submittedAt: '2026-06-10T00:00:00Z',
  },
  {
    id: '2',
    businessName: 'GreenLeaf Tax Services',
    ownerName: 'Chioma Eze',
    cacNumber: 'BN-789012',
    firsTin: '87654321-0002',
    phone: '08098765432',
    email: 'chioma@greenleaf.com',
    services: ['Business Registration', 'Tax Planning', 'Compliance'],
    city: 'Abuja',
    state: 'FCT',
    description: 'Eco-conscious tax firm helping startups and SMEs navigate Nigerian tax laws.',
    documents: [
      { type: 'CAC Certificate', url: '/docs/cac-2.pdf', status: 'verified' },
      { type: 'FIRS Certificate', url: '/docs/firs-2.pdf', status: 'pending' },
      { type: 'ID Document', url: '/docs/id-2.pdf', status: 'verified' },
    ],
    status: 'pending',
    submittedAt: '2026-06-11T00:00:00Z',
  },
  {
    id: '3',
    businessName: 'Okonkwo & Partners',
    ownerName: 'Emeka Okonkwo',
    cacNumber: 'BN-345678',
    firsTin: '11223344-0003',
    phone: '08055667788',
    email: 'emeka@okonkwoandpartners.com',
    services: ['Corporate Tax', 'International Tax', 'Transfer Pricing'],
    city: 'Port Harcourt',
    state: 'Rivers',
    description: 'Big 4 trained professionals providing world-class corporate tax advisory.',
    documents: [
      { type: 'CAC Certificate', url: '/docs/cac-3.pdf', status: 'verified' },
      { type: 'FIRS Certificate', url: '/docs/firs-3.pdf', status: 'verified' },
      { type: 'ID Document', url: '/docs/id-3.pdf', status: 'verified' },
    ],
    status: 'under_review',
    submittedAt: '2026-06-09T00:00:00Z',
  },
  {
    id: '4',
    businessName: 'Lagos Tax Consultants',
    ownerName: 'Funke Adeyemi',
    cacNumber: 'BN-901234',
    firsTin: '55443322-0004',
    phone: '08044556677',
    email: 'funke@lagostax.com',
    services: ['Payroll Tax', 'PAYE', 'Withholding Tax'],
    city: 'Lagos',
    state: 'Lagos',
    description: 'Specialized in payroll and employment tax matters for HR departments.',
    documents: [
      { type: 'CAC Certificate', url: '/docs/cac-4.pdf', status: 'verified' },
      { type: 'FIRS Certificate', url: '/docs/firs-4.pdf', status: 'verified' },
      { type: 'ID Document', url: '/docs/id-4.pdf', status: 'rejected' },
    ],
    status: 'under_review',
    submittedAt: '2026-06-08T00:00:00Z',
  },
  {
    id: '5',
    businessName: 'Nigerian Tax Advisory',
    ownerName: 'Olumide Bakare',
    cacNumber: 'BN-567890',
    firsTin: '99887766-0005',
    phone: '08033445566',
    email: 'olumide@nigeriantax.com.ng',
    services: ['Tax Dispute Resolution', 'Appeals', 'Litigation Support'],
    city: 'Ibadan',
    state: 'Oyo',
    description: 'Former FIRS officer providing expert representation in tax disputes.',
    documents: [
      { type: 'CAC Certificate', url: '/docs/cac-5.pdf', status: 'verified' },
      { type: 'FIRS Certificate', url: '/docs/firs-5.pdf', status: 'verified' },
      { type: 'ID Document', url: '/docs/id-5.pdf', status: 'verified' },
    ],
    status: 'approved',
    submittedAt: '2026-06-12T00:00:00Z',
  },
  {
    id: '6',
    businessName: 'Delta Financial Services',
    ownerName: 'Ifeoma Nwosu',
    cacNumber: 'BN-234567',
    firsTin: '66778899-0006',
    phone: '08022334455',
    email: 'ifeoma@deltafinancial.com',
    services: ['Tax Preparation', 'Bookkeeping', 'Financial Statements'],
    city: 'Asaba',
    state: 'Delta',
    description: 'Comprehensive financial services for small businesses in the Niger Delta.',
    documents: [
      { type: 'CAC Certificate', url: '/docs/cac-6.pdf', status: 'rejected' },
      { type: 'FIRS Certificate', url: '/docs/firs-6.pdf', status: 'pending' },
      { type: 'ID Document', url: '/docs/id-6.pdf', status: 'pending' },
    ],
    status: 'rejected',
    submittedAt: '2026-06-07T00:00:00Z',
  },
];

const applications = [...mockApplications];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  let filtered = [...applications];

  if (status && status !== 'all') {
    filtered = filtered.filter((app) => app.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.businessName.toLowerCase().includes(searchLower) ||
        app.ownerName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.city.toLowerCase().includes(searchLower)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  const today = new Date().toISOString().split('T')[0];
  const stats = {
    pending: applications.filter((a) => a.status === 'pending').length,
    underReview: applications.filter((a) => a.status === 'under_review').length,
    approvedToday: applications.filter(
      (a) => a.status === 'approved' && a.submittedAt.split('T')[0] === today
    ).length,
    rejectedToday: applications.filter(
      (a) => a.status === 'rejected' && a.submittedAt.split('T')[0] === today
    ).length,
  };

  return NextResponse.json({
    applications: paginated,
    total,
    stats,
  });
}