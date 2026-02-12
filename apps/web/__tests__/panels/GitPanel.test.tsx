import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { GitPanel } from '@/components/panels/GitPanel';

describe('GitPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the git panel container', () => {
    render(<GitPanel />);
    expect(screen.getByTestId('git-panel')).toBeInTheDocument();
  });

  it('renders the Source Control header', () => {
    render(<GitPanel />);
    expect(screen.getByText('Source Control')).toBeInTheDocument();
  });

  it('shows staged files section', () => {
    render(<GitPanel />);
    expect(screen.getByLabelText('Staged changes')).toBeInTheDocument();
    expect(screen.getByText(/Staged \(/)).toBeInTheDocument();
  });

  it('shows changed files section', () => {
    render(<GitPanel />);
    expect(screen.getByLabelText('Changes')).toBeInTheDocument();
    expect(screen.getByText(/Changes \(/)).toBeInTheDocument();
  });

  it('renders mock file entries', () => {
    render(<GitPanel />);
    // Staged file
    expect(screen.getAllByTestId('git-file-staged').length).toBeGreaterThanOrEqual(1);
    // Modified files
    expect(screen.getAllByTestId('git-file-modified').length).toBeGreaterThanOrEqual(1);
  });

  it('renders commit message textarea', () => {
    render(<GitPanel />);
    const textarea = screen.getByTestId('commit-message-input');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Message (Ctrl+Enter to commit)');
  });

  it('renders the commit button', () => {
    render(<GitPanel />);
    const button = screen.getByTestId('commit-button');
    expect(button).toBeInTheDocument();
  });

  it('commit button is disabled when message is empty', () => {
    render(<GitPanel />);
    const button = screen.getByTestId('commit-button');
    expect(button).toBeDisabled();
  });

  it('commit button enables when message is typed', () => {
    render(<GitPanel />);
    const textarea = screen.getByTestId('commit-message-input');
    const button = screen.getByTestId('commit-button');
    fireEvent.change(textarea, { target: { value: 'feat: my commit' } });
    expect(button).not.toBeDisabled();
  });

  it('commit clears message input', () => {
    render(<GitPanel />);
    const textarea = screen.getByTestId('commit-message-input');
    fireEvent.change(textarea, { target: { value: 'feat: my commit' } });
    const button = screen.getByTestId('commit-button');
    fireEvent.click(button);
    expect(textarea).toHaveValue('');
  });

  it('renders recent commits log', () => {
    render(<GitPanel />);
    expect(screen.getByTestId('commits-log')).toBeInTheDocument();
    const entries = screen.getAllByTestId('commit-entry');
    expect(entries.length).toBe(3);
  });

  it('shows recent commit messages', () => {
    render(<GitPanel />);
    expect(screen.getByText('feat: add ReactFlow pipeline node types')).toBeInTheDocument();
    expect(screen.getByText('feat: add xterm.js terminal panel')).toBeInTheDocument();
  });

  it('file rows have touch-friendly min height', () => {
    render(<GitPanel />);
    const stagedFiles = screen.getAllByTestId('git-file-staged');
    expect(stagedFiles.length).toBeGreaterThanOrEqual(1);
    expect(stagedFiles[0]?.className).toContain('min-h-[44px]');
  });
});
