"use client";

import { useState } from "react";
import type { MenuItem, MenuTag } from "@/lib/menu";
import type { CartSelection } from "@/lib/cart/types";
import { useCart } from "@/lib/cart/store";
import { useLang } from "@/lib/i18n";
import { unitPrice } from "@/lib/cart/pricing";

const TAG_LABEL: Record<MenuTag, { he: string; en: string }> = {
  signature: { he: "מנת דגל", en: "Signature" },
  popular: { he: "פופולרי", en: "Popular" },
  spicy: { he: "חריף", en: "Spicy" },
  grilled: { he: "על האש", en: "Grilled" },
  lighter: { he: "קליל", en: "Lighter" },
  vegetarian: { he: "צמחוני", en: "Vegetarian" },
  sharing: { he: "לשיתוף", en: "To share" },
  kids: { he: "ילדים", en: "Kids" },
};

export function MenuCard({ item }: { item: MenuItem }) {
  const { t, lang, localized } = useLang();
  const add = useCart((s) => s.add);

  const needsChoice = Boolean(item.options?.length || item.modifiers?.length);
  const [expanded, setExpanded] = useState(false);
  const [optionIndex, setOptionIndex] = useState(0);
  const [modifierOn, setModifierOn] = useState<boolean[]>(
    () => (item.modifiers ?? []).map(() => false),
  );
  const [justAdded, setJustAdded] = useState(false);

  const option = item.options?.[optionIndex];
  const chosenModifiers = (item.modifiers ?? []).filter(
    (_, i) => modifierOn[i],
  );

  const selection: CartSelection = {
    optionLabel: option?.label_en,
    optionSurcharge: option?.surcharge ?? 0,
    modifierLabels: chosenModifiers.map((m) => m.label_en),
    modifierSurcharge: chosenModifiers.reduce((n, m) => n + m.surcharge, 0),
  };

  const price = unitPrice(item, selection);

  function handleAdd() {
    if (needsChoice && !expanded) {
      setExpanded(true);
      return;
    }
    add(item.id, needsChoice ? selection : {});
    setExpanded(false);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className="flex flex-col rounded-card border border-char-700 bg-char-850 p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-char-600 hover:shadow-[0_16px_40px_-20px_rgba(242,98,29,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-bone-100">
          {localized(item, "name")}
        </h3>
        <span className="shrink-0 tabular-nums text-bone-200">
          {t("menu_currency")}
          {item.price ?? 0}
        </span>
      </div>

      {localized(item, "desc") && (
        <p className="mt-2 text-sm leading-relaxed text-bone-500">
          {localized(item, "desc")}
        </p>
      )}

      {item.includes_en && (
        <p className="mt-2 text-xs text-bone-500">
          <span className="text-bone-400">{t("menu_includes")}:</span>{" "}
          {localized(item, "includes")}
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className={`rounded-full border px-2 py-0.5 text-[11px] ${
                tag === "signature"
                  ? "border-ember-500/50 text-ember-300"
                  : "border-char-600 text-bone-400"
              }`}
            >
              {TAG_LABEL[tag][lang]}
            </li>
          ))}
        </ul>
      )}

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-char-700 pt-4">
          {item.options && item.options.length > 0 && (
            <fieldset>
              <legend className="text-xs font-semibold tracking-wide text-bone-400">
                {t("menu_choose")}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.options.map((opt, i) => (
                  <label
                    key={opt.label_en}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      i === optionIndex
                        ? "border-ember-500 bg-ember-500/15 text-ember-300"
                        : "border-char-600 text-bone-400 hover:border-char-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${item.id}-option`}
                      className="sr-only"
                      checked={i === optionIndex}
                      onChange={() => setOptionIndex(i)}
                    />
                    {localized(opt, "label")}
                    {opt.surcharge ? ` +${opt.surcharge}` : ""}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {item.modifiers && item.modifiers.length > 0 && (
            <fieldset>
              <legend className="text-xs font-semibold tracking-wide text-bone-400">
                {t("menu_extras")}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.modifiers.map((mod, i) => (
                  <label
                    key={mod.label_en}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      modifierOn[i]
                        ? "border-olive-500 bg-olive-500/15 text-olive-300"
                        : "border-char-600 text-bone-400 hover:border-char-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={modifierOn[i]}
                      onChange={() =>
                        setModifierOn((prev) =>
                          prev.map((v, j) => (j === i ? !v : v)),
                        )
                      }
                    />
                    {localized(mod, "label")}
                    {mod.surcharge ? ` +${mod.surcharge}` : ""}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className={`mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
          justAdded
            ? "bg-olive-500 text-char-900"
            : "bg-char-700 text-bone-100 hover:bg-ember-500 hover:text-char-900"
        }`}
      >
        {justAdded
          ? t("menu_added")
          : expanded || !needsChoice
            ? `${t("menu_add")} · ${t("menu_currency")}${price}`
            : t("menu_add")}
      </button>
    </article>
  );
}
