import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";

describe("WorkspaceLayout", () => {
  it("renders without crashing", () => {
    const { container } = render(<WorkspaceLayout />);
    expect(container.querySelector("[data-testid='sidebar']")).toBeInTheDocument();
  });

  it("contains all 4 panel areas", () => {
    const { container } = render(<WorkspaceLayout />);
    expect(container.querySelector("[data-testid='sidebar']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='main-canvas']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='ai-panel']")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='bottom-panel']")).toBeInTheDocument();
  });

  it("contains resize handles", () => {
    const { container } = render(<WorkspaceLayout />);
    const handles = container.querySelectorAll("[data-panel-resize-handle-id]");
    expect(handles.length).toBeGreaterThanOrEqual(3);
  });

  it("renders children in the main canvas area", () => {
    render(
      <WorkspaceLayout>
        <p>Test content</p>
      </WorkspaceLayout>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("defaults to code canvas mode", () => {
    render(<WorkspaceLayout />);
    const welcomeElements = screen.getAllByText("Welcome");
    expect(welcomeElements.length).toBeGreaterThanOrEqual(1);
  });
});
