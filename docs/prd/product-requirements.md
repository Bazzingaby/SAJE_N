# Product Requirements Document (PRD)

## Cosmos — Touch-First Development Platform

**Version:** 0.2.0 | **Date:** February 2026 | **Status:** Pre-Alpha

---

## 1. Vision

An open-source web platform unifying code editing, visual design, data pipelines, and AI agents in a single touch-optimized collaborative environment.

## 2. Problem

Development workflows are fragmented across 5+ tools (VS Code, Figma, Databricks, Copilot, Jira). Each is desktop-first, none designed for touch, none offer end-to-end workflows.

## 3. Target Users

| Persona | Primary Use |
|---------|-------------|
| Solo Creator | Full stack: code + design + deploy |
| Data Engineer | Pipelines + SQL + data views |
| Design Engineer | Design canvas → code generation |
| AI Builder | AI agents + workflows + code |
| Team Lead | Board + reviews + oversight |

---

## 4. User Stories

### Code Canvas (P0)
- **CC-01**: Edit code with syntax highlighting on iPad (Monaco, 20+ languages, touch selection)
- **CC-02**: Select code → AI explain/refactor/test (context menu, inline response)
- **CC-03**: Pencil annotations → AI instructions (handwriting recognition)
- **CC-04**: File explorer with tree navigation (create/rename/delete/search)
- **CC-05**: Integrated terminal (xterm.js, resizable)
- **CC-06**: Git integration (P1: diff, commit, push, pull, branch)
- **CC-07**: Inline AI ghost completions (P1: Copilot-style, accept with Tab)

### Workflow Canvas (P0)
- **WC-01**: Drag nodes onto canvas to build pipelines (ReactFlow, palette, drag-drop, connect)
- **WC-02**: Source nodes for APIs/DBs/files (REST, Postgres, MySQL, CSV, S3)
- **WC-03**: Transform nodes (filter, map, join, aggregate — configurable via tap)
- **WC-04**: Run pipeline with execution logs (streaming SSE logs)
- **WC-05**: Schedule pipelines on cron (P1)
- **WC-06**: AI-assisted pipeline building (P1: natural language → node graph)
- **WC-07**: View/edit node as code (P1: click node → Code Canvas)

### Design Canvas (P1)
- **DC-01**: Infinite canvas with UI components (zoom/pan, place, resize, group)
- **DC-02**: Drag pre-built components from palette (buttons, inputs, cards, layouts)
- **DC-03**: Design → real code export (React/HTML)
- **DC-04**: Pencil sketch → AI → structured component (P2)
- **DC-05**: Responsive preview (P2: phone/tablet/desktop frames)

### Data Canvas (P1)
- **DT-01**: Table view for data browsing (virtual scroll, sortable, pagination)
- **DT-02**: SQL console with results (execute against connected DBs)
- **DT-03**: Chart builder (P2: drag columns to axes)
- **DT-04**: Auto data profiling (P2: stats, null %, distributions)

### Board Canvas (P2)
- **BD-01**: Kanban board (drag between columns)
- **BD-02**: Cards linked to files/workflows
- **BD-03**: AI agent status display

### AI System (P0)
- **AI-01**: Configure LLM provider (Settings → provider, API key, model)
- **AI-02**: AI chat panel from any canvas (right sidebar, maintains context)
- **AI-03**: Autonomous agent tasks (P1: assign → work → report → deliver)
- **AI-04**: Local Ollama support (P1: connect localhost, offline capable)

### Collaboration (P1)
- **CO-01**: Real-time collaborative editing (Yjs CRDTs, live cursors)
- **CO-02**: Shareable workspace links (P2: permissions)

### Platform (P0)
- **PL-01**: Works on iPad Safari
- **PL-02**: Works on desktop Chrome/Firefox
- **PL-03**: Docker self-hosting (P1: docker-compose up)
- **PL-04**: OAuth login — GitHub/Google (P1)

---

## 5. Non-Functional Requirements

| Requirement | Target |
|------------|--------|
| First Contentful Paint | <2s |
| Lighthouse mobile | >80 |
| Touch response time | <100ms |
| Collaboration latency | <200ms |
| Min tap target | 44×44px (toolbar: 56×56px) |
| Accessibility | WCAG 2.1 AA |
| Self-hosting minimum | 2GB RAM VPS |

## 6. Out of Scope (MVP)

Native mobile app, video chat, plugin marketplace, enterprise SSO, on-device LLM inference, multi-language execution beyond JS/Python.

## 7. Success Metrics

| Metric | MVP | 6-Month |
|--------|-----|---------|
| GitHub Stars | 200 | 2,000 |
| Active Workspaces | 50 | 500 |
| Pipeline Runs/Day | 100 | 5,000 |
| Self-Hosted Deploys | 10 | 100 |
| Contributors | 5 | 25 |
