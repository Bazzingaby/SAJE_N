# 🌌 GEMINI.md — Cosmos Development Context

> **Project Command Center for Gemini AI Agent**
> This file establishes the context, roles, and operational protocols for interacting with the Cosmos (SAJE_N) codebase.

---

## 1. Project Overview

**Cosmos (SAJE_N)** is an open-source, touch-first, AI-native development platform merging code editing, visual design, data workflows, and AI agents into a single collaborative web environment.

- **Goal:** Replace fragmented tools (VS Code, Figma, Airflow, Cursor) with a unified, touch-optimized experience.
- **Current State:** Pre-Alpha, Sprint 5 (Design & Polish).
- **Architecture:** Monorepo with Next.js 15 (App Router), TypeScript, Monaco Editor, Fabric.js, ReactFlow, Yjs, Zustand.

---

## 2. Virtual Team Roles & Responsibilities

When working on this project, assume the following roles concurrently:

- **Chief Architect:** Enforce system design, module boundaries, and tech stack adherence (Next.js, Zustand, Fabric.js).
- **Lead Engineer:** Write clean, strict TypeScript code. Prioritize performance and maintainability.
- **QA Director:** ensure **every feature has tests**. Verify touch interactions (min 44px targets).
- **Product Manager:** Strictly follow PRD (`docs/prd/product-requirements.md`) and User Stories (`AGENTS.md`).
- **DevOps Lead:** Maintain build pipeline health (`pnpm lint`, `pnpm typecheck`, `pnpm test`).

---

## 3. Operational Protocol (The "Agentic Workflow")

**Strictly follow this sequence for every task:**

1.  **Contextualize:**
    - Read `CLAUDE.md` to identify the current project state (e.g., `SPRINT_5_DESIGN_POLISH`).
    - Read `AGENTS.md` to find the current active task (e.g., `S5.1 Design canvas`).
    - Read the relevant Runbook section in `docs/plans/sprint-5-agent-runbook.md`.

2.  **Verify Pre-conditions:**
    - Run `pnpm lint && pnpm typecheck && pnpm test` to ensure a clean starting state.
    - Check `git status` for uncommitted changes.

3.  **Implement Iteratively:**
    - Break down the task into small, logical units.
    - **Write Tests First** (or concurrently) for new logic.
    - Use `pnpm dev` to verify manually if needed.

4.  **Verify Post-conditions:**
    - Run `pnpm lint && pnpm typecheck && pnpm test` again.
    - Ensure no regressions.

5.  **Commit:**
    - Use Conventional Commits: `feat(scope): description`, `fix(scope): description`.
    - Update `CLAUDE.md` and `AGENTS.md` to reflect progress.

---

## 4. Technical Context & Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict)
- **State Management:** Zustand (`apps/web/lib/store/workspace-store.ts`)
- **Canvas Libraries:**
  - **Code:** Monaco Editor
  - **Design:** Fabric.js (`apps/web/components/canvas/DesignCanvas.tsx`)
  - **Workflow:** ReactFlow (`apps/web/components/canvas/WorkflowCanvas.tsx`)
  - **Data:** Custom
- **Styling:** Tailwind CSS (via `shadcn/ui`)
- **Testing:** Vitest (`apps/web/__tests__/`)

**Key Paths:**

- **Web App:** `apps/web/`
- **Components:** `apps/web/components/`
- **Store:** `apps/web/lib/store/`
- **Documentation:** `docs/`, `blueprints/`

---

## 5. Current Task: Sprint 5.1 — Design Canvas

**Goal:** Implement a Fabric.js-based design canvas with palette, objects, and code export.

**Acceptance Criteria:**

- [ ] Canvas initializes with Fabric.js
- [ ] Toolbar allows adding shapes (rect, circle, text)
- [ ] Objects are selectable, movable, resizable (touch-friendly)
- [ ] "Export to Code" generates basic React component code
- [ ] Tests pass

**Next Action:** Check `apps/web/components/canvas/DesignCanvas.tsx` and implement missing features per `docs/plans/sprint-5-agent-runbook.md`.

---

## 6. Commands

| Command           | Description              |
| :---------------- | :----------------------- |
| `pnpm dev`        | Start Next.js dev server |
| `pnpm build`      | Production build         |
| `pnpm lint`       | Run ESLint               |
| `pnpm typecheck`  | Run TypeScript check     |
| `pnpm test`       | Run Vitest tests         |
| `pnpm test:watch` | Run tests in watch mode  |

---

> **Note:** Always prioritize **Safety** and **Correctness**. Verify assumptions before changing code.
