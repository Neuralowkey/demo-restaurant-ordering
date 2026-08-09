"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The current time, rounded down to the last `intervalMs` boundary and re-read
 * once per interval.
 *
 * Calling `Date.now()` during render is impure: React may re-render at any
 * moment for unrelated reasons, so a "waiting 9 min" readout either sits stale
 * until something else changes or jumps unpredictably when it does. Treating
 * the clock as an external store makes the update schedule explicit and owned
 * by the component.
 *
 * Two details carry the implementation:
 *
 * - The snapshot is **quantized** to the interval instead of returning
 *   `Date.now()` raw. `useSyncExternalStore` re-reads the snapshot on every
 *   render and re-renders whenever it differs from the last one, so a raw clock
 *   — a new number on every single read — would never settle. Flooring to the
 *   interval means every read between two ticks returns the identical value,
 *   and the component re-renders exactly on the tick.
 * - `subscribe` is memoized on `intervalMs`, because React keys its
 *   subscription effect on that function's identity. An inline arrow would tear
 *   down and recreate the interval on every render.
 */
export function useNow(intervalMs: number): number {
  const subscribe = useCallback(
    (onTick: () => void) => {
      const id = window.setInterval(onTick, intervalMs);
      return () => window.clearInterval(id);
    },
    [intervalMs],
  );

  const getSnapshot = useCallback(
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    [intervalMs],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * There is no clock to read on the server. Every current caller sits behind
 * `useHydrated`, so this value is never the one rendered — it exists to satisfy
 * the hydration pass, not to be displayed.
 */
const getServerSnapshot = () => 0;
