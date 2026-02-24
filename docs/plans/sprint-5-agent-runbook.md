# Sprint 5 Agent Runbook — Design & Polish

Use with [AGENTS.md](../../AGENTS.md). Check off items as you complete them.

---

## S5.1 Design canvas (8 pts)

- [ ] **S5.1.1** Add Fabric.js; create DesignCanvas with canvas element, zoom/pan (mouse + touch).
- [ ] **S5.1.2** Component palette: buttons, inputs, cards, layout blocks; drag onto canvas as Fabric objects.
- [ ] **S5.1.3** Object manipulation: select, move, resize, delete; min 44px touch targets for controls.
- [ ] **S5.1.4** Group/ungroup; layer order; optional alignment guides.
- [ ] **S5.1.5** Export: design → React/HTML code (string or file); minimal codegen for MVP.
- [ ] **S5.1.6** Tests: canvas mounts; add object from palette; export returns non-empty string.
- [ ] **S5.1.7** Commit: `feat(design): Fabric.js canvas, palette, export (S5.1)`.

---

## S5.2 Pencil + handwriting (5 pts)

- [ ] **S5.2.1** Pencil/stylus input: capture drawing mode on Design or Code canvas; stroke path (points or path2D).
- [ ] **S5.2.2** Render strokes on canvas (Fabric path or overlay); clear/undo optional.
- [ ] **S5.2.3** Optional: handwriting → text (library or API); pass text to AI as context (e.g. inline AI).
- [ ] **S5.2.4** Touch targets and mode switch (e.g. pencil vs select) ≥ 44px.
- [ ] **S5.2.5** Tests: pencil mode toggles; stroke data captured (or mock).
- [ ] **S5.2.6** Commit: `feat(canvas): pencil stroke capture and optional HWR (S5.2)`.

---

## S5.3 Board canvas (3 pts)

- [ ] **S5.3.1** Board canvas layout: columns (e.g. To Do, In Progress, Done); cards in columns.
- [ ] **S5.3.2** Drag cards between columns; persist column/card state in store (board slice or workspace).
- [ ] **S5.3.3** Card: title, optional link to file or workflow ID; minimal UI.
- [ ] **S5.3.4** Tests: board renders columns; drag updates state or DOM.
- [ ] **S5.3.5** Commit: `feat(board): Kanban board with columns and draggable cards (S5.3)`.

---

## S5.4 Docker setup (3 pts)

- [ ] **S5.4.1** Dockerfile for Next.js app (multi-stage build); use Node 20, pnpm.
- [ ] **S5.4.2** docker-compose.yml: web service; optional collab (y-ws) service; env vars.
- [ ] **S5.4.3** .env.example with NEXT*PUBLIC*\*, COLLAB_SERVER_URL, etc.; document in README or deploy doc.
- [ ] **S5.4.4** Document: how to run with Docker; 2GB RAM note.
- [ ] **S5.4.5** Commit: `chore(docker): Dockerfile and docker-compose for app and collab (S5.4)`.

---

## S5.5 Documentation (3 pts)

- [ ] **S5.5.1** CONTRIBUTING.md: how to clone, install, run tests, submit PRs; link to CLAUDE/AGENTS.
- [ ] **S5.5.2** Deploy guide: Docker, env vars, optional Vercel; self-host checklist.
- [ ] **S5.5.3** Key component/API docs: short descriptions for canvas, panels, store, API routes (in README or docs/).
- [ ] **S5.5.4** Commit: `docs: CONTRIBUTING, deploy guide, component overview (S5.5)`.

---

## Final

- [ ] Update [CLAUDE.md](../../CLAUDE.md): mark Sprint 5 complete; set state to `[SPRINT_6_LAUNCH]`.
- [ ] Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
