import Link from 'next/link';
import {
  Terminal,
  Palette,
  Share2,
  Database,
  Columns3,
  ArrowRight,
  Github,
  Sparkles,
  Zap,
  Layers,
  Container,
  Globe
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-slate-50 selection:bg-accent-indigo/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-4 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent-indigo" />
          <span className="text-xl font-bold tracking-tight">Cosmos</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Bazzingaby/SAJE_N"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            <Github className="h-5 w-5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
          <Link
            href="/workspace/demo"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-white hover:scale-105"
          >
            Launch Demo
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-24 text-center sm:px-6 lg:px-8">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-indigo/20 blur-[120px]" />
          <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-accent-purple/20 blur-[100px]" />

          <a href="https://github.com/Bazzingaby/SAJE_N" target="_blank" rel="noreferrer" className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="flex h-2 w-2 rounded-full bg-accent-green mr-2" />
            V0.2.0 Pre-Alpha is live
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>

          <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 sm:text-7xl">
            Where touch meets code meets data meets AI.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            The world's first touch-first, AI-native development platform. Unifying code editing, visual design, data pipelines, and intelligent agents into a single collaborative web environment.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/workspace/demo"
              className="group flex h-14 items-center gap-2 rounded-xl bg-accent-indigo px-8 text-lg font-semibold text-white transition-all hover:bg-accent-indigo/90 hover:ring-4 hover:ring-accent-indigo/30"
            >
              Open Demo Workspace
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/Bazzingaby/SAJE_N"
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              <Github className="h-5 w-5" />
              View Source
            </a>
          </div>
        </section>

        {/* 5 Canvases Feature Grid */}
        <section className="border-t border-white/5 bg-slate-950/50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Five Modalities. One Interface.</h2>
              <p className="mt-4 text-lg text-slate-400">Switch context with a single tap. Stop juggling desktop apps.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] p-8 transition-all hover:border-accent-blue/50 hover:bg-accent-blue/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-blue/20 text-accent-blue">
                  <Terminal className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Code Canvas</h3>
                <p className="text-slate-400">Touch-optimized Monaco Editor with inline AI completions, Git operations, and Apple Pencil annotation routing directly to the LLM context.</p>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] p-8 transition-all hover:border-accent-purple/50 hover:bg-accent-purple/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple">
                  <Palette className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Design Canvas</h3>
                <p className="text-slate-400">Figma-like infinite canvas leveraging Fabric.js. Place UI components, draft wireframes, and generate native React code with one click.</p>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] p-8 transition-all hover:border-accent-green/50 hover:bg-accent-green/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-green/20 text-accent-green">
                  <Share2 className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Workflow Canvas</h3>
                <p className="text-slate-400">Visual node-based orchestration engine. Build custom ELT, AI pipelines, and API routines by connecting source and transform blocks.</p>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] p-8 transition-all hover:border-accent-amber/50 hover:bg-accent-amber/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-amber/20 text-accent-amber">
                  <Database className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Data Canvas</h3>
                <p className="text-slate-400">Integrated database explorer. Run SQL directly against your connections or browse tabular structures. Palantir Foundry patterns, locally.</p>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] p-8 transition-all hover:border-accent-pink/50 hover:bg-accent-pink/5 md:col-span-2 lg:col-span-1">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-pink/20 text-accent-pink">
                  <Columns3 className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Board Canvas</h3>
                <p className="text-slate-400">Integrated Kanban tracking linked directly to commits and pipeline runs. Organize your multi-agent AI sprints seamlessly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Details */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Multi-Agent Intelligence, Offline First.</h2>
                <p className="mt-4 text-lg text-slate-400">
                  Cosmos leverages 8 specialized autonomous agents (Conductor, Coder, Designer, Pipeline, etc.) built to construct your applications end-to-end. We deploy OpenRouter, Claude, OpenAI, and Ollama connections out of the box.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="text-slate-300">Yjs CRDT Real-time Multiplayer Collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white">
                      <Container className="h-5 w-5" />
                    </div>
                    <span className="text-slate-300">Secure Docker Sandboxed Executions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white">
                      <Layers className="h-5 w-5" />
                    </div>
                    <span className="text-slate-300">Monorepo Next.js + Tailwind Architecture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="text-slate-300">Self-hostable Local Development Ecosystem</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl overflow-hidden min-h-[400px]">
                {/* Decorative mock IDE interface */}
                <div className="h-full w-full rounded-xl border border-white/5 bg-[#0e0e12] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(99,102,241,0.1)]">
                  <div className="flex h-10 items-center gap-2 border-b border-white/5 px-4 bg-[#18181b]">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <div className="ml-4 text-xs font-mono text-slate-500">cosmos-engine | npm start</div>
                  </div>
                  <div className="flex flex-1 p-4 font-mono text-sm text-slate-300">
                    <div className="mr-4 flex flex-col items-end text-slate-600 select-none">
                      <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-accent-pink">import</span><span> {'{ Agent }'} </span><span className="text-accent-pink">from</span><span className="text-accent-green"> '@cosmos/agents'</span><span>;</span>
                      <br />
                      <span className="text-accent-pink">const</span><span className="text-accent-blue"> architect</span><span> = </span><span className="text-accent-pink">new</span><span className="text-accent-blue"> Agent</span><span>({'{'}</span>
                      <span className="ml-4">role: <span className="text-accent-green">'Chief Architect'</span>,</span>
                      <span className="ml-4">model: <span className="text-accent-green">'claude-3-5-sonnet'</span>,</span>
                      <span className="ml-4">tools: [CodeEditor, VisualCanvas, Docker]</span>
                      <span>{'}'});</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-slate-500">
        <p className="mb-2">SAJE_N Cosmos Platform is Open Source software released under the Apache License 2.0</p>
        <div className="flex justify-center gap-4">
          <a href="https://github.com/Bazzingaby/SAJE_N" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
        </div>
      </footer>
    </div>
  );
}
