'use client';

import type { NodeProps } from '@xyflow/react';
import { Wand2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { TransformNodeData as TransformNodeDataType } from '@/lib/pipeline/types';

export type TransformNodeData = TransformNodeDataType;

/**
 * Transform node — processes/transforms data in the workflow pipeline (S4.1).
 * Blue accent, Wand2 icon, both handles. Uses config from pipeline types.
 */
export function TransformNode({ data, selected }: NodeProps) {
  const nodeData = data as TransformNodeData;
  const config = nodeData.config ?? {};
  const desc = nodeData.description ?? (config.expression || 'Transform');

  return (
    <BaseNode
      label={nodeData.label ?? 'Transform'}
      icon={<Wand2 size={16} />}
      accentColor="#3b82f6"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={true}
    >
      <p className="text-xs text-text-secondary truncate" title={desc}>
        {desc}
      </p>
    </BaseNode>
  );
}
