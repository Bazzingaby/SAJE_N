'use client';

import type { NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { SourceNodeData as SourceNodeDataType } from '@/lib/pipeline/types';

export type SourceNodeData = SourceNodeDataType;

/**
 * Source node — represents a data source in the workflow pipeline (S4.1).
 * Green accent, Database icon, source handle only (right side). Uses config from pipeline types.
 */
export function SourceNode({ data, selected }: NodeProps) {
  const nodeData = data as SourceNodeData;
  const config = nodeData.config ?? {};
  const desc = nodeData.description ?? (config.url || config.query || 'Data source');

  return (
    <BaseNode
      label={nodeData.label ?? 'Data Source'}
      icon={<Database size={16} />}
      accentColor="#22c55e"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={false}
    >
      <p className="text-xs text-text-secondary">{desc}</p>
    </BaseNode>
  );
}
