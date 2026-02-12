'use client';

import { cn } from '@/lib/utils';

export function DataCanvas() {
  return (
    <div
      data-testid="data-canvas"
      className="flex h-full w-full flex-col items-center justify-center bg-bg-primary"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-accent-amber/20 text-accent-amber text-lg',
          )}
        >
          DB
        </span>
        <h2 className="text-lg font-medium text-accent-amber">Data Canvas</h2>
        <p className="max-w-sm text-center text-sm text-text-secondary">
          SQL console, table viewer, chart builder, and data profiling tools.
        </p>
      </div>
    </div>
  );
}
