"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/store";
import { useOrders } from "@/lib/orders/store";

/**
 * Both stores are created with `skipHydration` so the server render and the
 * first client render agree; this rehydrates them once, on mount.
 *
 * It also drives the simulated kitchen. In production the kitchen board is a
 * websocket subscription and orders advance because a human pressed a button;
 * here a timer stands in for both, so the customer's status page visibly moves
 * without a second tab open.
 */
export function StoreHydration() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useOrders.persist.rehydrate();
  }, []);

  useEffect(() => {
    const tick = useOrders.getState().tick;
    tick();
    const id = window.setInterval(tick, 3000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
