import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { QuickActions } from "../../components/toolbar/QuickActions";

const initialState = useWorkspaceStore.getState();

describe("QuickActions", () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders context buttons for default mode (code)", () => {
    render(<QuickActions />);
    expect(screen.getAllByLabelText("Format").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Comment").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Find").length).toBeGreaterThanOrEqual(1);
  });

  it("shows correct buttons for design mode", () => {
    useWorkspaceStore.setState({ canvasMode: "design" });
    render(<QuickActions />);
    expect(screen.getAllByLabelText("Align").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Group").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Layers").length).toBeGreaterThanOrEqual(1);
  });

  it("shows correct buttons for flow mode", () => {
    useWorkspaceStore.setState({ canvasMode: "flow" });
    render(<QuickActions />);
    expect(screen.getAllByLabelText("Add Node").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Run").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Validate").length).toBeGreaterThanOrEqual(1);
  });

  it("shows correct buttons for data mode", () => {
    useWorkspaceStore.setState({ canvasMode: "data" });
    render(<QuickActions />);
    expect(screen.getAllByLabelText("Execute").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Export").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Refresh").length).toBeGreaterThanOrEqual(1);
  });

  it("shows correct buttons for board mode", () => {
    useWorkspaceStore.setState({ canvasMode: "board" });
    render(<QuickActions />);
    expect(screen.getAllByLabelText("New Card").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Filter").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Sprint").length).toBeGreaterThanOrEqual(1);
  });
});
