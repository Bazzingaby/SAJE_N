'use client';

import type { NodeProps } from '@xyflow/react';
import { Download } from 'lucide-react';
import { BaseNode } from './BaseNode';

export interface SinkNodeData {
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Sink node — represents an output/destination in the workflow pipeline.
 * Amber accent, Download icon, target handle only (left side).
 */
export function SinkNode({ data, selected }: NodeProps) {
  const nodeData = data as SinkNodeData;

  return (
    <BaseNode
      label={nodeData.label ?? 'Output'}
      icon={<Download size={16} />}
      accentColor="#f59e0b"
      selected={selected}
      showSourceHandle={false}
      showTargetHandle={true}
    >
      <p className="text-xs text-text-secondary">{nodeData.description ?? 'Output'}</p>
    </BaseNode>
  );
}
