import { NextResponse } from 'next/server';
import { simpleGit } from 'simple-git';

const repoRoot = process.env.REPO_ROOT || process.cwd();

export async function GET() {
  try {
    const git = simpleGit(repoRoot);
    const [status, branch, log] = await Promise.all([
      git.status(),
      git.revparse(['--abbrev-ref', 'HEAD']).catch(() => 'main'),
      git.log({ maxCount: 20 }).catch(() => ({ all: [] })),
    ]);

    const files = [
      ...status.staged.map((path) => ({ path, status: 'staged' as const })),
      ...status.modified.map((path) => ({ path, status: 'modified' as const })),
      ...status.not_added.map((path) => ({ path, status: 'untracked' as const })),
      ...status.deleted.map((path) => ({ path, status: 'deleted' as const })),
    ];

    const commits = log.all.slice(0, 20).map((c) => ({
      sha: c.hash.slice(0, 7),
      message: c.message,
      author: c.author_name,
      date: c.date,
    }));

    const ahead = status.ahead;
    const behind = status.behind;

    return NextResponse.json({
      branch: branch.trim() || 'main',
      files,
      commits,
      ahead: ahead || 0,
      behind: behind || 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Git status failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
