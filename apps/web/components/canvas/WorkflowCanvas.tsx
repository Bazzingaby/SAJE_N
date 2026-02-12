'use client';

import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge as rfAddEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Database, Wand2, Download, Bot, Code2, GitBranch } from 'lucide-react';
import { SourceNode } from '@/components/flow-nodes/SourceNode';
import { TransformNode } from '@/components/flow-nodes/TransformNode';
import { SinkNode } from '@/components/flow-nodes/SinkNode';
import { AINode } from '@/components/flow-nodes/AINode';
import { FunctionNode } from '@/components/flow-nodes/FunctionNode';
import { BranchNode } from '@/components/flow-nodes/BranchNode';
import { useWorkspaceStore } from '@/lib/store';

const nodeTypes = {
  source: SourceNode,
  transform: TransformNode,
  sink: SinkNode,
  ai: AINode,
  function: FunctionNode,
  branch: BranchNode,
};

const DEFAULT_NODES: Node[] = [
  {
    id: 'source-1',
    type: 'source',
    position: { x: 100, y: 200 },
    data: { label: 'CSV Source', description: 'reads data.csv' },
  },
  {
    id: 'transform-1',
    type: 'transform',
    position: { x: 380, y: 200 },
    data: { label: 'Filter Rows', description: 'age > 18' },
  },
  {
    id: 'sink-1',
    type: 'sink',
    position: { x: 660, y: 200 },
    data: { label: 'PostgreSQL', description: 'writes to db' },
  },
];

const DEFAULT_EDGES: Edge[] = [
  { id: 'e-src-tf', source: 'source-1', target: 'transform-1' },
  { id: 'e-tf-sink', source: 'transform-1', target: 'sink-1' },
];

interface PaletteItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
  defaultData: Record<string, string>;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'source',
    label: 'Source',
    icon: <Database size={16} />,
    accentColor: '#22c55e',
    defaultData: { label: 'Data Source', description: 'data source' },
  },
  {
    type: 'transform',
    label: 'Transform',
    icon: <Wand2 size={16} />,
    accentColor: '#3b82f6',
    defaultData: { label: 'Transform', description: 'transform data' },
  },
  {
    type: 'sink',
    label: 'Output',
    icon: <Download size={16} />,
    accentColor: '#f59e0b',
    defaultData: { label: 'Output', description: 'write output' },
  },
  {
    type: 'ai',
    label: 'AI',
    icon: <Bot size={16} />,
    accentColor: '#6366f1',
    defaultData: { label: 'AI Processing', description: 'AI step' },
  },
  {
    type: 'function',
    label: 'Function',
    icon: <Code2 size={16} />,
    accentColor: '#a855f7',
    defaultData: { label: 'Custom Function', description: 'custom logic' },
  },
  {
    type: 'branch',
    label: 'Branch',
    icon: <GitBranch size={16} />,
    accentColor: '#ec4899',
    defaultData: { label: 'Condition', description: 'if/else' },
  },
];

let nodeIdCounter = 200;

const NODE_COLORS: Record<string, string> = {
  source: '#22c55e',
  transform: '#3b82f6',
  sink: '#f59e0b',
  ai: '#6366f1',
  function: '#a855f7',
  branch: '#ec4899',
};

function WorkflowCanvasInner() {
  const storeNodes = useWorkspaceStore((s) => s.nodes);
  const storeEdges = useWorkspaceStore((s) => s.edges);
  const setStoreNodes = useWorkspaceStore((s) => s.setNodes);
  const setStoreEdges = useWorkspaceStore((s) => s.setEdges);

  const initialNodes = storeNodes.length > 0 ? storeNodes : DEFAULT_NODES;
  const initialEdges = storeEdges.length > 0 ? storeEdges : DEFAULT_EDGES;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = rfAddEdge(connection, edges);
      setEdges(newEdges);
      setStoreEdges(newEdges);
    },
    [edges, setEdges, setStoreEdges],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type');
      const dataStr = event.dataTransfer.getData('application/reactflow-data');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = `${type}-${++nodeIdCounter}`;
      const defaultData = dataStr
        ? (JSON.parse(dataStr) as Record<string, string>)
        : { label: type, description: '' };

      const newNode: Node = { id, type, position, data: defaultData };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      setStoreNodes(newNodes);
    },
    [nodes, setNodes, setStoreNodes, reactFlowInstance],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex h-full w-full" data-testid="workflow-canvas">
      {/* Node palette */}
      <aside
        className="flex w-44 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border bg-bg-secondary p-3"
        data-testid="node-palette"
        aria-label="Node palette"
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Nodes
        </p>
        {PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow-type', item.type);
              e.dataTransfer.setData(
                'application/reactflow-data',
                JSON.stringify(item.defaultData),
              );
              e.dataTransfer.effectAllowed = 'move';
            }}
            role="button"
            tabIndex={0}
            className="flex min-h-[44px] cursor-grab items-center gap-2 rounded-md border border-border bg-bg-primary px-3 py-2 transition-colors hover:border-accent-green/50 hover:bg-bg-tertiary active:cursor-grabbing"
            data-testid={`palette-item-${item.type}`}
            aria-label={`Drag ${item.label} node`}
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm"
              style={{ backgroundColor: `${item.accentColor}20`, color: item.accentColor }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium text-text-primary">{item.label}</span>
          </div>
        ))}
      </aside>

      {/* ReactFlow canvas */}
      <div
        ref={reactFlowWrapper}
        className="flex-1"
        onDrop={onDrop}
        onDragOver={onDragOver}
        data-testid="reactflow-wrapper"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          className="bg-bg-primary"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a35" />
          <Controls />
          <MiniMap nodeColor={(node) => NODE_COLORS[node.type ?? ''] ?? '#6366f1'} />
        </ReactFlow>
      </div>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
