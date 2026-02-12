"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useTouchGestures } from "./use-touch-gestures";
import { isTouchDevice, clampFontSize } from "@/lib/utils/touch";

export interface TouchOverlayProps {
  /** Current Monaco font size — used as the baseline for pinch-zoom. */
  fontSize: number;
  /** Called when a pinch gesture changes the desired font size. */
  onFontSizeChange: (size: number) => void;
  /** Called when a three-finger left swipe triggers undo. */
  onUndo?: () => void;
  /** Called when a three-finger right swipe triggers redo. */
  onRedo?: () => void;
}

/**
 * Transparent overlay rendered on top of the Monaco editor.
 *
 * It intercepts multi-touch gestures that Monaco cannot handle natively
 * (pinch-to-zoom font size, three-finger undo/redo, long-press context menu).
 * Single-pointer events are passed through so Monaco's own editing behaviour
 * is preserved.
 */
export function TouchOverlay({
  fontSize,
  onFontSizeChange,
  onUndo,
  onRedo,
}: TouchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [showContextHint, setShowContextHint] = useState(false);

  // Detect touch support on mount (client-only)
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  const handlePinch = useCallback(
    (scale: number) => {
      const newSize = clampFontSize(Math.round(fontSize * scale));
      if (newSize !== fontSize) {
        onFontSizeChange(newSize);
      }
    },
    [fontSize, onFontSizeChange],
  );

  const handleLongPress = useCallback(() => {
    setShowContextHint(true);
    // Auto-dismiss after 1.5 s
    setTimeout(() => setShowContextHint(false), 1500);
  }, []);

  const handleThreeFingerSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left") {
        onUndo?.();
      } else {
        onRedo?.();
      }
    },
    [onUndo, onRedo],
  );

  useTouchGestures(overlayRef, {
    onPinch: handlePinch,
    onLongPress: handleLongPress,
    onThreeFingerSwipe: handleThreeFingerSwipe,
  });

  // Do not render the overlay on non-touch devices
  if (!isTouch) return null;

  return (
    <div
      ref={overlayRef}
      data-testid="touch-overlay"
      className="pointer-events-auto absolute inset-0 z-10 touch-none"
      style={{
        // Allow single-pointer events through to Monaco while
        // capturing multi-touch via the pointer-event listeners.
        pointerEvents: "none",
      }}
      // Re-enable pointer events only for multi-touch via JS listeners
      onPointerDown={(e) => {
        // This React handler ensures the DOM element receives pointer events
        // while the CSS pointerEvents:none allows single touches to fall through.
        // The actual gesture detection is handled by useTouchGestures.
        if (e.pointerType === "touch") {
          (e.currentTarget as HTMLDivElement).style.pointerEvents = "auto";
        }
      }}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") {
          (e.currentTarget as HTMLDivElement).style.pointerEvents = "none";
        }
      }}
    >
      {showContextHint && (
        <div
          data-testid="context-menu-hint"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-bg-tertiary px-4 py-2 text-sm text-text-secondary shadow-lg animate-fade-in"
        >
          Context menu (coming soon)
        </div>
      )}
    </div>
  );
}
