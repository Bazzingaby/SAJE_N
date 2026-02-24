'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GitCommit,
  GitBranch,
  FilePlus,
  FileMinus,
  FileEdit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Real Git API integration (S2.4)
// ---------------------------------------------------------------------------

type GitFileStatus = 'modified' | 'staged' | 'untracked' | 'deleted';

interface GitFileEntry {
  path: string;
  status: GitFileStatus;
}

interface GitCommitEntry {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface GitStatusResponse {
  branch: string;
  files: GitFileEntry[];
  commits: GitCommitEntry[];
  ahead: number;
  behind: number;
}

const STATUS_ICON: Record<GitFileStatus, React.ComponentType<{ className?: string }>> = {
  staged: FilePlus,
  modified: FileEdit,
  untracked: FileMinus,
  deleted: Trash2,
};

const STATUS_COLOR: Record<GitFileStatus, string> = {
  staged: 'text-accent-green',
  modified: 'text-accent-yellow',
  untracked: 'text-text-secondary',
  deleted: 'text-red-400',
};

const STATUS_LABEL: Record<GitFileStatus, string> = {
  staged: 'Staged',
  modified: 'Modified',
  untracked: 'Untracked',
  deleted: 'Deleted',
};

function formatCommitDate(d: string): string {
  try {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  } catch {
    return d;
  }
}

export function GitPanel() {
  const [commitMessage, setCommitMessage] = useState('');
  const [status, setStatus] = useState<GitStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<'commit' | 'push' | 'pull' | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/git/status');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText);
      }
      const data: GitStatusResponse = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Git status');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    setActionLoading('commit');
    try {
      const res = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      setCommitMessage('');
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Commit failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePush = async () => {
    setActionLoading('push');
    setError(null);
    try {
      const res = await fetch('/api/git/push', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Push failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePull = async () => {
    setActionLoading('pull');
    setError(null);
    try {
      const res = await fetch('/api/git/pull', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pull failed');
    } finally {
      setActionLoading(null);
    }
  };

  const stagedFiles = status?.files.filter((f) => f.status === 'staged') ?? [];
  const changedFiles = status?.files.filter((f) => f.status !== 'staged') ?? [];
  const commits = status?.commits ?? [];

  return (
    <div className="flex h-full flex-col bg-bg-secondary" data-testid="git-panel">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-text-secondary" aria-hidden="true" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Source Control
          </h2>
          {status && (
            <span
              className="text-xs text-text-secondary"
              title={`${status.ahead} ahead, ${status.behind} behind`}
            >
              {status.branch}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handlePush}
            disabled={loading || actionLoading !== null}
            aria-label="Push"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handlePull}
            disabled={loading || actionLoading !== null}
            aria-label="Pull"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div
          className="shrink-0 border-b border-border bg-red-500/10 px-3 py-2 text-xs text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-3">
          {loading ? (
            <p className="text-xs text-text-secondary">Loading...</p>
          ) : (
            <>
              {/* Staged changes */}
              {stagedFiles.length > 0 && (
                <section aria-label="Staged changes">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
                    Staged ({stagedFiles.length})
                  </p>
                  <ul className="flex flex-col gap-1" role="list">
                    {stagedFiles.map((file) => {
                      const Icon = STATUS_ICON[file.status];
                      return (
                        <li
                          key={file.path}
                          className="flex min-h-[44px] items-center gap-2 rounded-md px-2 py-1 hover:bg-bg-tertiary"
                          data-testid={`git-file-${file.status}`}
                        >
                          <Icon
                            className={cn('h-3.5 w-3.5 shrink-0', STATUS_COLOR[file.status])}
                            aria-label={STATUS_LABEL[file.status]}
                          />
                          <span className="truncate text-xs text-text-primary" title={file.path}>
                            {file.path.split(/[/\\]/).pop()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Changes (unstaged) */}
              {changedFiles.length > 0 && (
                <section aria-label="Changes">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
                    Changes ({changedFiles.length})
                  </p>
                  <ul className="flex flex-col gap-1" role="list">
                    {changedFiles.map((file) => {
                      const Icon = STATUS_ICON[file.status];
                      return (
                        <li
                          key={file.path}
                          className="flex min-h-[44px] items-center gap-2 rounded-md px-2 py-1 hover:bg-bg-tertiary"
                          data-testid={`git-file-${file.status}`}
                        >
                          <Icon
                            className={cn('h-3.5 w-3.5 shrink-0', STATUS_COLOR[file.status])}
                            aria-label={STATUS_LABEL[file.status]}
                          />
                          <span className="truncate text-xs text-text-primary" title={file.path}>
                            {file.path.split(/[/\\]/).pop()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Commit area */}
              <section aria-label="Commit" className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Commit
                </p>
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Message (Ctrl+Enter to commit)"
                  className="min-h-[80px] w-full resize-none rounded-md border border-border bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-accent-indigo focus:outline-none"
                  aria-label="Commit message"
                  data-testid="commit-message-input"
                />
                <Button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || actionLoading !== null}
                  className="h-11 w-full bg-accent-green text-bg-primary hover:bg-accent-green/90 disabled:opacity-50"
                  data-testid="commit-button"
                  aria-label="Commit staged changes"
                >
                  <GitCommit className="mr-2 h-4 w-4" aria-hidden="true" />
                  {actionLoading === 'commit' ? 'Committing...' : 'Commit'}
                </Button>
              </section>

              {/* Recent commits log */}
              <section aria-label="Recent commits">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Recent Commits
                </p>
                <ul className="flex flex-col gap-1" role="list" data-testid="commits-log">
                  {commits.map((commit) => (
                    <li
                      key={commit.sha}
                      className="flex min-h-[44px] flex-col justify-center rounded-md px-2 py-1 hover:bg-bg-tertiary"
                      data-testid="commit-entry"
                    >
                      <span className="truncate text-xs font-medium text-text-primary">
                        {commit.message}
                      </span>
                      <span className="text-[10px] text-text-secondary">
                        {commit.sha} · {commit.author} · {formatCommitDate(commit.date)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
