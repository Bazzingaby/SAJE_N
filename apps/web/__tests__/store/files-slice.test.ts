import { beforeEach, describe, expect, it } from 'vitest';
import { useWorkspaceStore } from '@/lib/store/workspace-store';
import type { FileNode } from '@/lib/store/types';

const initialState = useWorkspaceStore.getState();

const mockFile: FileNode = {
  id: 'file-1',
  name: 'index.ts',
  path: '/src/index.ts',
  isDirectory: false,
  content: 'console.log("hello")',
  language: 'typescript',
};

const mockFile2: FileNode = {
  id: 'file-2',
  name: 'utils.ts',
  path: '/src/utils.ts',
  isDirectory: false,
  content: 'export const foo = 1;',
  language: 'typescript',
};

const mockFile3: FileNode = {
  id: 'file-3',
  name: 'app.tsx',
  path: '/src/app.tsx',
  isDirectory: false,
  content: '<App />',
  language: 'typescriptreact',
};

describe('FilesSlice', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  describe('addFile', () => {
    it('should add a file to the files array', () => {
      useWorkspaceStore.getState().addFile(mockFile);

      const state = useWorkspaceStore.getState();
      expect(state.files).toHaveLength(1);
      expect(state.files[0]).toEqual(mockFile);
    });

    it('should add multiple files', () => {
      const { addFile } = useWorkspaceStore.getState();
      addFile(mockFile);
      addFile(mockFile2);

      const state = useWorkspaceStore.getState();
      expect(state.files).toHaveLength(2);
    });
  });

  describe('openFile', () => {
    it('should open a file and create a new tab', () => {
      useWorkspaceStore.getState().openFile(mockFile);

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(1);
      expect(state.openTabs[0]?.filePath).toBe(mockFile.path);
      expect(state.openTabs[0]?.fileName).toBe(mockFile.name);
      expect(state.openTabs[0]?.isDirty).toBe(false);
      expect(state.activeTabId).toBe(mockFile.id);
    });

    it('should not create a duplicate tab when opening the same file', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile);

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(1);
    });

    it('should activate existing tab when opening an already open file', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile2);
      openFile(mockFile);

      const state = useWorkspaceStore.getState();
      expect(state.activeTabId).toBe(mockFile.id);
    });

    it('should set the newly opened file as active tab', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile2);

      const state = useWorkspaceStore.getState();
      expect(state.activeTabId).toBe(mockFile2.id);
    });
  });

  describe('closeTab', () => {
    it('should close a tab', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile2);

      useWorkspaceStore.getState().closeTab(mockFile.id);

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(1);
      expect(state.openTabs[0]?.filePath).toBe(mockFile2.path);
    });

    it('should set activeTabId to null when closing the last tab', () => {
      useWorkspaceStore.getState().openFile(mockFile);
      useWorkspaceStore.getState().closeTab(mockFile.id);

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(0);
      expect(state.activeTabId).toBeNull();
    });

    it('should activate an adjacent tab when closing the active tab', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile2);
      openFile(mockFile3);

      // Active is file-3, close it
      useWorkspaceStore.getState().closeTab(mockFile3.id);

      const state = useWorkspaceStore.getState();
      expect(state.activeTabId).toBe(mockFile2.id);
    });

    it('should not change active tab when closing a non-active tab', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile2);

      // Active is file-2, close file-1
      useWorkspaceStore.getState().closeTab(mockFile.id);

      const state = useWorkspaceStore.getState();
      expect(state.activeTabId).toBe(mockFile2.id);
    });

    it('should do nothing when closing a non-existent tab', () => {
      useWorkspaceStore.getState().openFile(mockFile);
      useWorkspaceStore.getState().closeTab('non-existent');

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(1);
    });
  });

  describe('setActiveTab', () => {
    it('should set the active tab', () => {
      const { openFile } = useWorkspaceStore.getState();
      openFile(mockFile);
      openFile(mockFile2);

      useWorkspaceStore.getState().setActiveTab(mockFile.id);

      expect(useWorkspaceStore.getState().activeTabId).toBe(mockFile.id);
    });

    it('should not set active tab to a non-existent tab', () => {
      useWorkspaceStore.getState().openFile(mockFile);
      useWorkspaceStore.getState().setActiveTab('non-existent');

      expect(useWorkspaceStore.getState().activeTabId).toBe(mockFile.id);
    });
  });

  describe('updateFileContent', () => {
    it('should update file content and mark tab as dirty', () => {
      const { addFile, openFile } = useWorkspaceStore.getState();
      addFile(mockFile);
      openFile(mockFile);

      useWorkspaceStore.getState().updateFileContent(mockFile.path, 'new content');

      const state = useWorkspaceStore.getState();
      expect(state.files[0]?.content).toBe('new content');
      expect(state.openTabs[0]?.isDirty).toBe(true);
    });

    it('should handle updating content of a file without an open tab', () => {
      useWorkspaceStore.getState().addFile(mockFile);
      useWorkspaceStore.getState().updateFileContent(mockFile.path, 'new content');

      const state = useWorkspaceStore.getState();
      expect(state.files[0]?.content).toBe('new content');
    });

    it('should do nothing for a non-existent file path', () => {
      useWorkspaceStore.getState().addFile(mockFile);
      useWorkspaceStore.getState().updateFileContent('/non-existent.ts', 'new content');

      const state = useWorkspaceStore.getState();
      expect(state.files[0]?.content).toBe(mockFile.content);
    });
  });

  describe('deleteFile', () => {
    it('should remove a file from the files array', () => {
      const { addFile } = useWorkspaceStore.getState();
      addFile(mockFile);
      addFile(mockFile2);

      useWorkspaceStore.getState().deleteFile(mockFile.path);

      const state = useWorkspaceStore.getState();
      expect(state.files).toHaveLength(1);
      expect(state.files[0]?.path).toBe(mockFile2.path);
    });

    it('should close the tab when deleting an open file', () => {
      const { addFile, openFile } = useWorkspaceStore.getState();
      addFile(mockFile);
      openFile(mockFile);

      useWorkspaceStore.getState().deleteFile(mockFile.path);

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(0);
      expect(state.activeTabId).toBeNull();
    });

    it('should activate adjacent tab when deleting the active file', () => {
      const { addFile, openFile } = useWorkspaceStore.getState();
      addFile(mockFile);
      addFile(mockFile2);
      openFile(mockFile);
      openFile(mockFile2);

      // Active is file-2, delete it
      useWorkspaceStore.getState().deleteFile(mockFile2.path);

      const state = useWorkspaceStore.getState();
      expect(state.activeTabId).toBe(mockFile.id);
    });
  });

  describe('renameFile', () => {
    it('should rename a file in the files array', () => {
      useWorkspaceStore.getState().addFile(mockFile);

      useWorkspaceStore
        .getState()
        .renameFile(mockFile.path, '/src/main.ts', 'main.ts');

      const state = useWorkspaceStore.getState();
      expect(state.files[0]?.path).toBe('/src/main.ts');
      expect(state.files[0]?.name).toBe('main.ts');
    });

    it('should update the open tab when renaming an open file', () => {
      const { addFile, openFile } = useWorkspaceStore.getState();
      addFile(mockFile);
      openFile(mockFile);

      useWorkspaceStore
        .getState()
        .renameFile(mockFile.path, '/src/main.ts', 'main.ts');

      const state = useWorkspaceStore.getState();
      expect(state.openTabs[0]?.filePath).toBe('/src/main.ts');
      expect(state.openTabs[0]?.fileName).toBe('main.ts');
    });

    it('should do nothing when renaming a non-existent file', () => {
      useWorkspaceStore.getState().addFile(mockFile);

      useWorkspaceStore
        .getState()
        .renameFile('/non-existent.ts', '/src/main.ts', 'main.ts');

      const state = useWorkspaceStore.getState();
      expect(state.files[0]?.path).toBe(mockFile.path);
    });
  });
});
