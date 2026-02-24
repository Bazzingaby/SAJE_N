import type { AgentType } from '@/lib/store/types';

export interface AgentTask {
  instruction: string;
  selectedText?: string;
  filePath?: string;
  language?: string;
  context?: string;
}

export interface AgentResult {
  content: string;
  success: boolean;
}

export type { AgentType };
