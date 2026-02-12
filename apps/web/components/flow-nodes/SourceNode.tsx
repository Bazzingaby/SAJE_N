'use client';

import type { NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import { BaseNode } from './BaseNode';

export interface SourceNodeData {
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Source node — represents a data source in the workflow pipeline.
 * Green accent, Database icon, source handle only (right side).
 */
export function SourceNode({ data, selected }: NodeProps) {
  const nodeData = data as SourceNodeData;

  return (
    <BaseNode
      label={nodeData.label ?? 'Data Source'}
      icon={<Database size={16} />}
      accentColor="#22c55e"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={false}
    >
      <p className="text-xs text-text-secondary">{nodeData.description ?? 'Data source'}</p>
    </BaseNode>
  );
}
