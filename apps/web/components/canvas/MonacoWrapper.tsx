'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { TouchOverlay } from './touch/TouchOverlay';

// Monaco cannot render inside jsdom / SSR — load it client-only.
const Editor = dynamic(() => import('@monaco-editor/react').then((m) => m.Editor), {
  ssr: false,
  loading: () => <MonacoLoading />,
});

function MonacoLoading() {
  return (
    <div
      data-testid="monaco-loading"
      className="flex h-full w-full items-center justify-center bg-bg-primary text-text-secondary"
    >
      Loading editor...
    </div>
  );
}

export type InlineAIAction = 'explain' | 'refactor' | 'test';

export interface MonacoWrapperProps {
  filePath: string;
  content: string;
  language: string;
  onChange?: (value: string) => void;
  /** When provided, shows Explain/Refactor/Test bar when text is selected (S3.3). */
  onInlineAIRequest?: (action: InlineAIAction, selectedText: string) => Promise<string>;
}

/** Default font size for the editor (touch-friendly). */
const DEFAULT_FONT_SIZE = 16;

/**
 * Wraps `@monaco-editor/react` with the Cosmos dark theme, touch-friendly
 * defaults, and a {@link TouchOverlay} for multi-touch gestures.
 */
export function MonacoWrapper({
  filePath,
  content,
  language,
  onChange,
  onInlineAIRequest,
}: MonacoWrapperProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [selectedText, setSelectedText] = useState('');
  const [inlineAIResult, setInlineAIResult] = useState('');
  const [inlineAILoading, setInlineAILoading] = useState(false);

  const handleMount: OnMount = useCallback((editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;

    editorInstance.onDidChangeCursorSelection(() => {
      const selection = editorInstance.getSelection();
      const model = editorInstance.getModel();
      if (!selection || !model) return;
      const text = model.getValueInRange(selection);
      setSelectedText(text.trim());
      if (!text.trim()) setInlineAIResult('');
    });

    // Register the Cosmos dark theme
    monacoInstance.editor.defineTheme('cosmos-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0a0a0f',
        'editor.foreground': '#f0f0f5',
        'editorLineNumber.foreground': '#9090a0',
        'editor.selectionBackground': '#6366f133',
        'editor.lineHighlightBackground': '#111118',
      },
    });

    monacoInstance.editor.setTheme('cosmos-dark');
  }, []);

  const handleChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined) {
        onChange?.(value);
      }
    },
    [onChange],
  );

  const handleFontSizeChange = useCallback((newSize: number) => {
    setFontSize(newSize);
    editorRef.current?.updateOptions({ fontSize: newSize });
  }, []);

  const handleUndo = useCallback(() => {
    editorRef.current?.trigger('touch-overlay', 'undo', null);
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.trigger('touch-overlay', 'redo', null);
  }, []);

  const handleInlineAI = useCallback(
    async (action: InlineAIAction) => {
      if (!onInlineAIRequest || !selectedText) return;
      setInlineAILoading(true);
      setInlineAIResult('');
      try {
        const result = await onInlineAIRequest(action, selectedText);
        setInlineAIResult(result);
      } catch {
        setInlineAIResult('Request failed.');
      } finally {
        setInlineAILoading(false);
      }
    },
    [onInlineAIRequest, selectedText],
  );

  const showInlineBar = onInlineAIRequest && selectedText.length > 0;

  return (
    <div data-testid="monaco-wrapper" className="relative h-full w-full">
      {showInlineBar && (
        <div className="absolute left-2 right-2 top-2 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-secondary/95 p-2 shadow-lg backdrop-blur">
          <span className="text-xs text-text-secondary">AI:</span>
          <button
            type="button"
            onClick={() => handleInlineAI('explain')}
            disabled={inlineAILoading}
            className="min-h-[44px] min-w-[44px] rounded-md bg-bg-tertiary px-3 py-2 text-xs font-medium text-text-primary hover:bg-accent-indigo/20 disabled:opacity-50"
          >
            Explain
          </button>
          <button
            type="button"
            onClick={() => handleInlineAI('refactor')}
            disabled={inlineAILoading}
            className="min-h-[44px] min-w-[44px] rounded-md bg-bg-tertiary px-3 py-2 text-xs font-medium text-text-primary hover:bg-accent-indigo/20 disabled:opacity-50"
          >
            Refactor
          </button>
          <button
            type="button"
            onClick={() => handleInlineAI('test')}
            disabled={inlineAILoading}
            className="min-h-[44px] min-w-[44px] rounded-md bg-bg-tertiary px-3 py-2 text-xs font-medium text-text-primary hover:bg-accent-indigo/20 disabled:opacity-50"
          >
            Add tests
          </button>
          {inlineAILoading && <span className="text-xs text-text-secondary">...</span>}
          {inlineAIResult && (
            <div className="w-full rounded border border-border bg-bg-primary p-2 text-xs text-text-primary whitespace-pre-wrap max-h-48 overflow-y-auto">
              {inlineAIResult}
            </div>
          )}
        </div>
      )}
      <Editor
        path={filePath}
        defaultValue={content}
        language={language}
        onMount={handleMount}
        onChange={handleChange}
        options={{
          fontSize,
          lineHeight: 24,
          scrollbar: {
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
          lineNumbers: 'on',
          lineNumbersMinChars: 4,
          minimap: { enabled: false },
          wordWrap: 'on',
          padding: { top: 16 },
          automaticLayout: true,
          tabSize: 2,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace: 'selection',
        }}
      />

      <TouchOverlay
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
    </div>
  );
}
