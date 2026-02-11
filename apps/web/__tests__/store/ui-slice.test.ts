import { beforeEach, describe, expect, it } from 'vitest';
import { useWorkspaceStore } from '@/lib/store/workspace-store';

const initialState = useWorkspaceStore.getState();

describe('UISlice', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  describe('default values', () => {
    it('should have correct default UI state', () => {
      const { ui } = useWorkspaceStore.getState();

      expect(ui.sidebarOpen).toBe(true);
      expect(ui.sidebarWidth).toBe(56);
      expect(ui.aiPanelOpen).toBe(true);
      expect(ui.aiPanelWidth).toBe(280);
      expect(ui.bottomPanelOpen).toBe(true);
      expect(ui.bottomPanelHeight).toBe(180);
      expect(ui.activeBottomTab).toBe('terminal');
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar open to closed', () => {
      useWorkspaceStore.getState().toggleSidebar();

      expect(useWorkspaceStore.getState().ui.sidebarOpen).toBe(false);
    });

    it('should toggle sidebar closed to open', () => {
      useWorkspaceStore.getState().toggleSidebar();
      useWorkspaceStore.getState().toggleSidebar();

      expect(useWorkspaceStore.getState().ui.sidebarOpen).toBe(true);
    });
  });

  describe('setSidebarWidth', () => {
    it('should set sidebar width', () => {
      useWorkspaceStore.getState().setSidebarWidth(240);

      expect(useWorkspaceStore.getState().ui.sidebarWidth).toBe(240);
    });

    it('should allow zero width', () => {
      useWorkspaceStore.getState().setSidebarWidth(0);

      expect(useWorkspaceStore.getState().ui.sidebarWidth).toBe(0);
    });
  });

  describe('toggleAIPanel', () => {
    it('should toggle AI panel open to closed', () => {
      useWorkspaceStore.getState().toggleAIPanel();

      expect(useWorkspaceStore.getState().ui.aiPanelOpen).toBe(false);
    });

    it('should toggle AI panel closed to open', () => {
      useWorkspaceStore.getState().toggleAIPanel();
      useWorkspaceStore.getState().toggleAIPanel();

      expect(useWorkspaceStore.getState().ui.aiPanelOpen).toBe(true);
    });
  });

  describe('setAIPanelWidth', () => {
    it('should set AI panel width', () => {
      useWorkspaceStore.getState().setAIPanelWidth(400);

      expect(useWorkspaceStore.getState().ui.aiPanelWidth).toBe(400);
    });
  });

  describe('toggleBottomPanel', () => {
    it('should toggle bottom panel open to closed', () => {
      useWorkspaceStore.getState().toggleBottomPanel();

      expect(useWorkspaceStore.getState().ui.bottomPanelOpen).toBe(false);
    });

    it('should toggle bottom panel closed to open', () => {
      useWorkspaceStore.getState().toggleBottomPanel();
      useWorkspaceStore.getState().toggleBottomPanel();

      expect(useWorkspaceStore.getState().ui.bottomPanelOpen).toBe(true);
    });
  });

  describe('setBottomPanelHeight', () => {
    it('should set bottom panel height', () => {
      useWorkspaceStore.getState().setBottomPanelHeight(300);

      expect(useWorkspaceStore.getState().ui.bottomPanelHeight).toBe(300);
    });
  });

  describe('setActiveBottomTab', () => {
    it('should set active bottom tab to output', () => {
      useWorkspaceStore.getState().setActiveBottomTab('output');

      expect(useWorkspaceStore.getState().ui.activeBottomTab).toBe('output');
    });

    it('should set active bottom tab to problems', () => {
      useWorkspaceStore.getState().setActiveBottomTab('problems');

      expect(useWorkspaceStore.getState().ui.activeBottomTab).toBe('problems');
    });

    it('should set active bottom tab back to terminal', () => {
      useWorkspaceStore.getState().setActiveBottomTab('output');
      useWorkspaceStore.getState().setActiveBottomTab('terminal');

      expect(useWorkspaceStore.getState().ui.activeBottomTab).toBe('terminal');
    });
  });

  describe('multiple UI operations', () => {
    it('should handle multiple UI changes independently', () => {
      const store = useWorkspaceStore.getState();
      store.toggleSidebar();
      store.setAIPanelWidth(350);
      store.setActiveBottomTab('problems');
      store.setBottomPanelHeight(250);

      // Re-fetch state after mutations
      const state = useWorkspaceStore.getState();
      expect(state.ui.sidebarOpen).toBe(false);
      expect(state.ui.aiPanelWidth).toBe(350);
      expect(state.ui.activeBottomTab).toBe('problems');
      expect(state.ui.bottomPanelHeight).toBe(250);
      // Unchanged values should remain
      expect(state.ui.aiPanelOpen).toBe(true);
      expect(state.ui.bottomPanelOpen).toBe(true);
    });
  });
});
