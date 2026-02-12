import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileExplorer } from '../../components/panels/FileExplorer';

// Mock the Zustand store
const mockOpenFile = vi.fn();
let mockFiles: unknown[] = [];

vi.mock('@/lib/store', () => ({
  useWorkspaceStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      files: mockFiles,
      openFile: mockOpenFile,
    }),
}));

describe('FileExplorer', () => {
  beforeEach(() => {
    mockFiles = [];
    mockOpenFile.mockClear();
  });

  it('renders the Explorer header', () => {
    render(<FileExplorer />);
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<FileExplorer />);
    const inputs = screen.getAllByPlaceholderText('Search files...');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the search input with proper aria-label', () => {
    render(<FileExplorer />);
    const inputs = screen.getAllByLabelText('Search files');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty state when no files', () => {
    render(<FileExplorer />);
    const emptyMessages = screen.getAllByText('No files in workspace');
    expect(emptyMessages.length).toBeGreaterThanOrEqual(1);
  });

  it('renders New File action button', () => {
    render(<FileExplorer />);
    const buttons = screen.getAllByLabelText('New File');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons[0]).toBeInTheDocument();
  });

  it('renders New Folder action button', () => {
    render(<FileExplorer />);
    const buttons = screen.getAllByLabelText('New Folder');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons[0]).toBeInTheDocument();
  });

  it('renders Refresh action button', () => {
    render(<FileExplorer />);
    const buttons = screen.getAllByLabelText('Refresh');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons[0]).toBeInTheDocument();
  });

  it('renders the file explorer container with test id', () => {
    render(<FileExplorer />);
    const containers = screen.getAllByTestId('file-explorer');
    expect(containers.length).toBeGreaterThanOrEqual(1);
    expect(containers[0]).toBeInTheDocument();
  });

  it('renders file tree role', () => {
    render(<FileExplorer />);
    const trees = screen.getAllByRole('tree');
    expect(trees.length).toBeGreaterThanOrEqual(1);
  });

  it('renders files when store has files', () => {
    mockFiles = [
      {
        id: 'file-1',
        name: 'index.ts',
        path: '/src/index.ts',
        isDirectory: false,
      },
    ];
    render(<FileExplorer />);
    const fileNames = screen.getAllByText('index.ts');
    expect(fileNames.length).toBeGreaterThanOrEqual(1);
  });

  it('renders multiple files', () => {
    mockFiles = [
      {
        id: 'file-1',
        name: 'index.ts',
        path: '/index.ts',
        isDirectory: false,
      },
      {
        id: 'file-2',
        name: 'app.tsx',
        path: '/app.tsx',
        isDirectory: false,
      },
    ];
    render(<FileExplorer />);
    expect(screen.getAllByText('index.ts').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('app.tsx').length).toBeGreaterThanOrEqual(1);
  });
});
