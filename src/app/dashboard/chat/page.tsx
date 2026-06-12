'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';
import type { ChatMessage as ChatMessageType, ChatApiResponse } from '@/lib/types';

interface TokenInfo {
  used: number;
  limit: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ used: 23, limit: 50 });
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  let messageCounter = 0;
  const generateId = () => `${uniqueId}-${++messageCounter}`;
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const getTokenColor = () => {
    const ratio = tokenInfo.used / tokenInfo.limit;
    if (ratio >= 1) return 'text-error';
    if (ratio >= 0.8) return 'text-warning';
    return 'text-success';
  };
  
  const handleSend = async (message: string) => {
    if (limitReached || isLoading) return;
    
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content: message,
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('supabase-token');
      
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });
      
      if (response.status === 429) {
        setLimitReached(true);
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: "You've reached your daily token limit. Please upgrade to Pro for more queries, or wait until tomorrow.",
          createdAt: new Date(),
        }]);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data: ChatApiResponse = await response.json();
      
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      
      setTokenInfo({
        used: tokenInfo.used + data.tokensUsed,
        limit: tokenInfo.limit,
      });
      
      const assistantMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        sources: data.sources,
        tokensUsed: data.tokensUsed,
        createdAt: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        createdAt: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-surface-raised">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary-bg border border-brand-primary-border grid place-items-center">
            <svg className="w-4 h-4 text-brand-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              <path d="M8 10h8M8 14h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-text-primary">Tax Assistant</h1>
            <p className="text-xs text-text-muted">AI-powered Nigerian tax guidance</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 text-sm font-mono ${getTokenColor()}`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>Tokens today: {tokenInfo.used}/{tokenInfo.limit}</span>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary-bg border border-brand-primary-border grid place-items-center mb-4">
              <svg className="w-8 h-8 text-brand-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Ask about Nigerian Tax Law
            </h2>
            <p className="text-text-muted text-sm max-w-md">
              I can answer questions about VAT, PAYE, withholding tax, capital gains, and more based on official tax documents.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {['What is VAT?', 'PAYE tax rates', 'Withholding tax rules'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-surface-overlay border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-overlay border border-border-default rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-action animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-action animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-action animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {limitReached && (
        <div className="px-6 py-3 bg-warning-bg border-t border-warning-border">
          <p className="text-sm text-warning-text text-center">
            Daily token limit reached.{' '}
            <a href="/pricing" className="underline font-medium">Upgrade to Pro</a>{' '}
            for unlimited queries.
          </p>
        </div>
      )}
      
      <ChatInput onSend={handleSend} disabled={isLoading || limitReached} />
    </div>
  );
}