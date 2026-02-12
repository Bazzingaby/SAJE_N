import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import type { FileNode } from "@/lib/store/types";

// ---------------------------------------------------------------------------
// Mock MonacoWrapper — Monaco cannot run in jsdom.
// ---------------------------------------------------------------------------

vi.mock("@/components/canvas/MonacoWrapper", () => ({
  MonacoWrapper: ({
    filePath,
    language,
  }: {
    filePath: string;
    content: string;
    language: string;
    onChange?: (value: string) => void;
  }) => (
    <div data-testid="monaco-wrapper-mock">
      <span data-testid="mock-file-path">{filePath}</span>
      <span data-testid="mock-language">{language}</span>
    </div>
  ),
}));

import { CodeCanvas } from "@/components/canvas/CodeCanvas";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockFile: FileNode = {
  id: "file-1",
  name: "index.ts",
  path: "/src/index.ts",
  isDirectory: false,
  content: 'console.log("hello")',
  language: "typescript",
};

const mockFile2: FileNode = {
  id: "file-2",
  name: "utils.ts",
  path: "/src/utils.ts",
  isDirectory: false,
  content: "export const foo = 1;",
  language: "typescript",
};

const mockFile3: FileNode = {
  id: "file-3",
  name: "app.tsx",
  path: "/src/app.tsx",
  isDirectory: false,
  content: "<App />",
  language: "typescriptreact",
  isDirty: true,
} as FileNode & { isDirty: boolean };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const initialState = useWorkspaceStore.getState();

function setupStore(filesToOpen: FileNode[]) {
  useWorkspaceStore.setState(initialState, true);
  const store = useWorkspaceStore.getState();
  for (const file of filesToOpen) {
    store.addFile(file);
    store.openFile(file);
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CodeCanvas", () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  afterEach(() => {
    cleanup();
  });

  // ── Empty state ─────────────────────────────────────────────────────────
  describe("empty state", () => {
    it("renders the empty state when no tabs are open", () => {
      render(<CodeCanvas />);
      expect(screen.getByTestId("code-canvas-empty")).toBeInTheDocument();
      expect(
        screen.getByText("Open a file to start editing"),
      ).toBeInTheDocument();
    });

    it("does not render the tab bar when no tabs are open", () => {
      render(<CodeCanvas />);
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    });
  });

  // ── Tab bar ─────────────────────────────────────────────────────────────
  describe("tab bar", () => {
    it("renders a tab for each open file", () => {
      setupStore([mockFile, mockFile2]);
      render(<CodeCanvas />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
      expect(screen.getByText("index.ts")).toBeInTheDocument();
      expect(screen.getByText("utils.ts")).toBeInTheDocument();
    });

    it("marks the active tab with aria-selected true", () => {
      setupStore([mockFile, mockFile2]);
      render(<CodeCanvas />);

      const tabs = screen.getAllByRole("tab");
      // The last opened file (mockFile2) is active
      const activeTab = tabs.find(
        (tab) => tab.getAttribute("aria-selected") === "true",
      );
      expect(activeTab).toBeDefined();
      expect(activeTab).toHaveTextContent("utils.ts");
    });

    it("switches active tab when clicking a different tab", () => {
      setupStore([mockFile, mockFile2]);
      render(<CodeCanvas />);

      // Click the first tab (index.ts)
      fireEvent.click(screen.getByText("index.ts"));

      const state = useWorkspaceStore.getState();
      expect(state.activeTabId).toBe(mockFile.id);
    });

    it("closes a tab when clicking the close button", () => {
      setupStore([mockFile, mockFile2]);
      render(<CodeCanvas />);

      const closeBtn = screen.getByRole("button", {
        name: `Close ${mockFile.name}`,
      });
      fireEvent.click(closeBtn);

      const state = useWorkspaceStore.getState();
      expect(state.openTabs).toHaveLength(1);
      expect(state.openTabs[0]?.fileName).toBe(mockFile2.name);
    });

    it("displays a dirty indicator for unsaved tabs", () => {
      setupStore([mockFile]);
      // Mark the file as dirty
      useWorkspaceStore.getState().updateFileContent(mockFile.path, "changed");

      render(<CodeCanvas />);

      expect(
        screen.getByTestId(`dirty-indicator-${mockFile.id}`),
      ).toBeInTheDocument();
    });
  });

  // ── Editor area ─────────────────────────────────────────────────────────
  describe("editor area", () => {
    it("renders the mocked MonacoWrapper for the active file", () => {
      setupStore([mockFile]);
      render(<CodeCanvas />);

      expect(screen.getByTestId("monaco-wrapper-mock")).toBeInTheDocument();
      expect(screen.getByTestId("mock-file-path")).toHaveTextContent(
        mockFile.path,
      );
      expect(screen.getByTestId("mock-language")).toHaveTextContent(
        "typescript",
      );
    });

    it("shows the correct file after switching tabs", () => {
      setupStore([mockFile, mockFile2]);
      render(<CodeCanvas />);

      // Active is mockFile2; switch to mockFile
      fireEvent.click(screen.getByText("index.ts"));

      // Re-render happens via Zustand subscription
      // The mock shows the file path
      expect(screen.getByTestId("mock-file-path")).toHaveTextContent(
        mockFile.path,
      );
    });
  });
});
