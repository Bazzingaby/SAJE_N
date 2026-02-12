"use client";

import { useEffect, useRef, useCallback } from "react";
import { TOUCH_CONSTANTS } from "@/lib/utils/touch";

export interface TouchGestureHandlers {
  onTap?: (e: PointerEvent) => void;
  onDoubleTap?: (e: PointerEvent) => void;
  onLongPress?: (e: PointerEvent) => void;
  onPinch?: (scale: number) => void;
  onTwoFingerDrag?: (deltaX: number, deltaY: number) => void;
  onThreeFingerSwipe?: (direction: "left" | "right") => void;
}

interface PointerState {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
}

/**
 * Attaches pointer-event listeners to the given ref and calls the
 * appropriate handler when a gesture is recognised.
 *
 * Recognised gestures:
 *  - Single tap (pointer down + up within 200 ms, < 10 px movement)
 *  - Double tap (two taps within DOUBLE_TAP_DELAY)
 *  - Long press (pointer held for LONG_PRESS_DURATION with < 10 px movement)
 *  - Pinch (two pointers, distance changes past PINCH_THRESHOLD)
 *  - Two-finger drag (two pointers, both move in same direction)
 *  - Three-finger swipe (three pointers, horizontal movement past SWIPE_THRESHOLD)
 */
export function useTouchGestures(
  ref: React.RefObject<HTMLElement | null>,
  handlers: TouchGestureHandlers,
): void {
  const pointersRef = useRef<Map<number, PointerState>>(new Map());
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const initialPinchDistanceRef = useRef<number | null>(null);

  // Stabilise handler references so the effect doesn't re-attach on every render.
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pointers = pointersRef.current;

    function getDistance(): number | null {
      const entries = Array.from(pointers.values());
      if (entries.length < 2) return null;
      const a = entries[0]!;
      const b = entries[1]!;
      const dx = b.currentX - a.currentX;
      const dy = b.currentY - a.currentY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function onPointerDown(e: PointerEvent) {
      // Only track touch pointers (not mouse or pen)
      if (e.pointerType !== "touch") return;

      pointers.set(e.pointerId, {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        startTime: Date.now(),
      });

      // Long press detection — only when a single pointer is down
      if (pointers.size === 1) {
        clearLongPress();
        longPressTimerRef.current = setTimeout(() => {
          const ptr = pointers.get(e.pointerId);
          if (!ptr) return;
          const dx = ptr.currentX - ptr.startX;
          const dy = ptr.currentY - ptr.startY;
          if (Math.sqrt(dx * dx + dy * dy) < 10) {
            handlersRef.current.onLongPress?.(e);
          }
        }, TOUCH_CONSTANTS.LONG_PRESS_DURATION);
      } else {
        // Multi-touch cancels long press
        clearLongPress();
      }

      // Record initial pinch distance when we have exactly 2 pointers
      if (pointers.size === 2) {
        initialPinchDistanceRef.current = getDistance();
      } else {
        initialPinchDistanceRef.current = null;
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "touch") return;

      const ptr = pointers.get(e.pointerId);
      if (!ptr) return;

      ptr.currentX = e.clientX;
      ptr.currentY = e.clientY;

      // --- Pinch ---
      if (pointers.size === 2 && initialPinchDistanceRef.current !== null) {
        const currentDistance = getDistance();
        if (currentDistance !== null) {
          const delta = currentDistance - initialPinchDistanceRef.current;
          if (Math.abs(delta) > TOUCH_CONSTANTS.PINCH_THRESHOLD) {
            const scale = currentDistance / initialPinchDistanceRef.current;
            handlersRef.current.onPinch?.(scale);
            // Reset baseline so subsequent moves are relative
            initialPinchDistanceRef.current = currentDistance;
          }
        }
      }

      // --- Two-finger drag ---
      if (pointers.size === 2) {
        const entries = Array.from(pointers.values());
        const a = entries[0]!;
        const b = entries[1]!;
        const adx = a.currentX - a.startX;
        const ady = a.currentY - a.startY;
        const bdx = b.currentX - b.startX;
        const bdy = b.currentY - b.startY;

        // Both pointers moving in roughly the same direction
        if (
          (adx > 0 && bdx > 0) || (adx < 0 && bdx < 0) ||
          (ady > 0 && bdy > 0) || (ady < 0 && bdy < 0)
        ) {
          const avgDx = (adx + bdx) / 2;
          const avgDy = (ady + bdy) / 2;
          handlersRef.current.onTwoFingerDrag?.(avgDx, avgDy);
        }
      }

      // --- Three-finger swipe ---
      if (pointers.size === 3) {
        const entries = Array.from(pointers.values());
        const totalDx = entries.reduce((sum, p) => sum + (p.currentX - p.startX), 0) / 3;
        if (Math.abs(totalDx) > TOUCH_CONSTANTS.SWIPE_THRESHOLD) {
          const direction = totalDx > 0 ? "right" : "left";
          handlersRef.current.onThreeFingerSwipe?.(direction);

          // Reset starts so we don't fire repeatedly
          for (const p of entries) {
            p.startX = p.currentX;
            p.startY = p.currentY;
          }
        }
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerType !== "touch") return;

      const ptr = pointers.get(e.pointerId);
      pointers.delete(e.pointerId);

      if (!ptr) return;

      clearLongPress();

      const elapsed = Date.now() - ptr.startTime;
      const dx = ptr.currentX - ptr.startX;
      const dy = ptr.currentY - ptr.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Single / double tap detection
      if (elapsed < 200 && distance < 10 && pointers.size === 0) {
        const now = Date.now();
        if (now - lastTapTimeRef.current < TOUCH_CONSTANTS.DOUBLE_TAP_DELAY) {
          handlersRef.current.onDoubleTap?.(e);
          lastTapTimeRef.current = 0; // reset so triple-tap doesn't re-fire
        } else {
          handlersRef.current.onTap?.(e);
          lastTapTimeRef.current = now;
        }
      }

      if (pointers.size === 0) {
        initialPinchDistanceRef.current = null;
      }
    }

    function onPointerCancel(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      pointers.delete(e.pointerId);
      clearLongPress();
      if (pointers.size === 0) {
        initialPinchDistanceRef.current = null;
      }
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      clearLongPress();
    };
  }, [ref, clearLongPress]);
}
