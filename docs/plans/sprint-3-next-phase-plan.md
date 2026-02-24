# Sprint 3: Next Phase Plan — AI Integration

**Source:** [CLAUDE.md](../../CLAUDE.md) · **PRD:** [product-requirements.md](../prd/product-requirements.md) · **AI Blueprint:** [ai-agent-system.md](../../blueprints/data-flow/ai-agent-system.md)

**Current state:** Sprint 2 complete (24/24 pts). Ready for Sprint 3 (21 pts).

---

## 1. Requirements Summary

| Story    | Points | Description                                | PRD / Notes                                                                                       |
| -------- | ------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **S3.1** | 5      | AI Router (LLM provider abstraction layer) | Unified chat/complete interface; OpenRouter, Anthropic, OpenAI, Groq, Ollama, HuggingFace, custom |
| **S3.2** | 5      | AI Chat panel (right sidebar)              | Wire to router; send message, stream response, show in chat history                               |
| **S3.3** | 5      | Inline AI in code editor                   | Select text → Explain / Refactor / Test; context menu or toolbar; show response inline            |
| **S3.4** | 3      | Agent framework (conductor + coder agents) | runAgent(type, task); system prompts; Conductor + Coder minimal                                   |
| **S3.5** | 3      | Settings page (API key, model selection)   | Form: provider, API key, model, baseUrl; persist via store llmConfig                              |

**Constraints:** LLM-agnostic; no hardcoded keys; touch targets ≥ 44px; tests for router and panel.

---

## 2. Current Implementation vs Gaps

| Component               | Current state                                                | Sprint 3 gap                                                                  |
| ----------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------- |
| **Store**               | `llmConfig`, `chatHistory`, `addChatMessage`, `setLLMConfig` | Router reads config; chat panel appends to chatHistory                        |
| **AIPanel**             | Placeholder UI (input + send button, no backend)             | Call router.chat(); stream response; display messages                         |
| **CodeCanvas / Monaco** | No AI actions on selection                                   | Inline AI: context menu or floating bar → Explain/Refactor/Test → call router |
| **Agents**              | Types and slice (addAgent, updateAgentStatus)                | runAgent(conductor                                                            | coder, task) with system prompts |
| **Settings**            | None                                                         | New page or modal: provider, apiKey, model, baseUrl; save to store            |

---

## 3. Recommended Task Order

1. **S3.1** AI Router — core abstraction; no UI dependency.
2. **S3.5** Settings page — so users can configure API key before using chat.
3. **S3.2** AI Chat panel — wire AIPanel to router + stream.
4. **S3.4** Agent framework — runAgent + conductor/coder prompts.
5. **S3.3** Inline AI — selection → actions → router/agent.

---

## 4. Definition of Done (Sprint 3)

- Router: at least one provider (e.g. OpenAI-compatible) works; chat(messages) returns/streams text.
- Chat panel: user can send a message and see assistant reply (streamed or final).
- Inline AI: select code → action → see explanation/refactor/suggestion.
- Agent framework: runAgent('coder', task) uses Coder system prompt and router.
- Settings: user can set provider, API key, model; persisted; no keys in code.
- `pnpm lint && pnpm typecheck && pnpm test` pass.

---

## 5. Key Files

| Area       | Path                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| AI Router  | `apps/web/lib/ai/router.ts`                                                 |
| Chat panel | `apps/web/components/layout/AIPanel.tsx`                                    |
| Inline AI  | `apps/web/components/canvas/CodeCanvas.tsx` or MonacoWrapper + context menu |
| Agents     | `apps/web/lib/ai/agents/` (conductor, coder)                                |
| Settings   | `apps/web/app/settings/page.tsx` or modal in layout                         |
| Store      | `apps/web/lib/store/` (llmConfig, chatHistory)                              |
