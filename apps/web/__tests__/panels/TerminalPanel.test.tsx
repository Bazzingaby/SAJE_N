import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock @xterm/xterm and @xterm/addon-fit — xterm requires real DOM APIs
// (canvas, etc.) that are not available in jsdom.
// ---------------------------------------------------------------------------

const mockOpen = vi.fn();
const mockWrite = vi.fn();
const mockLoadAddon = vi.fn();
const mockDispose = vi.fn();
const mockOnData = vi.fn();

vi.mock('@xterm/xterm', () => {
  const TerminalMock = vi.fn().mockImplementation(() => ({
    open: mockOpen,
    write: mockWrite,
    loadAddon: mockLoadAddon,
    dispose: mockDispose,
    onData: mockOnData,
  }));
  return { Terminal: TerminalMock };
});

const mockFit = vi.fn();

vi.mock('@xterm/addon-fit', () => {
  const FitAddonMock = vi.fn().mockImplementation(() => ({
    fit: mockFit,
  }));
  return { FitAddon: FitAddonMock };
});

// Mock the CSS import — vitest/jsdom cannot handle CSS files
vi.mock('@xterm/xterm/css/xterm.css', () => ({}));

// Import after mocks
import { TerminalPanel } from '@/components/panels/TerminalPanel';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

// Mock ResizeObserver which is not available in jsdom
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: vi.fn(),
      disconnect: mockDisconnect,
    })),
  );
});

describe('TerminalPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the terminal container element', () => {
    render(<TerminalPanel />);
    const container = screen.getByTestId('terminal-panel');
    expect(container).toBeInTheDocument();
  });

  it('creates a Terminal instance on mount', () => {
    render(<TerminalPanel />);
    expect(Terminal).toHaveBeenCalledOnce();
    expect(Terminal).toHaveBeenCalledWith(
      expect.objectContaining({
        fontSize: 14,
        lineHeight: 1.4,
        scrollback: 1000,
        cursorBlink: true,
      }),
    );
  });

  it('calls terminal.open() with container element', () => {
    render(<TerminalPanel />);
    const container = screen.getByTestId('terminal-panel');
    expect(mockOpen).toHaveBeenCalledOnce();
    expect(mockOpen).toHaveBeenCalledWith(container);
  });

  it('loads the FitAddon', () => {
    render(<TerminalPanel />);
    expect(FitAddon).toHaveBeenCalledOnce();
    expect(mockLoadAddon).toHaveBeenCalledOnce();
  });

  it('calls fitAddon.fit() after opening', () => {
    render(<TerminalPanel />);
    expect(mockFit).toHaveBeenCalled();
  });

  it('writes the welcome message', () => {
    render(<TerminalPanel />);
    expect(mockWrite).toHaveBeenCalledWith('Welcome to Cosmos Terminal\r\n$ ');
  });

  it('registers an onData handler for local echo', () => {
    render(<TerminalPanel />);
    expect(mockOnData).toHaveBeenCalledOnce();
    expect(typeof mockOnData.mock.calls[0][0]).toBe('function');
  });

  it('sets up a ResizeObserver on the container', () => {
    render(<TerminalPanel />);
    const container = screen.getByTestId('terminal-panel');
    expect(mockObserve).toHaveBeenCalledWith(container);
  });

  it('disposes terminal on unmount', () => {
    const { unmount } = render(<TerminalPanel />);
    expect(mockDispose).not.toHaveBeenCalled();
    unmount();
    expect(mockDispose).toHaveBeenCalledOnce();
  });

  it('disconnects ResizeObserver on unmount', () => {
    const { unmount } = render(<TerminalPanel />);
    expect(mockDisconnect).not.toHaveBeenCalled();
    unmount();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });

  it('applies Cosmos dark theme colors', () => {
    render(<TerminalPanel />);
    expect(Terminal).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: expect.objectContaining({
          background: '#0a0a0f',
          foreground: '#f0f0f5',
          cursor: '#6366f1',
        }),
      }),
    );
  });
});
