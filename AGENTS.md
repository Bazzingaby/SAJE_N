# Agentic Orchestration — Cosmos (SAJE_N)

This file tells AI agents and developers how to run the **Sprint 6** implementation in order, what to validate, and where state lives.

## Current phase: Sprint 6 — Launch (16 pts)

**State machine:** See [CLAUDE.md](./CLAUDE.md) § Project State Machine.  
**Detailed runbook:** [docs/plans/sprint-6-agent-runbook.md](docs/plans/sprint-6-agent-runbook.md) (To be created)

## Execution order (strict)

| Step | Story                   | Points | What to do                                             |
| ---- | ----------------------- | ------ | ------------------------------------------------------ |
| 1    | **S6.1** CI/CD          | 5      | GitHub Actions for lint, typecheck, test, Docker build |
| 2    | **S6.2** Landing page   | 3      | Marketing page with features & demo link               |
| 3    | **S6.3** Demo workspace | 3      | Pre-configured workspace with sample data/code         |
| 4    | **S6.4** Community      | 2      | Discord, LICENSE check, final docs                     |
| 5    | **S6.5** Optimization   | 3      | Lighthouse audit, FCP < 2s, mobile polish              |

## Before every implementation step

1. Read the relevant section in [docs/plans/sprint-5-agent-runbook.md](docs/plans/sprint-5-agent-runbook.md).
2. Run: `pnpm lint && pnpm typecheck && pnpm test`.
3. Implement one logical unit; commit with Conventional Commits (e.g. `feat(design): ...`).

## After every implementation step

1. Run again: `pnpm lint && pnpm typecheck && pnpm test`.
2. Update the runbook checklist if you added a sub-task.
3. If the story is complete, update [CLAUDE.md](./CLAUDE.md) state machine (check off the story).

## Key paths

| Area                 | Path                                                        |
| -------------------- | ----------------------------------------------------------- |
| Design canvas        | `apps/web/components/canvas/DesignCanvas.tsx`               |
| Board canvas         | `apps/web/components/canvas/BoardCanvas.tsx`                |
| Handwriting / pencil | `apps/web/lib/utils/handwriting.ts` (or similar)            |
| Pipeline / flow      | `apps/web/lib/pipeline/`, `apps/web/components/flow-nodes/` |
| Data canvas          | `apps/web/components/canvas/DataCanvas.tsx`                 |
| Store                | `apps/web/lib/store/`                                       |
| Docker               | `Dockerfile`, `docker-compose.yml`                          |

## Interruption recovery

1. `git log --oneline -15` — see last commits.
2. `git status` — uncommitted work.
3. Read this file + [docs/plans/sprint-5-agent-runbook.md](docs/plans/sprint-5-agent-runbook.md) — find next unchecked item.
4. `pnpm test` — ensure health.
5. Continue from the next unchecked task.

## Definition of done (Sprint 5)

- All S5.1–S5.5 acceptance criteria met (see sprint-5-next-phase-plan.md).
- CI: lint → typecheck → test → build pass.
- Touch targets ≥ 44px where applicable.
