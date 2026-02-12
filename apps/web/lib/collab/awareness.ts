import type { WebsocketProvider } from 'y-websocket';

// ---------------------------------------------------------------------------
// Awareness state shape
// ---------------------------------------------------------------------------

export interface CursorPosition {
  x: number;
  y: number;
}

export interface AwarenessState {
  userId: string;
  name: string;
  color: string;
  cursor: CursorPosition | null;
}

// ---------------------------------------------------------------------------
// Awareness helpers
// ---------------------------------------------------------------------------

/**
 * Set the local user's awareness state on the provider.
 * Other connected clients will receive this via the awareness protocol.
 */
export function setLocalAwareness(provider: WebsocketProvider, state: AwarenessState): void {
  provider.awareness.setLocalStateField('user', state);
}

/**
 * Subscribe to remote awareness changes.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToAwareness(
  provider: WebsocketProvider,
  callback: (states: Map<number, { user?: AwarenessState }>) => void,
): () => void {
  const handler = () => {
    callback(provider.awareness.getStates() as Map<number, { user?: AwarenessState }>);
  };

  provider.awareness.on('change', handler);
  // Fire immediately with current state
  handler();

  return () => {
    provider.awareness.off('change', handler);
  };
}

/**
 * Get all currently connected remote cursors (excluding local client).
 */
export function getRemoteCursors(provider: WebsocketProvider): Map<number, AwarenessState> {
  const states = provider.awareness.getStates() as Map<number, { user?: AwarenessState }>;
  const localClientId = provider.awareness.clientID;
  const cursors = new Map<number, AwarenessState>();

  for (const [clientId, state] of states) {
    if (clientId !== localClientId && state.user) {
      cursors.set(clientId, state.user);
    }
  }

  return cursors;
}
