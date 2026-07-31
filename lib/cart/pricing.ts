import { MENU_BY_ID, type MenuItem } from "@/lib/menu";
import type { CartLine, CartSelection } from "./types";

/**
 * Money is carried as integer agorot everywhere it is summed. Menu prices are
 * whole shekels today, but multiplying before rounding keeps the arithmetic
 * exact if a half-shekel price ever lands in the menu.
 */

/** Unit price of one line, in shekels. */
export function unitPrice(item: MenuItem, sel: CartSelection): number {
  const base = item.price ?? 0;
  const opt = sel.optionSurcharge ?? 0;
  const mod = sel.modifierSurcharge ?? 0;
  return base + opt + mod;
}

export function lineSubtotal(item: MenuItem, line: CartLine): number {
  return unitPrice(item, line.selection) * line.qty;
}

export function lineSubtotalAgorot(item: MenuItem, line: CartLine): number {
  return Math.round(unitPrice(item, line.selection) * 100) * line.qty;
}

export function cartSubtotalAgorot(lines: CartLine[]): number {
  let total = 0;
  for (const line of lines) {
    const item = MENU_BY_ID.get(line.itemId);
    if (!item) continue;
    total += lineSubtotalAgorot(item, line);
  }
  return total;
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

/** Format agorot for display, e.g. 5200 -> "₪52". */
export function formatAgorot(agorot: number): string {
  const shekels = agorot / 100;
  const body = Number.isInteger(shekels)
    ? String(shekels)
    : shekels.toFixed(2);
  return `₪${body}`;
}
