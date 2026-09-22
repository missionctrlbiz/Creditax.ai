'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-sans">Admin Settings</h1>
        <p className="text-text-muted text-sm mt-1">Platform-wide preferences. Prototype — changes stay on this page.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={save} className="flex flex-col gap-4">
          <Input label="Platform name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          <Input label="Support email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">Save Changes</Button>
            {saved && <span className="text-brand-action text-sm font-medium">Saved ✓</span>}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-text-primary mb-2">Danger Zone</h2>
        <p className="text-text-muted text-sm mb-4">Prototype — these buttons navigate, they don&apos;t delete anything.</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Pause Signups</Button>
          <Button variant="ghost" size="sm">Export Audit Log</Button>
        </div>
      </Card>
    </div>
  );
}
