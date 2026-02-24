'use client';

import { use, useEffect } from 'react';
import { hydrateDemoWorkspace } from '@/lib/store/demo-data';

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  useEffect(() => {
    if (id === 'demo') {
      hydrateDemoWorkspace();
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center h-full">
      <h1 className="text-2xl font-bold text-text-primary">
        Welcome to Cosmos {id === 'demo' ? 'Demo' : ''}
      </h1>
      <p className="max-w-md text-sm text-text-secondary">
        {id === 'demo'
          ? 'This is a pre-populated workspace showcasing the 5 canvas modalities. Try switching between Code, Design, Flow, Data, and Board canvases using the toolbar below!'
          : 'Your touch-first, AI-native development environment. Open a file from the sidebar or start a conversation with the AI assistant to get started.'}
      </p>
    </div>
  );
}
