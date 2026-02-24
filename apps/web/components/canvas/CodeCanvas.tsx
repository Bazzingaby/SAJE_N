'use client';

import { useCallback, useMemo } from 'react';
import { useWorkspaceStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { MonacoWrapper } from './MonacoWrapper';
import type { InlineAIAction } from './MonacoWrapper';
import { runAgent } from '@/lib/ai/agents';

/**
 * Main Code canvas — renders a tab bar of open files and the Monaco editor
 * for the currently active tab.
 *
 * Reads its state exclusively from the Zustand workspace store.
 */
export function CodeCanvas() {
  const openTabs = useWorkspaceStore((s) => s.openTabs);
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const files = useWorkspaceStore((s) => s.files);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const closeTab = useWorkspaceStore((s) => s.closeTab);
  const updateFileContent = useWorkspaceStore((s) => s.updateFileContent);
  const llmConfig = useWorkspaceStore((s) => s.llmConfig);

  const activeTab = useMemo(
    () => openTabs.find((t) => t.id === activeTabId) ?? null,
    [openTabs, activeTabId],
  );

  const activeFile = useMemo(() => {
    if (!activeTab) return null;
    // Recursively search the file tree
    function findFile(nodes: typeof files, path: string): (typeof files)[number] | null {
      for (const node of nodes) {
        if (node.path === path) return node;
        if (node.children) {
          const found = findFile(node.children, path);
          if (found) return found;
        }
      }
      return null;
    }
    return findFile(files, activeTab.filePath);
  }, [files, activeTab]);

  const handleContentChange = useCallback(
    (value: string) => {
      if (activeTab) {
        updateFileContent(activeTab.filePath, value);
      }
    },
    [activeTab, updateFileContent],
  );

  const handleInlineAIRequest = useCallback(
    async (action: InlineAIAction, selectedText: string): Promise<string> => {
      const result = await runAgent(llmConfig, 'coder', {
        instruction:
          action === 'explain'
            ? 'Explain this code.'
            : action === 'refactor'
              ? 'Refactor this code.'
              : 'Suggest or write tests for this code.',
        selectedText,
        filePath: activeTab?.filePath,
        language: activeFile?.language,
      });
      return result.content;
    },
    [llmConfig, activeTab, activeFile],
  );

  // --- Empty state ---
  if (openTabs.length === 0) {
    return (
      <div
        data-testid="code-canvas-empty"
        className="flex h-full w-full flex-col items-center justify-center bg-bg-primary"
      >
        <p className="text-sm text-text-secondary">Open a file to start editing</p>
      </div>
    );
  }

  return (
    <div data-testid="code-canvas" className="flex h-full w-full flex-col bg-bg-primary">
      {/* ── Tab bar ── */}
      <div
        className="flex h-9 shrink-0 items-center overflow-x-auto border-b border-border bg-bg-secondary"
        role="tablist"
        aria-label="Open files"
      >
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                'group flex h-9 min-w-[44px] cursor-pointer items-center gap-1.5 border-r border-border px-3 text-xs transition-colors select-none',
                isActive
                  ? 'bg-bg-primary text-text-primary border-b-2 border-b-accent-blue'
                  : 'text-text-secondary hover:bg-bg-tertiary',
              )}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }
              }}
            >
              {/* Dirty indicator */}
              {tab.isDirty && (
                <span
                  data-testid={`dirty-indicator-${tab.id}`}
                  className="h-2 w-2 shrink-0 rounded-full bg-accent-blue"
                  aria-label="Unsaved changes"
                />
              )}

              <span className="truncate max-w-[120px]">{tab.fileName}</span>

              {/* Close button */}
              <button
                type="button"
                aria-label={`Close ${tab.fileName}`}
                className={cn(
                  'ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
                  'opacity-0 group-hover:opacity-100 focus:opacity-100',
                  isActive && 'opacity-100',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Editor area ── */}
      <div className="relative flex-1 overflow-hidden">
        {activeFile ? (
          <MonacoWrapper
            filePath={activeFile.path}
            content={activeFile.content ?? ''}
            language={activeFile.language ?? 'plaintext'}
            onChange={handleContentChange}
            onInlineAIRequest={handleInlineAIRequest}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            File not found
          </div>
        )}
      </div>
    </div>
  );
}
