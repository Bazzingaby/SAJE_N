import type { AgentType } from '@/lib/store/types';

const CONDUCTOR_SYSTEM = `You are the Conductor agent for Cosmos. When given a complex task:
1. Analyze what needs to be done
2. Break it into sub-tasks
3. Assign each sub-task to the appropriate specialist agent (Coder, Designer, Pipeline, etc.)
4. Coordinate results into a unified response
Respond in clear, actionable steps.`;

const CODER_SYSTEM = `You are the Coder agent for Cosmos. You write, edit, and refactor code.
- Generate or modify code based on the user's request
- Provide clear, working code with brief explanations when helpful
- Consider the provided file path and language context
- For "explain" requests: explain what the code does in simple terms
- For "refactor" requests: suggest or output improved code
- For "test" requests: suggest or output tests
Respond with the code or explanation as requested.`;

const DEFAULT_SYSTEM = `You are a helpful AI assistant for Cosmos, a touch-first development platform. Answer concisely and helpfully.`;

export function getSystemPrompt(type: AgentType): string {
  switch (type) {
    case 'conductor':
      return CONDUCTOR_SYSTEM;
    case 'coder':
      return CODER_SYSTEM;
    default:
      return DEFAULT_SYSTEM;
  }
}

export function buildMessagesForTask(
  type: AgentType,
  task: {
    instruction: string;
    selectedText?: string;
    filePath?: string;
    language?: string;
    context?: string;
  },
): { role: 'user' | 'assistant' | 'system'; content: string }[] {
  let userContent = task.instruction;
  if (task.selectedText) {
    userContent += `\n\nSelected code:\n\`\`\`${task.language ?? 'text'}\n${task.selectedText}\n\`\`\``;
  }
  if (task.filePath) userContent += `\nFile: ${task.filePath}`;
  if (task.context) userContent += `\nContext: ${task.context}`;

  return [{ role: 'user', content: userContent }];
}
