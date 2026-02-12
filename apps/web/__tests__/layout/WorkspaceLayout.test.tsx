import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';

// Mock Monaco and store-dependent canvases to avoid complex setup
vi.mock('../../components/canvas/CodeCanvas', () => ({
  CodeCanvas: () => <div data-testid="code-canvas-mock">Code Canvas</div>,
}));
vi.mock('../../components/canvas/DesignCanvas', () => ({
  DesignCanvas: () => <div data-testid="design-canvas-mock">Design Canvas</div>,
}));
vi.mock('../../components/canvas/WorkflowCanvas', () => ({
  WorkflowCanvas: () => <div data-testid="workflow-canvas-mock">Workflow Canvas</div>,
}));
vi.mock('../../components/canvas/DataCanvas', () => ({
  DataCanvas: () => <div data-testid="data-canvas-mock">Data Canvas</div>,
}));
vi.mock('../../components/canvas/BoardCanvas', () => ({
  BoardCanvas: () => <div data-testid="board-canvas-mock">Board Canvas</div>,
}));
vi.mock('../../components/toolbar/TouchToolbar', () => ({
  TouchToolbar: () => <div data-testid="touch-toolbar-mock">Touch Toolbar</div>,
}));

describe('WorkspaceLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<WorkspaceLayout />);
    expect(container.querySelector("[data-testid='sidebar']")).toBeInTheDocument();
  });

  it('contains all 4 panel areas', () => {
    const { container } = render(<WorkspaceLayout />);
    expect(container.querySelector("[data-testid='sidebar']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='main-canvas']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='ai-panel']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='bottom-panel']")).toBeInTheDocument();
  });

  it('contains resize handles', () => {
    const { container } = render(<WorkspaceLayout />);
    const handles = container.querySelectorAll('[data-panel-resize-handle-id]');
    expect(handles.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the touch toolbar', () => {
    render(<WorkspaceLayout />);
    expect(screen.getByTestId('touch-toolbar-mock')).toBeInTheDocument();
  });

  it('renders the main canvas with Code mode by default', () => {
    render(<WorkspaceLayout />);
    expect(screen.getByText('Code Mode')).toBeInTheDocument();
  });
});
