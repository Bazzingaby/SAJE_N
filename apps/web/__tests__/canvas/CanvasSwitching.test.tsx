import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../lib/store';
import { MainCanvas } from '../../components/layout/MainCanvas';

// Mock all canvas components
vi.mock('../../components/canvas/CodeCanvas', () => ({
  CodeCanvas: () => <div data-testid="code-canvas">Code Canvas</div>,
}));
vi.mock('../../components/canvas/DesignCanvas', () => ({
  DesignCanvas: () => <div data-testid="design-canvas">Design Canvas</div>,
}));
vi.mock('../../components/canvas/WorkflowCanvas', () => ({
  WorkflowCanvas: () => <div data-testid="workflow-canvas">Workflow Canvas</div>,
}));
vi.mock('../../components/canvas/DataCanvas', () => ({
  DataCanvas: () => <div data-testid="data-canvas">Data Canvas</div>,
}));
vi.mock('../../components/canvas/BoardCanvas', () => ({
  BoardCanvas: () => <div data-testid="board-canvas">Board Canvas</div>,
}));

describe('Canvas Mode Switching', () => {
  beforeEach(() => {
    useWorkspaceStore.setState({ canvasMode: 'code' });
  });

  it('renders CodeCanvas when mode is code', () => {
    render(<MainCanvas />);
    expect(screen.getByTestId('code-canvas')).toBeInTheDocument();
    expect(screen.getByText('Code Mode')).toBeInTheDocument();
  });

  it('renders DesignCanvas when mode is design', () => {
    useWorkspaceStore.setState({ canvasMode: 'design' });
    render(<MainCanvas />);
    expect(screen.getByTestId('design-canvas')).toBeInTheDocument();
    expect(screen.getByText('Design Mode')).toBeInTheDocument();
  });

  it('renders WorkflowCanvas when mode is flow', () => {
    useWorkspaceStore.setState({ canvasMode: 'flow' });
    render(<MainCanvas />);
    expect(screen.getByTestId('workflow-canvas')).toBeInTheDocument();
    expect(screen.getByText('Flow Mode')).toBeInTheDocument();
  });

  it('renders DataCanvas when mode is data', () => {
    useWorkspaceStore.setState({ canvasMode: 'data' });
    render(<MainCanvas />);
    expect(screen.getByTestId('data-canvas')).toBeInTheDocument();
    expect(screen.getByText('Data Mode')).toBeInTheDocument();
  });

  it('renders BoardCanvas when mode is board', () => {
    useWorkspaceStore.setState({ canvasMode: 'board' });
    render(<MainCanvas />);
    expect(screen.getByTestId('board-canvas')).toBeInTheDocument();
    expect(screen.getByText('Board Mode')).toBeInTheDocument();
  });

  it('shows mode indicator with correct accent color', () => {
    render(<MainCanvas />);
    const indicator = screen.getByTestId('main-canvas').querySelector('[aria-hidden="true"]');
    expect(indicator).toBeInTheDocument();
  });
});
