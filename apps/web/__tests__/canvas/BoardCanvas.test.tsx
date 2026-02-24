import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BoardCanvas } from '@/components/canvas/BoardCanvas';

describe('BoardCanvas', () => {
  it('renders board canvas container', () => {
    render(<BoardCanvas />);
    expect(screen.getByTestId('board-canvas')).toBeInTheDocument();
  });

  it('renders columns: To Do, In Progress, Done', () => {
    render(<BoardCanvas />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders sample cards', () => {
    render(<BoardCanvas />);
    expect(screen.getByText('Initialize Design Canvas')).toBeInTheDocument();
    expect(screen.getByText('Foundation Sprint')).toBeInTheDocument();
  });
});
