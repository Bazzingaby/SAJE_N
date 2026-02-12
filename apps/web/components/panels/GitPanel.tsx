'use client';

import { useState } from 'react';
import { GitCommit, GitBranch, FilePlus, FileMinus, FileEdit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Static mock data — real Git API integration is Sprint 6
// ---------------------------------------------------------------------------

interface GitFileEntry {
  path: string;
  status: 'modified' | 'staged' | 'untracked';
}

interface GitCommitEntry {
  sha: string;
  message: string;
  author: string;
  date: string;
}

const MOCK_FILES: GitFileEntry[] = [
  { path: 'apps/web/components/canvas/WorkflowCanvas.tsx', status: 'staged' },
  { path: 'apps/web/components/panels/GitPanel.tsx', status: 'modified' },
  { path: 'apps/web/lib/store/types.ts', status: 'modified' },
];

const MOCK_COMMITS: GitCommitEntry[] = [
  {
    sha: 'ecd87c5',
    message: 'feat: add ReactFlow pipeline node types',
    author: 'dev',
    date: '2 days ago',
  },
  {
    sha: '208b1af',
    message: 'feat: add xterm.js terminal panel',
    author: 'dev',
    date: '3 days ago',
  },
  {
    sha: 'ef3a706',
    message: 'feat: wire canvas mode switching',
    author: 'dev',
    date: '4 days ago',
  },
];

const STATUS_ICON: Record<GitFileEntry['status'], React.ComponentType<{ className?: string }>> = {
  staged: FilePlus,
  modified: FileEdit,
  untracked: FileMinus,
};

const STATUS_COLOR: Record<GitFileEntry['status'], string> = {
  staged: 'text-accent-green',
  modified: 'text-accent-yellow',
  untracked: 'text-text-secondary',
};

const STATUS_LABEL: Record<GitFileEntry['status'], string> = {
  staged: 'Staged',
  modified: 'Modified',
  untracked: 'Untracked',
};

export function GitPanel() {
  const [commitMessage, setCommitMessage] = useState('');

  const stagedFiles = MOCK_FILES.filter((f) => f.status === 'staged');
  const changedFiles = MOCK_FILES.filter((f) => f.status !== 'staged');

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    // Commit action — real implementation in Sprint 6
    setCommitMessage('');
  };

  return (
    <div className="flex h-full flex-col bg-bg-secondary" data-testid="git-panel">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <GitBranch className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Source Control
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-3">
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
                        {file.path.split('/').pop()}
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
                        {file.path.split('/').pop()}
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
              disabled={!commitMessage.trim()}
              className="h-11 w-full bg-accent-green text-bg-primary hover:bg-accent-green/90 disabled:opacity-50"
              data-testid="commit-button"
              aria-label="Commit staged changes"
            >
              <GitCommit className="mr-2 h-4 w-4" aria-hidden="true" />
              Commit
            </Button>
          </section>

          {/* Recent commits log */}
          <section aria-label="Recent commits">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
              Recent Commits
            </p>
            <ul className="flex flex-col gap-1" role="list" data-testid="commits-log">
              {MOCK_COMMITS.map((commit) => (
                <li
                  key={commit.sha}
                  className="flex min-h-[44px] flex-col justify-center rounded-md px-2 py-1 hover:bg-bg-tertiary"
                  data-testid="commit-entry"
                >
                  <span className="truncate text-xs font-medium text-text-primary">
                    {commit.message}
                  </span>
                  <span className="text-[10px] text-text-secondary">
                    {commit.sha} · {commit.author} · {commit.date}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
