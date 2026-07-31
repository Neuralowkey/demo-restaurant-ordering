"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine, CustomerInput } from "@/lib/cart/types";
import { cartSubtotalAgorot, cartItemCount } from "@/lib/cart/pricing";
import { zoneFeeAgorot, etaMinutes } from "@/lib/delivery";
import { type Order, type OrderStatus, nextStatus, isActive } from "./types";

/**
 * Orders live in the browser for this demo.
 *
 * In the production system this is a Postgres table behind a server action,
 * with the kitchen board subscribed over websockets. The shape of what the UI
 * consumes is identical — swapping the transport does not touch a component.
 *
 * The simulated kitchen below is demo-only: it advances orders on a timer so
 * the customer's status page is visibly alive without anyone having to open
 * the kitchen view in another tab.
 */

/** How long each stage takes in the simulated kitchen, in ms. */
const SIM_STAGE_MS: Record<OrderStatus, number> = {
  placed: 12_000,
  preparing: 30_000,
  ready: 45_000,
  out_for_delivery: 45_000,
  completed: Infinity,
  cancelled: Infinity,
};

let seq = 400;
function nextOrderNumber(): string {
  seq += 1 + Math.floor(Math.random() * 3);
  return `A-${seq}`;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

type OrderState = {
  orders: Order[];
  /** Wall-clock of the last simulated-kitchen tick — see `tick`. */
  lastTick: number;

  place: (lines: CartLine[], customer: CustomerInput) => Order;
  advance: (id: string) => void;
  cancel: (id: string) => void;
  clearAll: () => void;
  /** Move any order whose stage has run long enough to the next status. */
  tick: () => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastTick: 0,

      place: (lines, customer) => {
        const subtotal = cartSubtotalAgorot(lines);
        const fee =
          customer.mode === "delivery" ? zoneFeeAgorot(customer.zoneId) : 0;
        const now = Date.now();

        const order: Order = {
          id: makeId(),
          number: nextOrderNumber(),
          lines,
          customer,
          status: "placed",
          placedAt: now,
          updatedAt: now,
          subtotalAgorot: subtotal,
          deliveryFeeAgorot: fee,
          totalAgorot: subtotal + fee,
          etaMinutes: etaMinutes(
            customer.mode,
            customer.zoneId,
            cartItemCount(lines),
          ),
        };

        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },

      advance: (id) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o;
            const next = nextStatus(o);
            return next ? { ...o, status: next, updatedAt: Date.now() } : o;
          }),
        })),

      cancel: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id && isActive(o)
              ? { ...o, status: "cancelled", updatedAt: Date.now() }
              : o,
          ),
        })),

      clearAll: () => set({ orders: [] }),

      tick: () => {
        const now = Date.now();
        const { orders } = get();
        if (!orders.some(isActive)) return;

        let changed = false;
        const advanced = orders.map((o) => {
          if (!isActive(o)) return o;
          if (now - o.updatedAt < SIM_STAGE_MS[o.status]) return o;
          const next = nextStatus(o);
          if (!next) return o;
          changed = true;
          return { ...o, status: next, updatedAt: now };
        });

        if (changed) set({ orders: advanced, lastTick: now });
      },
    }),
    {
      name: "olive-ember.orders",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      // sessionStorage, not local: a fresh visitor to the portfolio should
      // always land on an empty kitchen board rather than someone else's
      // half-finished demo from a previous tab.
      partialize: (s) => ({ orders: s.orders }),
      skipHydration: true,
    },
  ),
);
