"use client";

import { BRAND } from "@/lib/brand";
import { useLang } from "@/lib/i18n";

export function About() {
  const { t, localized } = useLang();

  return (
    <section id="about" className="border-b border-char-700 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-ember-400">
            {t("section_about_kicker")}
          </p>
          <h2 className="display mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-bone-100 sm:text-5xl">
            {t("section_about_title")}
          </h2>
          <p className="mt-6 leading-relaxed text-bone-400">
            {t("section_about_body")}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-8">
          <blockquote className="border-s-2 border-ember-500 ps-5">
            <p className="font-[family-name:var(--font-display)] text-2xl leading-snug text-bone-200">
              {t("section_about_pull")}
            </p>
          </blockquote>

          <dl className="grid grid-cols-2 gap-6 border-t border-char-700 pt-8 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-bone-500">{t("about_label_origin")}</dt>
              <dd className="mt-1 text-bone-100">{localized(BRAND, "city")}</dd>
            </div>
            <div>
              <dt className="text-bone-500">{t("about_label_style")}</dt>
              <dd className="mt-1 text-bone-100">{t("about_value_style")}</dd>
            </div>
            <div>
              <dt className="text-bone-500">{t("about_label_cert")}</dt>
              <dd className="mt-1 text-bone-100">
                {localized(BRAND, "kosher")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
