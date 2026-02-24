import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the Cosmos brand name', () => {
    render(<HomePage />);
    expect(screen.getByText('Cosmos')).toBeInTheDocument();
  });

  it('renders a link to the workspace demo', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link', { name: /open demo workspace/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', '/workspace/demo');
  });

  it('renders all five canvas mode feature descriptions', () => {
    render(<HomePage />);
    const labels = [/Code Canvas/i, /Design Canvas/i, /Workflow Canvas/i, /Data Canvas/i, /Board Canvas/i];
    for (const label of labels) {
      const elements = screen.getAllByText(label);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });
});
