"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { OnMount, OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { TouchOverlay } from "./touch/TouchOverlay";

// Monaco cannot render inside jsdom / SSR — load it client-only.
const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.Editor), {
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

export interface MonacoWrapperProps {
  filePath: string;
  content: string;
  language: string;
  onChange?: (value: string) => void;
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
}: MonacoWrapperProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const handleMount: OnMount = useCallback((editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;

    // Register the Cosmos dark theme
    monacoInstance.editor.defineTheme("cosmos-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0a0a0f",
        "editor.foreground": "#f0f0f5",
        "editorLineNumber.foreground": "#9090a0",
        "editor.selectionBackground": "#6366f133",
        "editor.lineHighlightBackground": "#111118",
      },
    });

    monacoInstance.editor.setTheme("cosmos-dark");
  }, []);

  const handleChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined) {
        onChange?.(value);
      }
    },
    [onChange],
  );

  const handleFontSizeChange = useCallback(
    (newSize: number) => {
      setFontSize(newSize);
      editorRef.current?.updateOptions({ fontSize: newSize });
    },
    [],
  );

  const handleUndo = useCallback(() => {
    editorRef.current?.trigger("touch-overlay", "undo", null);
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.trigger("touch-overlay", "redo", null);
  }, []);

  return (
    <div data-testid="monaco-wrapper" className="relative h-full w-full">
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
          lineNumbers: "on",
          lineNumbersMinChars: 4,
          minimap: { enabled: false },
          wordWrap: "on",
          padding: { top: 16 },
          automaticLayout: true,
          tabSize: 2,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          renderWhitespace: "selection",
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
