import { useWorkspaceStore } from './workspace-store';
import { CanvasMode } from './types';

export function hydrateDemoWorkspace() {
    const state = useWorkspaceStore.getState();

    // 1. Files
    // Avoid re-hydrating if demo files already exist to prevent duplicates
    const hasDemoFiles = state.files.some(f => f.name === 'HeroComponent.tsx');
    if (hasDemoFiles) return;

    state.setProjectName('Cosmos Launch Demo');
    state.setProjectId('demo');

    // Add sample code
    const codeContent = `// HeroComponent.tsx
import React from 'react';

export function HeroComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900 text-white rounded-xl p-8">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Touch. Code. Deploy.
      </h1>
      <p className="text-slate-400 max-w-md text-center mb-8">
        This is a generated React component from the Design Canvas. Switch to Design mode to edit visually.
      </p>
      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
        Get Started
      </button>
    </div>
  );
}
`;

    state.addFile({
        id: 'demo-file-1',
        name: 'HeroComponent.tsx',
        path: '/src/components/HeroComponent.tsx',
        isDirectory: false,
        content: codeContent,
        language: 'typescript'
    });

    state.addFile({
        id: 'demo-file-2',
        name: 'data-pipeline.py',
        path: '/src/jobs/data-pipeline.py',
        isDirectory: false,
        content: `def transform_data(df):\n    """Sample PySpark transformation"""\n    return df.filter(df.status == 'active')`,
        language: 'python'
    });

    // Open the React component
    const reactFile = useWorkspaceStore.getState().files.find(f => f.id === 'demo-file-1');
    if (reactFile) {
        state.openFile(reactFile);
    }

    // 2. Flow Nodes (ReactFlow)
    state.setNodes([
        {
            id: 'source-1',
            type: 'sourceNode',
            position: { x: 100, y: 100 },
            data: { label: 'PostgreSQL - UsersDB' },
        },
        {
            id: 'transform-1',
            type: 'transformNode',
            position: { x: 350, y: 100 },
            data: { label: 'Clean & Aggregate' },
        },
        {
            id: 'sink-1',
            type: 'sinkNode',
            position: { x: 600, y: 100 },
            data: { label: 'Data Warehouse (Snowflake)' },
        },
    ]);

    state.setEdges([
        { id: 'e1-2', source: 'source-1', target: 'transform-1' },
        { id: 'e2-3', source: 'transform-1', target: 'sink-1' },
    ]);

    // 3. We initially land on the "Code" canvas, or maybe "Design"
    state.setCanvasMode('code');
}
