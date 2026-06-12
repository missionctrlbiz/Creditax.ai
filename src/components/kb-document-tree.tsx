'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KBDocument {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
}

interface DocumentTreeProps {
  documents: KBDocument[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const categories = ['VAT', 'Income Tax', 'WHT', 'CGT', 'General'];

export function DocumentTree({ documents, selectedId, onSelect }: DocumentTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories)
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const groupedDocs = categories.reduce((acc, category) => {
    acc[category] = documents.filter((doc) => doc.category === category);
    return acc;
  }, {} as Record<string, KBDocument[]>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border-default">
        <h2 className="text-sm font-semibold text-text-primary">Documents</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => {
          const docs = groupedDocs[category] || [];
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="mb-1">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[var(--color-hover-overlay)] transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                )}
                <span className="text-sm font-medium text-text-primary">{category}</span>
                <span className="text-xs text-text-muted ml-auto">({docs.length})</span>
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {docs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onSelect(doc.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left',
                        selectedId === doc.id
                          ? 'bg-brand-primary-bg text-brand-primary border border-brand-primary-border'
                          : 'text-text-secondary hover:bg-[var(--color-hover-overlay)] hover:text-text-primary'
                      )}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{doc.title}</span>
                      {doc.status === 'draft' && (
                        <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}