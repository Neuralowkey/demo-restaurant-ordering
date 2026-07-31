"use client";

import { useLang } from "@/lib/i18n";
import { DELIVERY_ZONES } from "@/lib/delivery";
import { formatAgorot } from "@/lib/cart/pricing";

export function Delivery() {
  const { t, localized } = useLang();

  const modes = [
    {
      h: t("section_delivery_pickup_h"),
      p: t("section_delivery_pickup_p"),
    },
    {
      h: t("section_delivery_delivery_h"),
      p: t("section_delivery_delivery_p"),
    },
    {
      h: t("section_delivery_dinein_h"),
      p: t("section_delivery_dinein_p"),
    },
  ];

  return (
    <section id="delivery" className="border-b border-char-700 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.22em] text-ember-400">
          {t("section_delivery_kicker")}
        </p>
        <h2 className="display mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-bone-100 sm:text-5xl">
          {t("section_delivery_title_head")}{" "}
          <em className="not-italic text-ember-400">
            {t("section_delivery_title_em")}
          </em>
        </h2>
        <p className="mt-4 text-bone-500">{t("section_delivery_lede")}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {modes.map((m) => (
            <div
              key={m.h}
              className="rounded-card border border-char-700 bg-char-850 p-6"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-bone-100">
                {m.h}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-500">{m.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-card border border-char-700">
          <table className="w-full text-sm">
            <thead className="bg-char-800 text-start text-xs uppercase tracking-wide text-bone-500">
              <tr>
                <th scope="col" className="px-5 py-3 text-start font-medium">
                  {t("checkout_zone")}
                </th>
                <th scope="col" className="px-5 py-3 text-end font-medium">
                  {t("cart_delivery_fee")}
                </th>
                <th scope="col" className="px-5 py-3 text-end font-medium">
                  {t("status_eta")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-char-700 bg-char-850">
              {DELIVERY_ZONES.map((z) => (
                <tr key={z.id}>
                  <td className="px-5 py-3 text-bone-200">
                    {localized(z, "name")}
                  </td>
                  <td className="px-5 py-3 text-end tabular-nums text-bone-300">
                    {formatAgorot(z.feeAgorot)}
                  </td>
                  <td className="px-5 py-3 text-end tabular-nums text-bone-500">
                    +{z.driveMinutes} {t("status_minutes")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
