import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  TOUCH_CONSTANTS,
  isTouchDevice,
  getGestureDistance,
  getGestureCenter,
  clampFontSize,
} from "@/lib/utils/touch";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("TOUCH_CONSTANTS", () => {
  it("has the expected long-press duration", () => {
    expect(TOUCH_CONSTANTS.LONG_PRESS_DURATION).toBe(500);
  });

  it("has the expected double-tap delay", () => {
    expect(TOUCH_CONSTANTS.DOUBLE_TAP_DELAY).toBe(300);
  });

  it("has the expected pinch threshold", () => {
    expect(TOUCH_CONSTANTS.PINCH_THRESHOLD).toBe(10);
  });

  it("has the expected swipe threshold", () => {
    expect(TOUCH_CONSTANTS.SWIPE_THRESHOLD).toBe(50);
  });

  it("has the expected minimum touch target size", () => {
    expect(TOUCH_CONSTANTS.MIN_TOUCH_TARGET).toBe(44);
  });

  it("has the expected toolbar touch target size", () => {
    expect(TOUCH_CONSTANTS.TOOLBAR_TOUCH_TARGET).toBe(56);
  });
});

// ---------------------------------------------------------------------------
// isTouchDevice
// ---------------------------------------------------------------------------

describe("isTouchDevice", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    // Restore any property stubs
    vi.restoreAllMocks();
  });

  it("returns false when window is undefined (SSR)", () => {
    // jsdom always defines window, so we temporarily hide it
    const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.defineProperty(globalThis, "window", { value: undefined as any, writable: true, configurable: true });

    expect(isTouchDevice()).toBe(false);

    // Restore
    if (windowDescriptor) {
      Object.defineProperty(globalThis, "window", windowDescriptor);
    } else {
      Object.defineProperty(globalThis, "window", { value: originalWindow, writable: true, configurable: true });
    }
  });

  it("returns true when ontouchstart is present", () => {
    // jsdom window — add ontouchstart
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ontouchstart = null;
    expect(isTouchDevice()).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).ontouchstart;
  });

  it("returns true when navigator.maxTouchPoints > 0", () => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 5,
      configurable: true,
    });
    expect(isTouchDevice()).toBe(true);
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      configurable: true,
    });
  });

  it("returns false when no touch support is detected", () => {
    // Ensure ontouchstart is absent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).ontouchstart;
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      configurable: true,
    });
    expect(isTouchDevice()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getGestureDistance
// ---------------------------------------------------------------------------

describe("getGestureDistance", () => {
  it("returns 0 for identical points", () => {
    const p = { clientX: 100, clientY: 200 };
    expect(getGestureDistance(p, p)).toBe(0);
  });

  it("returns correct distance for horizontal separation", () => {
    const a = { clientX: 0, clientY: 0 };
    const b = { clientX: 100, clientY: 0 };
    expect(getGestureDistance(a, b)).toBe(100);
  });

  it("returns correct distance for vertical separation", () => {
    const a = { clientX: 0, clientY: 0 };
    const b = { clientX: 0, clientY: 50 };
    expect(getGestureDistance(a, b)).toBe(50);
  });

  it("returns correct distance for a 3-4-5 triangle", () => {
    const a = { clientX: 0, clientY: 0 };
    const b = { clientX: 3, clientY: 4 };
    expect(getGestureDistance(a, b)).toBe(5);
  });

  it("is commutative", () => {
    const a = { clientX: 10, clientY: 20 };
    const b = { clientX: 40, clientY: 60 };
    expect(getGestureDistance(a, b)).toBe(getGestureDistance(b, a));
  });
});

// ---------------------------------------------------------------------------
// getGestureCenter
// ---------------------------------------------------------------------------

describe("getGestureCenter", () => {
  it("returns the same point when both touches are identical", () => {
    const p = { clientX: 100, clientY: 200 };
    expect(getGestureCenter(p, p)).toEqual({ x: 100, y: 200 });
  });

  it("returns the midpoint of two horizontal touches", () => {
    const a = { clientX: 0, clientY: 0 };
    const b = { clientX: 100, clientY: 0 };
    expect(getGestureCenter(a, b)).toEqual({ x: 50, y: 0 });
  });

  it("returns the midpoint of two arbitrary touches", () => {
    const a = { clientX: 10, clientY: 20 };
    const b = { clientX: 30, clientY: 60 };
    expect(getGestureCenter(a, b)).toEqual({ x: 20, y: 40 });
  });

  it("is commutative", () => {
    const a = { clientX: 5, clientY: 15 };
    const b = { clientX: 25, clientY: 35 };
    expect(getGestureCenter(a, b)).toEqual(getGestureCenter(b, a));
  });
});

// ---------------------------------------------------------------------------
// clampFontSize
// ---------------------------------------------------------------------------

describe("clampFontSize", () => {
  it("returns the value when within range", () => {
    expect(clampFontSize(16)).toBe(16);
  });

  it("clamps to minimum of 10", () => {
    expect(clampFontSize(5)).toBe(10);
    expect(clampFontSize(-1)).toBe(10);
    expect(clampFontSize(0)).toBe(10);
  });

  it("clamps to maximum of 32", () => {
    expect(clampFontSize(40)).toBe(32);
    expect(clampFontSize(100)).toBe(32);
  });

  it("returns exact boundaries", () => {
    expect(clampFontSize(10)).toBe(10);
    expect(clampFontSize(32)).toBe(32);
  });
});
