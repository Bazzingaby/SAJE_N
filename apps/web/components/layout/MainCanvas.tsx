"use client";

import { cn } from "@/lib/utils";

export type CanvasMode = "code" | "design" | "flow" | "data" | "board";

const canvasModeConfig: Record<
  CanvasMode,
  { label: string; accent: string; bgAccent: string }
> = {
  code: {
    label: "Code",
    accent: "bg-accent-blue",
    bgAccent: "text-accent-blue",
  },
  design: {
    label: "Design",
    accent: "bg-accent-purple",
    bgAccent: "text-accent-purple",
  },
  flow: {
    label: "Flow",
    accent: "bg-accent-green",
    bgAccent: "text-accent-green",
  },
  data: {
    label: "Data",
    accent: "bg-accent-amber",
    bgAccent: "text-accent-amber",
  },
  board: {
    label: "Board",
    accent: "bg-accent-pink",
    bgAccent: "text-accent-pink",
  },
};

interface MainCanvasProps {
  canvasMode: CanvasMode;
  children?: React.ReactNode;
}

export function MainCanvas({ canvasMode, children }: MainCanvasProps) {
  const config = canvasModeConfig[canvasMode];

  return (
    <div
      data-testid="main-canvas"
      className="flex h-full flex-col bg-bg-primary"
    >
      {/* Tab bar */}
      <div
        className="flex h-9 items-center border-b border-border bg-bg-secondary"
        role="tablist"
        aria-label="Open files"
      >
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="flex h-9 items-center gap-2 border-r border-border px-4 text-xs text-text-primary"
        >
          <span
            className={cn("h-2 w-2 rounded-full", config.accent)}
            aria-hidden="true"
          />
          Welcome
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {children ? (
          children
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span
                className={cn("h-3 w-3 rounded-full", config.accent)}
                aria-hidden="true"
              />
              <span className={cn("text-lg font-medium", config.bgAccent)}>
                {config.label} Canvas
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              {config.label} mode is active. Start building here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
