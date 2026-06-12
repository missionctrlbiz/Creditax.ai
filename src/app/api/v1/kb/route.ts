import { NextRequest, NextResponse } from 'next/server';

export interface KBDocument {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
}

const mockDocuments: KBDocument[] = [
  {
    id: '1',
    title: 'VAT Introduction',
    category: 'VAT',
    status: 'published',
    content: '# VAT Introduction\n\nValue Added Tax (VAT) is a consumption tax placed on products and services...\n\n## Key Points\n\n- VAT is charged at each stage of production\n- Businesses must register if turnover exceeds ₦25 million\n- Standard rate is 7.5%\n\n## Registration Requirements\n\nAll businesses with annual turnover exceeding ₦25 million must register for VAT.',
    version: 3,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-06-10T14:30:00Z',
  },
  {
    id: '2',
    title: 'VAT Rates Guide',
    category: 'VAT',
    status: 'published',
    content: '# VAT Rates Guide\n\n## Standard Rate\n\nThe standard VAT rate in Nigeria is **7.5%**\n\n## Zero-Rated Items\n\n- Agricultural products\n- Medical equipment\n- Books and educational materials\n- Machinery\n\n## Exempt Items\n\n- Financial services (certain)\n- Residential buildings\n- Public transportation',
    version: 2,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-05-15T11:20:00Z',
  },
  {
    id: '3',
    title: 'PAYE Fundamentals',
    category: 'Income Tax',
    status: 'published',
    content: '# PAYE (Pay As You Earn)\n\nPAYE is the method of withholding tax from employee salaries.\n\n## Tax Bands\n\n| Income Range | Tax Rate |\n|-------------|----------|\n| ₦0 - ₦300,000 | 0% |\n| ₦300,001 - ₦600,000 | 15% |\n| ₦600,001 - ₦1,100,000 | 20% |\n| ₦1,100,001 - ₦1,600,000 | 25% |\n| ₦1,600,001 - ₦3,200,000 | 30% |\n| Above ₦3,200,000 | 35% |',
    version: 4,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-06-01T09:15:00Z',
  },
  {
    id: '4',
    title: 'Self-Employment Tax',
    category: 'Income Tax',
    status: 'draft',
    content: '# Self-Employment Tax\n\nSelf-employed individuals in Nigeria must pay income tax on their profits.\n\n## Calculating Taxable Income\n\nTaxable Income = Gross Income - Allowable Deductions\n\n## Allowable Deductions\n\n- Business expenses necessarily incurred\n- Capital allowances\n- Reliefs and exemptions',
    version: 1,
    created_at: '2026-05-20T10:00:00Z',
    updated_at: '2026-05-20T10:00:00Z',
  },
  {
    id: '5',
    title: 'Withholding Tax Overview',
    category: 'WHT',
    status: 'published',
    content: '# Withholding Tax (WHT)\n\nWithholding tax is an advance collection of income tax.\n\n## Standard Rates\n\n| Payment Type | Rate |\n|-------------|------|\n| Dividends | 10% |\n| Interest | 10% |\n| Royalties | 10% |\n| Rent | 10% |\n| Professional fees | 5% |\n| Technical services | 5% |',
    version: 2,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-04-20T16:45:00Z',
  },
  {
    id: '6',
    title: 'WHT Rates Table',
    category: 'WHT',
    status: 'published',
    content: '# WHT Rates Table\n\n## Companies\n\n| Category | Rate |\n|----------|------|\n| Dividends, interest, rent | 10% |\n| Royalties | 10% |\n| Professional/technical services | 5% |\n| Consultancy | 5% |\n| Management fees | 5% |\n\n## Individuals\n\n| Category | Rate |\n|----------|------|\n| Dividends, interest, rent | 10% |\n| Royalties | 10% |\n| Professional/technical services | 5% |',
    version: 1,
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: '7',
    title: 'Capital Gains Tax Guide',
    category: 'CGT',
    status: 'published',
    content: '# Capital Gains Tax (CGT)\n\nCGT is charged on the disposal of chargeable assets.\n\n## Rate\n\nThe current CGT rate is **10%** for companies and calculated based on individuals\' tax bands.\n\n## Chargeable Assets\n\n- Land and buildings\n- Shares and securities\n- Business assets\n- Intellectual property\n\n## Exemptions\n\n- Primary residence (conditions apply)\n- Personal belongings up to ₦100,000',
    version: 1,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: '8',
    title: 'Tax General Information',
    category: 'General',
    status: 'published',
    content: '# General Tax Information\n\n## Nigerian Tax System Overview\n\nNigeria operates a self-assessment tax system.\n\n## Key Authorities\n\n- **FIRS** - Federal Inland Revenue Service\n- **SIRS** - State Inland Revenue Service\n\n## Filing Deadlines\n\n- Companies: 6 months after financial year end\n- Individuals: 31 March annually\n\n## Penalties\n\nLate filing attracts penalties of ₦25,000 in the first month and ₦5,000 for each subsequent month.',
    version: 2,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-05-30T12:00:00Z',
  },
];

let documents = [...mockDocuments];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const doc = documents.find((d) => d.id === id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json({ document: doc, content: doc.content });
  }

  const docsWithoutContent = documents.map((d) => {
    const { content: _content, ...rest } = d;
    void _content;
    return rest;
  });
  return NextResponse.json({ documents: docsWithoutContent });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const newDoc: KBDocument = {
      id: Date.now().toString(),
      title,
      content: content || '',
      category,
      status: 'draft',
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    documents.push(newDoc);

    const { content: _content, ...docWithoutContent } = newDoc;
    void _content;
    return NextResponse.json({ document: docWithoutContent });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const docIndex = documents.findIndex((d) => d.id === id);
    if (docIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, category, status } = body;

    const updatedDoc: KBDocument = {
      ...documents[docIndex],
      ...(title && { title }),
      ...(content !== undefined && { content }),
      ...(category && { category }),
      ...(status && { status }),
      version: documents[docIndex].version + 1,
      updated_at: new Date().toISOString(),
    };

    documents[docIndex] = updatedDoc;

    const { content: _content, ...docWithoutContent } = updatedDoc;
    void _content;
    return NextResponse.json({ document: docWithoutContent });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
  }

  const docIndex = documents.findIndex((d) => d.id === id);
  if (docIndex === -1) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  documents = documents.filter((d) => d.id !== id);
  return NextResponse.json({ success: true });
}