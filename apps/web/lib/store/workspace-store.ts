import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { createWorkspaceSlice } from './slices/workspace-slice';
import { createFilesSlice } from './slices/files-slice';
import { createCanvasSlice } from './slices/canvas-slice';
import { createAgentsSlice } from './slices/agents-slice';
import { createUISlice } from './slices/ui-slice';
import type { WorkspaceStore } from './types';

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    immer(
      persist(
        (...a) => ({
          ...createWorkspaceSlice(...a),
          ...createFilesSlice(...a),
          ...createCanvasSlice(...a),
          ...createAgentsSlice(...a),
          ...createUISlice(...a),
        }),
        {
          name: 'cosmos-workspace',
          partialize: (state) => ({
            projectId: state.projectId,
            canvasMode: state.canvasMode,
            nodes: state.nodes,
            edges: state.edges,
            ui: state.ui,
            llmConfig: state.llmConfig,
          }),
        },
      ),
    ),
    { name: 'CosmosWorkspace' },
  ),
);
