import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Cosmos</h1>
        <p className="max-w-lg text-lg text-text-secondary">
          The touch-first, AI-native development platform. Code, design, build pipelines, and
          collaborate — all in one place.
        </p>
      </div>

      <Link
        href="/workspace/demo"
        className="inline-flex h-12 items-center rounded-lg bg-accent-indigo px-8 text-base font-medium text-white transition-colors hover:bg-accent-indigo/90"
      >
        Open Workspace
      </Link>

      <div className="mt-8 grid grid-cols-5 gap-4 text-center text-sm">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-blue/20 text-accent-blue">
            {'</>'}
          </span>
          <span className="text-text-secondary">Code</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple/20 text-accent-purple">
            {'UI'}
          </span>
          <span className="text-text-secondary">Design</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/20 text-accent-green">
            {'->'}
          </span>
          <span className="text-text-secondary">Flow</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-amber/20 text-accent-amber">
            {'DB'}
          </span>
          <span className="text-text-secondary">Data</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-pink/20 text-accent-pink">
            {'PM'}
          </span>
          <span className="text-text-secondary">Board</span>
        </div>
      </div>
    </main>
  );
}
