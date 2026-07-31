"use client";

import { useCart } from "@/lib/cart/store";
import { cartItemCount, cartSubtotalAgorot, formatAgorot } from "@/lib/cart/pricing";
import { useLang } from "@/lib/i18n";

export function CartButton() {
  const { t } = useLang();
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);

  const count = cartItemCount(lines);

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-4 py-2 text-sm font-semibold text-char-900 transition-colors hover:bg-ember-400"
    >
      <span>{t("cart_title")}</span>
      {count > 0 && (
        <span className="rounded-full bg-char-900/25 px-2 py-0.5 text-xs tabular-nums">
          {count} · {formatAgorot(cartSubtotalAgorot(lines))}
        </span>
      )}
    </button>
  );
}
