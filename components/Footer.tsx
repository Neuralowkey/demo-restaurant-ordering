"use client";

import { BRAND, HOURS } from "@/lib/brand";
import { useLang } from "@/lib/i18n";
import type { ServiceStatus } from "@/lib/closures";

const DAY_NAMES = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  he: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
} as const;

export function Footer({ status }: { status: ServiceStatus }) {
  const { t, lang, localized } = useLang();

  const fmt = new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jerusalem",
  });

  return (
    <footer className="bg-char-850 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-bone-100">
            {localized(BRAND, "name")}
          </h2>
          <p className="mt-3 text-sm text-bone-500">
            {localized(BRAND, "street")}
            <br />
            {localized(BRAND, "city")}
            <br />
            <span className="tabular-nums">{BRAND.phoneDisplay}</span>
          </p>
          <p className="mt-4 text-xs text-bone-500">
            <span className="text-bone-400">{t("footer_kosher_h")}:</span>{" "}
            {localized(BRAND, "kosher")}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-bone-400">
            {t("footer_hours_h")}
          </h3>
          <dl className="mt-3 space-y-1 text-sm">
            {HOURS.map((h) => (
              <div key={h.day} className="flex justify-between gap-4">
                <dt className="text-bone-500">{DAY_NAMES[lang][h.day]}</dt>
                <dd className="tabular-nums text-bone-300">
                  {h.close === null
                    ? t("footer_closed")
                    : `${String(h.open).padStart(2, "0")}:00–${String(h.close).padStart(2, "0")}:00`}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-bone-400">
            {t("closed_shabbat")} / {t("closed_holiday")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {status.upcoming.slice(0, 4).map((w) => (
              <li key={w.start} className="flex justify-between gap-4">
                <span className="text-bone-500">
                  {lang === "he" ? w.reason_he : w.reason_en}
                </span>
                <span className="tabular-nums text-bone-300">
                  {fmt.format(new Date(w.start))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-char-700 px-4 pt-6 sm:px-6">
        <p className="text-xs text-bone-500">{t("footer_demo")}</p>
      </div>
    </footer>
  );
}
