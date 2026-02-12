import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { TouchToolbar } from "../../components/toolbar/TouchToolbar";

const initialState = useWorkspaceStore.getState();

describe("TouchToolbar", () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the toolbar", () => {
    render(<TouchToolbar />);
    const toolbars = screen.getAllByTestId("touch-toolbar");
    expect(toolbars.length).toBeGreaterThanOrEqual(1);
    expect(toolbars[0]).toBeInTheDocument();
  });

  it("contains Run button", () => {
    render(<TouchToolbar />);
    const runButtons = screen.getAllByLabelText("Run");
    expect(runButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("contains Save button", () => {
    render(<TouchToolbar />);
    const saveButtons = screen.getAllByLabelText("Save");
    expect(saveButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("contains Undo button", () => {
    render(<TouchToolbar />);
    const undoButtons = screen.getAllByLabelText("Undo");
    expect(undoButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("has proper aria labels on all buttons", () => {
    render(<TouchToolbar />);
    expect(screen.getAllByLabelText("Run").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Select").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Annotate").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("AI Assistant").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Save").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Undo").length).toBeGreaterThanOrEqual(1);
  });

  it("renders at 64px height (h-16)", () => {
    render(<TouchToolbar />);
    const toolbars = screen.getAllByTestId("touch-toolbar");
    expect(toolbars[0]?.className).toContain("h-16");
  });
});
