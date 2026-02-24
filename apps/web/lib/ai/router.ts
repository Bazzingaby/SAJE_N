/**
 * AI Router — LLM-agnostic provider abstraction (S3.1).
 * Single interface for chat(); dispatches to OpenAI-compatible or Anthropic APIs.
 */
import type { ChatMessage, ChatOptions, StreamCallback, LLMConfig } from './types';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getRequestUrl(config: LLMConfig): string {
  if (config.baseUrl) return config.baseUrl.replace(/\/$/, '');
  switch (config.provider) {
    case 'openai':
      return OPENAI_URL;
    case 'openrouter':
      return OPENROUTER_URL;
    case 'groq':
      return GROQ_URL;
    case 'ollama':
      return 'http://localhost:11434/v1/chat/completions';
    case 'anthropic':
      return ANTHROPIC_URL;
    case 'huggingface':
    case 'custom':
      return config.baseUrl || OPENAI_URL;
    default:
      return OPENAI_URL;
  }
}

function isAnthropic(config: LLMConfig): boolean {
  return config.provider === 'anthropic';
}

function buildOpenAIBody(
  messages: ChatMessage[],
  options: ChatOptions,
  config: LLMConfig,
  stream: boolean,
): Record<string, unknown> {
  const model = options.model ?? config.model;
  const max_tokens = options.maxTokens ?? config.maxTokens ?? 4096;
  const temperature = options.temperature ?? config.temperature ?? 0.7;
  return {
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream,
    max_tokens,
    temperature,
  };
}

function buildAnthropicBody(
  messages: ChatMessage[],
  options: ChatOptions,
  config: LLMConfig,
): Record<string, unknown> {
  const system = messages.find((m) => m.role === 'system');
  const rest = messages.filter((m) => m.role !== 'system');
  const model = options.model ?? config.model;
  const max_tokens = options.maxTokens ?? config.maxTokens ?? 4096;
  const temperature = options.temperature ?? config.temperature ?? 0.7;
  return {
    model,
    max_tokens,
    temperature,
    system: system?.content ?? '',
    messages: rest.map((m) => ({ role: m.role, content: m.content })),
    stream: true,
  };
}

async function streamOpenAI(
  url: string,
  headers: Record<string, string>,
  body: Record<string, unknown>,
  onStream: StreamCallback,
): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed: ${res.status} ${err}`);
  }
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            full += content;
            onStream(content);
          }
        } catch {
          // skip malformed chunk
        }
      }
    }
  }
  return full;
}

async function streamAnthropic(
  url: string,
  headers: Record<string, string>,
  body: Record<string, unknown>,
  onStream: StreamCallback,
): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      ...headers,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed: ${res.status} ${err}`);
  }
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data) as {
            type?: string;
            delta?: { text?: string };
            text?: string;
          };
          const text = json.delta?.text ?? json.text;
          if (text) {
            full += text;
            onStream(text);
          }
        } catch {
          // skip
        }
      }
    }
  }
  return full;
}

/**
 * Send chat messages to the configured LLM; optionally stream chunks.
 * Uses config.provider to choose API (OpenAI-compatible vs Anthropic).
 */
export async function chat(
  config: LLMConfig,
  messages: ChatMessage[],
  options?: ChatOptions,
  onStream?: StreamCallback,
): Promise<string> {
  const url = getRequestUrl(config);
  const opts = options ?? {};
  const stream = !!onStream;

  if (isAnthropic(config)) {
    const body = buildAnthropicBody(messages, opts, config);
    const headers: Record<string, string> = {};
    if (config.apiKey) headers['x-api-key'] = config.apiKey;
    if (stream && onStream) return streamAnthropic(url, headers, body, onStream);
    // Non-stream Anthropic: use stream and collect
    let result = '';
    await streamAnthropic(url, headers, body, (chunk) => {
      result += chunk;
    });
    return result;
  }

  // OpenAI-compatible
  const body = buildOpenAIBody(messages, opts, config, stream);
  const headers: Record<string, string> = {};
  if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
  if (config.provider === 'openrouter' && config.apiKey)
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : '';

  if (stream && onStream) return streamOpenAI(url, headers, body, onStream);
  body.stream = false;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed: ${res.status} ${err}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? '';
  return content;
}
