# Sprint 4: Next Phase Plan — Data & Pipelines

**Source:** [CLAUDE.md](../../CLAUDE.md) · **PRD:** [product-requirements.md](../prd/product-requirements.md) · **Pipeline blueprint:** [pipeline-engine.md](../../blueprints/data-flow/pipeline-engine.md)

**Current state:** Sprint 3 complete (21/21 pts). Ready for Sprint 4 (21 pts).

---

## 1. Requirements Summary

| Story    | Points | Description                                      | PRD / Notes                                                                   |
| -------- | ------ | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| **S4.1** | 5      | Custom ReactFlow nodes (source, transform, sink) | Config schema, execution contract; nodes are pipeline-aware                   |
| **S4.2** | 5      | Node configuration panels (slide-up on tap)      | Tap node → slide-up panel to edit config; touch-friendly                      |
| **S4.3** | 5      | Pipeline execution engine (basic runner)         | Parse DAG → topological sort → validate → execute in order; SSE/logs optional |
| **S4.4** | 3      | Data canvas (table view + basic charting)        | Table viewer, simple chart; Data canvas is more than placeholder              |
| **S4.5** | 3      | SQL console                                      | Execute SQL, show results; can live in Data canvas or as tab                  |

**Constraints:** Touch targets ≥ 44px; tests for runner and panels; no GPL deps.

---

## 2. Current Implementation vs Gaps

| Component          | Current state                                                      | Sprint 4 gap                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Flow nodes**     | SourceNode, TransformNode, SinkNode, etc. (UI + label/description) | Add `config` shape per type, execution interface (execute/validate); store config in node data                                               |
| **WorkflowCanvas** | No config UI on node tap                                           | S4.2: slide-up panel bound to selected node; form fields from node config schema                                                             |
| **Pipeline**       | None                                                               | S4.3: lib/pipeline/ or packages/cosmos-pipeline: DAG from nodes/edges, topological sort, run nodes in order; mock or simple execute per type |
| **DataCanvas**     | Placeholder only                                                   | S4.4: table with virtual scroll or simple list; chart (e.g. bar/line) from pipeline output or sample data                                    |
| **SQL**            | None                                                               | S4.5: input + run button; results table; can be pane in Data canvas                                                                          |

---

## 3. Recommended Task Order

1. **S4.1** — Define node config types and execution contract; extend node data with config.
2. **S4.2** — Node config panel (slide-up) when a node is selected; wire to node config.
3. **S4.3** — Pipeline runner: build DAG from store nodes/edges, topological sort, execute (mock or simple implementations).
4. **S4.4** — Data canvas: table view + basic chart component.
5. **S4.5** — SQL console (in Data canvas or separate); run query, show results table.

---

## 4. Definition of Done (Sprint 4)

- Source/Transform/Sink nodes have config schema and participate in runner (config in node data).
- Tapping a node opens a slide-up config panel; changes persist to store.
- Pipeline runner: given a graph, runs nodes in dependency order; at least one node type produces consumable output.
- Data canvas shows a data table and a simple chart (e.g. from sample or pipeline output).
- SQL console executes a query and displays results in a table.
- `pnpm lint && pnpm typecheck && pnpm test` pass.

---

## 5. Key Files

| Area              | Path                                                             |
| ----------------- | ---------------------------------------------------------------- |
| Flow nodes        | `apps/web/components/flow-nodes/`                                |
| Node config panel | `apps/web/components/panels/NodeConfigPanel.tsx` or in layout    |
| Pipeline runner   | `apps/web/lib/pipeline/runner.ts`, `nodes.ts`                    |
| Data canvas       | `apps/web/components/canvas/DataCanvas.tsx`                      |
| SQL console       | `apps/web/components/panels/SqlConsole.tsx` or inside DataCanvas |
| Workflow canvas   | `apps/web/components/canvas/WorkflowCanvas.tsx`                  |
