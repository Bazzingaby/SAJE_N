import * as Y from 'yjs';
import type { WebsocketProvider as WebsocketProviderType } from 'y-websocket';

// ---------------------------------------------------------------------------
// Lazy import so SSR and test environments are not broken by WebSocket deps
// ---------------------------------------------------------------------------

export interface CollabConfig {
  /** Unique room/document identifier */
  roomId: string;
  /** WebSocket server URL — defaults to ws://localhost:1234 */
  serverUrl?: string;
  /** If false the provider is created but never connects (offline/test mode) */
  enabled?: boolean;
}

export interface CollabProvider {
  doc: Y.Doc;
  provider: WebsocketProviderType | null;
  destroy: () => void;
}

/**
 * Creates a new Yjs document and optionally connects a WebsocketProvider.
 * Degrades gracefully when `enabled` is false or `window` is unavailable (SSR).
 */
export async function createCollabProvider(config: CollabConfig): Promise<CollabProvider> {
  const { roomId, serverUrl = 'ws://localhost:1234', enabled = true } = config;

  const doc = new Y.Doc();

  let provider: WebsocketProviderType | null = null;

  if (enabled && typeof window !== 'undefined') {
    const { WebsocketProvider } = await import('y-websocket');
    provider = new WebsocketProvider(serverUrl, roomId, doc, {
      connect: false, // connect lazily so callers can attach handlers first
    });
    provider.connect();
  }

  const destroy = () => {
    provider?.disconnect();
    doc.destroy();
  };

  return { doc, provider, destroy };
}

// ---------------------------------------------------------------------------
// Singleton convenience — one provider per browser session
// ---------------------------------------------------------------------------

let _singletonPromise: Promise<CollabProvider> | null = null;

export function getCollabProvider(config: CollabConfig): Promise<CollabProvider> {
  if (!_singletonPromise) {
    _singletonPromise = createCollabProvider(config);
  }
  return _singletonPromise;
}

/** Reset the singleton — useful for tests and workspace switches */
export function resetCollabProvider(): void {
  _singletonPromise = null;
}
