"use client";

import Link from "next/link";
import { useOrders } from "@/lib/orders/store";
import { MENU_BY_ID } from "@/lib/menu";
import { formatAgorot } from "@/lib/cart/pricing";
import { useLang } from "@/lib/i18n";
import { useHydrated } from "@/lib/useHydrated";
import { useNow } from "@/lib/useNow";
import { isActive, nextStatus, type Order, type OrderStatus } from "@/lib/orders/types";

const COLUMNS: { status: OrderStatus[]; key: "new" | "prep" | "out" }[] = [
  { key: "new", status: ["placed"] },
  { key: "prep", status: ["preparing"] },
  { key: "out", status: ["ready", "out_for_delivery"] },
];

export function KitchenBoard() {
  const { t } = useLang();
  const hydrated = useHydrated();
  const orders = useOrders((s) => s.orders);
  const clearAll = useOrders((s) => s.clearAll);

  const active = orders.filter(isActive);
  const completed = orders.filter((o) => o.status === "completed");

  const revenue = completed.reduce((n, o) => n + o.totalAgorot, 0);
  const avg = completed.length ? Math.round(revenue / completed.length) : 0;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-ember-400">
            {t("kitchen_title")}
          </p>
          <h1 className="display mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-bone-100">
            {t("kitchen_sub")}
          </h1>
        </div>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-full border border-char-600 px-4 py-2 text-xs text-bone-500 hover:border-bone-500 hover:text-bone-200"
          >
            Reset board
          </button>
        )}
      </div>

      {/* Day summary */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label={`${t("kitchen_today")} · ${t("kitchen_orders")}`} value={String(completed.length)} />
        <Stat label={t("kitchen_revenue")} value={formatAgorot(revenue)} />
        <Stat label={t("kitchen_avg")} value={formatAgorot(avg)} />
      </dl>

      {!hydrated ? null : active.length === 0 && completed.length === 0 ? (
        <div className="mt-12 rounded-card border border-dashed border-char-600 px-6 py-20 text-center">
          <p className="text-bone-200">{t("kitchen_empty")}</p>
          <p className="mt-1 text-sm text-bone-500">{t("kitchen_empty_hint")}</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-ember-500 px-5 py-2.5 text-sm font-semibold text-char-900 hover:bg-ember-400"
          >
            {t("hero_cta_primary")}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {COLUMNS.map((col) => {
              const inCol = active.filter((o) => col.status.includes(o.status));
              return (
                <section key={col.key}>
                  <h2 className="flex items-baseline justify-between border-b border-char-700 pb-2 text-xs font-semibold uppercase tracking-wide text-bone-400">
                    <span>
                      {col.key === "new"
                        ? t("kitchen_new")
                        : col.key === "prep"
                          ? t("kitchen_prep")
                          : t("kitchen_out")}
                    </span>
                    <span className="tabular-nums text-bone-500">
                      {inCol.length}
                    </span>
                  </h2>

                  <ul className="mt-4 space-y-3">
                    {inCol.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          {completed.length > 0 && (
            <section className="mt-14">
              <h2 className="border-b border-char-700 pb-2 text-xs font-semibold uppercase tracking-wide text-bone-400">
                {t("kitchen_done")}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {completed.map((o) => (
                  <li
                    key={o.id}
                    className="rounded-full border border-char-700 px-3 py-1 text-xs text-bone-500"
                  >
                    {o.number} · {formatAgorot(o.totalAgorot)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { t, localized } = useLang();
  const advance = useOrders((s) => s.advance);
  const cancel = useOrders((s) => s.cancel);

  // A ticket that has been up for 12 minutes should say so without waiting for
  // the store to change, so the board re-reads the clock every half minute.
  const now = useNow(30_000);
  const waitingMin = Math.floor((now - order.placedAt) / 60000);
  const hot = waitingMin >= 12;

  return (
    <li className="rounded-card border border-char-700 bg-char-850 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-bone-100">
          {order.number}
        </span>
        <span
          className={`text-xs tabular-nums ${hot ? "text-ember-400" : "text-bone-500"}`}
        >
          {waitingMin} {t("status_minutes")}
        </span>
      </div>

      <p className="mt-1 text-xs text-bone-500">
        {order.customer.mode === "delivery"
          ? t("checkout_delivery")
          : t("checkout_pickup")}{" "}
        · {order.customer.name}
      </p>

      <ul className="mt-3 space-y-1 text-sm">
        {order.lines.map((line) => {
          const item = MENU_BY_ID.get(line.itemId);
          if (!item) return null;
          const extras = [
            line.selection.optionLabel,
            ...(line.selection.modifierLabels ?? []),
          ].filter(Boolean);

          return (
            <li key={line.key} className="flex gap-2">
              <span className="tabular-nums text-bone-500">{line.qty}×</span>
              <span className="min-w-0 flex-1 text-bone-200">
                {localized(item, "name")}
                {extras.length > 0 && (
                  <span className="block text-xs text-ember-300/80">
                    {extras.join(" · ")}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {order.customer.notes && (
        <p className="mt-3 rounded-lg bg-char-800 px-3 py-2 text-xs text-bone-400">
          {order.customer.notes}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => advance(order.id)}
          disabled={!nextStatus(order)}
          className="flex-1 rounded-full bg-ember-500 px-4 py-2 text-xs font-semibold text-char-900 transition-colors hover:bg-ember-400 disabled:bg-char-700 disabled:text-bone-500"
        >
          {t("kitchen_advance")} →
        </button>
        <button
          type="button"
          onClick={() => cancel(order.id)}
          className="rounded-full border border-char-600 px-3 py-2 text-xs text-bone-500 hover:border-ember-600 hover:text-ember-400"
        >
          {t("kitchen_cancel")}
        </button>
      </div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-char-700 bg-char-850 px-5 py-4">
      <dt className="text-xs uppercase tracking-wide text-bone-500">{label}</dt>
      <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-bone-100">
        {value}
      </dd>
    </div>
  );
}
