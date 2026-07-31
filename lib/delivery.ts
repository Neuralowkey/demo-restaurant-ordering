/**
 * Delivery zones. In the production system these live in the database and are
 * edited by the owner; here they are a constant so the demo needs no backend.
 *
 * The fee is applied at checkout and is charged on delivery orders only —
 * a pickup order never carries a fee line.
 */

export type DeliveryZone = {
  id: string;
  name_he: string;
  name_en: string;
  /** Flat fee in agorot. */
  feeAgorot: number;
  /** Typical driver time once the order leaves the kitchen, in minutes. */
  driveMinutes: number;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "junction",
    name_he: "צומת הכרם ומרכז",
    name_en: "Kerem Junction & centre",
    feeAgorot: 1500,
    driveMinutes: 10,
  },
  {
    id: "north",
    name_he: "השכונות הצפוניות",
    name_en: "Northern neighbourhoods",
    feeAgorot: 2000,
    driveMinutes: 15,
  },
  {
    id: "ridge",
    name_he: "הרכס והמושבים",
    name_en: "The ridge & moshavim",
    feeAgorot: 3000,
    driveMinutes: 25,
  },
];

export const ZONES_BY_ID: ReadonlyMap<string, DeliveryZone> = new Map(
  DELIVERY_ZONES.map((z) => [z.id, z]),
);

/** Synthetic order-line id for the delivery fee (not a real MENU item). */
export const DELIVERY_FEE_ITEM_ID = "__delivery_fee__";

export function zoneFeeAgorot(zoneId: string | undefined): number {
  if (!zoneId) return 0;
  return ZONES_BY_ID.get(zoneId)?.feeAgorot ?? 0;
}

/** Kitchen time, plus the drive if this is a delivery. */
export function etaMinutes(
  mode: "delivery" | "pickup",
  zoneId: string | undefined,
  itemCount: number,
): number {
  const kitchen = 15 + Math.min(20, Math.floor(itemCount / 3) * 5);
  if (mode === "pickup") return kitchen;
  const drive = zoneId ? (ZONES_BY_ID.get(zoneId)?.driveMinutes ?? 15) : 15;
  return kitchen + drive;
}
