"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./menu";

export type { Lang };

/* =============================================================
   UI strings — single source of truth.
   The two dictionaries are checked for key parity at compile time
   below, so a string added to one language fails the build until
   it exists in the other.
   ============================================================= */
export const STRINGS = {
  he: {
    nav_menu: "תפריט",
    nav_about: "אודות",
    nav_delivery: "משלוחים",
    nav_kitchen: "מסך מטבח",
    lang_label: "EN",
    lang_aria: "החלף שפה לאנגלית",
    call_now: "התקשרו",

    hero_kicker: "על האש · שיפודים · כנפיים · כשר",
    hero_subtitle:
      "גריל כשר בצומת הכרם. בשר על פחמים, רטבי בית, ומשלוחים לכל האזור.",
    hero_cta_primary: "להזמנה",
    hero_cta_secondary: "לתפריט",

    section_menu_kicker: "01 / התפריט",
    section_menu_title_head: "האוכל.",
    section_menu_title_em: "האש.",
    section_menu_lede:
      "כל מה שיוצא מהמטבח. בחרו קטגוריה — או פשוט גללו.",

    section_about_kicker: "02 / הסיפור",
    section_about_title: "פחמים אמיתיים. בלי קיצורי דרך.",
    section_about_body:
      "התחלנו כדוכן אחד בצומת. היום זו מסעדה עם ישיבה, מטבח פתוח וארבעה רטבים שאנחנו מכינים בעצמנו כל בוקר. הבשר עולה על פחמים — לא על פלנצ׳ה.",
    section_about_pull:
      "אם הרוטב לא נגמר עד סוף היום, לא הכנו מספיק טרי.",
    about_label_origin: "מיקום",
    about_label_style: "סגנון",
    about_value_style: "בשרי · ישיבה · משלוחים",
    about_label_cert: "כשרות",

    section_delivery_kicker: "03 / משלוח ואיסוף",
    section_delivery_title_head: "להזמין · לאסוף ·",
    section_delivery_title_em: "לשבת אצלנו.",
    section_delivery_lede: "משלוחים בכל אזור צומת הכרם.",
    section_delivery_pickup_h: "איסוף עצמי",
    section_delivery_pickup_p: "בדרך כלל 15–25 דקות מרגע ההזמנה.",
    section_delivery_delivery_h: "משלוח",
    section_delivery_delivery_p:
      "המחיר נקבע לפי אזור ומוצג בקופה לפני התשלום.",
    section_delivery_dinein_h: "ישיבה במקום",
    section_delivery_dinein_p: "בלי הזמנה מראש. פשוט בואו.",

    menu_add: "הוסיפו",
    menu_added: "נוסף",
    menu_includes: "כולל",
    menu_currency: "₪",
    menu_choose: "בחרו",
    menu_extras: "תוספות",

    cart_title: "הסל",
    cart_empty: "הסל ריק.",
    cart_empty_hint: "הוסיפו משהו מהתפריט.",
    cart_subtotal: "ביניים",
    cart_delivery_fee: "משלוח",
    cart_total: "סה״כ",
    cart_checkout: "למעבר לתשלום",
    cart_back: "חזרה לסל",
    cart_remove: "הסירו",
    cart_qty: "כמות",

    checkout_title: "פרטי הזמנה",
    checkout_name: "שם",
    checkout_phone: "טלפון",
    checkout_mode: "אופן קבלה",
    checkout_delivery: "משלוח",
    checkout_pickup: "איסוף",
    checkout_address: "כתובת למשלוח",
    checkout_zone: "אזור",
    checkout_notes: "הערות למטבח",
    checkout_notes_ph: "אלרגיות, בקשות מיוחדות…",
    checkout_submit: "שליחת הזמנה",
    checkout_submitting: "שולח…",
    checkout_pay_note:
      "תשלום מדומה — לא מחויב כרטיס ולא נשלחים נתונים לשום מקום.",

    status_title: "ההזמנה שלכם",
    status_order_num: "הזמנה",
    status_placed: "התקבלה",
    status_eta: "זמן משוער",
    status_minutes: "דק׳",
    status_items: "פריטים",
    status_track_hint: "הדף מתעדכן אוטומטית ככל שההזמנה מתקדמת.",
    status_to_kitchen: "פתחו את מסך המטבח כדי לקדם את ההזמנה",

    kitchen_title: "מסך מטבח",
    kitchen_sub: "מה שהצוות רואה מאחורי הדלת.",
    kitchen_empty: "אין הזמנות פעילות.",
    kitchen_empty_hint: "הזמינו משהו מהתפריט וההזמנה תופיע כאן.",
    kitchen_new: "חדשות",
    kitchen_prep: "בהכנה",
    kitchen_out: "יצאו",
    kitchen_done: "הושלמו",
    kitchen_advance: "קדם",
    kitchen_cancel: "בטל",
    kitchen_today: "היום",
    kitchen_orders: "הזמנות",
    kitchen_revenue: "הכנסה",
    kitchen_avg: "ממוצע להזמנה",

    closed_banner: "המסעדה סגורה כעת",
    closed_shabbat: "סגור לשבת",
    closed_holiday: "סגור לחג",
    closed_hours: "מחוץ לשעות הפעילות",
    closed_reopens: "נפתח מחדש",
    open_now: "פתוח כעת",

    err_empty_cart: "הסל ריק.",
    err_invalid_customer: "בדקו את השם ומספר הטלפון.",
    err_address_required: "נדרשת כתובת למשלוח.",

    footer_visit: "בקרו אותנו",
    footer_kosher_h: "כשרות",
    footer_hours_h: "שעות פתיחה",
    footer_closed: "סגור",
    footer_demo: "הדגמה · כל הנתונים בדיוניים",

    marquee_words: ["חם", "פחמים", "כשר", "טרי", "צומת הכרם", "אש"],
  },

  en: {
    nav_menu: "Menu",
    nav_about: "About",
    nav_delivery: "Delivery",
    nav_kitchen: "Kitchen view",
    lang_label: "עב",
    lang_aria: "Switch language to Hebrew",
    call_now: "Call",

    hero_kicker: "FIRE · SKEWERS · WINGS · KOSHER",
    hero_subtitle:
      "A kosher grill at Kerem Junction. Meat over coals, sauces made every morning, delivery across the region.",
    hero_cta_primary: "Start an order",
    hero_cta_secondary: "See the menu",

    section_menu_kicker: "01 / The Menu",
    section_menu_title_head: "The food.",
    section_menu_title_em: "The fire.",
    section_menu_lede:
      "Everything that comes out of the kitchen. Pick a category, or just keep scrolling.",

    section_about_kicker: "02 / The Story",
    section_about_title: "Real coals. No shortcuts.",
    section_about_body:
      "We started as one stand at the junction. Today it's a sit-down room with an open kitchen and four sauces we make ourselves every morning. The meat goes over coals — never a flat-top.",
    section_about_pull:
      "If the sauce isn't gone by closing, we didn't make it fresh enough.",
    about_label_origin: "Location",
    about_label_style: "Style",
    about_value_style: "Meat · Sit-down · Delivery",
    about_label_cert: "Kosher",

    section_delivery_kicker: "03 / Delivery & Pickup",
    section_delivery_title_head: "Order in. Pick up.",
    section_delivery_title_em: "Or sit down.",
    section_delivery_lede: "We deliver across the Kerem Junction area.",
    section_delivery_pickup_h: "Pickup",
    section_delivery_pickup_p: "Usually 15–25 minutes from ordering.",
    section_delivery_delivery_h: "Delivery",
    section_delivery_delivery_p:
      "The fee is set by zone and shown at checkout before you pay.",
    section_delivery_dinein_h: "Dine in",
    section_delivery_dinein_p: "No reservation needed. Just come by.",

    menu_add: "Add",
    menu_added: "Added",
    menu_includes: "Includes",
    menu_currency: "₪",
    menu_choose: "Choose",
    menu_extras: "Extras",

    cart_title: "Your order",
    cart_empty: "Your cart is empty.",
    cart_empty_hint: "Add something from the menu.",
    cart_subtotal: "Subtotal",
    cart_delivery_fee: "Delivery",
    cart_total: "Total",
    cart_checkout: "Continue to checkout",
    cart_back: "Back to cart",
    cart_remove: "Remove",
    cart_qty: "Qty",

    checkout_title: "Order details",
    checkout_name: "Name",
    checkout_phone: "Phone",
    checkout_mode: "How would you like it?",
    checkout_delivery: "Delivery",
    checkout_pickup: "Pickup",
    checkout_address: "Delivery address",
    checkout_zone: "Zone",
    checkout_notes: "Notes for the kitchen",
    checkout_notes_ph: "Allergies, special requests…",
    checkout_submit: "Place order",
    checkout_submitting: "Sending…",
    checkout_pay_note:
      "Simulated payment — no card is charged and nothing is sent anywhere.",

    status_title: "Your order",
    status_order_num: "Order",
    status_placed: "Placed",
    status_eta: "Estimated",
    status_minutes: "min",
    status_items: "Items",
    status_track_hint: "This page updates itself as the order moves along.",
    status_to_kitchen: "Open the kitchen view to advance this order",

    kitchen_title: "Kitchen view",
    kitchen_sub: "What the staff sees behind the door.",
    kitchen_empty: "No active orders.",
    kitchen_empty_hint: "Place an order from the menu and it appears here.",
    kitchen_new: "New",
    kitchen_prep: "Preparing",
    kitchen_out: "Out",
    kitchen_done: "Completed",
    kitchen_advance: "Advance",
    kitchen_cancel: "Cancel",
    kitchen_today: "Today",
    kitchen_orders: "Orders",
    kitchen_revenue: "Revenue",
    kitchen_avg: "Avg / order",

    closed_banner: "We're closed right now",
    closed_shabbat: "Closed for Shabbat",
    closed_holiday: "Closed for the holiday",
    closed_hours: "Outside opening hours",
    closed_reopens: "Reopens",
    open_now: "Open now",

    err_empty_cart: "Your cart is empty.",
    err_invalid_customer: "Please check your name and phone number.",
    err_address_required: "An address is required for delivery.",

    footer_visit: "Visit us",
    footer_kosher_h: "Kosher",
    footer_hours_h: "Hours",
    footer_closed: "Closed",
    footer_demo: "Demo · all data is fictional",

    marquee_words: ["HOT", "COALS", "KOSHER", "FRESH", "KEREM JCT", "FIRE"],
  },
} as const;

// Compile-time check: keys must match across languages.
type StringsHE = typeof STRINGS.he;
type StringsEN = typeof STRINGS.en;
type _SameKeys = keyof StringsHE extends keyof StringsEN
  ? keyof StringsEN extends keyof StringsHE
    ? true
    : false
  : false;
const _keyParity: _SameKeys = true;
void _keyParity;

export type StringKey = keyof StringsHE;

/* =============================================================
   Context + hooks
   ============================================================= */
// Each key resolves to either a string OR readonly string[] (marquee_words).
// The conditional preserves that: `t("hero_subtitle")` is `string`,
// `t("marquee_words")` is `readonly string[]`.
type TValue<K extends StringKey> = StringsHE[K] extends readonly string[]
  ? readonly string[]
  : string;

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: <K extends StringKey>(key: K) => TValue<K>;
  /** localized(item, "name") => item.name_<lang>, falling back to English. */
  localized: <T extends Record<string, unknown>>(obj: T, key: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = "olive-ember.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // SSR default is English so the demo reads immediately for the people this
  // portfolio is aimed at; a stored Hebrew choice is picked up on mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "he") {
        // SSR and first client render are both `en`, so this triggers exactly
        // one extra render to catch up to a persisted Hebrew choice. No
        // hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(stored);
        document.documentElement.lang = stored;
        document.documentElement.dir = stored === "he" ? "rtl" : "ltr";
      }
    } catch {
      // localStorage unavailable — stay on the default.
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
    document.documentElement.lang = l;
    document.documentElement.dir = l === "he" ? "rtl" : "ltr";
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "he" ? "en" : "he");
  }, [lang, setLang]);

  const value = useMemo<LangContextValue>(() => {
    const dict = STRINGS[lang];
    return {
      lang,
      setLang,
      toggle,
      t: (<K extends StringKey>(key: K) => dict[key]) as LangContextValue["t"],
      localized: (obj, key) => {
        const scoped = obj[`${key}_${lang}`];
        if (typeof scoped === "string") return scoped;
        const fallback = obj[`${key}_en`];
        return typeof fallback === "string" ? fallback : "";
      },
    };
  }, [lang, setLang, toggle]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
