'use client';

import type { NodeProps } from '@xyflow/react';
import { Wand2 } from 'lucide-react';
import { BaseNode } from './BaseNode';

export interface TransformNodeData {
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Transform node — processes/transforms data in the workflow pipeline.
 * Blue accent, Wand2 icon, both handles.
 */
export function TransformNode({ data, selected }: NodeProps) {
  const nodeData = data as TransformNodeData;

  return (
    <BaseNode
      label={nodeData.label ?? 'Transform'}
      icon={<Wand2 size={16} />}
      accentColor="#3b82f6"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={true}
    >
      <p className="text-xs text-text-secondary">{nodeData.description ?? 'Transform'}</p>
    </BaseNode>
  );
}
