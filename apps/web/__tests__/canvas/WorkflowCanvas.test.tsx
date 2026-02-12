import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock @xyflow/react — uses real DOM APIs (ResizeObserver, SVG, etc.)
// that are not reliably available in jsdom.
// ---------------------------------------------------------------------------
vi.mock('@xyflow/react/dist/style.css', () => ({}));

vi.mock('@xyflow/react', async () => {
  const React = await import('react');
  const { useState } = React;

  const ReactFlow = ({
    children,
    nodes: _nodes,
    edges: _edges,
    onInit,
    ...rest
  }: {
    children?: React.ReactNode;
    nodes?: unknown[];
    edges?: unknown[];
    onInit?: (instance: unknown) => void;
    [key: string]: unknown;
  }) => {
    React.useEffect(() => {
      if (typeof onInit === 'function') {
        onInit({ screenToFlowPosition: ({ x, y }: { x: number; y: number }) => ({ x, y }) });
      }
    }, [onInit]);
    return React.createElement('div', { 'data-testid': 'reactflow', ...rest }, children);
  };

  const ReactFlowProvider = ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'reactflow-provider' }, children);

  const Background = () => React.createElement('div', { 'data-testid': 'rf-background' });
  const Controls = () => React.createElement('div', { 'data-testid': 'rf-controls' });
  const MiniMap = () => React.createElement('div', { 'data-testid': 'rf-minimap' });

  const useNodesState = (initial: unknown[]) => {
    const [nodes, setNodes] = useState(initial);
    const onNodesChange = vi.fn();
    return [nodes, setNodes, onNodesChange] as const;
  };

  const useEdgesState = (initial: unknown[]) => {
    const [edges, setEdges] = useState(initial);
    const onEdgesChange = vi.fn();
    return [edges, setEdges, onEdgesChange] as const;
  };

  const addEdge = (connection: unknown, edges: unknown[]) => [...edges, connection];

  return {
    ReactFlow,
    ReactFlowProvider,
    Background,
    BackgroundVariant: { Dots: 'dots' },
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
  };
});

// Mock all flow node components
vi.mock('@/components/flow-nodes/SourceNode', () => ({
  SourceNode: () => null,
}));
vi.mock('@/components/flow-nodes/TransformNode', () => ({
  TransformNode: () => null,
}));
vi.mock('@/components/flow-nodes/SinkNode', () => ({
  SinkNode: () => null,
}));
vi.mock('@/components/flow-nodes/AINode', () => ({
  AINode: () => null,
}));
vi.mock('@/components/flow-nodes/FunctionNode', () => ({
  FunctionNode: () => null,
}));
vi.mock('@/components/flow-nodes/BranchNode', () => ({
  BranchNode: () => null,
}));

// Import component after mocks
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { useWorkspaceStore } from '@/lib/store';

describe('WorkflowCanvas', () => {
  beforeEach(() => {
    // Reset store to empty nodes/edges so default DAG is used
    useWorkspaceStore.setState({ nodes: [], edges: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the workflow canvas container', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('workflow-canvas')).toBeInTheDocument();
  });

  it('renders inside a ReactFlowProvider', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('reactflow-provider')).toBeInTheDocument();
  });

  it('renders the ReactFlow component', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('reactflow')).toBeInTheDocument();
  });

  it('renders the node palette', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('node-palette')).toBeInTheDocument();
    expect(screen.getByLabelText('Node palette')).toBeInTheDocument();
  });

  it('renders all 6 node type palette items', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('palette-item-source')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-transform')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-sink')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-ai')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-function')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-branch')).toBeInTheDocument();
  });

  it('palette items show correct labels', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Transform')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Function')).toBeInTheDocument();
    expect(screen.getByText('Branch')).toBeInTheDocument();
  });

  it('palette items have draggable attribute', () => {
    render(<WorkflowCanvas />);
    const sourceItem = screen.getByTestId('palette-item-source');
    expect(sourceItem).toHaveAttribute('draggable', 'true');
  });

  it('palette items have touch-friendly min height of 44px', () => {
    render(<WorkflowCanvas />);
    const sourceItem = screen.getByTestId('palette-item-source');
    expect(sourceItem.className).toContain('min-h-[44px]');
  });

  it('renders the reactflow wrapper drop zone', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('reactflow-wrapper')).toBeInTheDocument();
  });

  it('renders background, controls and minimap', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('rf-background')).toBeInTheDocument();
    expect(screen.getByTestId('rf-controls')).toBeInTheDocument();
    expect(screen.getByTestId('rf-minimap')).toBeInTheDocument();
  });

  it('uses nodes from store when store is non-empty', () => {
    useWorkspaceStore.setState({
      nodes: [
        {
          id: 'custom-1',
          type: 'source',
          position: { x: 0, y: 0 },
          data: { label: 'Custom Source' },
        },
      ],
      edges: [],
    });
    render(<WorkflowCanvas />);
    // Component should render without crashing when store has nodes
    expect(screen.getByTestId('workflow-canvas')).toBeInTheDocument();
  });

  it('palette items have aria-labels for accessibility', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByLabelText('Drag Source node')).toBeInTheDocument();
    expect(screen.getByLabelText('Drag Transform node')).toBeInTheDocument();
    expect(screen.getByLabelText('Drag Branch node')).toBeInTheDocument();
  });
});
