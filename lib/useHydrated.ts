"use client";

import { useSyncExternalStore } from "react";
import { useOrders } from "@/lib/orders/store";

/**
 * True once the orders store has finished rehydrating from sessionStorage.
 *
 * The store is created with `skipHydration`, so the server render and the first
 * client render both see an empty `orders` array; `StoreHydration` rehydrates it
 * on mount. Without this gate the two disagree and React reports a hydration
 * mismatch on any page whose content depends on stored orders.
 *
 * It subscribes to zustand's persist API rather than flipping a flag in an
 * effect, so it reports the thing it is named for — rehydration having actually
 * finished — instead of the component having mounted. The two coincide today
 * only because nothing rehydrates late.
 *
 * The three callbacks are module constants because `useSyncExternalStore` keys
 * its subscription on `subscribe`'s identity; inline arrows would resubscribe
 * on every render.
 */
const subscribe = (onFinish: () => void) =>
  useOrders.persist.onFinishHydration(onFinish);

const getSnapshot = () => useOrders.persist.hasHydrated();

/** Nothing is rehydrated on the server, so the gate is always shut there. */
const getServerSnapshot = () => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
