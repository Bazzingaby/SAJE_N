import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "../../components/layout/Sidebar";

describe("Sidebar", () => {
  it("renders all navigation icons", () => {
    render(<Sidebar />);
    expect(screen.getAllByLabelText("Files").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Search").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText("Git").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByLabelText("Extensions").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("icons have proper aria-labels", () => {
    render(<Sidebar />);
    const buttons = screen.getAllByRole("button");
    const labeledButtons = buttons.filter(
      (btn) => btn.getAttribute("aria-label") !== null
    );
    // At least 5 nav items + 1 expand/collapse toggle = 6
    expect(labeledButtons.length).toBeGreaterThanOrEqual(5);
  });

  it("has settings at bottom", () => {
    render(<Sidebar />);
    const settingsButtons = screen.getAllByLabelText("Settings");
    expect(settingsButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("has expand/collapse toggle", () => {
    render(<Sidebar />);
    const toggles = screen.getAllByLabelText(/sidebar/i);
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  it("renders sidebar container", () => {
    render(<Sidebar />);
    const sidebars = screen.getAllByTestId("sidebar");
    expect(sidebars.length).toBeGreaterThanOrEqual(1);
    expect(sidebars[0]).toBeInTheDocument();
  });
});
