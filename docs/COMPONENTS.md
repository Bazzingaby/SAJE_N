# Core Components & Architecture — Cosmos (SAJE_N)

A high-level overview of the SAJE_N (Cosmos) codebase.

## 🎨 Canvas Modes

| Component        | Path                                            | Purpose                          | Library   |
| ---------------- | ----------------------------------------------- | -------------------------------- | --------- |
| `CodeCanvas`     | `apps/web/components/canvas/CodeCanvas.tsx`     | Touch-first code editing & AI    | Monaco    |
| `DesignCanvas`   | `apps/web/components/canvas/DesignCanvas.tsx`   | Visual UI builder & code export  | Fabric.js |
| `WorkflowCanvas` | `apps/web/components/canvas/WorkflowCanvas.tsx` | Data pipeline graph editor       | ReactFlow |
| `DataCanvas`     | `apps/web/components/canvas/DataCanvas.tsx`     | SQL console & table/chart viewer | Custom    |
| `BoardCanvas`    | `apps/web/components/canvas/BoardCanvas.tsx`    | Kanban task & agent tracking     | Custom    |

---

## 🏗️ UI Panels

- **File Explorer**: `apps/web/components/panels/FileExplorer.tsx` — Local and virtual file management.
- **AI Chat**: `apps/web/components/panels/AIPanel.tsx` — Agentic chat & task orchestration.
- **Terminal**: `apps/web/components/panels/TerminalPanel.tsx` — Integrated xterm.js shell.
- **Git**: `apps/web/components/panels/GitPanel.tsx` — Simple git integration (simple-git).

---

## 💾 Global Store (Zustand)

Location: `apps/web/lib/store/workspace-store.ts`

The store is split into specialized slices:

- **`workspace`**: Current project metadata and canvas mode.
- **`files`**: File tree state and active file buffer.
- **`canvas`**: ReactFlow nodes and edges for workflows.
- **`ui`**: Panel visibility, theme settings, and touch state.
- **`llmConfig`**: LLM provider settings (persisted to localStorage).

---

## 🤖 AI Router

Location: `apps/web/lib/ai/router.ts`

An abstraction layer for connecting to any OpenAI-compatible or Anthropic endpoint. Streaming is supported via Server-Sent Events (SSE).

---

## 🔗 Collaboration

Location: `apps/web/lib/collab/`

Uses **Yjs CRDTs** for real-time collaborative editing. A lightweight WebSocket server (`scripts/collab-server.mjs`) handles document broadcasting.
