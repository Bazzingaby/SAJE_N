import type { SliceCreator, WorkspaceSlice } from '../types';

export const createWorkspaceSlice: SliceCreator<WorkspaceSlice> = (set) => ({
  projectId: null,
  projectName: 'Untitled Project',
  canvasMode: 'code',

  setProjectId: (id) =>
    set(
      (state) => {
        state.projectId = id;
      },
      undefined,
      'workspace/setProjectId',
    ),

  setProjectName: (name) =>
    set(
      (state) => {
        state.projectName = name;
      },
      undefined,
      'workspace/setProjectName',
    ),

  setCanvasMode: (mode) =>
    set(
      (state) => {
        state.canvasMode = mode;
      },
      undefined,
      'workspace/setCanvasMode',
    ),
});
