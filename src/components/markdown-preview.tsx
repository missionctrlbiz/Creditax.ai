'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div
      className={cn(
        'prose prose-invert prose-sm max-w-none p-6 overflow-y-auto',
        'prose-headings:text-text-primary prose-headings:font-semibold',
        'prose-p:text-text-secondary prose-p:leading-relaxed',
        'prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:text-brand-action prose-code:bg-surface-inset prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        'prose-pre:bg-surface-deep prose-pre:border prose-pre:border-border-default',
        'prose-ul:text-text-secondary prose-ol:text-text-secondary',
        'prose-li:marker:text-text-muted',
        'prose-strong:text-text-primary prose-strong:font-semibold',
        'prose-blockquote:border-l-brand-primary prose-blockquote:text-text-muted',
        '[&_h1]:text-xl [&_h1]:mt-0 [&_h1]:mb-4',
        '[&_h2]:text-lg [&_h2]:mt-6 [&_h2]:mb-3',
        '[&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-2',
        '[&_p]:my-3',
        '[&_ul]:my-2 [&_ol]:my-2',
        '[&_li]:my-1',
        '[&_pre]:my-4 [&_pre]:rounded-lg [&_pre]:p-4',
        '[&_code]:font-mono',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || '*No content to preview*'}
      </ReactMarkdown>
    </div>
  );
}