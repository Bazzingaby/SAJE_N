# Sprint 2: Next Phase Plan — Canvas & Collaboration

**Source:** [CLAUDE.md](../../CLAUDE.md) · **PRD:** [product-requirements.md](../prd/product-requirements.md) · **V2 Architecture:** [cosmos-v2-architecture.md](../v2-architecture/cosmos-v2-architecture.md)

**Current state:** Sprint 1 complete (21/21 pts). Ready for Sprint 2 (24 pts).

---

## 1. Requirements Summary

| Story    | Points | Description                                   | PRD / Notes                                |
| -------- | ------ | --------------------------------------------- | ------------------------------------------ |
| **S2.1** | 8      | ReactFlow workflow canvas (basic node types)  | WC-01: drag nodes, palette, connect        |
| **S2.2** | 5      | Yjs real-time collaboration setup             | CO-01: CRDTs, live cursors                 |
| **S2.3** | 5      | Terminal integration (xterm.js)               | CC-05: integrated terminal, resizable      |
| **S2.4** | 3      | Git panel (status, commit, push, pull)        | CC-06: diff, commit, push, pull, branch    |
| **S2.5** | 3      | Canvas mode switching (Code/Flow/Design tabs) | Code / Flow / Design (and Data/Board) tabs |

**Constraints (from CLAUDE.md):**

- Touch-first: min 44×44px targets, toolbar 56×56px; pinch/pan on canvases.
- Every feature gets tests; `pnpm lint && pnpm typecheck && pnpm test` must pass.
- Incremental commits; Conventional Commits; one story point ≈ one logical commit.

---

## 2. Current Implementation vs Gaps

| Component          | Current state                                                        | Sprint 2 gap                                                                                                     |
| ------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **WorkflowCanvas** | ReactFlow + 6 node types, palette, default nodes/edges, connect/drag | Touch gestures (pinch/pan), optional persistence; node config on tap (can defer to S4.2).                        |
| **TerminalPanel**  | xterm.js + FitAddon + theme + local-echo only                        | Real PTY: server-side (e.g. node-pty + WebSocket) or in-browser (e.g. WebContainers).                            |
| **GitPanel**       | UI only; mock data                                                   | Real Git: API routes that run `git status/diff/add/commit/push/pull` (or isomorphic-git / client-side).          |
| **Yjs**            | `createCollabProvider` + y-websocket client                          | y-websocket **server** (e.g. Next.js API or separate Node); bind Y.Doc to Monaco (y-monaco); optional awareness. |
| **Mode switching** | ModeSwitch + MainCanvas; all 5 modes render                          | Verify touch targets, persistence of last mode (Zustand already in memory), tests.                               |

---

## 3. Recommended Task Order & Breakdown

### Phase 2.1 — Mode switching (S2.5) · 3 pts

**Why first:** Already implemented; confirm acceptance criteria and close out.

- [ ] **S2.5.1** Verify Code/Flow/Design/Data/Board tabs switch correctly; mode indicator bar and accent colors match [interface-specification](../../blueprints/ui-wireframes/interface-specification.md).
- [ ] **S2.5.2** Persist `canvasMode` in `localStorage` (or existing store hydration) so refresh keeps mode.
- [ ] **S2.5.3** Add/integrate tests for mode switching (e.g. `CanvasSwitching.test.tsx`, `ModeSwitch.test.tsx`); ensure touch target sizes (44px min).
- [ ] **S2.5.4** One commit: `feat(workspace): persist canvas mode and verify mode switching (S2.5)`.

**Acceptance criteria:** User can switch between Code, Flow, Design, Data, Board; selection persists across refresh; all touch targets ≥ 44px.

---

### Phase 2.2 — ReactFlow canvas completion (S2.1) · 8 pts

**Why second:** Core workflow experience; S2.2 (Yjs) can later bind to the same canvas state.

- [ ] **S2.1.1** Touch: pinch-to-zoom and two-finger pan on WorkflowCanvas (react-flow supports this; verify and tune for touch).
- [ ] **S2.1.2** Node palette: drag from palette onto canvas creates node at drop position (if not already); touch-friendly hit areas.
- [ ] **S2.1.3** Connections: drag from handle to handle creates edge; long-press node → context menu (duplicate/delete) per [interface-specification](../../blueprints/ui-wireframes/interface-specification.md).
- [ ] **S2.1.4** Minimal persistence: save/load graph from Zustand or URL so refresh doesn’t lose the graph (optional: Yjs in S2.2).
- [ ] **S2.1.5** Tests: WorkflowCanvas integration tests (add node, add edge, pan/zoom); touch gesture tests if applicable.
- [ ] **S2.1.6** Commits: one or two logical commits (e.g. touch gestures + persistence, then tests).

**Acceptance criteria:** User can add nodes from palette, connect nodes, pan/zoom with touch, and optionally see graph persist.

---

### Phase 2.3 — Terminal integration (S2.3) · 5 pts

**Why third:** Independent of Git/Yjs; unblocks “integrated terminal” user story.

- [ ] **S2.3.1** Decide backend: (A) Next.js API route + `node-pty` + WebSocket, or (B) in-browser only (e.g. local-echo + future WebContainers). For MVP, (A) is more “real” terminal.
- [ ] **S2.3.2** If (A): add API route (e.g. `POST /api/terminal/session`) that spawns a shell with `node-pty`, streams stdin/stdout over WebSocket; TerminalPanel connects and sends/receives.
- [ ] **S2.3.3** If (B): document current behavior as “local echo terminal” and add “Connect to server terminal” in a later sprint.
- [ ] **S2.3.4** Resize: ensure FitAddon runs on panel resize; no layout jumps.
- [ ] **S2.3.5** Tests: TerminalPanel mount/resize/dispose; optional E2E for “types and sees output” if real PTY.
- [ ] **S2.3.6** Commits: e.g. `feat(terminal): add PTY backend and WebSocket (S2.3)`.

**Acceptance criteria:** User gets a working terminal in the bottom panel (either real shell or documented local-echo MVP).

---

### Phase 2.4 — Git panel (S2.4) · 3 pts

**Why fourth:** Clear scope; no dependency on Yjs.

- [ ] **S2.4.1** Backend: API routes (e.g. `GET /api/git/status`, `POST /api/git/commit`, `POST /api/git/push`, `POST /api/git/pull`) that run Git in the repo directory (workspace root). Use `simple-git` or child_process; validate paths to avoid escape.
- [ ] **S2.4.2** Frontend: GitPanel calls these APIs; show status (modified/staged/untracked), diff summary, commit message input, Commit / Push / Pull buttons.
- [ ] **S2.4.3** Safety: no `git push --force` in UI; show last commit and branch name.
- [ ] **S2.4.4** Tests: API route tests (mock git); GitPanel integration test with mocked API.
- [ ] **S2.4.5** Commit: `feat(git): wire Git panel to real Git API (S2.4)`.

**Acceptance criteria:** User can see status, stage/commit, push, and pull from the Git panel.

---

### Phase 2.5 — Yjs collaboration (S2.2) · 5 pts

**Why last:** Depends on stable canvas and editor; needs server and bindings.

- [ ] **S2.2.1** Server: run y-websocket server (e.g. `y-websocket` server script or custom WebSocket server in Next.js) on a port (e.g. 1234); document in README.
- [ ] **S2.2.2** Monaco binding: use `y-monaco` (or custom Y.Text binding) so the active file in CodeCanvas syncs via Yjs; connect provider from `createCollabProvider` with `roomId` = workspace id.
- [ ] **S2.2.3** Optional: bind ReactFlow state (nodes/edges) to Y.Doc so workflow canvas is collaborative; or defer to post-Sprint 2.
- [ ] **S2.2.4** Awareness: broadcast cursor/selection (see `lib/collab/awareness.ts`); show other users’ cursors in Monaco.
- [ ] **S2.2.5** Offline: provider reconnects; no data loss (Yjs CRDT).
- [ ] **S2.2.6** Tests: yjs-provider tests (already present); integration test with two clients and shared document.
- [ ] **S2.2.7** Commits: e.g. `feat(collab): y-websocket server and Monaco sync (S2.2)`.

**Acceptance criteria:** Two users in the same workspace see real-time code (and optionally flow) updates; cursors visible; reconnection works.

---

## 4. Definition of Done (Sprint 2)

- [ ] All five stories S2.1–S2.5 implemented and meeting acceptance criteria above.
- [ ] `pnpm lint && pnpm typecheck && pnpm test` pass.
- [ ] Touch targets and gestures per interface-specification where applicable.
- [ ] No GPL/AGPL/SSPL dependencies (license gate).
- [ ] CLAUDE.md state machine updated to `[SPRINT_2_CANVAS_COLLAB]` complete and pointer to `[SPRINT_3_AI]`.

---

## 5. Quick Reference — Key Files

| Area            | Path                                                                             |
| --------------- | -------------------------------------------------------------------------------- |
| Workflow canvas | `apps/web/components/canvas/WorkflowCanvas.tsx`, `components/flow-nodes/*`       |
| Terminal        | `apps/web/components/panels/TerminalPanel.tsx`                                   |
| Git panel       | `apps/web/components/panels/GitPanel.tsx`                                        |
| Mode switch     | `apps/web/components/toolbar/ModeSwitch.tsx`, `components/layout/MainCanvas.tsx` |
| Collab          | `apps/web/lib/collab/yjs-provider.ts`, `awareness.ts`                            |
| Store           | `apps/web/lib/store/` (canvas slice: `canvasMode`)                               |
| Tests           | `apps/web/__tests__/` (canvas, collab, panels, toolbar)                          |

---

## 6. Next Sprint Preview (Sprint 3 — AI)

After Sprint 2, the next phase is **Sprint 3: AI** (21 pts): AI Router, AI Chat panel, Inline AI in editor, Agent framework, Settings page. See CLAUDE.md and [cosmos-v2-architecture.md](../v2-architecture/cosmos-v2-architecture.md) for story list.
