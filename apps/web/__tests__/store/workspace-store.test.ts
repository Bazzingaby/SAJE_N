import { beforeEach, describe, expect, it } from 'vitest';
import { useWorkspaceStore } from '@/lib/store/workspace-store';

const initialState = useWorkspaceStore.getState();

describe('WorkspaceStore', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  it('should initialize with default state', () => {
    const state = useWorkspaceStore.getState();

    // Workspace slice defaults
    expect(state.projectId).toBeNull();
    expect(state.projectName).toBe('Untitled Project');
    expect(state.canvasMode).toBe('code');

    // Files slice defaults
    expect(state.files).toEqual([]);
    expect(state.openTabs).toEqual([]);
    expect(state.activeTabId).toBeNull();

    // Canvas slice defaults
    expect(state.nodes).toEqual([]);
    expect(state.edges).toEqual([]);

    // Agents slice defaults
    expect(state.agents).toEqual([]);
    expect(state.chatHistory).toEqual([]);
    expect(state.llmConfig.provider).toBe('anthropic');

    // UI slice defaults
    expect(state.ui.sidebarOpen).toBe(true);
    expect(state.ui.aiPanelOpen).toBe(true);
    expect(state.ui.bottomPanelOpen).toBe(true);
    expect(state.ui.activeBottomTab).toBe('terminal');
  });

  it('should have all workspace actions defined', () => {
    const state = useWorkspaceStore.getState();

    expect(typeof state.setProjectId).toBe('function');
    expect(typeof state.setProjectName).toBe('function');
    expect(typeof state.setCanvasMode).toBe('function');
  });

  it('should have all files actions defined', () => {
    const state = useWorkspaceStore.getState();

    expect(typeof state.openFile).toBe('function');
    expect(typeof state.closeTab).toBe('function');
    expect(typeof state.setActiveTab).toBe('function');
    expect(typeof state.updateFileContent).toBe('function');
    expect(typeof state.addFile).toBe('function');
    expect(typeof state.deleteFile).toBe('function');
    expect(typeof state.renameFile).toBe('function');
  });

  it('should have all canvas actions defined', () => {
    const state = useWorkspaceStore.getState();

    expect(typeof state.setNodes).toBe('function');
    expect(typeof state.setEdges).toBe('function');
    expect(typeof state.addNode).toBe('function');
    expect(typeof state.removeNode).toBe('function');
    expect(typeof state.addEdge).toBe('function');
    expect(typeof state.removeEdge).toBe('function');
  });

  it('should have all agents actions defined', () => {
    const state = useWorkspaceStore.getState();

    expect(typeof state.addAgent).toBe('function');
    expect(typeof state.removeAgent).toBe('function');
    expect(typeof state.updateAgentStatus).toBe('function');
    expect(typeof state.addChatMessage).toBe('function');
    expect(typeof state.clearChatHistory).toBe('function');
    expect(typeof state.setLLMConfig).toBe('function');
  });

  it('should have all UI actions defined', () => {
    const state = useWorkspaceStore.getState();

    expect(typeof state.toggleSidebar).toBe('function');
    expect(typeof state.setSidebarWidth).toBe('function');
    expect(typeof state.toggleAIPanel).toBe('function');
    expect(typeof state.setAIPanelWidth).toBe('function');
    expect(typeof state.toggleBottomPanel).toBe('function');
    expect(typeof state.setBottomPanelHeight).toBe('function');
    expect(typeof state.setActiveBottomTab).toBe('function');
  });

  it('should allow cross-slice interactions', () => {
    const { setCanvasMode, toggleSidebar, addFile } = useWorkspaceStore.getState();

    setCanvasMode('design');
    toggleSidebar();
    addFile({
      id: 'file-1',
      name: 'test.ts',
      path: '/test.ts',
      isDirectory: false,
    });

    const state = useWorkspaceStore.getState();
    expect(state.canvasMode).toBe('design');
    expect(state.ui.sidebarOpen).toBe(false);
    expect(state.files).toHaveLength(1);
  });

  it('persists canvasMode so it can be rehydrated (S2.5)', async () => {
    useWorkspaceStore.getState().setCanvasMode('flow');
    // Allow persist middleware to write
    await new Promise((r) => setTimeout(r, 50));
    const raw = localStorage.getItem('cosmos-workspace');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as { state?: { canvasMode?: string } };
    expect(parsed.state?.canvasMode).toBe('flow');
  });
});
