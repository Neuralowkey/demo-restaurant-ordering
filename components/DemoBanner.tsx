"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Storefront" },
  { href: "/kitchen", label: "Kitchen view" },
];

/**
 * Sits above everything, on every page. Two jobs: say plainly that the data is
 * invented, and give a visitor who lands mid-flow a way back out.
 */
export function DemoBanner() {
  const pathname = usePathname();

  return (
    <div
      dir="ltr"
      className="sticky top-0 z-50 border-b border-char-700 bg-char-850/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-xs sm:px-6">
        <span className="inline-flex items-center gap-2 font-medium tracking-wide text-ember-400">
          <span className="inline-block size-1.5 rounded-full bg-ember-500 animate-ember-pulse" />
          DEMO
        </span>

        <p className="text-bone-500">
          A portfolio build. Every dish, price, customer and order is invented.
        </p>

        <nav className="ms-auto flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1 transition-colors ${
                  active
                    ? "bg-char-700 text-bone-100"
                    : "text-bone-500 hover:text-bone-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
