import { NextRequest, NextResponse } from 'next/server';
import { simpleGit } from 'simple-git';

const repoRoot = process.env.REPO_ROOT || process.cwd();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return NextResponse.json({ error: 'Commit message is required' }, { status: 400 });
    }

    const git = simpleGit(repoRoot);
    await git.add('.');
    const result = await git.commit(message);

    if (result.commit) {
      return NextResponse.json({
        sha: result.commit.slice(0, 7),
        message,
      });
    }
    return NextResponse.json({ error: 'Nothing to commit' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Commit failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
