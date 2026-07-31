"use client";

import { BRAND } from "@/lib/brand";
import { useLang } from "@/lib/i18n";
import { CartButton } from "./CartButton";

export function Header({ open }: { open: boolean }) {
  const { t, lang, toggle, localized } = useLang();

  return (
    <header className="sticky top-[41px] z-40 border-b border-char-700/70 bg-char-900/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-bone-100">
            {localized(BRAND, "name")}
          </span>
          <span
            className={`hidden text-xs sm:inline ${
              open ? "text-olive-300" : "text-bone-500"
            }`}
          >
            {open ? `● ${t("open_now")}` : `○ ${t("closed_banner")}`}
          </span>
        </a>

        <nav className="ms-auto hidden items-center gap-6 text-sm text-bone-400 md:flex">
          <a href="#menu" className="hover:text-bone-100">
            {t("nav_menu")}
          </a>
          <a href="#about" className="hover:text-bone-100">
            {t("nav_about")}
          </a>
          <a href="#delivery" className="hover:text-bone-100">
            {t("nav_delivery")}
          </a>
        </nav>

        <button
          type="button"
          onClick={toggle}
          aria-label={t("lang_aria")}
          className="ms-auto rounded-full border border-char-600 px-3 py-1.5 text-xs font-medium text-bone-400 transition-colors hover:border-char-500 hover:text-bone-100 md:ms-0"
          lang={lang === "he" ? "en" : "he"}
        >
          {t("lang_label")}
        </button>

        <CartButton />
      </div>
    </header>
  );
}
