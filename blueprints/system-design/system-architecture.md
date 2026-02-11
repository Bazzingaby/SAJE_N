# System Architecture Blueprint

## Cosmos — Touch-First Development Platform

---

## 1. Architecture Overview

Client-heavy, server-light. Rich browser-side with Monaco, ReactFlow, Fabric.js. Server handles persistence, auth, AI routing, pipeline execution.

```
BROWSER (iPad / Tablet / Desktop)
┌───────────┬───────────┬───────────┬───────────┐
│  Monaco   │ ReactFlow │ Fabric.js │ xterm.js  │
│  Editor   │  Canvas   │  Canvas   │ Terminal  │
└─────┬─────┴─────┬─────┴─────┬─────┴─────┬─────┘
      └───────────┼───────────┼───────────┘
          Zustand State Store
                  │
          Yjs CRDT Document Layer
                  │ WebSocket
──────────────────┼───────────────────────────────
SERVER (Next.js)  │
┌─────────────────▼──────────────────────────────┐
│  y-ws Server │ AI Router │ File API │ Pipeline │
│              │           │          │ Runner   │
│              └─────┬─────┘                     │
│    LLM Providers (OpenRouter/Claude/Ollama/…)  │
│                                                │
│  PostgreSQL │ MinIO/S3 │ Docker Sandbox         │
└────────────────────────────────────────────────┘
```

## 2. Client Architecture

### Canvas Manager
```
CanvasManager
├── CodeCanvas (Monaco + touch layer + inline AI + pencil annotations)
├── WorkflowCanvas (ReactFlow + custom nodes + node config panels)
├── DesignCanvas (Fabric.js + component palette + code exporter)
├── DataCanvas (table view + chart builder + SQL console)
└── BoardCanvas (Kanban + agent status cards)
```

### State (Zustand)
```typescript
interface WorkspaceState {
  projectId: string;
  files: FileNode[];
  openFiles: string[];
  activeFile: string | null;
  canvasMode: 'code' | 'design' | 'flow' | 'data' | 'board';
  nodes: FlowNode[];
  edges: FlowEdge[];
  agents: AgentState[];
  chatHistory: ChatMessage[];
  llmConfig: LLMConfig;
  awareness: UserPresence[];
}
```

### Gesture System
| Gesture | Action |
|---------|--------|
| Single tap | Select/Click |
| Double tap | Open/Zoom |
| Long press | Context menu |
| Pinch | Zoom |
| Two-finger drag | Pan |
| Swipe left/right | Switch tabs |
| Three-finger swipe | Undo/Redo |
| Pencil draw | Annotate |

## 3. Server Architecture

### API Routes
```
/api/auth/     → NextAuth.js (GitHub, Google OAuth)
/api/ai/       → Chat, inline completions, agent tasks
/api/files/    → CRUD operations, upload to S3
/api/pipelines/→ Execute, schedule, logs
/api/projects/ → List/create/manage workspaces
/api/collab/   → Yjs room management
```

### AI Router Interface
```typescript
interface AIRouter {
  chat(messages, options?): AsyncIterable<string>;
  complete(prompt, context): Promise<string>;
  runAgent(type, task): Promise<AgentResult>;
  setProvider(config): void;
}
```

### Pipeline Execution
1. Parse node graph → DAG (topological sort)
2. Validate all node configs
3. Execute nodes in dependency order
4. Stream logs via SSE
5. Store run history in PostgreSQL

## 4. Database Schema (Core)

- **projects** — id, name, owner_id, timestamps
- **files** — id, project_id, path, content, is_directory (virtual filesystem)
- **workflows** — id, project_id, name, nodes (JSONB), edges (JSONB), schedule
- **pipeline_runs** — id, workflow_id, status, logs (JSONB), timestamps
- **chat_history** — id, project_id, role, content, agent_type, timestamp

## 5. Deployment

**Cloud:** Vercel + Supabase + S3/R2 + Hocuspocus (Yjs)

**Self-hosted:** Docker Compose with postgres, minio, yjs-server, cosmos-web, sandbox

## 6. Security

| Concern | Mitigation |
|---------|-----------|
| Code execution | Sandboxed Docker, resource limits |
| API keys | Encrypted at rest, server-side only |
| Auth | NextAuth.js + OAuth |
| Collaboration | Room-level access control |
| XSS | React escaping + CSP headers |
