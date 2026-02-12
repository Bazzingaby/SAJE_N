"use client";

import { Code2, Palette, GitBranch, Database, LayoutGrid } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import type { CanvasMode } from "@/lib/store/types";
import { cn } from "@/lib/utils";
import { ToolbarButton } from "./ToolbarButton";

interface ModeDefinition {
  mode: CanvasMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const modes: ModeDefinition[] = [
  { mode: "code", label: "Code", icon: Code2, accentColor: "bg-accent-blue" },
  {
    mode: "design",
    label: "Design",
    icon: Palette,
    accentColor: "bg-accent-purple",
  },
  {
    mode: "flow",
    label: "Flow",
    icon: GitBranch,
    accentColor: "bg-accent-green",
  },
  {
    mode: "data",
    label: "Data",
    icon: Database,
    accentColor: "bg-accent-amber",
  },
  {
    mode: "board",
    label: "Board",
    icon: LayoutGrid,
    accentColor: "bg-accent-pink",
  },
];

interface ModeSwitchProps {
  showLabels?: boolean;
}

export function ModeSwitch({ showLabels = false }: ModeSwitchProps) {
  const canvasMode = useWorkspaceStore((s) => s.canvasMode);
  const setCanvasMode = useWorkspaceStore((s) => s.setCanvasMode);

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-xl bg-bg-tertiary/50 p-1"
      )}
      role="tablist"
      aria-label="Canvas mode"
    >
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = canvasMode === m.mode;

        return (
          <div key={m.mode} className="flex flex-col items-center">
            <ToolbarButton
              icon={<Icon className="h-5 w-5" />}
              label={m.label}
              onClick={() => setCanvasMode(m.mode)}
              isActive={isActive}
              accentColor={m.accentColor}
            />
            {showLabels && (
              <span
                className={cn(
                  "mt-0.5 text-[10px] leading-none",
                  isActive ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {m.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
