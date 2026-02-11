"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function AIPanel() {
  const [input, setInput] = useState("");

  return (
    <div
      data-testid="ai-panel"
      className="flex h-full flex-col border-l border-border bg-bg-secondary"
    >
      {/* Header */}
      <div className="flex h-12 items-center gap-2 border-b border-border px-4">
        <Sparkles className="h-4 w-4 text-accent-indigo" aria-hidden="true" />
        <h2 className="text-sm font-medium text-text-primary">AI Assistant</h2>
      </div>

      {/* Scrollable chat area */}
      <ScrollArea className="flex-1">
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-indigo/10">
            <Sparkles
              className="h-6 w-6 text-accent-indigo"
              aria-hidden="true"
            />
          </div>
          <p className="text-center text-sm text-text-secondary">
            Ask me anything about your code...
          </p>
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            className={cn(
              "h-10 flex-1 rounded-md border border-border bg-bg-primary px-3 text-sm text-text-primary",
              "placeholder:text-text-secondary",
              "focus:border-accent-indigo focus:outline-none focus:ring-1 focus:ring-accent-indigo"
            )}
            aria-label="AI chat input"
          />
          <button
            type="button"
            disabled={!input.trim()}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              "bg-accent-indigo text-white hover:bg-accent-indigo/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
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
