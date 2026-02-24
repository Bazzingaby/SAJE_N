'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Doc } from 'yjs';
import type { CollabProvider } from './yjs-provider';
import { createCollabProvider, resetCollabProvider } from './yjs-provider';

const COLLAB_SERVER_URL = process.env.NEXT_PUBLIC_COLLAB_SERVER_URL || 'ws://localhost:1234';

interface CollabContextValue {
  doc: Doc | null;
  provider: CollabProvider['provider'];
  isConnected: boolean;
  roomId: string | null;
}

const CollabContext = createContext<CollabContextValue>({
  doc: null,
  provider: null,
  isConnected: false,
  roomId: null,
});

export function useCollab() {
  return useContext(CollabContext);
}

interface CollabProviderWrapperProps {
  roomId: string | null;
  children: React.ReactNode;
  enabled?: boolean;
}

export function CollabProviderWrapper({
  roomId,
  children,
  enabled = true,
}: CollabProviderWrapperProps) {
  const [state, setState] = useState<CollabContextValue>({
    doc: null,
    provider: null,
    isConnected: false,
    roomId: null,
  });

  useEffect(() => {
    if (!roomId || !enabled || typeof window === 'undefined') {
      setState({ doc: null, provider: null, isConnected: false, roomId: null });
      return;
    }

    let mounted = true;
    let collab: CollabProvider | null = null;

    createCollabProvider({
      roomId,
      serverUrl: COLLAB_SERVER_URL,
      enabled: true,
    }).then((c) => {
      collab = c;
      if (!mounted) {
        c.destroy();
        return;
      }
      const synced = !!(c.provider as { synced?: boolean } | null)?.synced;
      setState({
        doc: c.doc,
        provider: c.provider,
        isConnected: synced,
        roomId,
      });

      const onSynced = (syncedState: boolean) => {
        if (mounted) setState((prev) => ({ ...prev, isConnected: syncedState }));
      };
      (c.provider as { on?: (e: string, f: (v: boolean) => void) => void })?.on?.(
        'synced',
        onSynced,
      );

      return () => {
        (c.provider as { off?: (e: string, f: (v: boolean) => void) => void })?.off?.(
          'synced',
          onSynced,
        );
      };
    });

    return () => {
      mounted = false;
      collab?.destroy();
      resetCollabProvider();
      setState({ doc: null, provider: null, isConnected: false, roomId: null });
    };
  }, [roomId, enabled]);

  return <CollabContext.Provider value={state}>{children}</CollabContext.Provider>;
}
