import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the Cosmos heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cosmos');
  });

  it('renders a link to the workspace', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link', { name: /open workspace/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', '/workspace/demo');
  });

  it('renders all five canvas mode indicators', () => {
    render(<HomePage />);
    const labels = ['Code', 'Design', 'Flow', 'Data', 'Board'];
    for (const label of labels) {
      const elements = screen.getAllByText(label);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });
});
