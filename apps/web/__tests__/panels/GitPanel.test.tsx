import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { GitPanel } from '@/components/panels/GitPanel';

const mockStatus = {
  branch: 'master',
  files: [
    { path: 'apps/web/components/canvas/WorkflowCanvas.tsx', status: 'staged' as const },
    { path: 'apps/web/components/panels/GitPanel.tsx', status: 'modified' as const },
    { path: 'apps/web/lib/store/types.ts', status: 'modified' as const },
  ],
  commits: [
    {
      sha: 'ecd87c5',
      message: 'feat: add ReactFlow pipeline node types',
      author: 'dev',
      date: new Date().toISOString(),
    },
    {
      sha: '208b1af',
      message: 'feat: add xterm.js terminal panel',
      author: 'dev',
      date: new Date().toISOString(),
    },
    {
      sha: 'ef3a706',
      message: 'feat: wire canvas mode switching',
      author: 'dev',
      date: new Date().toISOString(),
    },
  ],
  ahead: 0,
  behind: 0,
};

describe('GitPanel', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url === '/api/git/status') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockStatus),
          } as Response);
        }
        return Promise.reject(new Error('Unknown URL'));
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the git panel container', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('git-panel')).toBeInTheDocument();
  });

  it('renders the Source Control header', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Source Control')).toBeInTheDocument();
  });

  it('shows staged files section when status loaded', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getByLabelText('Staged changes')).toBeInTheDocument();
    });
    expect(screen.getByText(/Staged \(/)).toBeInTheDocument();
  });

  it('shows changed files section when status loaded', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getByLabelText('Changes')).toBeInTheDocument();
    });
    expect(screen.getByText(/Changes \(/)).toBeInTheDocument();
  });

  it('renders file entries from API', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getAllByTestId('git-file-staged').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByTestId('git-file-modified').length).toBeGreaterThanOrEqual(1);
  });

  it('renders commit message textarea', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    const textarea = screen.getByTestId('commit-message-input');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Message (Ctrl+Enter to commit)');
  });

  it('renders the commit button', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getByTestId('commit-button')).toBeInTheDocument();
    });
    const button = screen.getByTestId('commit-button');
    expect(button).toBeInTheDocument();
  });

  it('commit button is disabled when message is empty', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    const button = screen.getByTestId('commit-button');
    expect(button).toBeDisabled();
  });

  it('commit button enables when message is typed', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getByTestId('commit-message-input')).toBeInTheDocument();
    });
    const textarea = screen.getByTestId('commit-message-input');
    const button = screen.getByTestId('commit-button');
    fireEvent.change(textarea, { target: { value: 'feat: my commit' } });
    expect(button).not.toBeDisabled();
  });

  it('commit clears message input after successful commit', async () => {
    const fetchMock = vi.fn((url: string, opts?: RequestInit) => {
      if (url === '/api/git/status') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockStatus) } as Response);
      }
      if (url === '/api/git/commit' && opts?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sha: 'abc1234', message: 'ok' }),
        } as Response);
      }
      return Promise.reject(new Error('Unknown'));
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    const textarea = screen.getByTestId('commit-message-input');
    fireEvent.change(textarea, { target: { value: 'feat: my commit' } });
    const button = screen.getByTestId('commit-button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('renders recent commits log', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getByTestId('commits-log')).toBeInTheDocument();
    });
    const entries = screen.getAllByTestId('commit-entry');
    expect(entries.length).toBe(3);
  });

  it('shows recent commit messages from API', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getByText('feat: add ReactFlow pipeline node types')).toBeInTheDocument();
    });
    expect(screen.getByText('feat: add xterm.js terminal panel')).toBeInTheDocument();
  });

  it('file rows have touch-friendly min height', async () => {
    render(<GitPanel />);
    await waitFor(() => {
      expect(screen.getAllByTestId('git-file-staged').length).toBeGreaterThanOrEqual(1);
    });
    const stagedFiles = screen.getAllByTestId('git-file-staged');
    expect(stagedFiles[0]?.className).toContain('min-h-[44px]');
  });
});
