/**
 * Single source of truth for the menu.
 *
 * In the production system this constant is swapped for a fetch against the
 * database without changing a single component — the shape is the contract.
 * For the demo it stays a constant so the app runs with no backend at all.
 *
 * Every item, price and description below is invented for this demo.
 */

export type Lang = "he" | "en";

export type MenuOption = {
  label_he: string;
  label_en: string;
  surcharge?: number;
};

export type MenuModifier = {
  label_he: string;
  label_en: string;
  surcharge: number;
};

export type MenuTag =
  | "signature"
  | "popular"
  | "spicy"
  | "grilled"
  | "lighter"
  | "vegetarian"
  | "sharing"
  | "kids";

export type CategoryId =
  | "mains"
  | "grill"
  | "combos"
  | "salads"
  | "sides"
  | "sauces"
  | "drinks"
  | "platters";

export type Category = {
  id: CategoryId;
  name_he: string;
  name_en: string;
  desc_he: string;
  desc_en: string;
};

export type MenuItem = {
  id: string;
  category: CategoryId;
  name_he: string;
  name_en: string;
  desc_he?: string;
  desc_en?: string;
  /** Whole shekels. */
  price?: number;
  tags?: MenuTag[];
  /** Mutually exclusive choices — the customer picks exactly one. */
  options?: MenuOption[];
  /** Independent toggles — the customer picks any number. */
  modifiers?: MenuModifier[];
  includes_he?: string;
  includes_en?: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "mains",
    name_he: "עיקריות",
    name_en: "Mains",
    desc_he: "הכריכים שבשבילם אנשים עוצרים בצומת.",
    desc_en: "The sandwiches people pull off the highway for.",
  },
  {
    id: "grill",
    name_he: "על האש",
    name_en: "From the Grill",
    desc_he: "פחמים, שיפודים, כנפיים. עשן אמיתי.",
    desc_en: "Coals, skewers, wings. Real smoke.",
  },
  {
    id: "combos",
    name_he: "ארוחות",
    name_en: "Combos",
    desc_he: "כל עיקרית, צ׳יפס ושתייה. ארוחה שלמה.",
    desc_en: "Any main, fries, and a drink. The whole meal.",
  },
  {
    id: "salads",
    name_he: "סלטים",
    name_en: "Salads",
    desc_he: "נחתך בבוקר, נגמר עד הערב.",
    desc_en: "Cut in the morning, gone by evening.",
  },
  {
    id: "sides",
    name_he: "תוספות",
    name_en: "Sides",
    desc_he: "הצ׳יפס שנגמר לפני העיקרית.",
    desc_en: "The fries that disappear before the main does.",
  },
  {
    id: "sauces",
    name_he: "רטבים",
    name_en: "Sauces",
    desc_he: "ארבעה רטבים, כולם מהמטבח. כלום מצנצנת.",
    desc_en: "Four sauces, all from the kitchen. Nothing from a jar.",
  },
  {
    id: "drinks",
    name_he: "שתייה",
    name_en: "Drinks",
    desc_he: "משהו קר ליד משהו חם.",
    desc_en: "Something cold next to something hot.",
  },
  {
    id: "platters",
    name_he: "מגשים",
    name_en: "Platters",
    desc_he: "לשולחן שלם. הזמינו יום מראש.",
    desc_en: "For a full table. Order a day ahead.",
  },
];

const SPICE_LEVELS: MenuOption[] = [
  { label_he: "לא חריף", label_en: "Mild" },
  { label_he: "בינוני", label_en: "Medium" },
  { label_he: "חריף", label_en: "Hot" },
  { label_he: "אש", label_en: "Ember", surcharge: 2 },
];

export const MENU: MenuItem[] = [
  /* ---------------------------------------------------------- mains */
  {
    id: "ember-chicken",
    category: "mains",
    name_he: "כריך עוף אש",
    name_en: "Ember Chicken Sandwich",
    desc_he: "חזה עוף על הפחמים, כרוב חמוץ, רוטב הבית, לחמנייה קלויה.",
    desc_en:
      "Coal-grilled chicken thigh, quick-pickled cabbage, house sauce, toasted bun.",
    price: 52,
    tags: ["signature", "popular", "grilled"],
    options: SPICE_LEVELS,
    modifiers: [
      { label_he: "ביצת עין", label_en: "Fried egg", surcharge: 6 },
      { label_he: "בצל מקורמל", label_en: "Caramelised onion", surcharge: 4 },
      { label_he: "כפול בשר", label_en: "Double meat", surcharge: 18 },
    ],
  },
  {
    id: "olive-burger",
    category: "mains",
    name_he: "המבורגר הבית",
    name_en: "House Burger",
    desc_he: "200 גרם אנטריקוט טחון, עגבנייה, חסה, רוטב זית מעושן.",
    desc_en:
      "200g ground ribeye, tomato, lettuce, smoked-olive aioli on a sesame bun.",
    price: 58,
    tags: ["signature", "popular"],
    options: [
      { label_he: "מדיום", label_en: "Medium" },
      { label_he: "מדיום וול", label_en: "Medium well" },
      { label_he: "וול דאן", label_en: "Well done" },
    ],
    modifiers: [
      { label_he: "פטריות", label_en: "Mushrooms", surcharge: 5 },
      { label_he: "צ׳ילי מתוק", label_en: "Sweet chilli", surcharge: 3 },
      { label_he: "קציצה נוספת", label_en: "Extra patty", surcharge: 22 },
    ],
  },
  {
    id: "schnitzel-baguette",
    category: "mains",
    name_he: "באגט שניצל",
    name_en: "Schnitzel Baguette",
    desc_he: "שניצל פריך, חומוס, סלט ירקות קצוץ, עמבה.",
    desc_en: "Crisp schnitzel, hummus, chopped salad, amba, in a warm baguette.",
    price: 46,
    tags: ["popular"],
    modifiers: [
      { label_he: "חריף", label_en: "Extra spicy", surcharge: 0 },
      { label_he: "בלי עמבה", label_en: "No amba", surcharge: 0 },
      { label_he: "צ׳יפס בפנים", label_en: "Fries inside", surcharge: 4 },
    ],
  },
  {
    id: "portobello-pita",
    category: "mains",
    name_he: "פיתה פורטובלו",
    name_en: "Portobello Pita",
    desc_he: "פטריות פורטובלו על הגריל, טחינה ירוקה, עגבניות צלויות.",
    desc_en: "Grilled portobello, green tahini, blistered tomato, in fresh pita.",
    price: 42,
    tags: ["vegetarian", "lighter", "grilled"],
  },

  /* ---------------------------------------------------------- grill */
  {
    id: "wings-half",
    category: "grill",
    name_he: "כנפיים — חצי מנה",
    name_en: "Wings — Half Order",
    desc_he: "שש כנפיים, מעושנות ואז צרובות.",
    desc_en: "Six wings, smoked then seared.",
    price: 34,
    tags: ["popular", "grilled"],
    options: SPICE_LEVELS,
  },
  {
    id: "wings-full",
    category: "grill",
    name_he: "כנפיים — מנה מלאה",
    name_en: "Wings — Full Order",
    desc_he: "שתים־עשרה כנפיים. תביאו חברים.",
    desc_en: "Twelve wings. Bring a friend.",
    price: 62,
    tags: ["sharing", "grilled"],
    options: SPICE_LEVELS,
  },
  {
    id: "lamb-skewer",
    category: "grill",
    name_he: "שיפוד כבש",
    name_en: "Lamb Skewer",
    desc_he: "כבש טחון, כמון, נענע. שני שיפודים.",
    desc_en: "Ground lamb, cumin, mint. Two skewers.",
    price: 68,
    tags: ["signature", "grilled"],
  },
  {
    id: "chicken-hearts",
    category: "grill",
    name_he: "לבבות עוף",
    name_en: "Chicken Hearts",
    desc_he: "על הפחמים, לימון, פטרוזיליה.",
    desc_en: "Over coals with lemon and parsley.",
    price: 38,
    tags: ["grilled"],
  },

  /* ---------------------------------------------------------- combos */
  {
    id: "combo-classic",
    category: "combos",
    name_he: "ארוחה קלאסית",
    name_en: "Classic Combo",
    desc_he: "כל עיקרית, צ׳יפס בית ושתייה קרה.",
    desc_en: "Any main, house fries, and a cold drink.",
    price: 74,
    tags: ["popular"],
    includes_he: "עיקרית · צ׳יפס · שתייה",
    includes_en: "Main · Fries · Drink",
    options: [
      { label_he: "כריך עוף אש", label_en: "Ember Chicken" },
      { label_he: "המבורגר הבית", label_en: "House Burger", surcharge: 6 },
      { label_he: "באגט שניצל", label_en: "Schnitzel Baguette" },
      { label_he: "פיתה פורטובלו", label_en: "Portobello Pita" },
    ],
  },
  {
    id: "combo-kids",
    category: "combos",
    name_he: "ארוחת ילדים",
    name_en: "Kids Combo",
    desc_he: "נשיכות עוף, צ׳יפס קטן, מיץ.",
    desc_en: "Chicken bites, small fries, juice.",
    price: 42,
    tags: ["kids"],
    includes_he: "נשיכות · צ׳יפס קטן · מיץ",
    includes_en: "Bites · Small fries · Juice",
  },

  /* ---------------------------------------------------------- salads */
  {
    id: "chopped-salad",
    category: "salads",
    name_he: "סלט קצוץ",
    name_en: "Chopped Salad",
    desc_he: "עגבנייה, מלפפון, בצל, פטרוזיליה, לימון, שמן זית.",
    desc_en: "Tomato, cucumber, onion, parsley, lemon, olive oil.",
    price: 28,
    tags: ["lighter", "vegetarian"],
  },
  {
    id: "grilled-eggplant",
    category: "salads",
    name_he: "חציל בגריל",
    name_en: "Grilled Eggplant",
    desc_he: "חציל שרוף, טחינה, רימון.",
    desc_en: "Charred eggplant, tahini, pomegranate.",
    price: 32,
    tags: ["vegetarian", "grilled"],
  },

  /* ---------------------------------------------------------- sides */
  {
    id: "house-fries",
    category: "sides",
    name_he: "צ׳יפס בית",
    name_en: "House Fries",
    desc_he: "מטוגן פעמיים, מלח גס.",
    desc_en: "Twice-fried, coarse salt.",
    price: 22,
    tags: ["popular"],
    modifiers: [
      { label_he: "פפריקה מעושנת", label_en: "Smoked paprika", surcharge: 2 },
      { label_he: "שום ופטרוזיליה", label_en: "Garlic & parsley", surcharge: 3 },
    ],
  },
  {
    id: "onion-rings",
    category: "sides",
    name_he: "טבעות בצל",
    name_en: "Onion Rings",
    price: 24,
    tags: ["vegetarian"],
  },
  {
    id: "warm-pita",
    category: "sides",
    name_he: "פיתה חמה",
    name_en: "Warm Pita",
    desc_he: "שתי פיתות מהטאבון.",
    desc_en: "Two, straight from the taboon.",
    price: 8,
    tags: ["vegetarian"],
  },

  /* ---------------------------------------------------------- sauces */
  {
    id: "sauce-ember",
    category: "sauces",
    name_he: "רוטב אש",
    name_en: "Ember Sauce",
    desc_he: "פלפל מעושן, דבש, חומץ.",
    desc_en: "Smoked pepper, honey, vinegar.",
    price: 6,
    tags: ["signature", "spicy"],
  },
  {
    id: "sauce-tahini",
    category: "sauces",
    name_he: "טחינה ירוקה",
    name_en: "Green Tahini",
    price: 6,
    tags: ["vegetarian"],
  },
  {
    id: "sauce-amba",
    category: "sauces",
    name_he: "עמבה",
    name_en: "Amba",
    price: 6,
    tags: ["vegetarian"],
  },
  {
    id: "sauce-garlic",
    category: "sauces",
    name_he: "שום",
    name_en: "Garlic",
    price: 6,
    tags: ["vegetarian"],
  },

  /* ---------------------------------------------------------- drinks */
  {
    id: "soda",
    category: "drinks",
    name_he: "שתייה קלה",
    name_en: "Soft Drink",
    price: 12,
    options: [
      { label_he: "קולה", label_en: "Cola" },
      { label_he: "קולה זירו", label_en: "Cola Zero" },
      { label_he: "לימונדה", label_en: "Lemonade" },
      { label_he: "סודה", label_en: "Soda" },
    ],
  },
  {
    id: "mint-lemonade",
    category: "drinks",
    name_he: "לימונענע",
    name_en: "Mint Lemonade",
    desc_he: "סחוט טרי, הרבה נענע.",
    desc_en: "Fresh-squeezed, heavy on the mint.",
    price: 16,
    tags: ["popular"],
  },
  {
    id: "bottled-water",
    category: "drinks",
    name_he: "מים",
    name_en: "Bottled Water",
    price: 8,
  },

  /* ---------------------------------------------------------- platters */
  {
    id: "mixed-grill-platter",
    category: "platters",
    name_he: "מגש מעורב",
    name_en: "Mixed Grill Platter",
    desc_he: "שיפודים, כנפיים, שניצל, ארבעה סלטים, פיתות. 8–10 סועדים.",
    desc_en:
      "Skewers, wings, schnitzel, four salads and pita. Serves 8–10.",
    price: 420,
    tags: ["sharing"],
    includes_he: "מוגש קר עם הוראות חימום",
    includes_en: "Delivered cold with reheating instructions",
  },
  {
    id: "salad-platter",
    category: "platters",
    name_he: "מגש סלטים",
    name_en: "Salad Platter",
    desc_he: "שמונה סלטי בית, טחינה, פיתות. 8–10 סועדים.",
    desc_en: "Eight house salads, tahini, pita. Serves 8–10.",
    price: 210,
    tags: ["sharing", "vegetarian"],
  },
];

export const MENU_BY_ID: ReadonlyMap<string, MenuItem> = new Map(
  MENU.map((item) => [item.id, item]),
);

export function itemsInCategory(category: CategoryId): MenuItem[] {
  return MENU.filter((item) => item.category === category);
}
