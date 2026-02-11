import type { FileNode, FilesSlice, SliceCreator } from '../types';

function findFileByPath(files: FileNode[], filePath: string): FileNode | undefined {
  for (const file of files) {
    if (file.path === filePath) return file;
    if (file.children) {
      const found = findFileByPath(file.children, filePath);
      if (found) return found;
    }
  }
  return undefined;
}

function removeFileByPath(files: FileNode[], filePath: string): boolean {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    if (file.path === filePath) {
      files.splice(i, 1);
      return true;
    }
    if (file.children) {
      if (removeFileByPath(file.children, filePath)) return true;
    }
  }
  return false;
}

export const createFilesSlice: SliceCreator<FilesSlice> = (set) => ({
  files: [],
  openTabs: [],
  activeTabId: null,

  openFile: (file) =>
    set(
      (state) => {
        const existingTab = state.openTabs.find((tab) => tab.filePath === file.path);
        if (existingTab) {
          state.activeTabId = existingTab.id;
        } else {
          const newTab = {
            id: file.id,
            filePath: file.path,
            fileName: file.name,
            isDirty: false,
          };
          state.openTabs.push(newTab);
          state.activeTabId = newTab.id;
        }
      },
      undefined,
      'files/openFile',
    ),

  closeTab: (tabId) =>
    set(
      (state) => {
        const tabIndex = state.openTabs.findIndex((tab) => tab.id === tabId);
        if (tabIndex === -1) return;

        state.openTabs.splice(tabIndex, 1);

        if (state.activeTabId === tabId) {
          if (state.openTabs.length === 0) {
            state.activeTabId = null;
          } else {
            // Activate the tab that was next to the closed one
            const newIndex = Math.min(tabIndex, state.openTabs.length - 1);
            const nextTab = state.openTabs[newIndex];
            state.activeTabId = nextTab ? nextTab.id : null;
          }
        }
      },
      undefined,
      'files/closeTab',
    ),

  setActiveTab: (tabId) =>
    set(
      (state) => {
        const tab = state.openTabs.find((t) => t.id === tabId);
        if (tab) {
          state.activeTabId = tabId;
        }
      },
      undefined,
      'files/setActiveTab',
    ),

  updateFileContent: (filePath, content) =>
    set(
      (state) => {
        const file = findFileByPath(state.files, filePath);
        if (file) {
          file.content = content;
        }

        const tab = state.openTabs.find((t) => t.filePath === filePath);
        if (tab) {
          tab.isDirty = true;
        }
      },
      undefined,
      'files/updateFileContent',
    ),

  addFile: (file) =>
    set(
      (state) => {
        state.files.push(file);
      },
      undefined,
      'files/addFile',
    ),

  deleteFile: (filePath) =>
    set(
      (state) => {
        removeFileByPath(state.files, filePath);

        // Close any open tabs for the deleted file
        const tabIndex = state.openTabs.findIndex((tab) => tab.filePath === filePath);
        if (tabIndex !== -1) {
          const tabId = state.openTabs[tabIndex]?.id;
          state.openTabs.splice(tabIndex, 1);

          if (state.activeTabId === tabId) {
            if (state.openTabs.length === 0) {
              state.activeTabId = null;
            } else {
              const newIndex = Math.min(tabIndex, state.openTabs.length - 1);
              const nextTab = state.openTabs[newIndex];
              state.activeTabId = nextTab ? nextTab.id : null;
            }
          }
        }
      },
      undefined,
      'files/deleteFile',
    ),

  renameFile: (oldPath, newPath, newName) =>
    set(
      (state) => {
        const file = findFileByPath(state.files, oldPath);
        if (file) {
          file.path = newPath;
          file.name = newName;
        }

        const tab = state.openTabs.find((t) => t.filePath === oldPath);
        if (tab) {
          tab.filePath = newPath;
          tab.fileName = newName;
        }
      },
      undefined,
      'files/renameFile',
    ),
});
