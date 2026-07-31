"use client";

import Link from "next/link";
import { useOrders } from "@/lib/orders/store";
import { MENU_BY_ID } from "@/lib/menu";
import { formatAgorot, lineSubtotalAgorot } from "@/lib/cart/pricing";
import { useLang } from "@/lib/i18n";
import { customerStepIndex } from "@/lib/orders/types";
import { useHydrated } from "@/lib/useHydrated";

export function OrderTracker({ orderId }: { orderId: string }) {
  const { t, lang, localized } = useLang();
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.id === orderId));

  // Orders live in sessionStorage, so nothing is knowable until rehydration.
  if (!hydrated) {
    return <Shell><p className="text-bone-500">…</p></Shell>;
  }

  if (!order) {
    return (
      <Shell>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-bone-100">
          {t("status_title")}
        </h1>
        <p className="mt-3 text-bone-500">
          This order isn&apos;t in your session — orders in the demo live in the
          browser tab that placed them.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-ember-500 px-5 py-2.5 text-sm font-semibold text-char-900 hover:bg-ember-400"
        >
          {t("hero_cta_primary")}
        </Link>
      </Shell>
    );
  }

  const stepIndex = customerStepIndex(order.status);
  const cancelled = order.status === "cancelled";
  const delivery = order.customer.mode === "delivery";

  const steps = [
    { key: "placed", label: t("status_placed") },
    { key: "preparing", label: t("kitchen_prep") },
    {
      key: "underway",
      label: delivery ? t("kitchen_out") : t("checkout_pickup"),
    },
    { key: "done", label: t("kitchen_done") },
  ];

  const placedAt = new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(order.placedAt));

  return (
    <Shell>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-ember-400">
            {t("status_order_num")} {order.number}
          </p>
          <h1 className="display mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-bone-100">
            {t("status_title")}
          </h1>
        </div>
        <div className="text-end text-sm">
          <p className="text-bone-500">
            {t("status_placed")} {placedAt}
          </p>
          {!cancelled && stepIndex < 3 && (
            <p className="mt-1 text-bone-200">
              {t("status_eta")} ~{order.etaMinutes} {t("status_minutes")}
            </p>
          )}
        </div>
      </div>

      {/* Progress rail */}
      <ol className="mt-10 grid grid-cols-4 gap-2">
        {steps.map((step, i) => {
          const done = !cancelled && i <= stepIndex;
          const current = !cancelled && i === stepIndex;
          return (
            <li key={step.key} className="flex flex-col gap-2">
              <span
                className={`h-1.5 rounded-full transition-colors ${
                  done ? "bg-ember-500" : "bg-char-700"
                } ${current ? "animate-ember-pulse" : ""}`}
              />
              <span
                className={`text-xs ${done ? "text-bone-200" : "text-bone-500"}`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      {cancelled && (
        <p className="mt-6 rounded-card border border-ember-600/50 bg-ember-600/10 px-4 py-3 text-sm text-ember-300">
          {t("kitchen_cancel")}
        </p>
      )}

      <p className="mt-6 text-sm text-bone-500">{t("status_track_hint")}</p>

      {/* Items */}
      <div className="mt-10 rounded-card border border-char-700 bg-char-850">
        <h2 className="border-b border-char-700 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-bone-400">
          {t("status_items")}
        </h2>
        <ul className="divide-y divide-char-700">
          {order.lines.map((line) => {
            const item = MENU_BY_ID.get(line.itemId);
            if (!item) return null;
            const extras = [
              line.selection.optionLabel,
              ...(line.selection.modifierLabels ?? []),
            ].filter(Boolean);

            return (
              <li key={line.key} className="flex gap-4 px-5 py-3">
                <span className="tabular-nums text-bone-500">{line.qty}×</span>
                <div className="min-w-0 flex-1">
                  <p className="text-bone-100">{localized(item, "name")}</p>
                  {extras.length > 0 && (
                    <p className="mt-0.5 text-xs text-bone-500">
                      {extras.join(" · ")}
                    </p>
                  )}
                </div>
                <span className="tabular-nums text-bone-300">
                  {formatAgorot(lineSubtotalAgorot(item, line))}
                </span>
              </li>
            );
          })}
        </ul>

        <dl className="space-y-1 border-t border-char-700 px-5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-bone-500">{t("cart_subtotal")}</dt>
            <dd className="tabular-nums text-bone-300">
              {formatAgorot(order.subtotalAgorot)}
            </dd>
          </div>
          {order.deliveryFeeAgorot > 0 && (
            <div className="flex justify-between">
              <dt className="text-bone-500">{t("cart_delivery_fee")}</dt>
              <dd className="tabular-nums text-bone-300">
                {formatAgorot(order.deliveryFeeAgorot)}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-char-700 pt-2">
            <dt className="text-bone-200">{t("cart_total")}</dt>
            <dd className="text-lg font-semibold tabular-nums text-bone-100">
              {formatAgorot(order.totalAgorot)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Fulfilment */}
      <div className="mt-6 rounded-card border border-char-700 bg-char-850 px-5 py-4 text-sm">
        <p className="text-bone-200">
          {delivery ? t("checkout_delivery") : t("checkout_pickup")} ·{" "}
          {order.customer.name}
        </p>
        {order.customer.address && (
          <p className="mt-1 text-bone-500">{order.customer.address}</p>
        )}
        {order.customer.notes && (
          <p className="mt-2 text-bone-500">
            <span className="text-bone-400">{t("checkout_notes")}:</span>{" "}
            {order.customer.notes}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/kitchen"
          className="rounded-full bg-char-700 px-5 py-2.5 text-sm font-semibold text-bone-100 hover:bg-char-600"
        >
          {t("status_to_kitchen")} →
        </Link>
        <Link
          href="/"
          className="rounded-full border border-char-600 px-5 py-2.5 text-sm text-bone-300 hover:border-bone-500 hover:text-bone-100"
        >
          {t("nav_menu")}
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
      {children}
    </main>
  );
}
