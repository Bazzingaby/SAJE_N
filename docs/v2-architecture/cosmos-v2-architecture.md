# 🌌 COSMOS v2 — The Touch-First Development Platform

## A Web-Based, AI-Native, End-to-End Development & Data Workflow Environment

**Version:** 0.2.0-alpha  
**Platform:** Web app (touch-optimized, works on iPad, Android tablets, desktop)  
**License:** Apache 2.0  
**Status:** Architecture Complete → Sprint Planning

---

## 1. What Cosmos Is

Cosmos is an open-source, web-based platform that merges:

- **Code editor** (like VS Code) — but touch-first with pencil annotation
- **Design canvas** (like Figma) — visual UI building that generates code
- **Workflow builder** (like Databricks/Airflow) — visual data & logic pipelines
- **AI workspace** (like Cursor + Palantir) — LLM agents integrated end-to-end
- **Business OS** (like Palantir Foundry) — from data ingestion to deployment

**No product like this exists today.** Every existing tool does one slice. Cosmos unifies them in a single touch-optimized, collaborative web environment.

### What Makes Cosmos Different

| Existing Tool | What it does | What Cosmos adds |
|--------------|-------------|-----------------|
| VS Code (web) | Code editing | Touch UI, pencil annotation, AI inline, workflow canvas |
| Figma | Visual design | Generates real code, connects to live data pipelines |
| Databricks | Data pipelines | Visual node editor, no Spark dependency, open-source |
| Palantir Foundry | End-to-end data OS | Open-source, self-hostable, AI-native |
| Cursor/Copilot | AI code assistance | Full agent system, not just autocomplete |
| n8n/Airflow | Workflow automation | Embedded in IDE, touch-native, visual |

---

## 2. Core Interface — The Four Panels

```
┌──────────────────────────────────────────────────────────────┐
│  COSMOS — Touch-First Development Platform                    │
├──────┬───────────────────────────────────────────┬───────────┤
│      │                                           │           │
│  📁  │   ┌─────────────────────────────────┐     │  🤖 AI    │
│      │   │                                 │     │  Panel    │
│ File │   │  MAIN CANVAS                    │     │           │
│ Tree │   │  (switches between modes):      │     │  Chat     │
│      │   │                                 │     │  Agent    │
│ ──── │   │  📝 Code Editor (Monaco)        │     │  Status   │
│      │   │  🎨 Design Canvas (Fabric.js)   │     │  Suggest  │
│ Git  │   │  🔗 Workflow Canvas (ReactFlow) │     │  Comment  │
│      │   │  📊 Data View (tables/charts)   │     │           │
│ ──── │   │  📋 Board (Kanban/Scrum)        │     │  ──────── │
│      │   │                                 │     │           │
│ Srch │   │  [ Tabs for open files/flows ]  │     │  🎤 Voice │
│      │   │                                 │     │  ✏️ Pencil │
│      │   └─────────────────────────────────┘     │  📷 Snap  │
│      │                                           │           │
│      │   ┌─────────────────────────────────┐     │           │
│      │   │  BOTTOM PANEL (collapsible)     │     │           │
│      │   │  Terminal / Logs / Output / DB   │     │           │
│      │   └─────────────────────────────────┘     │           │
├──────┴───────────────────────────────────────────┴───────────┤
│  ⬟ Touch Toolbar: [▶ Run] [🔍 Select] [✏️ Annotate]          │
│  [🤖 AI] [📐 Design] [🔗 Flow] [📝 Code] [💾 Save] [↩ Undo]  │
└──────────────────────────────────────────────────────────────┘
```

### Touch-First Design Principles

1. **Large tap targets** — All buttons minimum 44x44px (Apple HIG), toolbar buttons 56x56px
2. **Gesture-native** — Pinch zoom on canvas, two-finger pan, long-press for context menu
3. **Pencil-aware** — Draw annotations that convert to text (handwriting recognition)
4. **Split view** — Code + Preview, or Code + Workflow, or Design + Code side-by-side
5. **Floating action button** — AI assistant accessible from any view via FAB
6. **Touch toolbar** — Bottom toolbar with mode switching (replaces keyboard shortcuts)
7. **Drag-and-drop** — Components, files, nodes — all draggable with touch
8. **Swipe navigation** — Swipe between tabs, swipe to reveal panels

---

## 3. The Five Canvas Modes

### 3.1 📝 Code Canvas (Monaco Editor)

The code editor retains full developer functionality but reimagined for touch:

**Standard Features (preserved):**
- File explorer with folder tree
- Multi-file tabs
- Syntax highlighting (all languages)
- IntelliSense / autocomplete
- Git integration (diff, blame, commit)
- Terminal (xterm.js)
- Search & replace
- Minimap

**Touch Enhancements:**
- **Select + Annotate:** Tap the 🔍 tool, select any code block, then:
  - Write a pencil comment above it (handwriting → text via Web API)
  - Tap 🤖 to ask AI about the selection
  - Long-press to refactor/explain/test
- **Enlarged gutter:** Line numbers and breakpoints are bigger tap targets
- **Swipe-to-indent:** Swipe right to indent, swipe left to outdent
- **Touch-friendly command palette:** Grid layout instead of dropdown
- **Quick actions bar:** Common operations (comment, format, run) as bottom toolbar buttons
- **Split keyboard mode:** On iPad, keyboard can show code snippets on the accessory bar

**AI Integration in Code Canvas:**
- Inline ghost completions (like Copilot)
- Select code → "Explain" / "Refactor" / "Add tests" / "Fix bug"
- Natural language → code generation in the current file context
- AI reviews code on save (optional)

### 3.2 🎨 Design Canvas (Fabric.js + Custom)

A Figma-like visual canvas where you design UI that becomes real code:

**Features:**
- Freeform canvas with infinite zoom/pan
- Component library (drag pre-built UI elements)
- Layout tools (flexbox/grid visual builder)
- Typography, color, spacing controls
- Responsive preview (phone/tablet/desktop frames)
- Asset management (images, icons, fonts)

**Code Generation:**
- Designs export to real React/HTML/SwiftUI components
- Two-way binding: edit in design → updates code, edit code → updates design
- AI: describe a UI in natural language → generates design + code

**Touch-Native:**
- Pencil for freeform drawing / wireframing
- Pencil sketches → AI converts to structured UI components
- Pinch to resize elements
- Drag from component palette to canvas

### 3.3 🔗 Workflow Canvas (ReactFlow)

A visual node-based editor for building data pipelines, automation flows, and logic:

**Node Types:**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ 📥 Source    │───→│ 🔄 Transform │───→│ 📤 Sink     │
│ (API, DB,   │    │ (Filter,     │    │ (DB, API,   │
│  File, CSV) │    │  Map, Join)  │    │  File, S3)  │
└─────────────┘    └──────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ 🤖 AI Node  │───→│ ⚡ Function  │───→│ 📊 Viz Node │
│ (LLM call,  │    │ (Custom      │    │ (Chart,     │
│  classify)  │    │  Python/JS)  │    │  Table)     │
└─────────────┘    └──────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ ⏰ Trigger  │───→│ 🔀 Branch    │───→│ 🔔 Notify   │
│ (Cron,      │    │ (If/else,    │    │ (Email,     │
│  Webhook)   │    │  Switch)     │    │  Slack)     │
└─────────────┘    └──────────────┘    └─────────────┘
```

**Pipeline Capabilities (inspired by Databricks/Informatica/Airflow):**
- **Data Ingestion:** Connect to REST APIs, databases (Postgres, MySQL, SQLite), CSV/JSON files, S3/GCS
- **Transformation:** SQL transforms, Python/JS functions, AI-powered transforms
- **ML Pipeline:** Train models, inference nodes, feature engineering
- **Orchestration:** Schedule runs, dependency management, retry logic
- **Monitoring:** Execution logs, data quality checks, alerts

**Touch-Native:**
- Drag nodes from palette to canvas
- Connect nodes by dragging between ports
- Pinch to zoom, two-finger pan
- Tap node to configure (slide-up panel)
- Long-press to duplicate/delete

**Each node is also code:**
- Click any node → see its code in the Code Canvas
- Edit the code → node behavior updates
- Export entire workflow as Python/JS script

### 3.4 📊 Data Canvas

Interactive data exploration and visualization:

- **Table view:** Spreadsheet-like data browser
- **Chart builder:** Drag columns to axes, pick chart type
- **SQL console:** Write queries against connected databases
- **Data profiling:** Automatic statistics, null detection, type inference
- **Schema viewer:** Visual ER diagrams of database schemas

### 3.5 📋 Board Canvas

Project management integrated into the IDE:

- **Kanban board:** Drag tasks between columns
- **Sprint planning:** Story points, velocity tracking
- **Agent status:** See what AI agents are working on
- **Linked artifacts:** Each card links to files, workflows, designs

---

## 4. AI & Agent System

### 4.1 AI Access Points

AI is available from **every** canvas mode:

| Context | AI Action |
|---------|-----------|
| Code selected | Explain, refactor, add tests, fix, optimize |
| Design canvas | "Make this responsive" / "Add dark mode" |
| Workflow canvas | "Add error handling to this pipeline" |
| Data canvas | "Find anomalies in this column" |
| Board canvas | "Break this epic into stories" |
| Anywhere | Natural language → action via command bar |

### 4.2 Agent Roles

| Agent | Responsibility | Triggered By |
|-------|---------------|-------------|
| **Conductor** | Orchestrates multi-agent tasks | Complex user requests |
| **Coder** | Writes/edits code | Code generation requests |
| **Designer** | Generates UI designs/components | Design requests |
| **Pipeline** | Builds data workflows | Data pipeline requests |
| **Reviewer** | Reviews code/designs for quality | On commit, or manual |
| **Tester** | Generates and runs tests | On save, or manual |
| **Doc Writer** | Generates documentation | On command |
| **Researcher** | Searches web, finds libraries | When context needed |

### 4.3 LLM Backend Strategy

**Cosmos is LLM-agnostic.** Users choose their backend:

| Option | How | Cost |
|--------|-----|------|
| **OpenRouter** | API key, access any model | Pay per token |
| **Anthropic Claude** | Direct API | Pay per token |
| **OpenAI** | Direct API | Pay per token |
| **Groq** | Fast inference API | Pay per token |
| **Local (Ollama)** | Connect to local Ollama server | Free |
| **Self-hosted** | Any OpenAI-compatible endpoint | Free |
| **HuggingFace Inference** | Free/paid API | Free tier available |

Users configure their LLM in Settings → AI → Provider. Cosmos routes all agent calls through a unified interface.

### 4.4 Pencil + AI Workflow

A uniquely Cosmos feature:

1. User draws on the Design Canvas or annotates code with Apple Pencil
2. Cosmos uses handwriting recognition (Web API / Tesseract.js) to convert to text
3. If text is a question or instruction → routed to AI agent
4. Agent responds inline (as a comment, or by generating code/design)

Example flow:
```
User draws "add login form here" on Design Canvas
→ Handwriting recognized as text
→ Routed to Designer Agent
→ Agent generates a login form component
→ Component appears on canvas + code generated in Code Canvas
```

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | SSR, API routes, React Server Components |
| **Language** | TypeScript | Type safety across entire codebase |
| **Code Editor** | Monaco Editor (@monaco-editor/react) | Same engine as VS Code |
| **Workflow Canvas** | ReactFlow (@xyflow/react) | Production-grade node editor |
| **Design Canvas** | Fabric.js + custom React layer | Touch-native 2D canvas |
| **Collaboration** | Yjs + y-websocket (CRDT) | Real-time multi-user sync |
| **Terminal** | xterm.js + Web Container API | In-browser terminal |
| **Code Execution** | WebContainers (Stackblitz) or server sandbox | Run code in-browser |
| **UI Components** | shadcn/ui + Tailwind CSS | Accessible, customizable |
| **State Management** | Zustand | Simple, performant |
| **Database** | PostgreSQL (Supabase) + SQLite (local) | Persistence + offline |
| **Auth** | NextAuth.js / Supabase Auth | OAuth, magic link |
| **File Storage** | S3-compatible (MinIO self-hosted) | Project files, assets |
| **AI Router** | Custom abstraction layer | LLM-agnostic API calls |
| **Handwriting** | Web Handwriting Recognition API / Tesseract.js | Pencil → text |
| **Charts** | Recharts + D3.js | Data visualization |
| **Deployment** | Vercel / Docker self-hosted | Cloud or on-prem |

### 5.2 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│  BROWSER (iPad / Tablet / Desktop)                       │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Monaco   │ │ ReactFlow│ │ Fabric.js│ │ xterm.js │   │
│  │ Editor   │ │ Canvas   │ │ Canvas   │ │ Terminal │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       │            │            │            │           │
│  ┌────▼────────────▼────────────▼────────────▼─────┐    │
│  │              Zustand Store                       │    │
│  │  (files, nodes, canvas state, agent state)       │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐    │
│  │           Yjs CRDT Layer (Collaboration)         │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │ WebSocket                        │
└───────────────────────┼──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│  SERVER (Next.js API Routes / Node.js)                    │
│                                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ y-ws     │ │ AI Router│ │ File API │ │ Pipeline │    │
│  │ Server   │ │          │ │          │ │ Runner   │    │
│  └──────────┘ └────┬─────┘ └──────────┘ └──────────┘    │
│                    │                                      │
│  ┌─────────────────▼──────────────────────────────┐      │
│  │  LLM Providers (OpenRouter/Claude/Ollama/etc)  │      │
│  └────────────────────────────────────────────────┘      │
│                                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│  │ Postgres │ │ MinIO/S3 │ │ Docker   │                 │
│  │ (data)   │ │ (files)  │ │ (sandbox)│                 │
│  └──────────┘ └──────────┘ └──────────┘                 │
└───────────────────────────────────────────────────────────┘
```

### 5.3 Project Structure

```
cosmos/
├── README.md
├── LICENSE                         # Apache 2.0
├── CONTRIBUTING.md
├── package.json
├── next.config.ts
├── docker-compose.yml              # Self-hosted deployment
│
├── apps/
│   └── web/                        # Next.js main application
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx            # Landing / workspace selector
│       │   ├── workspace/[id]/
│       │   │   ├── page.tsx        # Main IDE view
│       │   │   ├── code/           # Code canvas route
│       │   │   ├── design/         # Design canvas route
│       │   │   ├── flow/           # Workflow canvas route
│       │   │   ├── data/           # Data canvas route
│       │   │   └── board/          # Board canvas route
│       │   ├── api/
│       │   │   ├── ai/             # AI routing endpoints
│       │   │   ├── files/          # File CRUD
│       │   │   ├── pipelines/      # Pipeline execution
│       │   │   ├── collab/         # Collaboration endpoints
│       │   │   └── auth/           # Authentication
│       │   └── settings/           # User/workspace settings
│       │
│       ├── components/
│       │   ├── canvas/
│       │   │   ├── CodeCanvas.tsx       # Monaco wrapper with touch enhancements
│       │   │   ├── DesignCanvas.tsx     # Fabric.js wrapper
│       │   │   ├── WorkflowCanvas.tsx   # ReactFlow wrapper
│       │   │   ├── DataCanvas.tsx       # Table + chart view
│       │   │   └── BoardCanvas.tsx      # Kanban board
│       │   ├── panels/
│       │   │   ├── FileExplorer.tsx
│       │   │   ├── AIPanel.tsx
│       │   │   ├── TerminalPanel.tsx
│       │   │   ├── GitPanel.tsx
│       │   │   └── PropertiesPanel.tsx
│       │   ├── toolbar/
│       │   │   ├── TouchToolbar.tsx      # Bottom touch toolbar
│       │   │   ├── ModeSwitch.tsx        # Canvas mode tabs
│       │   │   └── QuickActions.tsx      # Context-sensitive actions
│       │   ├── ai/
│       │   │   ├── AgentChat.tsx
│       │   │   ├── InlineAI.tsx          # Ghost completions, inline suggestions
│       │   │   ├── PencilAI.tsx          # Handwriting → AI
│       │   │   └── AgentStatus.tsx
│       │   ├── flow-nodes/              # Custom ReactFlow nodes
│       │   │   ├── SourceNode.tsx
│       │   │   ├── TransformNode.tsx
│       │   │   ├── SinkNode.tsx
│       │   │   ├── AINode.tsx
│       │   │   ├── FunctionNode.tsx
│       │   │   ├── BranchNode.tsx
│       │   │   └── TriggerNode.tsx
│       │   └── ui/                      # shadcn/ui components
│       │
│       ├── lib/
│       │   ├── ai/
│       │   │   ├── router.ts            # LLM provider abstraction
│       │   │   ├── agents/
│       │   │   │   ├── conductor.ts
│       │   │   │   ├── coder.ts
│       │   │   │   ├── designer.ts
│       │   │   │   ├── pipeline.ts
│       │   │   │   ├── reviewer.ts
│       │   │   │   └── tester.ts
│       │   │   └── prompts/             # Agent prompt templates
│       │   ├── collab/
│       │   │   ├── yjs-provider.ts      # Yjs setup
│       │   │   └── awareness.ts         # User cursors/presence
│       │   ├── pipeline/
│       │   │   ├── runner.ts            # Execute pipeline flows
│       │   │   ├── nodes.ts             # Node type definitions
│       │   │   └── scheduler.ts         # Cron/trigger management
│       │   ├── store/
│       │   │   ├── workspace.ts         # Zustand workspace store
│       │   │   ├── files.ts             # File state
│       │   │   └── agents.ts            # Agent state
│       │   └── utils/
│       │       ├── handwriting.ts       # Pencil → text conversion
│       │       ├── touch.ts             # Touch gesture helpers
│       │       └── codegen.ts           # Design → code generation
│       │
│       └── styles/
│           └── globals.css
│
├── packages/
│   ├── cosmos-agents/               # Agent framework (standalone npm package)
│   ├── cosmos-pipeline/             # Pipeline runner (standalone)
│   └── cosmos-ui/                   # Shared UI components
│
├── docs/
│   ├── getting-started.md
│   ├── architecture.md
│   ├── self-hosting.md
│   ├── agent-development.md
│   ├── pipeline-nodes.md
│   └── touch-gestures.md
│
└── docker/
    ├── Dockerfile
    ├── docker-compose.yml
    └── nginx.conf
```

---

## 6. Data Engineering Capabilities

Inspired by Databricks, Informatica, Snowflake — but open-source and visual:

### 6.1 Data Connectors (Source Nodes)

| Category | Connectors |
|----------|-----------|
| **Databases** | PostgreSQL, MySQL, SQLite, MongoDB, Redis |
| **Cloud Storage** | S3, GCS, Azure Blob, MinIO |
| **APIs** | REST (any URL), GraphQL, Webhook |
| **Files** | CSV, JSON, Parquet, Excel, XML |
| **SaaS** | GitHub API, Slack API, Google Sheets |
| **Streaming** | WebSocket, Server-Sent Events |

### 6.2 Transform Nodes

| Node | Description |
|------|------------|
| **SQL Transform** | Write SQL against any connected data |
| **Python Function** | Custom Python/JS transform logic |
| **Filter** | Conditional row filtering |
| **Map** | Column mapping / rename / type cast |
| **Join** | Merge datasets by key |
| **Aggregate** | Group by + sum/avg/count/min/max |
| **AI Transform** | LLM-powered: classify, extract, summarize |
| **Deduplicate** | Remove duplicate rows |
| **Pivot / Unpivot** | Reshape data |
| **Data Quality** | Null check, schema validation, anomaly detection |

### 6.3 Sink Nodes (Destinations)

| Sink | Description |
|------|------------|
| **Database Write** | INSERT/UPSERT to any connected DB |
| **File Export** | CSV, JSON, Parquet to storage |
| **API Call** | POST results to any endpoint |
| **Notification** | Email, Slack, webhook alert |
| **Visualization** | Pipe to chart/dashboard node |
| **Model Training** | Feed into ML training pipeline |

### 6.4 Orchestration

- **Scheduled runs:** Cron expressions via UI
- **Event triggers:** Webhook, file change, database change
- **Dependencies:** Node B waits for Node A
- **Retry logic:** Configurable retries with backoff
- **Execution history:** Log every run with inputs/outputs
- **Data lineage:** Track where every column came from

---

## 7. Open-Source & Self-Hosting

### 7.1 Deployment Options

| Mode | Description | Infrastructure |
|------|------------|---------------|
| **Cloud (Vercel)** | Fastest start, managed | Vercel + Supabase + S3 |
| **Self-hosted (Docker)** | Full control, on-prem | Docker Compose on any Linux server |
| **Hybrid** | Frontend cloud, backend self-hosted | Vercel + self-hosted API/DB |

### 7.2 docker-compose.yml (Self-Hosted)

```yaml
services:
  cosmos-web:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [postgres, minio, yjs-server]

  postgres:
    image: postgres:16-alpine
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      POSTGRES_DB: cosmos
      POSTGRES_USER: cosmos
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes: ["miniodata:/data"]

  yjs-server:
    image: node:20-alpine
    command: npx y-websocket
    ports: ["1234:1234"]

  sandbox:
    image: cosmos-sandbox  # Isolated code execution
    security_opt: ["no-new-privileges"]
    mem_limit: 512m

volumes:
  pgdata:
  miniodata:
```

### 7.3 Legal & Licensing

| Component | License | Status |
|-----------|---------|--------|
| Cosmos codebase | Apache 2.0 | ✅ Permissive |
| Monaco Editor | MIT | ✅ Compatible |
| ReactFlow | MIT | ✅ Compatible |
| Fabric.js | MIT | ✅ Compatible |
| Yjs | MIT | ✅ Compatible |
| xterm.js | MIT | ✅ Compatible |
| shadcn/ui | MIT | ✅ Compatible |
| Next.js | MIT | ✅ Compatible |
| All open-source | Verified | ✅ No infringement |

**No proprietary code from Databricks, Palantir, Informatica, Snowflake, or Figma is used.**  
Cosmos is built from scratch using only open-source libraries.

---

## 8. Sprint Plan

### Sprint 1 (Week 1-2): Foundation

| Story | Points | Description |
|-------|--------|-------------|
| S1.1 | 3 | Next.js project setup, TypeScript, Tailwind, shadcn/ui |
| S1.2 | 5 | Monaco Editor integration with touch enhancements |
| S1.3 | 3 | File explorer (tree view, create/delete/rename) |
| S1.4 | 3 | Touch toolbar (bottom bar with mode switching) |
| S1.5 | 2 | Basic layout (sidebar + main area + right panel) |
| S1.6 | 5 | Zustand store for workspace state |
| **Total** | **21** | |

### Sprint 2 (Week 3-4): Canvas & Collaboration

| Story | Points | Description |
|-------|--------|-------------|
| S2.1 | 8 | ReactFlow workflow canvas (basic node types) |
| S2.2 | 5 | Yjs real-time collaboration setup |
| S2.3 | 5 | Terminal integration (xterm.js) |
| S2.4 | 3 | Git panel (status, commit, push, pull) |
| S2.5 | 3 | Canvas mode switching (Code/Flow/Design tabs) |
| **Total** | **24** | |

### Sprint 3 (Week 5-6): AI Integration

| Story | Points | Description |
|-------|--------|-------------|
| S3.1 | 5 | AI Router (LLM provider abstraction layer) |
| S3.2 | 5 | AI Chat panel (right sidebar) |
| S3.3 | 5 | Inline AI in code editor (select → explain/refactor) |
| S3.4 | 3 | Agent framework (conductor + coder agents) |
| S3.5 | 3 | Settings page (API key config, model selection) |
| **Total** | **21** | |

### Sprint 4 (Week 7-8): Data & Pipelines

| Story | Points | Description |
|-------|--------|-------------|
| S4.1 | 5 | Custom ReactFlow nodes (source, transform, sink) |
| S4.2 | 5 | Node configuration panels (slide-up on tap) |
| S4.3 | 5 | Pipeline execution engine (basic runner) |
| S4.4 | 3 | Data canvas (table view + basic charting) |
| S4.5 | 3 | SQL console |
| **Total** | **21** | |

### Sprint 5 (Week 9-10): Design & Polish

| Story | Points | Description |
|-------|--------|-------------|
| S5.1 | 8 | Design canvas (Fabric.js + component palette) |
| S5.2 | 5 | Pencil annotation + handwriting recognition |
| S5.3 | 3 | Board canvas (Kanban) |
| S5.4 | 3 | Docker self-hosting setup |
| S5.5 | 3 | Documentation site |
| **Total** | **22** | |

### Sprint 6 (Week 11-12): Launch

| Story | Points | Description |
|-------|--------|-------------|
| S6.1 | 5 | GitHub repo setup, CI/CD, issue templates |
| S6.2 | 3 | Landing page + docs |
| S6.3 | 3 | Demo workspace with sample project |
| S6.4 | 2 | Discord server setup |
| S6.5 | 3 | Performance optimization + testing |
| **Total** | **16** | |

---

## 9. Competitive Landscape & Positioning

```
                    Touch-Native
                        ▲
                        │
            Cosmos ★    │
                        │
   Full Workflow ◄──────┼──────► Code Only
                        │
         Databricks     │   VS Code Web
         Palantir       │   Replit
                        │   CodeSandbox
                        │
                        ▼
                    Desktop-First
```

**Cosmos occupies a unique position:** No other tool is both a full workflow platform AND touch-native. This is the gap.

---

## 10. Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Code editor works on iPad Safari | ✅ Functional |
| Workflow canvas touch interactions | ✅ Drag, connect, zoom |
| AI responds to code selection | <3 second response |
| Collaboration (2 users same doc) | Real-time sync |
| Pipeline executes 3-node flow | End-to-end success |
| Self-hosted Docker deploy | `docker-compose up` works |
| GitHub stars (month 1) | 200+ |
| Lighthouse performance (mobile) | >80 |

---

## 11. Future Vision

### Phase 2 (3-6 months post-MVP)
- Voice coding ("Hey Cosmos, add a login page")
- Mobile app wrapper (PWA or React Native)
- Plugin marketplace (community nodes, themes)
- Team workspaces with roles/permissions

### Phase 3 (6-12 months)
- AI model fine-tuning on user's codebase
- Real-time data streaming pipelines
- Database migrations and schema management
- Marketplace for workflow templates

### Phase 4 (1-2 years)
- Full Palantir-like ontology system
- Enterprise features (SSO, audit logs, compliance)
- Edge deployment (export pipelines as containers)
- Multi-language code execution (Python, Rust, Go, Java)
- iPad-specific native wrapper for offline + pencil

---

*Cosmos: Where touch meets code meets data meets AI.*
