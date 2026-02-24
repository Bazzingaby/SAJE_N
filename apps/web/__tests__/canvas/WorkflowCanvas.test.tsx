import { render, screen, fireEvent } from '@testing-library/react';
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
    onNodeContextMenu,
    ...rest
  }: {
    children?: React.ReactNode;
    nodes?: unknown[];
    edges?: unknown[];
    onInit?: (instance: unknown) => void;
    onNodeContextMenu?: (
      event: React.MouseEvent,
      node: {
        id: string;
        type: string;
        position: { x: number; y: number };
        data: Record<string, unknown>;
      },
    ) => void;
    [key: string]: unknown;
  }) => {
    React.useEffect(() => {
      if (typeof onInit === 'function') {
        onInit({ screenToFlowPosition: ({ x, y }: { x: number; y: number }) => ({ x, y }) });
      }
    }, [onInit]);
    const triggerContextMenu = () => {
      if (typeof onNodeContextMenu === 'function') {
        const ev = new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 });
        onNodeContextMenu(ev as unknown as React.MouseEvent, {
          id: 'source-1',
          type: 'source',
          position: { x: 100, y: 200 },
          data: { label: 'CSV Source' },
        });
      }
    };
    return React.createElement(
      'div',
      { 'data-testid': 'reactflow', ...rest },
      React.createElement(
        'button',
        {
          type: 'button',
          'data-testid': 'trigger-node-context-menu',
          onClick: triggerContextMenu,
        },
        'Open node menu',
      ),
      children,
    );
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

  it('node context menu shows Duplicate and Delete (S2.1)', () => {
    render(<WorkflowCanvas />);
    const trigger = screen.getByTestId('trigger-node-context-menu');
    fireEvent.click(trigger);
    expect(screen.getByRole('menu', { name: 'Node actions' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /duplicate/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
  });

  it('Delete in context menu removes node and connected edges (S2.1)', () => {
    useWorkspaceStore.setState({
      nodes: [
        { id: 'source-1', type: 'source', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'transform-1', type: 'transform', position: { x: 100, y: 0 }, data: { label: 'B' } },
      ],
      edges: [{ id: 'e1', source: 'source-1', target: 'transform-1' }],
    });
    render(<WorkflowCanvas />);
    fireEvent.click(screen.getByTestId('trigger-node-context-menu'));
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    const state = useWorkspaceStore.getState();
    expect(state.nodes).toHaveLength(1);
    expect(state.edges).toHaveLength(0);
  });
});
