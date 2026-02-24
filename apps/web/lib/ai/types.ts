import type { LLMConfig } from '@/lib/store/types';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export type StreamCallback = (chunk: string) => void;

export type { LLMConfig };
