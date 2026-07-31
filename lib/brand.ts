/**
 * Invented brand for this demo. Nothing here refers to a real business.
 *
 * The system this demo is modelled on was built for a real restaurant; every
 * name, address, phone number, price and menu item below is fictional and was
 * written for the demo.
 */

export const BRAND = {
  name_en: "Olive & Ember",
  name_he: "זית ולהבה",
  tagline_en: "Fire-grilled · Kosher · Northern Israel",
  tagline_he: "על האש · כשר · צפון הארץ",
  /** Fictional. Do not dial. */
  phone: "+972 4 555 0140",
  phoneDisplay: "04-555-0140",
  street_en: "12 Ha'Gefen Street",
  street_he: "הגפן 12",
  city_en: "Kerem Junction",
  city_he: "צומת הכרם",
  kosher_en: "Kosher Mehadrin (fictional certification)",
  kosher_he: "כשר למהדרין (תעודה בדיונית)",
  currency: "₪",
} as const;

/** Weekly service hours, local time. Friday closes early for Shabbat. */
export const HOURS: { day: number; open: number; close: number | null }[] = [
  { day: 0, open: 11, close: 22 }, // Sunday
  { day: 1, open: 11, close: 22 },
  { day: 2, open: 11, close: 22 },
  { day: 3, open: 11, close: 22 },
  { day: 4, open: 11, close: 23 },
  { day: 5, open: 10, close: 14 }, // Friday — early close
  { day: 6, open: 0, close: null }, // Shabbat — closed
];
