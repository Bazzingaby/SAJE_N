'use client';

import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/store';
import type { LLMProvider } from '@/lib/store/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'groq', label: 'Groq' },
  { value: 'ollama', label: 'Ollama (local)' },
  { value: 'huggingface', label: 'HuggingFace' },
  { value: 'custom', label: 'Custom (OpenAI-compatible)' },
];

export default function SettingsPage() {
  const router = useRouter();
  const llmConfig = useWorkspaceStore((s) => s.llmConfig);
  const setLLMConfig = useWorkspaceStore((s) => s.setLLMConfig);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setLLMConfig({
      provider: (data.get('provider') as LLMProvider) || llmConfig.provider,
      model: (data.get('model') as string) || llmConfig.model,
      apiKey: (data.get('apiKey') as string) || undefined,
      baseUrl: (data.get('baseUrl') as string) || undefined,
      temperature: Number(data.get('temperature')) || 0.7,
      maxTokens: Number(data.get('maxTokens')) || 4096,
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-6 inline-flex min-h-[44px] min-w-[44px] items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="mb-6 text-xl font-semibold text-text-primary">Settings</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <section
            className="rounded-lg border border-border bg-bg-secondary p-4"
            aria-labelledby="ai-settings-heading"
          >
            <h2 id="ai-settings-heading" className="mb-4 text-sm font-medium text-text-primary">
              AI / LLM
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="provider" className="block text-sm text-text-secondary">
                  Provider
                </label>
                <select
                  id="provider"
                  name="provider"
                  defaultValue={llmConfig.provider}
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
                  aria-label="LLM provider"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="apiKey" className="block text-sm text-text-secondary">
                  API Key (optional for Ollama)
                </label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  defaultValue={llmConfig.apiKey ?? ''}
                  placeholder="sk-..."
                  className="mt-1 min-h-[44px]"
                  autoComplete="off"
                  aria-label="API key"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm text-text-secondary">
                  Model
                </label>
                <Input
                  id="model"
                  name="model"
                  type="text"
                  defaultValue={llmConfig.model}
                  placeholder="gpt-4o-mini / claude-3-5-sonnet / etc."
                  className="mt-1 min-h-[44px]"
                  aria-label="Model name"
                />
              </div>
              <div>
                <label htmlFor="baseUrl" className="block text-sm text-text-secondary">
                  Base URL (optional, for custom/Ollama)
                </label>
                <Input
                  id="baseUrl"
                  name="baseUrl"
                  type="url"
                  defaultValue={llmConfig.baseUrl ?? ''}
                  placeholder="https://..."
                  className="mt-1 min-h-[44px]"
                  aria-label="Base URL"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="temperature" className="block text-sm text-text-secondary">
                    Temperature
                  </label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    defaultValue={llmConfig.temperature}
                    className="mt-1 min-h-[44px]"
                    aria-label="Temperature"
                  />
                </div>
                <div>
                  <label htmlFor="maxTokens" className="block text-sm text-text-secondary">
                    Max tokens
                  </label>
                  <Input
                    id="maxTokens"
                    name="maxTokens"
                    type="number"
                    min={1}
                    max={128000}
                    defaultValue={llmConfig.maxTokens}
                    className="mt-1 min-h-[44px]"
                    aria-label="Max tokens"
                  />
                </div>
              </div>
            </div>
          </section>
          <Button
            type="submit"
            className="min-h-[44px] w-full bg-accent-indigo hover:bg-accent-indigo/90"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
