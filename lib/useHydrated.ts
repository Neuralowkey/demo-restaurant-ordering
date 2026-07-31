"use client";

import { useEffect, useState } from "react";

/**
 * True once the client has mounted.
 *
 * Both stores persist to sessionStorage with `skipHydration`, so a component
 * that reads them renders "nothing yet" on the server and on the first client
 * pass. Without this gate the two disagree and React reports a hydration
 * mismatch on any page whose content depends on stored state.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
