import { describe, expect, it, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock y-websocket — uses native WebSocket which is not available in jsdom
// ---------------------------------------------------------------------------

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockAwareness = {
  clientID: 1,
  setLocalStateField: vi.fn(),
  getStates: vi.fn().mockReturnValue(new Map()),
  on: vi.fn(),
  off: vi.fn(),
};

const MockWebsocketProvider = vi
  .fn()
  .mockImplementation((_serverUrl: string, _roomId: string, _doc: unknown, _opts?: unknown) => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    awareness: mockAwareness,
  }));

vi.mock('y-websocket', () => ({
  WebsocketProvider: MockWebsocketProvider,
}));

// Import after mocks are in place
import {
  createCollabProvider,
  getCollabProvider,
  resetCollabProvider,
} from '@/lib/collab/yjs-provider';
import { setLocalAwareness, subscribeToAwareness, getRemoteCursors } from '@/lib/collab/awareness';
import * as Y from 'yjs';

describe('createCollabProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCollabProvider();
    // Ensure window is defined so provider tries to connect
    vi.stubGlobal('window', globalThis.window ?? {});
  });

  it('returns a Y.Doc', async () => {
    const { doc } = await createCollabProvider({ roomId: 'test-room' });
    expect(doc).toBeInstanceOf(Y.Doc);
  });

  it('creates a WebsocketProvider when enabled', async () => {
    const { provider } = await createCollabProvider({
      roomId: 'test-room',
      enabled: true,
    });
    expect(MockWebsocketProvider).toHaveBeenCalledOnce();
    expect(provider).not.toBeNull();
  });

  it('does NOT create WebsocketProvider when enabled is false', async () => {
    const { provider } = await createCollabProvider({
      roomId: 'test-room',
      enabled: false,
    });
    expect(MockWebsocketProvider).not.toHaveBeenCalled();
    expect(provider).toBeNull();
  });

  it('passes the correct serverUrl and roomId to WebsocketProvider', async () => {
    await createCollabProvider({
      roomId: 'my-workspace',
      serverUrl: 'ws://custom-host:4321',
    });
    expect(MockWebsocketProvider).toHaveBeenCalledWith(
      'ws://custom-host:4321',
      'my-workspace',
      expect.any(Y.Doc),
      expect.objectContaining({ connect: false }),
    );
  });

  it('uses default serverUrl ws://localhost:1234 when not specified', async () => {
    await createCollabProvider({ roomId: 'room-a' });
    expect(MockWebsocketProvider).toHaveBeenCalledWith(
      'ws://localhost:1234',
      'room-a',
      expect.any(Y.Doc),
      expect.anything(),
    );
  });

  it('calls provider.connect() after creation', async () => {
    await createCollabProvider({ roomId: 'test-room' });
    expect(mockConnect).toHaveBeenCalledOnce();
  });

  it('destroy() disconnects provider and destroys doc', async () => {
    const { destroy } = await createCollabProvider({ roomId: 'test-room' });
    destroy();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });
});

describe('getCollabProvider (singleton)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCollabProvider();
  });

  it('returns the same instance on repeated calls', async () => {
    const a = await getCollabProvider({ roomId: 'room-x' });
    const b = await getCollabProvider({ roomId: 'room-x' });
    expect(a).toBe(b);
  });

  it('resetCollabProvider clears the singleton', async () => {
    const a = await getCollabProvider({ roomId: 'room-x' });
    resetCollabProvider();
    const b = await getCollabProvider({ roomId: 'room-x' });
    // After reset, a fresh provider is created
    expect(a).not.toBe(b);
  });
});

describe('awareness helpers', () => {
  const mockProvider = {
    awareness: mockAwareness,
  } as unknown as import('y-websocket').WebsocketProvider;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('setLocalAwareness sets user field on awareness', () => {
    setLocalAwareness(mockProvider, {
      userId: 'u1',
      name: 'Alice',
      color: '#ff0000',
      cursor: { x: 10, y: 20 },
    });
    expect(mockAwareness.setLocalStateField).toHaveBeenCalledWith('user', {
      userId: 'u1',
      name: 'Alice',
      color: '#ff0000',
      cursor: { x: 10, y: 20 },
    });
  });

  it('subscribeToAwareness registers a change handler', () => {
    const callback = vi.fn();
    subscribeToAwareness(mockProvider, callback);
    expect(mockAwareness.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('subscribeToAwareness fires callback immediately with current state', () => {
    const mockStates = new Map([
      [2, { user: { userId: 'u2', name: 'Bob', color: '#0000ff', cursor: null } }],
    ]);
    mockAwareness.getStates.mockReturnValueOnce(mockStates);
    const callback = vi.fn();
    subscribeToAwareness(mockProvider, callback);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(mockStates);
  });

  it('subscribeToAwareness returns unsubscribe function', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToAwareness(mockProvider, callback);
    unsubscribe();
    expect(mockAwareness.off).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('getRemoteCursors excludes local client', () => {
    mockAwareness.clientID = 1;
    mockAwareness.getStates.mockReturnValueOnce(
      new Map([
        [1, { user: { userId: 'local', name: 'Me', color: '#fff', cursor: null } }],
        [2, { user: { userId: 'remote', name: 'Bob', color: '#0f0', cursor: { x: 5, y: 5 } } }],
      ]),
    );
    const cursors = getRemoteCursors(mockProvider);
    expect(cursors.has(1)).toBe(false);
    expect(cursors.has(2)).toBe(true);
    expect(cursors.get(2)?.name).toBe('Bob');
  });
});
