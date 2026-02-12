'use client';

import { cn } from '@/lib/utils';

export function WorkflowCanvas() {
  return (
    <div
      data-testid="workflow-canvas"
      className="flex h-full w-full flex-col items-center justify-center bg-bg-primary"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/20 text-accent-green text-lg',
          )}
        >
          {'->'}
        </span>
        <h2 className="text-lg font-medium text-accent-green">Workflow Canvas</h2>
        <p className="max-w-sm text-center text-sm text-text-secondary">
          Visual node-based pipeline editor. Drag nodes from the palette, connect them, and build
          data workflows.
        </p>
      </div>
    </div>
  );
}
