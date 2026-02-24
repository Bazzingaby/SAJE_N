# 🌌 SAJE_N — Cosmos Development Platform

> **The Touch-First, AI-Native, End-to-End Development & Data Workflow Platform**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Alpha-orange.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20App-green.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![CI/CD](https://github.com/Bazzingaby/SAJE_N/actions/workflows/ci.yml/badge.svg)](https://github.com/Bazzingaby/SAJE_N/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBazzingaby%2FSAJE_N)

---

## What is Cosmos?

Cosmos is an **open-source web platform** that merges five tools into one touch-optimized environment:

| Capability             | Replaces             | How                                                       |
| ---------------------- | -------------------- | --------------------------------------------------------- |
| 📝 **Code Editor**     | VS Code Web          | Monaco Editor with touch UI, pencil annotation, inline AI |
| 🎨 **Design Canvas**   | Figma                | Visual UI builder that generates real, working code       |
| 🔗 **Workflow Engine** | Databricks / Airflow | Visual node editor for data pipelines & automation        |
| 🤖 **AI Workspace**    | Cursor / Copilot     | 8 specialized agents, LLM-agnostic, end-to-end            |
| 📊 **Data Platform**   | Palantir Foundry     | From data ingestion → transformation → deployment         |

**No product like this exists today.** Every existing tool does one slice. Cosmos unifies them in a single collaborative, touch-native web environment.

---

## ✨ Key Features

- **Touch-First Interface** — 56px tap targets, gesture navigation, swipe tabs, drag-and-drop everything
- **Apple Pencil / Stylus Support** — Draw annotations that convert to text → AI instructions
- **Five Canvas Modes** — Code, Design, Workflow, Data, Board — switch with one tap
- **Visual Data Pipelines** — Drag source → transform → sink nodes. Open-source Databricks alternative
- **AI Agent System** — 8 agents (Conductor, Coder, Designer, Pipeline, Reviewer, Tester, Doc Writer, Researcher)
- **LLM Agnostic** — Connect OpenRouter, Claude, OpenAI, Groq, Ollama, or any compatible endpoint
- **Real-Time Collaboration** — Yjs CRDTs for multi-user editing with live cursors
- **Self-Hostable** — `docker-compose up` and you're running
- **100% Open Source** — Apache 2.0, all dependencies MIT/Apache 2.0

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9

### Install & Run

```bash
# Clone and install
git clone https://github.com/Bazzingaby/SAJE_N.git
cd SAJE_N
pnpm install

# Start the app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use a workspace URL such as [http://localhost:3000/workspace/default](http://localhost:3000/workspace/default) to enter the IDE.

### Optional: Collaboration Server

For real-time collaborative editing (Yjs), run the WebSocket server in a separate terminal:

```bash
pnpm run collab:server
```

This starts the collab server on `ws://localhost:1234`. Set `NEXT_PUBLIC_COLLAB_SERVER_URL` if you use a different host/port.

### Scripts

| Command                  | Description                            |
| ------------------------ | -------------------------------------- |
| `pnpm dev`               | Start Next.js dev server               |
| `pnpm build`             | Production build                       |
| `pnpm lint`              | ESLint                                 |
| `pnpm typecheck`         | TypeScript check                       |
| `pnpm test`              | Run tests                              |
| `pnpm run collab:server` | Start Yjs WebSocket server (port 1234) |

---

## 📂 Repository Structure

```
SAJE_N/
├── README.md
├── AGENTS.md                    ← Agentic orchestration (current sprint runbook)
├── CLAUDE.md                    ← Project command center & state machine
├── docs/
│   ├── plans/                   ← Sprint plans & agent runbooks
│   │   ├── sprint-2-next-phase-plan.md
│   │   ├── sprint-2-agent-runbook.md
│   │   ├── sprint-3-next-phase-plan.md
│   │   ├── sprint-3-agent-runbook.md
│   │   ├── sprint-4-next-phase-plan.md
│   │   └── sprint-4-agent-runbook.md
│   ├── prd/
│   │   └── product-requirements.md
│   └── v2-architecture/
│       └── cosmos-v2-architecture.md
├── blueprints/
│   ├── system-design/
│   ├── data-flow/               ← Pipeline & AI agent blueprints
│   └── ui-wireframes/
├── apps/
│   └── web/                     ← Next.js 15 app (Monaco, ReactFlow, panels, API)
│       ├── app/                 ← App Router, api/, workspace/[id]/
│       ├── components/          ← canvas/, panels/, toolbar/, layout/, ui/
│       ├── lib/                 ← store/, collab/, ai/, utils/
│       └── __tests__/
├── packages/                    ← cosmos-agents, cosmos-pipeline, cosmos-ui
├── scripts/
│   └── collab-server.mjs       ← Yjs WebSocket server
└── .github/
```

---

## 🚦 Project Status

| Phase                         | Status         | Notes                                                                     |
| ----------------------------- | -------------- | ------------------------------------------------------------------------- |
| Research & Architecture       | ✅ Complete    | Done                                                                      |
| PRD & Blueprints              | ✅ Complete    | Done                                                                      |
| **Sprint 1: Foundation**      | ✅ Complete    | Next.js, Monaco, file explorer, toolbar, layout, Zustand                  |
| **Sprint 2: Canvas & Collab** | ✅ Complete    | ReactFlow, Yjs server + context, Terminal, Git panel, mode switching      |
| **Sprint 3: AI Integration**  | ✅ Complete    | AI Router, Chat panel, Inline AI, Agent framework, Settings               |
| **Sprint 4: Data Pipelines**  | ✅ Complete    | Flow nodes, config panels, pipeline runner, Data canvas (Table/Chart/SQL) |
| **Sprint 5: Design & Polish** | ✅ Complete    | Design canvas, Pencil, Board, Docker, docs                                |
| **Sprint 6: Launch**          | ✅ Complete    | CI/CD, landing, demo, community                                           |

See [CLAUDE.md](CLAUDE.md) for the full state machine and [AGENTS.md](AGENTS.md) for the current sprint runbook.

---

## 🛠 Tech Stack

| Layer            | Technology                | License                    |
| ---------------- | ------------------------- | -------------------------- |
| Framework        | Next.js 15 (App Router)   | MIT                        |
| Language         | TypeScript                | Apache 2.0                 |
| Code Editor      | Monaco Editor             | MIT                        |
| Workflow Canvas  | ReactFlow (@xyflow/react) | MIT                        |
| Design Canvas    | Fabric.js                 | MIT                        |
| Collaboration    | Yjs + y-websocket (CRDT)  | MIT                        |
| Terminal         | xterm.js                  | MIT                        |
| UI Components    | shadcn/ui + Tailwind CSS  | MIT                        |
| State Management | Zustand                   | MIT                        |
| Database         | PostgreSQL + SQLite       | PostgreSQL / Public Domain |
| AI Router        | Custom abstraction layer  | Apache 2.0                 |
| Charts           | Recharts + D3.js          | MIT                        |
| Deployment       | Docker / Vercel           | -                          |

---

## 📖 Documentation

| Document                                                               | Description                                               |
| ---------------------------------------------------------------------- | --------------------------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                                                 | Project command center, state machine, execution protocol |
| [AGENTS.md](AGENTS.md)                                                 | Agentic orchestration & current sprint runbook            |
| [V2 Architecture](docs/v2-architecture/cosmos-v2-architecture.md)      | Full technical architecture                               |
| [Product Requirements](docs/prd/product-requirements.md)               | PRD with user stories & acceptance criteria               |
| [System Architecture](blueprints/system-design/system-architecture.md) | System design blueprint                                   |
| [AI Agent System](blueprints/data-flow/ai-agent-system.md)             | Agent roles, routing, LLM abstraction                     |
| [Interface Spec](blueprints/ui-wireframes/interface-specification.md)  | Touch UI spec & gesture map                               |
| [Deployment Guide](docs/DEPLOYMENT.md)                                 | Docker & Cloud deployment guide                           |
| [Component Guide](docs/COMPONENTS.md)                                  | Core component & API guide                                |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Join the community:**

- 💬 Discord Server _(coming soon)_
- 🐛 [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)

---

## 📄 License

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE) for details.

---

<p align="center"><strong>Cosmos: Where touch meets code meets data meets AI.</strong></p>
