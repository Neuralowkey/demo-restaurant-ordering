"use client";

import { useState } from "react";
import { CATEGORIES, itemsInCategory, type CategoryId } from "@/lib/menu";
import { useLang } from "@/lib/i18n";
import { MenuCard } from "./MenuCard";

export function Menu() {
  const { t, localized } = useLang();
  const [active, setActive] = useState<CategoryId | "all">("all");

  const shown =
    active === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === active);

  return (
    <section id="menu" className="border-b border-char-700 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.22em] text-ember-400">
          {t("section_menu_kicker")}
        </p>
        <h2 className="display mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-bone-100 sm:text-5xl">
          {t("section_menu_title_head")}{" "}
          <em className="not-italic text-ember-400">
            {t("section_menu_title_em")}
          </em>
        </h2>
        <p className="mt-4 max-w-2xl text-bone-500">{t("section_menu_lede")}</p>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          <FilterChip
            label={t("nav_menu")}
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={localized(cat, "name")}
              active={active === cat.id}
              onClick={() => setActive(cat.id)}
            />
          ))}
        </div>

        <div className="mt-12 space-y-16">
          {shown.map((cat) => (
            <div key={cat.id}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-bone-100">
                  {localized(cat, "name")}
                </h3>
                <p className="text-sm text-bone-500">
                  {localized(cat, "desc")}
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {itemsInCategory(cat.id).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active
          ? "border-ember-500 bg-ember-500 font-semibold text-char-900"
          : "border-char-600 text-bone-400 hover:border-char-500 hover:text-bone-100"
      }`}
    >
      {label}
    </button>
  );
}
