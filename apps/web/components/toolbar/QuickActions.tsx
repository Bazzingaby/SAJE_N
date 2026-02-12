"use client";

import {
  Wand2,
  MessageSquare,
  Search,
  AlignCenter,
  Group,
  Layers,
  PlusCircle,
  Play,
  CheckCircle,
  Download,
  RefreshCw,
  Plus,
  Filter,
  Timer,
} from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import type { CanvasMode } from "@/lib/store/types";
import { ToolbarButton } from "./ToolbarButton";

interface ActionDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const actionsByMode: Record<CanvasMode, ActionDefinition[]> = {
  code: [
    { id: "format", label: "Format", icon: Wand2 },
    { id: "comment", label: "Comment", icon: MessageSquare },
    { id: "find", label: "Find", icon: Search },
  ],
  design: [
    { id: "align", label: "Align", icon: AlignCenter },
    { id: "group", label: "Group", icon: Group },
    { id: "layers", label: "Layers", icon: Layers },
  ],
  flow: [
    { id: "add-node", label: "Add Node", icon: PlusCircle },
    { id: "run-flow", label: "Run", icon: Play },
    { id: "validate", label: "Validate", icon: CheckCircle },
  ],
  data: [
    { id: "execute", label: "Execute", icon: Play },
    { id: "export", label: "Export", icon: Download },
    { id: "refresh", label: "Refresh", icon: RefreshCw },
  ],
  board: [
    { id: "new-card", label: "New Card", icon: Plus },
    { id: "filter", label: "Filter", icon: Filter },
    { id: "sprint", label: "Sprint", icon: Timer },
  ],
};

export function QuickActions() {
  const canvasMode = useWorkspaceStore((s) => s.canvasMode);
  const actions = actionsByMode[canvasMode];

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Quick actions">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <ToolbarButton
            key={action.id}
            icon={<Icon className="h-5 w-5" />}
            label={action.label}
            onClick={() => {
              // Placeholder: actions will be wired in future sprints
              console.log(`[QuickAction] ${action.id} triggered in ${canvasMode} mode`);
            }}
          />
        );
      })}
    </div>
  );
}
