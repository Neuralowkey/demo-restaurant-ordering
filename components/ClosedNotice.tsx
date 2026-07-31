"use client";

import { useLang } from "@/lib/i18n";
import type { ServiceStatus } from "@/lib/closures";

/** Localised reason for the current closure, or null when we're open. */
export function useClosedReason(status: ServiceStatus): string | null {
  const { t, lang } = useLang();

  if (status.open) return null;
  if (status.reason === "shabbat") return t("closed_shabbat");
  if (status.reason === "holiday") {
    const name = lang === "he" ? status.reason_he : status.reason_en;
    return name ? `${t("closed_holiday")} — ${name}` : t("closed_holiday");
  }
  return t("closed_hours");
}

export function ClosedNotice({ status }: { status: ServiceStatus }) {
  const { t, lang } = useLang();
  const reason = useClosedReason(status);
  if (!reason) return null;

  const reopens = status.reopensAt
    ? new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jerusalem",
      }).format(new Date(status.reopensAt))
    : null;

  return (
    <div className="rounded-card border border-char-600 bg-char-800/80 p-4 text-sm">
      <p className="font-semibold text-bone-100">{reason}</p>
      {reopens && (
        <p className="mt-1 text-bone-500">
          {t("closed_reopens")} {reopens}
        </p>
      )}
      <p className="mt-2 text-xs text-bone-500">
        Closures are computed from the Hebrew calendar — candle lighting to
        havdalah, including yom tov — not from a hardcoded weekly schedule.
      </p>
    </div>
  );
}
