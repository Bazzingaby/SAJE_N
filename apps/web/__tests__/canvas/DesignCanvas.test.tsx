import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('DesignCanvas', () => {
  it('renders design canvas container', () => {
    render(<DesignCanvas />);
    expect(screen.getByTestId('design-canvas')).toBeInTheDocument();
  });

  it('renders heading and instructions', () => {
    render(<DesignCanvas />);
    expect(screen.getByText('Design Canvas')).toBeInTheDocument();
    expect(screen.getByText(/Alt \+ Drag to pan/)).toBeInTheDocument();
  });

  it('renders palette buttons', () => {
    render(<DesignCanvas />);
    expect(screen.getByTitle('Add Rectangle')).toBeInTheDocument();
    expect(screen.getByTitle('Add Circle')).toBeInTheDocument();
    expect(screen.getByTitle('Add Text')).toBeInTheDocument();
    expect(screen.getByTitle('Add Button Component')).toBeInTheDocument();
    expect(screen.getByTitle('Add Card Component')).toBeInTheDocument();
    expect(screen.getByTitle('Add Input Component')).toBeInTheDocument();
    expect(screen.getByTitle('Group Selection')).toBeInTheDocument();
    expect(screen.getByTitle('Ungroup Selection')).toBeInTheDocument();
  });

  it('renders export button', () => {
    render(<DesignCanvas />);
    expect(screen.getByRole('button', { name: /Export Code/i })).toBeInTheDocument();
  });
});
