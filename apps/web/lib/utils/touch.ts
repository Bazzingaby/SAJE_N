/**
 * Touch utility functions and constants for the Cosmos touch-first UI.
 *
 * All touch targets follow Apple HIG (44px minimum) and the project's
 * toolbar sizing (56px). These helpers are used by the touch gesture
 * overlay and any component that needs to respond to multi-touch input.
 */

export const TOUCH_CONSTANTS = {
  /** Milliseconds a pointer must be held for a long-press */
  LONG_PRESS_DURATION: 500,
  /** Maximum milliseconds between taps for a double-tap */
  DOUBLE_TAP_DELAY: 300,
  /** Minimum pixel distance change to recognise a pinch */
  PINCH_THRESHOLD: 10,
  /** Minimum pixel movement to recognise a swipe */
  SWIPE_THRESHOLD: 50,
  /** Minimum interactive target size in px (Apple HIG) */
  MIN_TOUCH_TARGET: 44,
  /** Toolbar button target size in px */
  TOOLBAR_TOUCH_TARGET: 56,
} as const;

/** A minimal point shape accepted by gesture helpers. */
export interface TouchPoint {
  clientX: number;
  clientY: number;
}

/**
 * Returns `true` when the current device supports touch input.
 * Always returns `false` during SSR (no `window`).
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Euclidean distance between two touch points.
 */
export function getGestureDistance(touch1: TouchPoint, touch2: TouchPoint): number {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Midpoint between two touch points.
 */
export function getGestureCenter(
  touch1: TouchPoint,
  touch2: TouchPoint,
): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

/**
 * Clamps a Monaco font size to the allowed range (10 – 32).
 */
export function clampFontSize(size: number): number {
  return Math.min(Math.max(size, 10), 32);
}
