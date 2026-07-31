"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart/store";
import { MENU_BY_ID } from "@/lib/menu";
import {
  cartSubtotalAgorot,
  lineSubtotalAgorot,
  formatAgorot,
} from "@/lib/cart/pricing";
import { useLang } from "@/lib/i18n";
import type { ServiceStatus } from "@/lib/closures";
import { CheckoutForm } from "./CheckoutForm";
import { useClosedReason } from "./ClosedNotice";

export function CartDrawer({ status }: { status: ServiceStatus }) {
  const { t, localized } = useLang();
  const isOpen = useCart((s) => s.isOpen);
  const view = useCart((s) => s.view);
  const lines = useCart((s) => s.lines);
  const close = useCart((s) => s.close);
  const setView = useCart((s) => s.setView);
  const setQty = useCart((s) => s.setQty);

  const panelRef = useRef<HTMLDivElement>(null);
  const closedReason = useClosedReason(status);

  // Escape closes; body scroll is locked while the panel is up.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen, view]);

  if (!isOpen) return null;

  const subtotal = cartSubtotalAgorot(lines);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-char-900/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("cart_title")}
        tabIndex={-1}
        className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-char-700 bg-char-850 shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-char-700 px-5 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-bone-100">
            {view === "cart" ? t("cart_title") : t("checkout_title")}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-full px-3 py-1 text-sm text-bone-500 hover:text-bone-100"
          >
            ✕
          </button>
        </header>

        {view === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-bone-200">{t("cart_empty")}</p>
                  <p className="mt-1 text-sm text-bone-500">
                    {t("cart_empty_hint")}
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => {
                    const item = MENU_BY_ID.get(line.itemId);
                    if (!item) return null;
                    const extras = [
                      line.selection.optionLabel,
                      ...(line.selection.modifierLabels ?? []),
                    ].filter(Boolean);

                    return (
                      <li
                        key={line.key}
                        className="flex gap-3 rounded-card border border-char-700 bg-char-800 p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-bone-100">
                            {localized(item, "name")}
                          </p>
                          {extras.length > 0 && (
                            <p className="mt-0.5 text-xs text-bone-500">
                              {extras.join(" · ")}
                            </p>
                          )}

                          <div className="mt-2 flex items-center gap-2">
                            <QtyButton
                              label="−"
                              onClick={() => setQty(line.key, line.qty - 1)}
                            />
                            <span className="w-6 text-center text-sm tabular-nums text-bone-200">
                              {line.qty}
                            </span>
                            <QtyButton
                              label="+"
                              onClick={() => setQty(line.key, line.qty + 1)}
                            />
                            <button
                              type="button"
                              onClick={() => setQty(line.key, 0)}
                              className="ms-2 text-xs text-bone-500 underline-offset-2 hover:text-ember-400 hover:underline"
                            >
                              {t("cart_remove")}
                            </button>
                          </div>
                        </div>

                        <span className="shrink-0 tabular-nums text-bone-200">
                          {formatAgorot(lineSubtotalAgorot(item, line))}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <footer className="border-t border-char-700 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-bone-400">{t("cart_subtotal")}</span>
                <span className="text-lg font-semibold tabular-nums text-bone-100">
                  {formatAgorot(subtotal)}
                </span>
              </div>

              {closedReason && (
                <p className="mt-3 rounded-lg border border-char-600 bg-char-800 px-3 py-2 text-xs text-bone-400">
                  {closedReason} — {t("checkout_pay_note")}
                </p>
              )}

              <button
                type="button"
                disabled={lines.length === 0}
                onClick={() => setView("checkout")}
                className="mt-4 w-full rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-char-900 transition-colors hover:bg-ember-400 disabled:cursor-not-allowed disabled:bg-char-700 disabled:text-bone-500"
              >
                {t("cart_checkout")}
              </button>
            </footer>
          </>
        ) : (
          <CheckoutForm />
        )}
      </div>
    </div>
  );
}

function QtyButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="size-7 rounded-full border border-char-600 text-bone-300 transition-colors hover:border-bone-500 hover:text-bone-100"
    >
      {label}
    </button>
  );
}
