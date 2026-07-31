import type { CartLine, CustomerInput } from "@/lib/cart/types";

/**
 * The order lifecycle. `ready` and `out_for_delivery` are the same stage of
 * the kitchen's work, split by fulfilment mode — a pickup order is never
 * "on the way" and a delivery order is never "waiting at the counter".
 */
export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  /** Short human-facing number shown on the ticket, e.g. "A-418". */
  number: string;
  lines: CartLine[];
  customer: CustomerInput;
  status: OrderStatus;
  /** Epoch ms. */
  placedAt: number;
  /** Epoch ms of the last status change — drives the kitchen's ageing dots. */
  updatedAt: number;
  subtotalAgorot: number;
  deliveryFeeAgorot: number;
  totalAgorot: number;
  etaMinutes: number;
};

/** The next status, or null at a terminal one. */
export function nextStatus(order: Order): OrderStatus | null {
  switch (order.status) {
    case "placed":
      return "preparing";
    case "preparing":
      return order.customer.mode === "delivery" ? "out_for_delivery" : "ready";
    case "ready":
    case "out_for_delivery":
      return "completed";
    default:
      return null;
  }
}

export function isActive(order: Order): boolean {
  return order.status !== "completed" && order.status !== "cancelled";
}

/** Customer-facing steps, in order. The kitchen's vocabulary is its own. */
export const CUSTOMER_STEPS = [
  "placed",
  "preparing",
  "underway",
  "done",
] as const;

export type CustomerStep = (typeof CUSTOMER_STEPS)[number];

export function customerStepIndex(status: OrderStatus): number {
  switch (status) {
    case "placed":
      return 0;
    case "preparing":
      return 1;
    case "ready":
    case "out_for_delivery":
      return 2;
    case "completed":
      return 3;
    default:
      return -1; // cancelled
  }
}
