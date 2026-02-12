'use client';

import { cn } from '@/lib/utils';

export function DesignCanvas() {
  return (
    <div
      data-testid="design-canvas"
      className="flex h-full w-full flex-col items-center justify-center bg-bg-primary"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple text-lg',
          )}
        >
          UI
        </span>
        <h2 className="text-lg font-medium text-accent-purple">Design Canvas</h2>
        <p className="max-w-sm text-center text-sm text-text-secondary">
          Visual UI builder with component library. Design interfaces that generate real code.
        </p>
      </div>
    </div>
  );
}
