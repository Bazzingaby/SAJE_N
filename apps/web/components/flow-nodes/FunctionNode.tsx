'use client';

import type { NodeProps } from '@xyflow/react';
import { Code2 } from 'lucide-react';
import { BaseNode } from './BaseNode';

export interface FunctionNodeData {
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Function node — represents a custom function step in the workflow pipeline.
 * Purple accent, Code2 icon, both handles.
 */
export function FunctionNode({ data, selected }: NodeProps) {
  const nodeData = data as FunctionNodeData;

  return (
    <BaseNode
      label={nodeData.label ?? 'Custom Function'}
      icon={<Code2 size={16} />}
      accentColor="#a855f7"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={true}
    >
      <p className="text-xs text-text-secondary">{nodeData.description ?? 'Custom Function'}</p>
    </BaseNode>
  );
}
