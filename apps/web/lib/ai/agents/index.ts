import type { LLMConfig } from '@/lib/store/types';
import type { AgentType } from '@/lib/store/types';
import type { AgentTask, AgentResult } from './types';
import { getSystemPrompt, buildMessagesForTask } from './prompts';
import { chat } from '../router';
import type { ChatMessage } from '../types';

export type { AgentTask, AgentResult };
export { getSystemPrompt, buildMessagesForTask };

/**
 * Run an agent with the given task; uses router with agent system prompt.
 */
export async function runAgent(
  config: LLMConfig,
  type: AgentType,
  task: AgentTask,
): Promise<AgentResult> {
  const systemPrompt = getSystemPrompt(type);
  const userMessages = buildMessagesForTask(type, task);
  const messages: ChatMessage[] = [{ role: 'system', content: systemPrompt }, ...userMessages];

  try {
    const content = await chat(config, messages);
    return { content, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Agent failed';
    return { content: message, success: false };
  }
}
