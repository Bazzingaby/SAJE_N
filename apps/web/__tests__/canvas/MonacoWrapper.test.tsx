import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock next/dynamic — Monaco cannot run in jsdom.
//
// next/dynamic is used by MonacoWrapper to lazily load the Monaco Editor
// component. We replace it with a simple passthrough that renders the
// `loading` component returned by the dynamic call's options.
// ---------------------------------------------------------------------------

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (
    _loader: () => Promise<unknown>,
    options?: { loading?: () => React.ReactElement },
  ) => {
    // Return a component that renders the loading state
    function DynamicMock() {
      if (options?.loading) {
        return options.loading();
      }
      return null;
    }
    DynamicMock.displayName = "DynamicMock";
    return DynamicMock;
  },
}));

// Mock the TouchOverlay so it doesn't interfere with snapshot testing
vi.mock("@/components/canvas/touch/TouchOverlay", () => ({
  TouchOverlay: () => <div data-testid="touch-overlay-mock" />,
}));

// Import AFTER mocks are set up
import { MonacoWrapper } from "@/components/canvas/MonacoWrapper";

describe("MonacoWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    render(
      <MonacoWrapper
        filePath="/src/index.ts"
        content='console.log("hello");'
        language="typescript"
      />,
    );

    expect(screen.getByTestId("monaco-wrapper")).toBeInTheDocument();
  });

  it("shows the loading state when Monaco has not loaded yet", () => {
    render(
      <MonacoWrapper
        filePath="/src/index.ts"
        content=""
        language="typescript"
      />,
    );

    // The mocked next/dynamic renders the loading component
    expect(screen.getByTestId("monaco-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading editor...")).toBeInTheDocument();
  });

  it("renders the touch overlay mock", () => {
    render(
      <MonacoWrapper
        filePath="/src/app.tsx"
        content="<App />"
        language="typescriptreact"
      />,
    );

    expect(screen.getByTestId("touch-overlay-mock")).toBeInTheDocument();
  });
});
