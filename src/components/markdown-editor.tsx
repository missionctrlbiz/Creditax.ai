'use client';

import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({ value, onChange, className }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  }, [value, onChange]);

  const lines = value.split('\n');
  const lineNumbers = lines.map((_, i) => i + 1);

  return (
    <div className={cn('flex h-full rounded-lg border border-border-default overflow-hidden bg-surface-base', className)}>
      <div className="w-12 flex-shrink-0 bg-surface-inset border-r border-border-default overflow-hidden">
        <div className="py-3 pr-2 text-right">
          {lineNumbers.map((num) => (
            <div
              key={num}
              className="text-[11px] font-mono text-text-muted leading-[1.6] h-[1.6em]"
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className={cn(
          'flex-1 w-full p-4 font-mono text-sm text-text-primary',
          'bg-transparent resize-none focus:outline-none',
          'leading-[1.6] whitespace-pre-wrap',
          'placeholder:text-text-placeholder'
        )}
        placeholder="Write your content in Markdown..."
      />
    </div>
  );
}