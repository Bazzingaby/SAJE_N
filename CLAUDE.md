# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# PROJECT COMMAND CENTER

## Mission Statement

Build **Cosmos (SAJE_N)** — the world's first touch-first, AI-native, open-source development platform unifying code editing, visual design, data pipelines, and multi-agent AI in a single collaborative web environment. No product like this exists today.

## Virtual Team Roles

Every Claude Code session operates as a full engineering team:

- **Chief Architect**: System design decisions, module boundaries, tech stack adherence
- **Lead Engineer**: Implementation, code quality, TypeScript strictness, performance
- **QA Director**: Test coverage for every feature, edge cases, touch interaction testing
- **Product Manager**: PRD compliance, user story acceptance criteria, priority enforcement (P0 → P1 → P2)
- **DevOps Lead**: Build pipeline, Docker config, CI/CD, self-hosting validation
- **Security Lead**: License compliance (no GPL), input validation, sandbox isolation, OWASP awareness

## Project State Machine

```
[ARCHITECTURE_COMPLETE] ← current state
       │
       ▼
[SPRINT_1_FOUNDATION] → S1.1 Next.js setup (3pts)
                        S1.2 Monaco + touch (5pts)
                        S1.3 File explorer (3pts)
                        S1.4 Touch toolbar (3pts)
                        S1.5 Basic layout (2pts)
                        S1.6 Zustand store (5pts)
       │                                    = 21pts
       ▼
[SPRINT_2_CANVAS_COLLAB] → S2.1 ReactFlow canvas (8pts)
                           S2.2 Yjs collaboration (5pts)
                           S2.3 Terminal xterm.js (5pts)
                           S2.4 Git panel (3pts)
                           S2.5 Mode switching (3pts)
       │                                    = 24pts
       ▼
[SPRINT_3_AI] → S3.1 AI Router (5pts)
                S3.2 AI Chat panel (5pts)
                S3.3 Inline AI (5pts)
                S3.4 Agent framework (3pts)
                S3.5 Settings page (3pts)
       │                                    = 21pts
       ▼
[SPRINT_4_DATA_PIPELINES] → S4.1 Flow nodes (5pts)
                             S4.2 Node config panels (5pts)
                             S4.3 Pipeline runner (5pts)
                             S4.4 Data canvas (3pts)
                             S4.5 SQL console (3pts)
       │                                    = 21pts
       ▼
[SPRINT_5_DESIGN_POLISH] → S5.1 Design canvas (8pts)
                            S5.2 Pencil + handwriting (5pts)
                            S5.3 Board canvas (3pts)
                            S5.4 Docker setup (3pts)
                            S5.5 Documentation (3pts)
       │                                    = 22pts
       ▼
[SPRINT_6_LAUNCH] → S6.1 CI/CD (5pts)
                     S6.2 Landing page (3pts)
                     S6.3 Demo workspace (3pts)
                     S6.4 Community (2pts)
                     S6.5 Optimization (3pts)
       │                                    = 16pts
       ▼
[MVP_COMPLETE]                        Total = 125pts
```

**Current State: `ARCHITECTURE_COMPLETE` — Ready for Sprint 1**

## Execution Protocol

1. **Before implementing**: Read the relevant blueprint/PRD section. Never guess requirements.
2. **Every feature gets tests**: Unit tests for utilities, integration tests for canvases, E2E for critical paths.
3. **Touch-first always**: Every UI element must work with touch before keyboard/mouse.
4. **Incremental commits**: One story point = one logical commit. Use Conventional Commits.
5. **Validate continuously**: `pnpm lint && pnpm typecheck && pnpm test` must pass after every change.
6. **Handle interruptions**: If a session is interrupted, read this file + git log to resume. State lives in code and commits, not in conversation memory.

## Interruption & Restart Recovery

When resuming after an interruption:
1. `git log --oneline -20` — see what was last completed
2. `git status` — check for uncommitted work
3. Read this file's Project State Machine — identify current sprint/story
4. `pnpm test` — verify the codebase is healthy
5. Continue from the next incomplete story

---

## Build & Development Commands

```bash
pnpm install              # Install dependencies (pnpm v9, Node 20 required)
pnpm dev                  # Development server (Next.js 15)
pnpm build                # Production build
pnpm lint                 # ESLint
pnpm typecheck            # TypeScript strict checking
pnpm test                 # Run all tests
pnpm test -- --watch      # Watch mode for TDD
```

CI pipeline order: lint → typecheck → test → build.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript (strict mode, all source code)
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Workflow Canvas:** ReactFlow (`@xyflow/react`)
- **Design Canvas:** Fabric.js
- **Collaboration:** Yjs + y-websocket (CRDT-based, offline-first)
- **Terminal:** xterm.js
- **UI:** shadcn/ui + Tailwind CSS (dark theme only, no inline styles)
- **State:** Zustand (single `WorkspaceState` store)
- **Database:** PostgreSQL (Supabase) + SQLite
- **AI:** Custom LLM router (~200 lines) — OpenRouter, Claude, OpenAI, Groq, Ollama, HuggingFace, custom endpoints
- **Package Manager:** pnpm v9

**License gate: All dependencies must be MIT, Apache 2.0, ISC, or PostgreSQL. No GPL/AGPL/SSPL ever.**

## Architecture

```
BROWSER (iPad / Tablet / Desktop)
┌──────────────────────────────────────────┐
│ Monaco | ReactFlow | Fabric.js | xterm.js│
│ Editor | Canvas    | Canvas    | Terminal │
└──────────────────────┬───────────────────┘
          Zustand State Store
                   │
          Yjs CRDT Document Layer
                   │ WebSocket
───────────────────┼───────────────────────
SERVER (Next.js)   │
┌──────────────────▼───────────────────────┐
│ y-ws Server │ AI Router │ File API       │
│ LLM Providers │ PostgreSQL │ Docker Sandbox│
└──────────────────────────────────────────┘
```

### Target Project Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── workspace/[id]/           # Main IDE (code/, design/, flow/, data/, board/)
│   ├── api/                      # AI, files, pipelines, collab, auth routes
│   └── settings/
├── components/
│   ├── canvas/                   # CodeCanvas, DesignCanvas, WorkflowCanvas, DataCanvas, BoardCanvas
│   ├── panels/                   # FileExplorer, AIPanel, TerminalPanel, GitPanel
│   ├── toolbar/                  # TouchToolbar, ModeSwitch, QuickActions
│   ├── ai/                       # AgentChat, InlineAI, PencilAI, AgentStatus
│   ├── flow-nodes/               # SourceNode, TransformNode, SinkNode, etc.
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── ai/                       # router.ts + agents/ (conductor, coder, designer, etc.)
│   ├── collab/                   # yjs-provider.ts, awareness.ts
│   ├── pipeline/                 # runner.ts, nodes.ts, scheduler.ts
│   ├── store/                    # workspace.ts, files.ts, agents.ts (Zustand)
│   └── utils/                    # handwriting.ts, touch.ts, codegen.ts
└── styles/globals.css

packages/
├── cosmos-agents/                # Agent framework (standalone)
├── cosmos-pipeline/              # Pipeline runner (standalone)
└── cosmos-ui/                    # Shared UI components
```

### Five Canvas Modes

| Mode | Library | Accent Color | Purpose |
|------|---------|-------------|---------|
| **Code** | Monaco | `#3b82f6` blue | Touch-optimized editing, inline AI, pencil annotations, terminal, git |
| **Design** | Fabric.js | `#a855f7` purple | Infinite canvas, component library, code export, sketch→component |
| **Workflow** | ReactFlow | `#22c55e` green | Visual node pipeline editor, 30+ node types, DAG execution |
| **Data** | Custom | `#f59e0b` amber | SQL console, table viewer, chart builder, data profiling |
| **Board** | Custom | `#ec4899` pink | Kanban, sprint planning, AI agent tracking |

AI elements use `#6366f1` indigo. Background is `#0a0a0f`.

### AI Agent System

8 agents through unified LLM router: **Conductor** (orchestrator), **Coder**, **Designer**, **Pipeline**, **Reviewer** (on commit), **Tester** (on save), **Doc Writer**, **Researcher**.

### Pipeline Engine

Nodes: Sources → Transforms → Sinks + Control Flow. Execution: parse DAG → topological sort → validate → parallel execute → SSE logs → PostgreSQL history.

## Design Constraints

- **Touch targets:** min 44x44px (toolbar 56x56px), 8px gap minimum
- **Touch response:** <100ms. Collab latency: <200ms
- **Performance:** FCP <2s, Lighthouse mobile >80
- **Self-host:** Docker Compose on 2GB RAM VPS
- **Accessibility:** WCAG 2.1 AA
- **LLM-agnostic:** Never couple to one provider

## Coding Conventions

- **Components:** PascalCase, from shadcn/ui
- **Utilities:** camelCase
- **Files:** Named to match default export
- **Styling:** Tailwind only (no inline styles)
- **Strings:** i18n-ready
- **Commits:** Conventional (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

## Key Documentation

| Document | Path |
|----------|------|
| PRD + User Stories | `docs/prd/product-requirements.md` |
| V2 Architecture | `docs/v2-architecture/cosmos-v2-architecture.md` |
| System Design | `blueprints/system-design/system-architecture.md` |
| Tech Stack Rationale | `blueprints/system-design/tech-stack-rationale.md` |
| Pipeline Engine | `blueprints/data-flow/pipeline-engine.md` |
| AI Agent System | `blueprints/data-flow/ai-agent-system.md` |
| Touch UI Spec | `blueprints/ui-wireframes/interface-specification.md` |
