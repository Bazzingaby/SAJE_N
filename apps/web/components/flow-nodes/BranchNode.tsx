'use client';

import type { NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { BaseNode } from './BaseNode';

export interface BranchNodeData {
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Branch node — represents a conditional branch in the workflow pipeline.
 * Pink accent, GitBranch icon, target handle on left + 2 source handles on right (true/false).
 */
export function BranchNode({ data, selected }: NodeProps) {
  const nodeData = data as BranchNodeData;

  return (
    <BaseNode
      label={nodeData.label ?? 'Condition'}
      icon={<GitBranch size={16} />}
      accentColor="#ec4899"
      selected={selected}
      showSourceHandle={false}
      showTargetHandle={true}
      extraSourceHandles={[
        {
          id: 'true',
          label: 'True',
          style: { top: '35%' },
        },
        {
          id: 'false',
          label: 'False',
          style: { top: '65%' },
        },
      ]}
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs text-text-secondary">{nodeData.description ?? 'Condition'}</p>
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span className="text-accent-green">True</span>
          <span className="text-accent-red">False</span>
        </div>
      </div>
    </BaseNode>
  );
}
