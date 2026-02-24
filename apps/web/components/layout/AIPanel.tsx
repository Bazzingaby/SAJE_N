'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/store';
import type { ChatMessage as StoreChatMessage } from '@/lib/store/types';
import { chat } from '@/lib/ai';
import type { ChatMessage as RouterChatMessage } from '@/lib/ai/types';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AIPanel() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatHistory = useWorkspaceStore((s) => s.chatHistory);
  const addChatMessage = useWorkspaceStore((s) => s.addChatMessage);
  const llmConfig = useWorkspaceStore((s) => s.llmConfig);

  useEffect(() => {
    const el = scrollRef.current;
    if (el?.scrollIntoView && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, streamingContent]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);
    const userMessage: StoreChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addChatMessage(userMessage);

    const messagesForRouter: RouterChatMessage[] = [
      ...chatHistory.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
      { role: 'user', content: text },
    ];

    setLoading(true);
    setStreamingContent('');

    try {
      const full = await chat(llmConfig, messagesForRouter, undefined, (chunk) => {
        setStreamingContent((prev) => prev + chunk);
      });
      const assistantMessage: StoreChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: full,
        timestamp: Date.now(),
      };
      addChatMessage(assistantMessage);
      setStreamingContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setStreamingContent('');
    } finally {
      setLoading(false);
    }
  };

  const hasMessages = chatHistory.length > 0 || streamingContent.length > 0;

  return (
    <div
      data-testid="ai-panel"
      className="flex h-full flex-col border-l border-border bg-bg-secondary"
    >
      <div className="flex h-12 items-center gap-2 border-b border-border px-4">
        <Sparkles className="h-4 w-4 text-accent-indigo" aria-hidden="true" />
        <h2 className="text-sm font-medium text-text-primary">AI Assistant</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-3">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-indigo/10">
                <Sparkles className="h-6 w-6 text-accent-indigo" aria-hidden="true" />
              </div>
              <p className="text-center text-sm text-text-secondary">
                Ask me anything about your code...
              </p>
            </div>
          )}
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2 rounded-lg px-3 py-2',
                msg.role === 'user' ? 'ml-8 bg-bg-tertiary' : 'mr-8 bg-accent-indigo/10',
              )}
            >
              {msg.role === 'user' ? (
                <User className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
              ) : (
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-indigo" aria-hidden />
              )}
              <p className="min-h-[44px] flex-1 whitespace-pre-wrap break-words text-sm text-text-primary">
                {msg.content}
              </p>
            </div>
          ))}
          {streamingContent.length > 0 && (
            <div className="flex gap-2 rounded-lg bg-accent-indigo/10 px-3 py-2 mr-8">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-indigo" aria-hidden />
              <p className="min-h-[44px] flex-1 whitespace-pre-wrap break-words text-sm text-text-primary">
                {streamingContent}
              </p>
            </div>
          )}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask AI..."
            className={cn(
              'min-h-[44px] flex-1 rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary',
              'placeholder:text-text-secondary',
              'focus:border-accent-indigo focus:outline-none focus:ring-1 focus:ring-accent-indigo',
            )}
            aria-label="AI chat input"
            disabled={loading}
          />
          <button
            type="button"
            disabled={!input.trim() || loading}
            onClick={handleSend}
            className={cn(
              'flex h-11 w-11 min-w-[44px] items-center justify-center rounded-md transition-colors',
              'bg-accent-indigo text-white hover:bg-accent-indigo/90',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
