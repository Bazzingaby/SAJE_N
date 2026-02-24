# Sprint 5: Next Phase Plan — Design & Polish

**Source:** [CLAUDE.md](../../CLAUDE.md) · **PRD:** [product-requirements.md](../prd/product-requirements.md) · **Touch UI:** [interface-specification.md](../../blueprints/ui-wireframes/interface-specification.md)

**Current state:** Sprint 4 complete (21/21 pts). Ready for Sprint 5 (22 pts).

---

## 1. Requirements Summary

| Story    | Points | Description               | PRD / Notes                                                                              |
| -------- | ------ | ------------------------- | ---------------------------------------------------------------------------------------- |
| **S5.1** | 8      | Design canvas (Fabric.js) | Infinite canvas, zoom/pan; component palette; place, resize, group; design → code export |
| **S5.2** | 5      | Pencil + handwriting      | Pencil/stylus input; stroke capture; optional handwriting → text for AI                  |
| **S5.3** | 3      | Board canvas              | Kanban columns; cards; link to files/workflows; minimal MVP                              |
| **S5.4** | 3      | Docker setup              | docker-compose for app + optional collab; 2GB RAM target                                 |
| **S5.5** | 3      | Documentation             | README, CONTRIBUTING, API/component docs; deploy guide                                   |

**Constraints:** Touch targets ≥ 44px; Fabric.js for design; no GPL deps; self-host docs.

---

## 2. Current Implementation vs Gaps

| Component                | Current state            | Sprint 5 gap                                                   |
| ------------------------ | ------------------------ | -------------------------------------------------------------- |
| **Design canvas**        | Placeholder or missing   | S5.1: Fabric.js canvas; palette; objects; export to React/HTML |
| **Pencil / handwriting** | Not implemented          | S5.2: stroke capture on canvas; optional HWR → AI context      |
| **Board canvas**         | Placeholder              | S5.3: columns, cards, drag-between; link to entities           |
| **Docker**               | None                     | S5.4: Dockerfile + docker-compose; env template                |
| **Docs**                 | README, CLAUDE, runbooks | S5.5: CONTRIBUTING, deploy guide, key API/component docs       |

---

## 3. Recommended Task Order

1. **S5.1** — Design canvas: Fabric.js setup, basic objects, palette, export.
2. **S5.2** — Pencil: stroke capture; optional handwriting recognition path.
3. **S5.3** — Board canvas: Kanban UI, cards, drag-drop.
4. **S5.4** — Docker: Dockerfile, docker-compose, .env.example.
5. **S5.5** — Documentation: CONTRIBUTING, deploy guide, component/API notes.

---

## 4. Definition of Done (Sprint 5)

- Design canvas: user can add shapes/components, resize, and export to code (or placeholder export).
- Pencil: strokes are captured on at least one canvas (code/design); optional text conversion.
- Board: Kanban with columns and draggable cards; cards can reference files/workflows.
- Docker: `docker-compose up` runs the app (and optional collab server).
- Docs: CONTRIBUTING and deploy guide exist; key paths documented.
- `pnpm lint && pnpm typecheck && pnpm test` pass.

---

## 5. Key Files

| Area                 | Path                                               |
| -------------------- | -------------------------------------------------- |
| Design canvas        | `apps/web/components/canvas/DesignCanvas.tsx`      |
| Board canvas         | `apps/web/components/canvas/BoardCanvas.tsx`       |
| Handwriting / pencil | `apps/web/lib/utils/handwriting.ts` (or similar)   |
| Docker               | `Dockerfile`, `docker-compose.yml`, `.env.example` |
| Docs                 | `README.md`, `CONTRIBUTING.md`, `docs/`            |
