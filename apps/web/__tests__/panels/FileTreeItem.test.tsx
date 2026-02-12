import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileTreeItem } from '../../components/panels/FileTreeItem';
import type { FileNode } from '@/lib/store/types';

const mockFile: FileNode = {
  id: 'file-1',
  name: 'index.ts',
  path: '/src/index.ts',
  isDirectory: false,
};

const mockDirectory: FileNode = {
  id: 'dir-1',
  name: 'src',
  path: '/src',
  isDirectory: true,
  children: [
    {
      id: 'child-1',
      name: 'main.ts',
      path: '/src/main.ts',
      isDirectory: false,
    },
    {
      id: 'child-2',
      name: 'app.tsx',
      path: '/src/app.tsx',
      isDirectory: false,
    },
  ],
};

const mockEmptyDir: FileNode = {
  id: 'dir-empty',
  name: 'empty',
  path: '/empty',
  isDirectory: true,
  children: [],
};

describe('FileTreeItem', () => {
  it('renders the file name', () => {
    const { container } = render(
      <FileTreeItem node={mockFile} depth={0} onSelect={vi.fn()} />
    );
    expect(within(container).getByText('index.ts')).toBeInTheDocument();
  });

  it('renders the directory name', () => {
    const { container } = render(
      <FileTreeItem node={mockDirectory} depth={0} onSelect={vi.fn()} />
    );
    expect(within(container).getByText('src')).toBeInTheDocument();
  });

  it('has role="treeitem"', () => {
    const { container } = render(
      <FileTreeItem node={mockFile} depth={0} onSelect={vi.fn()} />
    );
    const treeItems = within(container).getAllByRole('treeitem');
    expect(treeItems.length).toBeGreaterThanOrEqual(1);
    expect(treeItems[0]).toBeInTheDocument();
  });

  it('has aria-expanded for directories', () => {
    const { container } = render(
      <FileTreeItem node={mockDirectory} depth={0} onSelect={vi.fn()} />
    );
    const treeItems = within(container).getAllByRole('treeitem');
    const dirItem = treeItems.find((el) => el.hasAttribute('aria-expanded'));
    expect(dirItem).toBeDefined();
    expect(dirItem).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not have aria-expanded for files', () => {
    const { container } = render(
      <FileTreeItem node={mockFile} depth={0} onSelect={vi.fn()} />
    );
    const treeItems = within(container).getAllByRole('treeitem');
    // The file's treeitem should not have aria-expanded
    expect(treeItems[0]).not.toHaveAttribute('aria-expanded');
  });

  it('calls onSelect when clicking a file', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <FileTreeItem node={mockFile} depth={0} onSelect={onSelect} />
    );

    fireEvent.click(within(container).getByText('index.ts'));
    expect(onSelect).toHaveBeenCalledWith(mockFile);
  });

  it('calls onSelect when clicking a directory', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <FileTreeItem node={mockDirectory} depth={0} onSelect={onSelect} />
    );

    fireEvent.click(within(container).getByText('src'));
    expect(onSelect).toHaveBeenCalledWith(mockDirectory);
  });

  it('expands a directory when clicked and shows children', () => {
    const { container } = render(
      <FileTreeItem node={mockDirectory} depth={0} onSelect={vi.fn()} />
    );

    // Children should not be visible initially
    expect(within(container).queryByText('main.ts')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(within(container).getByText('src'));

    // Children should now be visible
    expect(within(container).getByText('main.ts')).toBeInTheDocument();
    expect(within(container).getByText('app.tsx')).toBeInTheDocument();
  });

  it('collapses a directory when clicked again', () => {
    const { container } = render(
      <FileTreeItem node={mockDirectory} depth={0} onSelect={vi.fn()} />
    );

    // Expand
    fireEvent.click(within(container).getByText('src'));
    expect(within(container).getByText('main.ts')).toBeInTheDocument();

    // Collapse
    fireEvent.click(within(container).getByText('src'));
    expect(within(container).queryByText('main.ts')).not.toBeInTheDocument();
  });

  it('updates aria-expanded when directory is expanded', () => {
    const { container } = render(
      <FileTreeItem node={mockDirectory} depth={0} onSelect={vi.fn()} />
    );

    const treeItems = within(container).getAllByRole('treeitem');
    const dirItem = treeItems.find((el) => el.hasAttribute('aria-expanded'));
    expect(dirItem).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(within(container).getByText('src'));

    expect(dirItem).toHaveAttribute('aria-expanded', 'true');
  });

  it('indents items based on depth', () => {
    const { container } = render(
      <FileTreeItem node={mockFile} depth={2} onSelect={vi.fn()} />
    );
    const button = within(container).getByLabelText('index.ts');
    // depth 2 * 16px + 12px = 44px
    expect(button.style.paddingLeft).toBe('44px');
  });

  it('indents at depth 0 with base padding', () => {
    const { container } = render(
      <FileTreeItem node={mockFile} depth={0} onSelect={vi.fn()} />
    );
    const button = within(container).getByLabelText('index.ts');
    // depth 0 * 16px + 12px = 12px
    expect(button.style.paddingLeft).toBe('12px');
  });

  it('applies selected styling when selectedPath matches', () => {
    const { container } = render(
      <FileTreeItem
        node={mockFile}
        depth={0}
        onSelect={vi.fn()}
        selectedPath="/src/index.ts"
      />
    );
    const button = within(container).getByLabelText('index.ts');
    expect(button.className).toContain('bg-accent-blue');
  });

  it('does not apply selected styling when selectedPath does not match', () => {
    const { container } = render(
      <FileTreeItem
        node={mockFile}
        depth={0}
        onSelect={vi.fn()}
        selectedPath="/other/file.ts"
      />
    );
    const button = within(container).getByLabelText('index.ts');
    expect(button.className).not.toContain('bg-accent-blue');
  });

  it('renders an empty directory without children', () => {
    const { container } = render(
      <FileTreeItem node={mockEmptyDir} depth={0} onSelect={vi.fn()} />
    );

    fireEvent.click(within(container).getByText('empty'));
    // Should not crash, and aria-expanded should be true
    const treeItems = within(container).getAllByRole('treeitem');
    const dirItem = treeItems.find((el) => el.hasAttribute('aria-expanded'));
    expect(dirItem).toHaveAttribute('aria-expanded', 'true');
  });

  it('has proper button accessibility', () => {
    const { container } = render(
      <FileTreeItem node={mockFile} depth={0} onSelect={vi.fn()} />
    );
    const button = within(container).getByLabelText('index.ts');
    expect(button).toHaveAttribute('aria-label', 'index.ts');
  });
});
