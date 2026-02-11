"use client";

import { cn } from "@/lib/utils";

interface PanelPlaceholderProps {
  title: string;
  description?: string;
  accentColor?: string;
}

export function PanelPlaceholder({
  title,
  description,
  accentColor = "text-text-secondary",
}: PanelPlaceholderProps) {
  return (
    <div
      data-testid="panel-placeholder"
      className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border border-border bg-bg-secondary p-6"
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-bg-tertiary",
          accentColor
        )}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60"
        >
          <rect
            x="2"
            y="2"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="max-w-xs text-center text-xs text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
