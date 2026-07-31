"use client";

import { useLang } from "@/lib/i18n";

export function Marquee() {
  const { t } = useLang();
  const words = t("marquee_words");
  // Doubled so the -50% translate loops seamlessly.
  const strip = [...words, ...words];

  return (
    <div
      className="overflow-hidden border-y border-char-700 bg-char-850 py-4"
      aria-hidden
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap ps-8">
        {strip.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-char-600"
          >
            {word}
            <span className="ms-8 text-ember-600">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
