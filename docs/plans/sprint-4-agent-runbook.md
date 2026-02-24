# Sprint 4 Agent Runbook — Data & Pipelines

Use with [AGENTS.md](../../AGENTS.md). Check off items as you complete them.

---

## S4.1 Custom ReactFlow nodes (5 pts)

- [x] **S4.1.1** Define pipeline types in `lib/pipeline/types.ts`: `NodeConfig` (source/transform/sink variants), `DataPayload` (rows, schema), `PipelineNodeData` (extends current node data with `config`).
- [x] **S4.1.2** Extend SourceNode, TransformNode, SinkNode so `data.config` is typed and persisted (e.g. source: `{ url?: string, query?: string }`, transform: `{ expression?: string }`, sink: `{ table?: string }`). Default config when adding node.
- [x] **S4.1.3** Add execution stubs: each node type has an `execute(payload)` that returns `DataPayload` (mock data or simple passthrough for MVP).
- [x] **S4.1.4** Tests: node data includes config; execute returns payload shape.
- [x] **S4.1.5** Commit: `feat(pipeline): node config schema and execution contract (S4.1)`.

---

## S4.2 Node config panels (5 pts)

- [x] **S4.2.1** Create `NodeConfigPanel` (or slide-up sheet): receives `nodeId`, `nodeType`, `config`, `onSave(config)`. Renders form fields based on node type (source: URL/query, transform: expression, sink: table).
- [x] **S4.2.2** In WorkflowCanvas: when a node is selected (`onNodeClick` or selected state), show the panel (Sheet from shadcn or fixed bottom panel). Pass current node data and update store on save.
- [x] **S4.2.3** Panel: min 44px touch targets; close button; Save/Cancel. Persist config to node in store (setNodes with updated node data).
- [x] **S4.2.4** Tests: panel opens when node selected; save updates node config in store.
- [x] **S4.2.5** Commit: `feat(flow): node config panel slide-up on tap (S4.2)`.

---

## S4.3 Pipeline runner (5 pts)

- [x] **S4.3.1** Create `lib/pipeline/runner.ts`: `buildDag(nodes, edges)` → adjacency list; `topologicalSort(nodes, edges)` → ordered node ids; cycle detection.
- [x] **S4.3.2** `runPipeline(nodes, edges)` (or from store): get order, for each node get inputs from predecessors, call node `execute`, pass output to next. Use execution stubs from S4.1. Return final outputs or run summary.
- [x] **S4.3.3** Expose "Run" in WorkflowCanvas (toolbar or context): call runner, show success/error (toast or inline). Optional: stream logs via state.
- [x] **S4.3.4** Tests: topological sort; run pipeline with 2–3 nodes returns expected.
- [x] **S4.3.5** Commit: `feat(pipeline): DAG runner and Run action (S4.3)`.

---

## S4.4 Data canvas (3 pts)

- [x] **S4.4.1** Data canvas layout: left or top = data source selector or "Pipeline output" / "Sample data"; main = table view (columns + rows); optional right/bottom = chart.
- [x] **S4.4.2** Table view: component that accepts `rows: Record<string, unknown>[]` and `columns: string[]`; render table with scroll; min 44px row height for touch.
- [x] **S4.4.3** Basic chart: bar or line chart from same data (e.g. first numeric column vs index, or two columns). Use a small charting lib (e.g. Recharts — check license) or simple SVG/CSS.
- [x] **S4.4.4** Wire sample data or last pipeline run result to table/chart so Data canvas shows something on load or after run.
- [x] **S4.4.5** Commit: `feat(data): Data canvas table view and basic chart (S4.4)`.

---

## S4.5 SQL console (3 pts)

- [x] **S4.5.1** Add SQL console component: textarea (or Monaco SQL) for query, "Run" button. On Run: call API `POST /api/sql/run` with `{ query: string }` or run in-memory (e.g. sql.js) for MVP.
- [x] **S4.5.2** Display results in a table (reuse table from S4.4). Show error message if query fails.
- [x] **S4.5.3** Place in Data canvas as a tab or section ("SQL" / "Table" / "Chart").
- [x] **S4.5.4** Tests: SQL console renders; run with mock API returns table.
- [x] **S4.5.5** Commit: `feat(data): SQL console with results table (S4.5)`.

---

## Final

- [x] Update [CLAUDE.md](../../CLAUDE.md): mark Sprint 4 complete; set state to `[SPRINT_5_DESIGN_POLISH]`.
- [x] Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
