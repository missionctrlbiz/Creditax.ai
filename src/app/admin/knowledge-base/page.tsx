'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const documents = [
  { id: 1, title: 'VAT Guide 2025 — FIRS', chunks: 48, updated: 'Jun 10, 2026', status: 'Published' },
  { id: 2, title: 'PAYE Bands & Reliefs', chunks: 32, updated: 'Jun 8, 2026', status: 'Published' },
  { id: 3, title: 'WHT Rates by Transaction', chunks: 21, updated: 'Jun 5, 2026', status: 'Draft' },
  { id: 4, title: 'TIN Registration Steps', chunks: 12, updated: 'Jun 1, 2026', status: 'Published' },
];

export default function AdminKnowledgeBasePage() {
  const [query, setQuery] = useState('');

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-sans">Knowledge Base</h1>
          <p className="text-text-muted text-sm mt-1">Documents that power the AI Tax Assistant&apos;s answers.</p>
        </div>
        <Button variant="primary" size="sm">+ Add Document</Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-text-primary">{doc.title}</h3>
              <Badge variant={doc.status === 'Published' ? 'success' : 'warning'}>{doc.status}</Badge>
            </div>
            <p className="text-text-muted text-sm mt-2">
              {doc.chunks} chunks · updated {doc.updated}
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Re-index</Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-text-secondary text-sm">No documents match &quot;{query}&quot;.</p>
        </Card>
      )}
    </div>
  );
}
