'use client';

import { useWorkspaceStore } from '@/lib/store';
import type { CanvasMode } from '@/lib/store/types';
import { cn } from '@/lib/utils';
import { CodeCanvas } from '@/components/canvas/CodeCanvas';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { DataCanvas } from '@/components/canvas/DataCanvas';
import { BoardCanvas } from '@/components/canvas/BoardCanvas';

const canvasModeConfig: Record<CanvasMode, { label: string; accent: string }> = {
  code: { label: 'Code', accent: 'bg-accent-blue' },
  design: { label: 'Design', accent: 'bg-accent-purple' },
  flow: { label: 'Flow', accent: 'bg-accent-green' },
  data: { label: 'Data', accent: 'bg-accent-amber' },
  board: { label: 'Board', accent: 'bg-accent-pink' },
};

const canvasComponents: Record<CanvasMode, React.ComponentType> = {
  code: CodeCanvas,
  design: DesignCanvas,
  flow: WorkflowCanvas,
  data: DataCanvas,
  board: BoardCanvas,
};

export function MainCanvas() {
  const canvasMode = useWorkspaceStore((s) => s.canvasMode);
  const config = canvasModeConfig[canvasMode];
  const CanvasComponent = canvasComponents[canvasMode];

  return (
    <div data-testid="main-canvas" className="flex h-full flex-col bg-bg-primary">
      {/* Mode indicator bar */}
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-border bg-bg-secondary px-3">
        <span className={cn('h-2 w-2 rounded-full', config.accent)} aria-hidden="true" />
        <span className="text-xs font-medium text-text-secondary">{config.label} Mode</span>
      </div>

      {/* Active canvas */}
      <div className="flex-1 overflow-hidden">
        <CanvasComponent />
      </div>
    </div>
  );
}
