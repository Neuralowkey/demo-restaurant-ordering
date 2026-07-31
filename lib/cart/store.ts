"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MENU_BY_ID } from "@/lib/menu";
import type { CartLine, CartSelection } from "./types";

/** Stable, order-insensitive key so {Hot} and {Hot + Fried egg} stay distinct. */
function lineKey(itemId: string, sel: CartSelection): string {
  const opt = sel.optionLabel ?? "";
  const mods = [...(sel.modifierLabels ?? [])].sort().join("|");
  return `${itemId}::${opt}::${mods}`;
}

type CartView = "cart" | "checkout";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  view: CartView;

  add: (itemId: string, selection?: CartSelection) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  setView: (v: CartView) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      view: "cart",

      add: (itemId, selection = {}) =>
        set((s) => {
          const key = lineKey(itemId, selection);
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === key ? { ...l, qty: l.qty + 1 } : l,
              ),
            };
          }
          return { lines: [...s.lines, { key, itemId, selection, qty: 1 }] };
        }),

      setQty: (key, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),

      remove: (key) =>
        set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),

      clear: () => set({ lines: [], view: "cart" }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, view: "cart" }),
      setView: (v) => set({ view: v }),
    }),
    {
      name: "olive-ember.cart",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ lines: s.lines }),
      // If an item is renamed or pulled from the menu between visits, drop the
      // line rather than letting someone check out something we no longer make.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.lines = state.lines.filter((l) => MENU_BY_ID.has(l.itemId));
      },
      skipHydration: true,
    },
  ),
);
