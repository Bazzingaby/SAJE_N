"use client";

import {
  Play,
  MousePointer2,
  Pencil,
  Bot,
  Save,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolbarButton } from "./ToolbarButton";
import { ModeSwitch } from "./ModeSwitch";
import { QuickActions } from "./QuickActions";

export function TouchToolbar() {
  return (
    <div
      data-testid="touch-toolbar"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex h-16 items-center justify-between",
        "border-t border-border bg-bg-secondary",
        "px-2 pb-[env(safe-area-inset-bottom)]",
        "overflow-x-auto"
      )}
    >
      {/* Left section: Run, Select, Annotate */}
      <div className="flex shrink-0 items-center gap-1">
        <ToolbarButton
          icon={<Play className="h-6 w-6" />}
          label="Run"
          onClick={() => console.log("[Toolbar] Run")}
          size="large"
          accentColor="bg-accent-green"
        />
        <ToolbarButton
          icon={<MousePointer2 className="h-5 w-5" />}
          label="Select"
          onClick={() => console.log("[Toolbar] Select")}
        />
        <ToolbarButton
          icon={<Pencil className="h-5 w-5" />}
          label="Annotate"
          onClick={() => console.log("[Toolbar] Annotate")}
        />
      </div>

      {/* Center section: Mode switch */}
      <div className="flex shrink-0 items-center px-2">
        <ModeSwitch />
      </div>

      {/* Right section: Quick actions, AI, Save, Undo */}
      <div className="flex shrink-0 items-center gap-1">
        <QuickActions />
        <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
        <ToolbarButton
          icon={<Bot className="h-5 w-5" />}
          label="AI Assistant"
          onClick={() => console.log("[Toolbar] AI Assistant")}
          size="large"
          accentColor="bg-accent-indigo"
        />
        <ToolbarButton
          icon={<Save className="h-5 w-5" />}
          label="Save"
          onClick={() => console.log("[Toolbar] Save")}
        />
        <ToolbarButton
          icon={<Undo2 className="h-5 w-5" />}
          label="Undo"
          onClick={() => console.log("[Toolbar] Undo")}
        />
      </div>
    </div>
  );
}
