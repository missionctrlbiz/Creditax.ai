'use client';

import { useState } from 'react';
import { Check, Download, Pause, TriangleAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('Creditax.ai');
  const [supportEmail, setSupportEmail] = useState('support@creditax.ai');
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-[720px]">
      {/* Page Header */}
      <div className="mb-8">
        <h1>Admin Settings</h1>
        <p className="text-text-muted mt-1">Platform-wide preferences. Prototype — changes stay on this page (no server writes yet).</p>
      </div>

      {/* General */}
      <Card className="p-6">
        <form onSubmit={save} className="flex flex-col gap-4">
          <Input label="Platform name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          <Input label="Support email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="md">
              <Check size={15} />
              Save Changes
            </Button>
            {saved && (
              <Badge variant="success">
                <Check size={11} />
                Saved
              </Badge>
            )}
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-error-border">
        <div className="flex items-center gap-2 mb-2">
          <TriangleAlert className="w-4 h-4 text-error-text" />
          <h2>Danger Zone</h2>
        </div>
        <p className="text-text-muted text-sm mb-4">Prototype — these buttons navigate, they don&apos;t delete anything.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" size="md" onClick={() => toast('Signups paused (demo)', { description: 'Real signup gating is a Track B setting.' })}>
            <Pause size={15} />
            Pause Signups
          </Button>
          <Button variant="ghost" size="md" onClick={() => window.location.assign('/admin/audit')}>
            <Download size={15} />
            Export Audit Log
          </Button>
        </div>
      </Card>
    </div>
  );
}
