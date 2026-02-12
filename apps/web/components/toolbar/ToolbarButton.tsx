"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  accentColor?: string;
  size?: "default" | "large";
  disabled?: boolean;
}

export function ToolbarButton({
  icon,
  label,
  onClick,
  isActive = false,
  accentColor = "bg-accent-blue",
  size = "default",
  disabled = false,
}: ToolbarButtonProps) {
  const sizeClasses = size === "large" ? "h-14 w-14" : "h-12 w-12";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={cn(
              "inline-flex items-center justify-center rounded-lg transition-all duration-150",
              "active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-1",
              sizeClasses,
              isActive
                ? cn(accentColor, "text-white")
                : "bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
              disabled && "pointer-events-none opacity-40"
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
