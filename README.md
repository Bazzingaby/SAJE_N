# 🌌 SAJE_N — Cosmos Development Platform

> **The Touch-First, AI-Native, End-to-End Development & Data Workflow Platform**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Pre--Alpha-orange.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20App-green.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## What is Cosmos?

Cosmos is an **open-source web platform** that merges five tools into one touch-optimized environment:

| Capability | Replaces | How |
|-----------|---------|-----|
| 📝 **Code Editor** | VS Code Web | Monaco Editor with touch UI, pencil annotation, inline AI |
| 🎨 **Design Canvas** | Figma | Visual UI builder that generates real, working code |
| 🔗 **Workflow Engine** | Databricks / Airflow | Visual node editor for data pipelines & automation |
| 🤖 **AI Workspace** | Cursor / Copilot | 8 specialized agents, LLM-agnostic, end-to-end |
| 📊 **Data Platform** | Palantir Foundry | From data ingestion → transformation → deployment |

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

## 📂 Repository Structure

```
SAJE_N/
├── README.md                          ← You are here
├── LICENSE                            ← Apache 2.0
├── CONTRIBUTING.md                    ← Contribution guidelines
├── CODE_OF_CONDUCT.md                 ← Community standards
├── CHANGELOG.md                       ← Version history
│
├── docs/
│   ├── v1-research/
│   │   └── cosmos-v1-original-plan.md ← Original iPad workstation research
│   ├── v2-architecture/
│   │   └── cosmos-v2-architecture.md  ← Current architecture (touch-first web app)
│   └── prd/
│       └── product-requirements.md    ← Full PRD with user stories
│
├── dashboards/
│   ├── cosmos-v1-dashboard.jsx        ← Original project dashboard (React)
│   └── cosmos-v2-dashboard.jsx        ← Current project dashboard (React)
│
├── blueprints/
│   ├── system-design/
│   │   ├── system-architecture.md     ← System architecture blueprint
│   │   └── tech-stack-rationale.md    ← Technology selection rationale
│   ├── data-flow/
│   │   ├── pipeline-engine.md         ← Data pipeline design
│   │   └── ai-agent-system.md         ← Agent system design
│   └── ui-wireframes/
│       └── interface-specification.md ← Touch UI specification
│
├── assets/
│   └── cosmos-banner.md               ← Project branding
│
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    └── workflows/
        └── ci.yml
```

---

## 🚀 Project Status

| Phase | Status | Timeline |
|-------|--------|----------|
| Research & Architecture | ✅ Complete | Done |
| PRD & Blueprints | ✅ Complete | Done |
| Sprint 1: Foundation | 🔲 Not started | Weeks 1-2 |
| Sprint 2: Canvas & Collab | 🔲 Not started | Weeks 3-4 |
| Sprint 3: AI Integration | 🔲 Not started | Weeks 5-6 |
| Sprint 4: Data Pipelines | 🔲 Not started | Weeks 7-8 |
| Sprint 5: Design & Polish | 🔲 Not started | Weeks 9-10 |
| Sprint 6: Launch | 🔲 Not started | Weeks 11-12 |

---

## 🛠 Tech Stack

| Layer | Technology | License |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | MIT |
| Language | TypeScript | Apache 2.0 |
| Code Editor | Monaco Editor | MIT |
| Workflow Canvas | ReactFlow (@xyflow/react) | MIT |
| Design Canvas | Fabric.js | MIT |
| Collaboration | Yjs + y-websocket (CRDT) | MIT |
| Terminal | xterm.js | MIT |
| UI Components | shadcn/ui + Tailwind CSS | MIT |
| State Management | Zustand | MIT |
| Database | PostgreSQL + SQLite | PostgreSQL / Public Domain |
| AI Router | Custom abstraction layer | Apache 2.0 |
| Charts | Recharts + D3.js | MIT |
| Deployment | Docker / Vercel | - |

---

## 📖 Documentation

| Document | Description |
|---------|-------------|
| [V2 Architecture](docs/v2-architecture/cosmos-v2-architecture.md) | Full technical architecture |
| [Product Requirements](docs/prd/product-requirements.md) | PRD with user stories & acceptance criteria |
| [System Architecture](blueprints/system-design/system-architecture.md) | System design blueprint |
| [Tech Stack Rationale](blueprints/system-design/tech-stack-rationale.md) | Why each technology was chosen |
| [Pipeline Engine](blueprints/data-flow/pipeline-engine.md) | Data pipeline node types & execution |
| [AI Agent System](blueprints/data-flow/ai-agent-system.md) | Agent roles, routing, LLM abstraction |
| [Interface Spec](blueprints/ui-wireframes/interface-specification.md) | Touch UI spec & gesture map |
| [V1 Research](docs/v1-research/cosmos-v1-original-plan.md) | Original iPad research (preserved) |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Join the community:**
- 💬 Discord Server *(coming soon)*
- 🐛 [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)

---

## 📄 License

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE) for details.

---

<p align="center"><strong>Cosmos: Where touch meets code meets data meets AI.</strong></p>
