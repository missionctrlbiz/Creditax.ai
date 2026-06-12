'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };
  
  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex items-end gap-3 p-4 bg-surface-raised border-t border-border-default">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about Nigerian tax law..."
          disabled={disabled}
          rows={1}
          className="w-full min-h-[44px] max-h-[120px] px-4 py-3 bg-surface-base border border-border-strong rounded-xl text-sm text-text-primary placeholder:text-text-placeholder resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        variant="primary"
        size="md"
        className="h-[44px] px-5 flex-shrink-0"
      >
        <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        <span className="hidden sm:inline">Send</span>
      </Button>
    </div>
  );
}