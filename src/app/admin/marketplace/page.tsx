'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const applications = [
  { id: 1, business: 'Akinwale & Associates', owner: 'Tunde Akinwale', city: 'Lagos', service: 'VAT Filing', status: 'Pending', submitted: '2 hours ago' },
  { id: 2, business: 'Balogun Tax Consult', owner: 'Aisha Balogun', city: 'Abuja', service: 'Audit Support', status: 'Pending', submitted: '5 hours ago' },
  { id: 3, business: 'NaijaBooks Pro', owner: 'Chidi Eze', city: 'Port Harcourt', service: 'Bookkeeping', status: 'Under Review', submitted: '1 day ago' },
];

export default function AdminMarketplacePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-sans">Marketplace Approvals</h1>
          <p className="text-text-muted text-sm mt-1">Review tax pro applications before they go live on the marketplace.</p>
        </div>
        <Badge variant="warning">2 pending</Badge>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{app.business}</h3>
                  <Badge variant={app.status === 'Pending' ? 'warning' : 'info'}>{app.status}</Badge>
                </div>
                <p className="text-text-muted text-sm mt-1">
                  {app.owner} · {app.city} · {app.service} · submitted {app.submitted}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/professionals">
                  <Button variant="secondary" size="sm">View Profile</Button>
                </Link>
                <Button variant="primary" size="sm">Approve →</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 flex items-center justify-between">
        <p className="text-text-secondary text-sm">See everyone already live on the public marketplace.</p>
        <Link href="/marketplace">
          <Button variant="ghost" size="sm">Open Marketplace →</Button>
        </Link>
      </Card>
    </div>
  );
}
