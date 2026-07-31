/** A customer's choices for one menu item. Empty when the item has neither. */
export type CartSelection = {
  /** label_en of the picked option (e.g. "Medium"); undefined if N/A. */
  optionLabel?: string;
  /** Surcharge in shekels for that option (0 if N/A). */
  optionSurcharge?: number;
  /** label_en values of any modifiers the customer toggled on. */
  modifierLabels?: string[];
  /** Sum of the selected modifier surcharges, in shekels. */
  modifierSurcharge?: number;
};

export type CartLine = {
  /** Stable hash of itemId + selection — the React key and the map key. */
  key: string;
  itemId: string;
  selection: CartSelection;
  qty: number;
};

export type FulfilmentMode = "delivery" | "pickup";

export type CustomerInput = {
  name: string;
  phone: string;
  mode: FulfilmentMode;
  /** Free-text address. Drivers are local; there is no geocoding step. */
  address?: string;
  zoneId?: string;
  notes?: string;
};
