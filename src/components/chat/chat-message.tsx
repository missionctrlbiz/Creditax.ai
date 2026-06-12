'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, Source } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());
  
  const isUser = message.role === 'user';
  
  const toggleSource = (index: number) => {
    setExpandedSources(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 relative group ${
          isUser
            ? 'bg-brand-action text-text-inverse rounded-br-md'
            : 'bg-surface-overlay border border-border-default rounded-bl-md'
        }`}
      >
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-text-inverse' : 'text-text-primary'}`}>
          {message.content}
        </p>
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border-default">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
              Sources
            </p>
            <div className="flex flex-col gap-2">
              {message.sources.map((source: Source, index: number) => (
                <button
                  key={index}
                  onClick={() => toggleSource(index)}
                  className="text-left p-2 rounded-lg bg-surface-base border border-border-subtle hover:border-border-default transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-brand-primary">
                      {source.title}
                    </span>
                    <svg
                      className={`w-3 h-3 text-text-muted flex-shrink-0 transition-transform ${expandedSources.has(index) ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {expandedSources.has(index) && (
                    <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                      {source.snippet}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {!isUser && message.tokensUsed && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-text-muted">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>{message.tokensUsed} tokens</span>
          </div>
        )}
        
        <div
          className={`absolute -top-5 ${isUser ? 'right-0' : 'left-0'} text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}