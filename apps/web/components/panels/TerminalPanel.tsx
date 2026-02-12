'use client';

import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const TERMINAL_THEME = {
  background: '#0a0a0f',
  foreground: '#f0f0f5',
  cursor: '#6366f1',
  selectionBackground: 'rgba(99, 102, 241, 0.3)',
  black: '#1a1a2e',
  red: '#f87171',
  green: '#4ade80',
  yellow: '#facc15',
  blue: '#60a5fa',
  magenta: '#c084fc',
  cyan: '#22d3ee',
  white: '#f0f0f5',
  brightBlack: '#4a4a6a',
  brightRed: '#fca5a5',
  brightGreen: '#86efac',
  brightYellow: '#fde68a',
  brightBlue: '#93c5fd',
  brightMagenta: '#d8b4fe',
  brightCyan: '#67e8f9',
  brightWhite: '#ffffff',
};

const WELCOME_MESSAGE = 'Welcome to Cosmos Terminal\r\n$ ';

/**
 * TerminalPanel — xterm.js embedded terminal for the Cosmos workspace.
 *
 * Mounts a full xterm.js Terminal instance into a container div, loads the
 * FitAddon so the terminal resizes with its parent panel, and wires up a
 * basic local-echo input handler (Enter → new prompt, Backspace → erase).
 *
 * A ResizeObserver keeps the terminal sized correctly whenever the bottom
 * panel is resized. The instance is fully disposed on unmount.
 *
 * @remarks Inline styles are intentional here — xterm.js requires the
 * background colour to be set directly on the host element so its canvas
 * layer blends seamlessly (Tailwind classes are applied after the canvas
 * renders and cannot override the canvas background).
 */
export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;

    const terminal = new Terminal({
      theme: TERMINAL_THEME,
      fontSize: 14,
      lineHeight: 1.4,
      scrollback: 1000,
      cursorBlink: true,
      fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Menlo, Monaco, monospace",
      allowProposedApi: true,
    });
    terminalRef.current = terminal;

    terminal.loadAddon(fitAddon);
    terminal.open(container);

    // Fit after open so the terminal sizes to the container
    try {
      fitAddon.fit();
    } catch {
      // Container may not have dimensions yet
    }

    terminal.write(WELCOME_MESSAGE);

    // Basic local echo handler
    terminal.onData((data: string) => {
      for (const char of data) {
        if (char === '\r') {
          // Enter key
          terminal.write('\r\n$ ');
        } else if (char === '\u007f') {
          // Backspace
          terminal.write('\b \b');
        } else {
          terminal.write(char);
        }
      }
    });

    // ResizeObserver to auto-fit terminal when container resizes
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // Terminal may not be ready
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="terminal-panel"
      className="h-full w-full"
      style={{ backgroundColor: '#0a0a0f' }}
    />
  );
}
