import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataCanvas } from '@/components/canvas/DataCanvas';

describe('DataCanvas', () => {
  it('renders data canvas with table tab', () => {
    render(<DataCanvas />);
    expect(screen.getByTestId('data-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('has Table, Chart, SQL tabs', () => {
    render(<DataCanvas />);
    expect(screen.getByRole('tab', { name: /table/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /chart/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sql/i })).toBeInTheDocument();
  });
});
