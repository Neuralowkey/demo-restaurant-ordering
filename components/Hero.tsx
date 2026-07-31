"use client";

import { BRAND } from "@/lib/brand";
import { useLang } from "@/lib/i18n";
import type { ServiceStatus } from "@/lib/closures";
import { ClosedNotice } from "./ClosedNotice";

export function Hero({ status }: { status: ServiceStatus }) {
  const { t, localized } = useLang();

  return (
    <section id="top" className="relative overflow-hidden border-b border-char-700">
      {/* Ember glow behind the type — the only "image" the page needs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grain"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 110%, rgba(242,98,29,0.30) 0%, rgba(242,98,29,0.08) 42%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-xs font-semibold tracking-[0.22em] text-ember-400">
          {t("hero_kicker")}
        </p>

        <h1 className="display mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[0.95] tracking-tight text-bone-100 sm:text-7xl lg:text-8xl">
          {localized(BRAND, "name")}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone-400">
          {t("hero_subtitle")}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#menu"
            className="rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-char-900 transition-colors hover:bg-ember-400"
          >
            {t("hero_cta_primary")}
          </a>
          <a
            href="#menu"
            className="rounded-full border border-char-600 px-6 py-3 text-sm font-semibold text-bone-200 transition-colors hover:border-bone-500 hover:text-bone-100"
          >
            {t("hero_cta_secondary")}
          </a>
        </div>

        {!status.open && (
          <div className="mt-8 max-w-xl">
            <ClosedNotice status={status} />
          </div>
        )}
      </div>
    </section>
  );
}
