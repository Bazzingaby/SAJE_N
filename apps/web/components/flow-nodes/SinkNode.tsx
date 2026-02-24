'use client';

import type { NodeProps } from '@xyflow/react';
import { Download } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { SinkNodeData as SinkNodeDataType } from '@/lib/pipeline/types';

export type SinkNodeData = SinkNodeDataType;

/**
 * Sink node — represents an output/destination in the workflow pipeline (S4.1).
 * Amber accent, Download icon, target handle only (left side). Uses config from pipeline types.
 */
export function SinkNode({ data, selected }: NodeProps) {
  const nodeData = data as SinkNodeData;
  const config = nodeData.config ?? {};
  const desc = nodeData.description ?? (config.table || config.path || 'Output');

  return (
    <BaseNode
      label={nodeData.label ?? 'Output'}
      icon={<Download size={16} />}
      accentColor="#f59e0b"
      selected={selected}
      showSourceHandle={false}
      showTargetHandle={true}
    >
      <p className="text-xs text-text-secondary truncate" title={desc}>
        {desc}
      </p>
    </BaseNode>
  );
}
