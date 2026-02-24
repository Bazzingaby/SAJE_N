# Sprint 3 Agent Runbook — AI Integration

Use with [AGENTS.md](../../AGENTS.md). Check off items as you complete them.

---

## S3.1 AI Router (5 pts)

- [ ] **S3.1.1** Create `apps/web/lib/ai/router.ts`: interface `ChatMessage`, `ChatOptions`, `StreamCallback`; function `chat(messages, options, onStream?)` that returns `Promise<string>` and optionally calls `onStream(chunk)`.
- [ ] **S3.1.2** Implement provider dispatch by `llmConfig.provider`: map to fetch to OpenAI-compatible API (OpenAI, OpenRouter, Groq, custom baseUrl) or Anthropic. Use `llmConfig.apiKey`, `llmConfig.model`, `llmConfig.baseUrl` where applicable.
- [ ] **S3.1.3** Support streaming: parse SSE or NDJSON from provider response and invoke `onStream` with text deltas.
- [ ] **S3.1.4** Keep router ~200 lines; no GPL deps. Add unit tests (mock fetch) for chat() and provider selection.
- [ ] **S3.1.5** Commit: `feat(ai): add AI router with provider abstraction (S3.1)`.

---

## S3.5 Settings page (3 pts)

- [ ] **S3.5.1** Add route `app/settings/page.tsx`: form with provider dropdown, API key (password input), model name, base URL (optional), temperature, maxTokens. Load/save from `useWorkspaceStore` llmConfig.
- [ ] **S3.5.2** Persist: store already partializes `llmConfig`; ensure Settings form writes via `setLLMConfig`.
- [ ] **S3.5.3** Link to Settings from workspace (e.g. toolbar or sidebar). Touch-friendly inputs (min 44px).
- [ ] **S3.5.4** Commit: `feat(settings): add Settings page for API key and model (S3.5)`.

---

## S3.2 AI Chat panel (5 pts)

- [ ] **S3.2.1** In AIPanel: on Send, get `chatHistory` and `llmConfig` from store; build messages array (user + assistant history); call `chat(messages, {}, onStream)`.
- [ ] **S3.2.2** Append user message to `chatHistory` (addChatMessage); when stream starts append assistant message with empty content, then update content on each chunk (or append full response when done).
- [ ] **S3.2.3** Display messages in scrollable list (user right, assistant left or stacked); markdown optional for assistant. Auto-scroll to bottom.
- [ ] **S3.2.4** Disable send while loading; show loading indicator. Handle errors (toast or inline).
- [ ] **S3.2.5** Tests: mock router; AIPanel sends message and displays response.
- [ ] **S3.2.6** Commit: `feat(ai): wire AI Chat panel to router (S3.2)`.

---

## S3.4 Agent framework (3 pts)

- [ ] **S3.4.1** Create `apps/web/lib/ai/agents/types.ts`: `AgentType`, `AgentTask`, `AgentResult`; system prompts for Conductor and Coder (strings or functions).
- [ ] **S3.4.2** Create `apps/web/lib/ai/agents/conductor.ts` and `coder.ts` (or single `agents.ts`): `getSystemPrompt(type)`, `buildMessages(task)`.
- [ ] **S3.4.3** In router or new `runAgent(type, task)`: get system prompt, build messages, call `chat([{ role: 'system', content }, ...messages])`, return result. Optionally parse structured output.
- [ ] **S3.4.4** Tests: runAgent('coder', { instruction, context }) returns string; mock chat.
- [ ] **S3.4.5** Commit: `feat(ai): add agent framework with conductor and coder (S3.4)`.

---

## S3.3 Inline AI (5 pts)

- [ ] **S3.3.1** In CodeCanvas or MonacoWrapper: when user selects text, show context menu or floating toolbar with "Explain", "Refactor", "Add tests" (or similar). Use Monaco's built-in context menu or a custom overlay at selection.
- [ ] **S3.3.2** On action: get selected text and file context; call `runAgent('coder', { instruction: 'explain', selectedText, filePath })` or direct `chat()` with prompt including selection.
- [ ] **S3.3.3** Show response in a popover, inline below selection, or in AI panel. Dismiss on blur or button.
- [ ] **S3.3.4** Touch: long-press or selection handles → show same actions. Min 44px targets.
- [ ] **S3.3.5** Tests: mock router; selection + click Explain shows response area.
- [ ] **S3.3.6** Commit: `feat(ai): inline AI explain/refactor from code selection (S3.3)`.

---

## Final

- [ ] Update [CLAUDE.md](../../CLAUDE.md): mark Sprint 3 complete; set state to `[SPRINT_4_DATA_PIPELINES]`.
- [ ] Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
