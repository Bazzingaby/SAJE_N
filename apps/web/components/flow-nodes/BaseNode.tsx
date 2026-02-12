'use client';

import { type ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface BaseNodeProps {
  label: string;
  icon: ReactNode;
  accentColor: string;
  children?: ReactNode;
  selected?: boolean;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  /** Additional source handles (e.g. for branch true/false) */
  extraSourceHandles?: Array<{
    id: string;
    label: string;
    style?: React.CSSProperties;
  }>;
}

/**
 * Shared wrapper for all custom ReactFlow nodes.
 * Provides a consistent card layout with accent color bar, icon, label,
 * and touch-friendly handle sizing (24x24px visible, 12px dot).
 */
export function BaseNode({
  label,
  icon,
  accentColor,
  children,
  selected = false,
  showSourceHandle = true,
  showTargetHandle = true,
  extraSourceHandles,
}: BaseNodeProps) {
  const handleStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: '2px solid #2a2a35',
    background: '#1a1a24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      data-testid="base-node"
      className={cn(
        'relative w-[180px] rounded-lg border bg-bg-secondary transition-shadow',
        selected ? 'shadow-lg' : 'border-border',
      )}
      style={
        selected ? { borderColor: accentColor, boxShadow: `0 0 12px ${accentColor}40` } : undefined
      }
    >
      {/* Accent bar */}
      <div
        className="h-1 w-full rounded-t-lg"
        style={{ backgroundColor: accentColor }}
        data-testid="accent-bar"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </span>
        <span className="truncate text-xs font-medium text-text-primary">{label}</span>
      </div>

      {/* Content area — min 44px for touch */}
      {children && <div className="min-h-[44px] border-t border-border px-3 py-2">{children}</div>}

      {/* Target handle (left) */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...handleStyle,
            left: -12,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: accentColor,
              pointerEvents: 'none',
            }}
          />
        </Handle>
      )}

      {/* Source handle (right) */}
      {showSourceHandle && !extraSourceHandles && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            ...handleStyle,
            right: -12,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: accentColor,
              pointerEvents: 'none',
            }}
          />
        </Handle>
      )}

      {/* Extra source handles (for Branch node, etc.) */}
      {extraSourceHandles?.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type="source"
          position={Position.Right}
          style={{
            ...handleStyle,
            right: -12,
            ...handle.style,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: accentColor,
              pointerEvents: 'none',
            }}
          />
        </Handle>
      ))}
    </div>
  );
}
