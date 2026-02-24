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
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Database, Wand2, Download, Bot, Code2, GitBranch, Copy, Trash2, Play } from 'lucide-react';
import { SourceNode } from '@/components/flow-nodes/SourceNode';
import { TransformNode } from '@/components/flow-nodes/TransformNode';
import { SinkNode } from '@/components/flow-nodes/SinkNode';
import { AINode } from '@/components/flow-nodes/AINode';
import { FunctionNode } from '@/components/flow-nodes/FunctionNode';
import { BranchNode } from '@/components/flow-nodes/BranchNode';
import { useWorkspaceStore } from '@/lib/store';
import {
  DEFAULT_SOURCE_CONFIG,
  DEFAULT_TRANSFORM_CONFIG,
  DEFAULT_SINK_CONFIG,
} from '@/lib/pipeline/types';
import { NodeConfigPanel } from '@/components/panels/NodeConfigPanel';
import { runPipeline } from '@/lib/pipeline/runner';

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
  const [contextMenuNode, setContextMenuNode] = useState<Node | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<Node | null>(null);
  const [runStatus, setRunStatus] = useState<{ success: boolean; message: string } | null>(null);

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
      const parsed = dataStr
        ? (JSON.parse(dataStr) as Record<string, unknown>)
        : { label: type, description: '' };
      const defaultData: Record<string, unknown> = { ...parsed };
      if (type === 'source') defaultData.config = DEFAULT_SOURCE_CONFIG;
      else if (type === 'transform') defaultData.config = DEFAULT_TRANSFORM_CONFIG;
      else if (type === 'sink') defaultData.config = DEFAULT_SINK_CONFIG;

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

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    if (['source', 'transform', 'sink'].includes(node.type ?? '')) {
      setSelectedNodeForConfig(node);
      setConfigPanelOpen(true);
    }
  }, []);

  const onNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
    event.preventDefault();
    setContextMenuNode(node);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleRunPipeline = useCallback(async () => {
    setRunStatus(null);
    const result = await runPipeline(nodes, edges);
    if (result.success) {
      setRunStatus({ success: true, message: 'Pipeline ran successfully.' });
    } else {
      setRunStatus({ success: false, message: result.error ?? 'Run failed' });
    }
  }, [nodes, edges]);

  const handleConfigSave = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      const newNodes = nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
      );
      setNodes(newNodes);
      setStoreNodes(newNodes);
      setSelectedNodeForConfig(null);
    },
    [nodes, setNodes, setStoreNodes],
  );

  const closeContextMenu = useCallback(() => {
    setContextMenuNode(null);
    setContextMenuPosition(null);
  }, []);

  const handleDuplicateNode = useCallback(() => {
    if (!contextMenuNode) return;
    const existingNode = nodes.find((n) => n.id === contextMenuNode.id);
    if (!existingNode) return;
    const newId = `${existingNode.type}-${++nodeIdCounter}`;
    const newNode: Node = {
      ...existingNode,
      id: newId,
      position: {
        x: existingNode.position.x + 40,
        y: existingNode.position.y + 40,
      },
      data: { ...existingNode.data },
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setStoreNodes(newNodes);
    closeContextMenu();
  }, [contextMenuNode, nodes, setNodes, setStoreNodes, closeContextMenu]);

  const handleDeleteNode = useCallback(() => {
    if (!contextMenuNode) return;
    const nodeId = contextMenuNode.id;
    const newNodes = nodes.filter((n) => n.id !== nodeId);
    const newEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    setStoreNodes(newNodes);
    setStoreEdges(newEdges);
    closeContextMenu();
  }, [
    contextMenuNode,
    nodes,
    edges,
    setNodes,
    setEdges,
    setStoreNodes,
    setStoreEdges,
    closeContextMenu,
  ]);

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
        <button
          type="button"
          onClick={handleRunPipeline}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-accent-green/50 bg-accent-green/10 text-accent-green transition-colors hover:bg-accent-green/20"
          aria-label="Run pipeline"
          data-testid="run-pipeline-button"
        >
          <Play size={16} />
          Run
        </button>
        {runStatus && (
          <p
            className={runStatus.success ? 'text-xs text-accent-green' : 'text-xs text-red-400'}
            role="status"
          >
            {runStatus.message}
          </p>
        )}
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
          onNodeClick={onNodeClick}
          onNodeContextMenu={onNodeContextMenu}
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

      {/* Node context menu (S2.1): Duplicate / Delete — fixed position for right-click/long-press */}
      {contextMenuNode && contextMenuPosition && (
        <>
          <div
            className="fixed inset-0 z-40"
            role="presentation"
            onClick={closeContextMenu}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div
            className="fixed z-50 min-w-[160px] rounded-md border border-border bg-bg-secondary py-1 shadow-lg"
            style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
            role="menu"
            aria-label="Node actions"
          >
            <button
              type="button"
              role="menuitem"
              className="flex min-h-[44px] w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary"
              onClick={handleDuplicateNode}
            >
              <Copy className="h-4 w-4 shrink-0" aria-hidden />
              Duplicate
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex min-h-[44px] w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-bg-tertiary"
              onClick={handleDeleteNode}
            >
              <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
              Delete
            </button>
          </div>
        </>
      )}

      <NodeConfigPanel
        node={selectedNodeForConfig}
        open={configPanelOpen}
        onOpenChange={(open) => {
          setConfigPanelOpen(open);
          if (!open) setSelectedNodeForConfig(null);
        }}
        onSave={handleConfigSave}
      />
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
