import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { chat } from '@/lib/ai/router';
import type { LLMConfig } from '@/lib/store/types';
import type { ChatMessage } from '@/lib/ai/types';

const defaultConfig: LLMConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'test-key',
  temperature: 0.7,
  maxTokens: 4096,
};

describe('AI Router', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls OpenAI-compatible API with correct URL and body', async () => {
    const mockFetch = vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Hello' } }] }),
    } as Response);

    const messages: ChatMessage[] = [{ role: 'user', content: 'Hi' }];
    const result = await chat(defaultConfig, messages);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const call = mockFetch.mock.calls[0];
    expect(call).toBeDefined();
    const [url, opts] = call ?? [];
    expect(String(url)).toContain('openai.com');
    expect(opts?.method).toBe('POST');
    const body = JSON.parse((opts?.body as string) ?? '{}');
    expect(body.messages).toEqual([{ role: 'user', content: 'Hi' }]);
    expect(body.model).toBe('gpt-4o-mini');
    expect(result).toBe('Hello');
  });

  it('uses options overrides for model and maxTokens', async () => {
    const mockFetch = vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Ok' } }] }),
    } as Response);

    await chat(defaultConfig, [{ role: 'user', content: 'x' }], {
      model: 'gpt-4o',
      maxTokens: 1024,
    });

    const call = mockFetch.mock.calls[0];
    const opts = call?.[1];
    const body = JSON.parse((opts?.body as string) ?? '{}');
    expect(body.model).toBe('gpt-4o');
    expect(body.max_tokens).toBe(1024);
  });

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    } as Response);

    await expect(chat(defaultConfig, [{ role: 'user', content: 'Hi' }])).rejects.toThrow(
      /401|Unauthorized/,
    );
  });

  it('uses baseUrl for custom provider', async () => {
    const mockFetch = vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Custom' } }] }),
    } as Response);

    await chat(
      {
        ...defaultConfig,
        provider: 'custom',
        baseUrl: 'https://my-llm.example.com/v1/chat/completions',
      },
      [{ role: 'user', content: 'Hi' }],
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://my-llm.example.com/v1/chat/completions',
      expect.any(Object),
    );
  });
});
