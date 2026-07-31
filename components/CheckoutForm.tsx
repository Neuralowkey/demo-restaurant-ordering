"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/store";
import { useOrders } from "@/lib/orders/store";
import { cartSubtotalAgorot, formatAgorot } from "@/lib/cart/pricing";
import { DELIVERY_ZONES, zoneFeeAgorot } from "@/lib/delivery";
import { useLang } from "@/lib/i18n";
import type { FulfilmentMode } from "@/lib/cart/types";

export function CheckoutForm() {
  const { t, localized } = useLang();
  const router = useRouter();

  const lines = useCart((s) => s.lines);
  const setView = useCart((s) => s.setView);
  const clear = useCart((s) => s.clear);
  const closeCart = useCart((s) => s.close);
  const place = useOrders((s) => s.place);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<FulfilmentMode>("delivery");
  const [address, setAddress] = useState("");
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotalAgorot(lines);
  const fee = mode === "delivery" ? zoneFeeAgorot(zoneId) : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) return setError(t("err_empty_cart"));
    if (name.trim().length < 2 || phone.trim().length < 6) {
      return setError(t("err_invalid_customer"));
    }
    if (mode === "delivery" && address.trim().length < 4) {
      return setError(t("err_address_required"));
    }

    setSubmitting(true);
    const order = place(lines, {
      name: name.trim(),
      phone: phone.trim(),
      mode,
      address: mode === "delivery" ? address.trim() : undefined,
      zoneId: mode === "delivery" ? zoneId : undefined,
      notes: notes.trim() || undefined,
    });

    clear();
    closeCart();
    router.push(`/order/${order.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <Field label={t("checkout_name")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-lg border border-char-600 bg-char-800 px-3 py-2 text-bone-100 placeholder:text-bone-500"
            placeholder="Dana Levi"
          />
        </Field>

        <Field label={t("checkout_phone")}>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-char-600 bg-char-800 px-3 py-2 text-bone-100 placeholder:text-bone-500"
            placeholder="050-000-0000"
          />
        </Field>

        <fieldset>
          <legend className="text-xs font-semibold tracking-wide text-bone-400">
            {t("checkout_mode")}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["delivery", "pickup"] as const).map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
                  mode === m
                    ? "border-ember-500 bg-ember-500/15 font-semibold text-ember-300"
                    : "border-char-600 text-bone-400 hover:border-char-500"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  className="sr-only"
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                {m === "delivery" ? t("checkout_delivery") : t("checkout_pickup")}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "delivery" && (
          <>
            <Field label={t("checkout_address")}>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-char-600 bg-char-800 px-3 py-2 text-bone-100 placeholder:text-bone-500"
                placeholder="4 Ha'Zayit Street, apt 3"
              />
            </Field>

            <Field label={t("checkout_zone")}>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full rounded-lg border border-char-600 bg-char-800 px-3 py-2 text-bone-100"
              >
                {DELIVERY_ZONES.map((z) => (
                  <option key={z.id} value={z.id} className="bg-char-800">
                    {localized(z, "name")} — {formatAgorot(z.feeAgorot)}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        <Field label={t("checkout_notes")}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-char-600 bg-char-800 px-3 py-2 text-bone-100 placeholder:text-bone-500"
            placeholder={t("checkout_notes_ph")}
          />
        </Field>

        {error && (
          <p role="alert" className="rounded-lg bg-ember-600/20 px-3 py-2 text-sm text-ember-300">
            {error}
          </p>
        )}
      </div>

      <footer className="space-y-3 border-t border-char-700 px-5 py-4">
        <dl className="space-y-1 text-sm">
          <Row label={t("cart_subtotal")} value={formatAgorot(subtotal)} />
          {mode === "delivery" && (
            <Row label={t("cart_delivery_fee")} value={formatAgorot(fee)} />
          )}
          <div className="flex items-baseline justify-between border-t border-char-700 pt-2">
            <dt className="text-bone-200">{t("cart_total")}</dt>
            <dd className="text-lg font-semibold tabular-nums text-bone-100">
              {formatAgorot(subtotal + fee)}
            </dd>
          </div>
        </dl>

        <p className="text-xs text-bone-500">{t("checkout_pay_note")}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("cart")}
            className="rounded-full border border-char-600 px-4 py-3 text-sm text-bone-300 hover:border-bone-500 hover:text-bone-100"
          >
            {t("cart_back")}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-char-900 transition-colors hover:bg-ember-400 disabled:bg-char-700 disabled:text-bone-500"
          >
            {submitting ? t("checkout_submitting") : t("checkout_submit")}
          </button>
        </div>
      </footer>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-wide text-bone-400">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-bone-500">{label}</dt>
      <dd className="tabular-nums text-bone-300">{value}</dd>
    </div>
  );
}
