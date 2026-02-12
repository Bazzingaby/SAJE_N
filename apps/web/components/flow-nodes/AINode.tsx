'use client';

import type { NodeProps } from '@xyflow/react';
import { Bot } from 'lucide-react';
import { BaseNode } from './BaseNode';

export interface AINodeData {
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * AI node — represents an AI processing step in the workflow pipeline.
 * Indigo accent, Bot icon, both handles.
 */
export function AINode({ data, selected }: NodeProps) {
  const nodeData = data as AINodeData;

  return (
    <BaseNode
      label={nodeData.label ?? 'AI Processing'}
      icon={<Bot size={16} />}
      accentColor="#6366f1"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={true}
    >
      <p className="text-xs text-text-secondary">{nodeData.description ?? 'AI Processing'}</p>
    </BaseNode>
  );
}
