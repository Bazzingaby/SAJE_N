'use client';

import { cn } from '@/lib/utils';

export function BoardCanvas() {
  return (
    <div
      data-testid="board-canvas"
      className="flex h-full w-full flex-col items-center justify-center bg-bg-primary"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-accent-pink/20 text-accent-pink text-lg',
          )}
        >
          PM
        </span>
        <h2 className="text-lg font-medium text-accent-pink">Board Canvas</h2>
        <p className="max-w-sm text-center text-sm text-text-secondary">
          Kanban board, sprint planning, and AI agent tracking for project management.
        </p>
      </div>
    </div>
  );
}
