import { NextResponse } from 'next/server';
import { simpleGit } from 'simple-git';

const repoRoot = process.env.REPO_ROOT || process.cwd();

export async function POST() {
  try {
    const git = simpleGit(repoRoot);
    await git.push();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Push failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
