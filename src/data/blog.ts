export interface BlogPost {
  id: number;
  slug: string;
  category: 'Tax Tips' | 'Product Updates' | 'API Guides' | 'Nigerian Finance' | 'Credit & Borrowing';
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured?: boolean;
  content: string[];
  keyPoints: string[];
}

export const categories = [
  'All',
  'Tax Tips',
  'Product Updates',
  'API Guides',
  'Nigerian Finance',
  'Credit & Borrowing',
] as const;

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'nigeria-tax-reform-act-2024-sme-guide',
    category: 'Tax Tips',
    title:
      "How Nigeria's New Tax Reform Act 2024 Affects Your Business — What Every SME Owner Needs to Know",
    excerpt:
      'FIRS has introduced sweeping changes to corporate income tax, VAT thresholds, and transfer pricing rules. Here’s a plain-English breakdown for Nigerian entrepreneurs.',
    author: 'Adaeze Obi',
    authorRole: 'Product Team',
    date: 'June 10, 2025',
    readTime: '8 min read',
    image: '/blog/blog-featured.png',
    tags: ['Tax Reform Act', 'SME', 'FIRS', 'VAT', 'CIT'],
    featured: true,
    content: [
      'Nigeria’s Tax Reform Act 2024 is the most significant overhaul of the country’s tax system in over a decade. For SME owners in Lagos, Abuja, and Port Harcourt, the changes touch everything from company income tax (CIT) to VAT registration thresholds and transfer pricing documentation.',
      'The headline change: the CIT rate structure has been simplified, and small companies with turnover below ₦25 million now enjoy clearer exemption pathways. But exemption does not mean exemption from filing — you still need to file annual returns with FIRS to stay compliant and keep your Tax Clearance Certificate (TCC) valid.',
      'On VAT, the registration threshold and remittance timelines have been tightened. If you sell taxable goods or digital services, you need to charge 7.5% VAT, remit monthly via the FIRS portal, and keep digital records for at least 6 years. Late remittance now attracts steeper penalties and interest.',
      'Transfer pricing is no longer just for multinationals. If your business transacts with related parties — even a sister company in Ghana or the UK — you need contemporaneous documentation. Creditax.ai can flag related-party transactions automatically from your uploaded invoices.',
      'What should you do this week? 1) Confirm your TIN status on the FIRS portal. 2) Reconcile your last 12 months of sales for VAT exposure. 3) Upload your CAC documents and financials to Creditax to get a compliance health score. Compliant businesses borrow cheaper — lenders trust filed returns more than bank statements.',
    ],
    keyPoints: [
      'Small companies under ₦25M turnover get simplified CIT treatment but must still file annually.',
      '7.5% VAT applies to taxable supplies — remit monthly and keep 6-year digital records.',
      'Related-party transactions now need transfer-pricing documentation, even for SMEs.',
      'A valid TCC unlocks loans, government contracts, and better credit terms.',
    ],
  },
  {
    id: 2,
    slug: 'introducing-creditax-rag-engine',
    category: 'Product Updates',
    title: 'Introducing the Creditax RAG Engine: Ask Any Nigerian Tax Question',
    excerpt:
      'Our new AI-powered knowledge base answers complex Nigerian tax questions instantly — grounded in FIRS guides, the NTA, and real circulars.',
    author: 'Adaeze Nwosu',
    authorRole: 'Engineering',
    date: 'June 8, 2025',
    readTime: '5 min read',
    image: '/blog/blog-rag-engine.png',
    tags: ['RAG', 'AI', 'Product', 'FIRS', 'NTA'],
    content: [
      'We built the Creditax RAG Engine because generic chatbots hallucinate tax law. Our engine retrieves from a curated corpus — the Nigeria Tax Act, FIRS VAT guides, withholding tax circulars, and Capital Gains Tax rules — before it generates a single word.',
      'How it works: your question is embedded with Vertex AI, matched against Supabase pgvector chunks, then answered by Kimchi.dev with citations. Every answer links back to the source section so your accountant can verify it.',
      'Try asking “What is the VAT rate on digital services in Nigeria?” or “How do I calculate WHT on rent?” You’ll get a plain-English answer plus the legal reference.',
      'Developers can call the same engine via our /api/v1/chat endpoint. All queries are logged for audit, and PII is redacted before embedding.',
    ],
    keyPoints: [
      'Grounded answers from NTA, NTAA, FIRS guides, and circulars — not generic web text.',
      'Every answer includes citations you can verify.',
      'Available in-app and via API for partners.',
    ],
  },
  {
    id: 3,
    slug: 'freelancer-documents-max-credit-score',
    category: 'Credit & Borrowing',
    title: '5 Documents Every Nigerian Freelancer Should Upload for Maximum Credit Score',
    excerpt:
      'Boost your creditworthiness by submitting the right financial documentation — from bank statements to tax filings.',
    author: 'Chidinma Eze',
    authorRole: 'Credit Team',
    date: 'June 5, 2025',
    readTime: '6 min read',
    image: '/blog/blog-freelancer-docs.png',
    tags: ['Freelancer', 'Credit Score', 'Mono', 'Bank Statements'],
    content: [
      'Freelancers in Nigeria often earn well but score poorly — not because they lack income, but because their income is invisible to lenders. These five documents make it visible.',
      '1) 12 months of bank statements via Mono. 2) Your personal income tax filings (PITA). 3) Invoices and contracts showing recurring clients. 4) Savings records — even ₦20,000 monthly matters. 5) Your CAC business name certificate if you operate as a business name.',
      'Upload them to Creditax and our model scores income stability, savings rate, and debt burden alongside tax compliance. Users who upload all five see an average +40 point lift within 60 days of consistent filing.',
      'Pro tip: label transfers from clients clearly. “Payment for UI design — Chidi” beats “Thanks” for automated income detection.',
    ],
    keyPoints: [
      'Bank statements + tax filings + invoices = visible income.',
      'Consistent savings, however small, lifts your score fast.',
      'Labelled transfers improve automatic income detection.',
    ],
  },
  {
    id: 4,
    slug: 'api-v2-faster-cheaper-wht',
    category: 'API Guides',
    title: 'API v2.0 Released: Faster, Cheaper, and WHT Support',
    excerpt:
      'Major improvements to our API including Withholding Tax calculation support, 3x faster responses, and 40% lower pricing.',
    author: 'Tunde Bakare',
    authorRole: 'Developer Relations',
    date: 'June 1, 2025',
    readTime: '4 min read',
    image: '/blog/blog-api-v2.png',
    tags: ['API', 'WHT', 'Developers', 'Changelog'],
    content: [
      'Creditax API v2.0 is live. Median latency dropped from 900ms to 280ms on the tax-calculation endpoint, and pricing is down 40% for startups under 100k calls/month.',
      'The big feature is Withholding Tax: POST /api/v1/tax/wht with { amount, serviceType, recipientType } returns the correct WHT rate, deductible amount, and FIRS remittance code. Supported types include rent, dividends, professional fees, and royalties.',
      'Migration is one line: change your base URL header to X-Creditax-Version: 2025-06-01. v1 remains supported until December 2025.',
      'Check /developers/sandbox to test WHT without a live key. Sample Postman collection and TypeScript SDK are updated.',
    ],
    keyPoints: [
      'New WHT endpoint with FIRS remittance codes.',
      '3x faster, 40% cheaper for startups.',
      'v1 supported until Dec 2025 — one-line migration.',
    ],
  },
  {
    id: 5,
    slug: 'pita-personal-income-tax-explained',
    category: 'Nigerian Finance',
    title: 'Understanding PITA: Personal Income Tax Act Explained Simply',
    excerpt:
      'A comprehensive, jargon-free guide to navigating personal income tax in Nigeria — PAYE, bands, reliefs, and filing.',
    author: 'Chukwuemeka Obi',
    authorRole: 'Tax Research',
    date: 'May 28, 2025',
    readTime: '10 min read',
    image: '/blog/blog-pita.png',
    tags: ['PITA', 'PAYE', 'Personal Income Tax'],
    content: [
      'PITA governs how individuals are taxed in Nigeria. If you earn salary, freelance income, or business profits, this is the law that applies to you.',
      'Employees pay via PAYE — your employer deducts monthly using the graduated bands (7% to 24% after the ₦200,000 consolidated relief + 20% of gross income). Your payslip should show gross, relief, taxable income, and tax deducted.',
      'Self-employed? You file directly with your state IRS (e.g., LIRS in Lagos). Keep records of all income and allowable expenses — pension, NHIS, and life assurance premiums reduce taxable income.',
      'Filing deadline is March 31 for individuals. Miss it and you risk penalties plus a blocked TCC when you need a loan or visa. Upload your payslips to Creditax and we estimate your liability in seconds.',
    ],
    keyPoints: [
      'PAYE bands run 7%–24% after consolidated relief.',
      'Self-employed file with state IRS by March 31.',
      'Pension, NHIS, and life assurance lower your taxable income.',
    ],
  },
  {
    id: 6,
    slug: 'tax-compliance-beats-credit-scoring',
    category: 'Credit & Borrowing',
    title: 'How Tax Compliance Beats Traditional Credit Scoring in Nigeria',
    excerpt:
      'Why your tax history matters more than your bank balance for loans — and how lenders are starting to notice.',
    author: 'Adaeze Nwosu',
    authorRole: 'Credit Team',
    date: 'May 22, 2025',
    readTime: '7 min read',
    image: '/blog/blog-compliance-credit.png',
    tags: ['Credit Score', 'Compliance', 'Lending', 'TCC'],
    content: [
      'Traditional Nigerian credit scoring looks at bank balances and BVN loan history. That misses 60% of the economy — traders, freelancers, and SMEs who operate in cash or across multiple accounts.',
      'Tax compliance tells a richer story: did you file three years straight? Is your declared income stable or growing? Do your invoices match your bank inflows? Lenders we work with say a 3-year filing streak predicts repayment better than a 6-month balance spike.',
      'That’s why Creditax Score = f(income, stability, savings rate, debt burden, compliance). Compliance is the only factor you can improve in 30 days — file outstanding returns and watch your score move.',
      'Bring your TCC to your next loan meeting. It’s the closest thing Nigeria has to a universal trust badge.',
    ],
    keyPoints: [
      'Filing streak predicts repayment better than short-term balances.',
      'Compliance is the fastest lever to lift your score.',
      'TCC + bank data beats bank data alone.',
    ],
  },
  {
    id: 7,
    slug: 'creditax-mono-integration-automatic',
    category: 'Product Updates',
    title: 'Creditax x Mono Integration: Bank Data Now Automatic',
    excerpt:
      'Connect your bank account for seamless financial tracking, income analysis, and faster credit decisions.',
    author: 'Chidinma Eze',
    authorRole: 'Product Team',
    date: 'May 18, 2025',
    readTime: '3 min read',
    image: '/blog/blog-mono-integration.png',
    tags: ['Mono', 'Integration', 'Open Banking', 'Product'],
    content: [
      'Manual statement uploads are over. Connect GTBank, Access, First Bank, and 20+ others via Mono in under 60 seconds.',
      'Once linked, Creditax auto-categorises inflows (salary, client payments, transfers), calculates income stability, and flags large expenses that affect affordability. Refresh runs daily via Trigger.dev.',
      'Security: we use Mono’s read-only tokens. We never see your login password, and you can revoke access anytime from /dashboard/keys. All data is encrypted at rest in Supabase.',
      'Enable it today: Dashboard → Connect Bank → select institution → approve. Your credit score updates within an hour.',
    ],
    keyPoints: [
      '20+ Nigerian banks supported via Mono.',
      'Read-only access — revoke anytime.',
      'Scores refresh automatically every 24 hours.',
    ],
  },
  {
    id: 8,
    slug: 'withholding-tax-nigeria-complete-guide-2025',
    category: 'Tax Tips',
    title: 'Withholding Tax in Nigeria: The Complete 2025 Guide (Rates, Remittance, Penalties)',
    excerpt:
      'WHT on rent, dividends, professional fees, and royalties — exact rates, who remits, due dates, and how to avoid penalties.',
    author: 'Tunde Bakare',
    authorRole: 'Tax Research',
    date: 'May 12, 2025',
    readTime: '9 min read',
    image: '/blog/blog-wht-guide.png',
    tags: ['WHT', 'FIRS', 'Rent', 'Dividends', 'Compliance'],
    content: [
      'Withholding Tax is advance income tax deducted at source. If you pay rent, hire a consultant, or receive dividends, WHT has already touched your money.',
      '2025 quick rates: Rent 10%, Professional / management fees 5% (companies) / 5% (individuals), Dividends 10%, Royalties 5%, Construction 2.5–5%. Always confirm on the FIRS schedule — rates change by finance acts.',
      'Who remits? The payer deducts and remits to FIRS (companies) or state IRS (individuals, rent) within 21 days after the month of deduction. You’ll need the beneficiary’s TIN and the correct payment code.',
      'Penalties hurt: 10% of tax not deducted plus interest at CBN MPR. Use Creditax API v2 /api/v1/tax/wht to calculate before you pay, and store every receipt — your vendor needs it to claim tax credit.',
    ],
    keyPoints: [
      'Rent 10%, dividends 10%, professional fees 5% — confirm current FIRS schedule.',
      'Remit within 21 days with beneficiary TIN.',
      '10% penalty + interest for failure to deduct.',
    ],
  },
];

export function getPostById(id: number | string): BlogPost | undefined {
  const num = typeof id === 'string' ? parseInt(id, 10) : id;
  return blogPosts.find((p) => p.id === num || p.slug === String(id));
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const sameCategory = blogPosts.filter(
    (p) => p.id !== post.id && p.category === post.category
  );
  const others = blogPosts.filter(
    (p) => p.id !== post.id && p.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, count);
}
