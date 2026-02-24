# Sprint 2 Agent Runbook — Step-by-step

Use this runbook with [AGENTS.md](../../AGENTS.md). Check off items as you complete them.

---

## S2.5 Mode switching (3 pts)

- [x] **S2.5.1** Confirm `workspace-store.ts` persists `canvasMode` via `partialize` (already includes `canvasMode`).
- [ ] **S2.5.2** Add test: after `setCanvasMode('flow')` and rehydration from storage, mode is `'flow'` (or test persist middleware).
- [ ] **S2.5.3** Verify `ModeSwitch` / `ToolbarButton` touch targets ≥ 44px (inspect or test).
- [ ] **S2.5.4** Commit: `feat(workspace): verify mode switching persistence and touch targets (S2.5)`.

---

## S2.1 ReactFlow canvas (8 pts)

- [ ] **S2.1.1** Add `onNodeContextMenu` in `WorkflowCanvas.tsx`: show context menu with Duplicate / Delete; Delete removes node and connected edges; Duplicate adds a copy with offset position.
- [ ] **S2.1.2** Add `nodes` and `edges` to store `partialize` in `workspace-store.ts` so graph persists across refresh (optional: skip if store size is a concern; then document).
- [ ] **S2.1.3** Ensure ReactFlow pane is keyboard- and touch-accessible (pan/zoom); document or add test.
- [ ] **S2.1.4** Add integration test: context menu opens, delete node removes it, duplicate adds node.
- [ ] **S2.1.5** Commit(s): `feat(flow): node context menu duplicate/delete (S2.1)`; optional `feat(store): persist workflow nodes/edges`.

---

## S2.3 Terminal (5 pts)

- [ ] **S2.3.1** Document in `TerminalPanel.tsx` or README: current behavior is local-echo MVP; real PTY is via WebSocket (see S2.3.2).
- [ ] **S2.3.2** Add optional WebSocket-based terminal: either (A) `app/api/terminal/route.ts` that upgrades to WebSocket and runs shell (e.g. `node-pty` in a separate process or script), or (B) a small script `scripts/terminal-ws-server.mjs` that spawns PTY and forwards to WebSocket. TerminalPanel connects when available; falls back to local-echo.
- [ ] **S2.3.3** Resize: already using FitAddon + ResizeObserver; verify no regressions.
- [ ] **S2.3.4** Test: TerminalPanel mounts and disposes; optional E2E for WebSocket terminal.
- [ ] **S2.3.5** Commit: `feat(terminal): document MVP and add optional WebSocket PTY (S2.3)`.

---

## S2.4 Git panel (3 pts)

- [ ] **S2.4.1** Add dependency: `simple-git` (or use `child_process` for `git` CLI) in `apps/web`.
- [ ] **S2.4.2** Create API routes (workspace root = process.cwd() or env `REPO_ROOT`):
  - `GET /api/git/status` → `{ branch, files: [{ path, status }], ahead, behind }`
  - `POST /api/git/commit` → body `{ message }` → run git add + commit
  - `POST /api/git/push` → push
  - `POST /api/git/pull` → pull
- [ ] **S2.4.3** GitPanel: replace mock data with `fetch('/api/git/status')` and similar; loading and error states; commit/push/pull buttons call API.
- [ ] **S2.4.4** Safety: do not expose `git push --force`; validate paths.
- [ ] **S2.4.5** Tests: mock API or mock simple-git in API route tests; GitPanel test with mocked fetch.
- [ ] **S2.4.6** Commit: `feat(git): real Git API and wire Git panel (S2.4)`.

---

## S2.2 Yjs collaboration (5 pts)

- [ ] **S2.2.1** Add y-websocket server: new script `scripts/collab-server.mjs` (or in `apps/web`) that runs `y-websocket` server on port 1234 (or env). Document in README.
- [ ] **S2.2.2** Workspace page: create or get collab provider with `roomId = workspaceId`; pass `doc` to a collaboration context or props.
- [ ] **S2.2.3** Monaco binding: create a hook or wrapper that binds active file content to a Y.Text (e.g. `doc.get('content', Y.Text)`). On mount: apply yText to editor; on editor change: update yText; on yText observe: update editor. Use `roomId` + `filePath` as key if multiple files.
- [ ] **S2.2.4** Awareness: use existing `awareness.ts`; set local user state on provider; optionally show remote cursors in Monaco (if binding supports it).
- [ ] **S2.2.5** Offline: provider reconnects; no data loss (Yjs handles).
- [ ] **S2.2.6** Tests: yjs-provider tests; optional two-client sync test.
- [ ] **S2.2.7** Commit: `feat(collab): y-websocket server and Monaco Yjs binding (S2.2)`.

---

## Final

- [ ] Update [CLAUDE.md](../../CLAUDE.md): mark Sprint 2 complete; set current state to `[SPRINT_3_AI]`.
- [ ] Run full CI: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
