import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { ModeSwitch } from "../../components/toolbar/ModeSwitch";

const initialState = useWorkspaceStore.getState();

describe("ModeSwitch", () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders all 5 mode buttons", () => {
    render(<ModeSwitch />);
    expect(screen.getAllByLabelText("Code").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Design").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Flow").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Data").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Board").length).toBeGreaterThanOrEqual(1);
  });

  it("each button has correct aria-label", () => {
    render(<ModeSwitch />);
    const codeBtn = screen.getAllByLabelText("Code")[0];
    const designBtn = screen.getAllByLabelText("Design")[0];
    const flowBtn = screen.getAllByLabelText("Flow")[0];
    const dataBtn = screen.getAllByLabelText("Data")[0];
    const boardBtn = screen.getAllByLabelText("Board")[0];

    expect(codeBtn).toHaveAttribute("aria-label", "Code");
    expect(designBtn).toHaveAttribute("aria-label", "Design");
    expect(flowBtn).toHaveAttribute("aria-label", "Flow");
    expect(dataBtn).toHaveAttribute("aria-label", "Data");
    expect(boardBtn).toHaveAttribute("aria-label", "Board");
  });

  it("active mode is visually indicated with accent color class", () => {
    render(<ModeSwitch />);
    // Default mode is 'code', so the Code button should have the accent-blue class
    const codeBtn = screen.getAllByLabelText("Code")[0];
    expect(codeBtn?.className).toContain("bg-accent-blue");
  });

  it("clicking a mode button changes the canvas mode in the store", () => {
    render(<ModeSwitch />);

    const designBtn = screen.getAllByLabelText("Design")[0]!;
    fireEvent.click(designBtn);

    expect(useWorkspaceStore.getState().canvasMode).toBe("design");
  });

  it("switching mode updates the active button styling", () => {
    render(<ModeSwitch />);

    // Click Flow
    const flowBtn = screen.getAllByLabelText("Flow")[0]!;
    fireEvent.click(flowBtn);

    // After re-render, Flow button should have green accent
    const updatedFlowBtn = screen.getAllByLabelText("Flow")[0];
    expect(updatedFlowBtn?.className).toContain("bg-accent-green");

    // Code button should no longer have its accent
    const codeBtn = screen.getAllByLabelText("Code")[0];
    expect(codeBtn?.className).not.toContain("bg-accent-blue");
  });
});
