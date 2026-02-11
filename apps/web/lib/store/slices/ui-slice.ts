import type { SliceCreator, UISlice } from '../types';

const defaultUIState = {
  sidebarOpen: true,
  sidebarWidth: 56,
  aiPanelOpen: true,
  aiPanelWidth: 280,
  bottomPanelOpen: true,
  bottomPanelHeight: 180,
  activeBottomTab: 'terminal' as const,
};

export const createUISlice: SliceCreator<UISlice> = (set) => ({
  ui: { ...defaultUIState },

  toggleSidebar: () =>
    set(
      (state) => {
        state.ui.sidebarOpen = !state.ui.sidebarOpen;
      },
      undefined,
      'ui/toggleSidebar',
    ),

  setSidebarWidth: (width) =>
    set(
      (state) => {
        state.ui.sidebarWidth = width;
      },
      undefined,
      'ui/setSidebarWidth',
    ),

  toggleAIPanel: () =>
    set(
      (state) => {
        state.ui.aiPanelOpen = !state.ui.aiPanelOpen;
      },
      undefined,
      'ui/toggleAIPanel',
    ),

  setAIPanelWidth: (width) =>
    set(
      (state) => {
        state.ui.aiPanelWidth = width;
      },
      undefined,
      'ui/setAIPanelWidth',
    ),

  toggleBottomPanel: () =>
    set(
      (state) => {
        state.ui.bottomPanelOpen = !state.ui.bottomPanelOpen;
      },
      undefined,
      'ui/toggleBottomPanel',
    ),

  setBottomPanelHeight: (height) =>
    set(
      (state) => {
        state.ui.bottomPanelHeight = height;
      },
      undefined,
      'ui/setBottomPanelHeight',
    ),

  setActiveBottomTab: (tab) =>
    set(
      (state) => {
        state.ui.activeBottomTab = tab;
      },
      undefined,
      'ui/setActiveBottomTab',
    ),
});
