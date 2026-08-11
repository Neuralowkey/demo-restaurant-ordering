<div align="right" lang="he">ב״ה</div>

# Olive & Ember — a restaurant ordering & delivery system

**Colin Olivier · 2026 · Next.js 16, React 19, TypeScript, Tailwind 4**

![CI](https://github.com/Neuralowkey/demo-restaurant-ordering/actions/workflows/ci.yml/badge.svg)

**[▶ Open the live demo](https://demo-restaurant-ordering.vercel.app)** · no login, nothing to install

A working demo of an ordering and delivery system for an independent restaurant:
bilingual menu, cart with per-item options, checkout with zone-priced delivery, a live
order tracker, and the kitchen board the staff works from.

> **Olive & Ember is fictional.** This demo is a portfolio rebuild of a system I built for
> a real restaurant. Every dish, price, phone number, address, customer and order here was
> invented for the demo. No client data, branding, or code history is carried over.

## Try it in about a minute

1. Add something from the menu — the signature items have spice levels and extras that
   change the price.
2. Check out as **delivery** and pick a zone. The fee and the ETA both move.
3. You land on the order tracker. Leave it open: the order advances on its own.
4. Open **Kitchen view** in the demo banner to see the same order from behind the counter,
   and push it through the stages yourself.

Everything runs in your browser tab. Nothing is sent anywhere and no card is charged.

## What it demonstrates

**Bilingual from the data layer up, not bolted on.** Menu items, categories, delivery
zones and UI strings all carry `_en`/`_he` variants, and one `localized(obj, "name")`
helper resolves them. Switching language flips `dir` to RTL and the whole layout mirrors —
including the cart drawer, which slides from the correct side in both directions. The two
string dictionaries are checked for key parity **at compile time**, so a string added to
one language fails the build until it exists in the other.

**The Hebrew calendar decides when the restaurant is closed.** Opening hours are not a
hardcoded weekly table. `lib/closures.ts` computes candle-lighting → havdalah windows from
`@hebcal/core`, so Shabbat and every yom tov close ordering automatically, at the right
minute, years ahead. Two things this gets right that a naive implementation does not:

- A **two-day yom tov** produces one continuous closure, not two overlapping ones. The
  inner candle lighting is skipped rather than opening a second nested window.
- A plain Shabbat next to a **fast day** is still labelled "Shabbat". Timed events in the
  calendar stream (`Fast begins`/`Fast ends`, a second lighting) are distinguished from
  all-day chag markers, which is what makes the label correct.

Both are pinned by tests in `lib/closures.test.ts`.

**Money is never a float.** Prices are whole shekels in the menu, but every total is summed
as integer agorot and formatted once at the edge. Option and modifier surcharges compose
into a single line price, and the same function computes the cart, the checkout total and
the order record — so the three can't drift.

**Cart lines are identified by content, not position.** An Ember Chicken with *Hot + fried
egg* and one with *Hot* are different lines; adding the same combination twice increments a
quantity instead of appending a duplicate. The key is an order-insensitive hash of the item
and its selections. Lines for items that have left the menu are dropped on rehydration
rather than being carried to checkout.

**One order lifecycle, two vocabularies.** The kitchen sees `placed → preparing → ready |
out_for_delivery → completed`; the customer sees four steps with `ready` and
`out_for_delivery` collapsed into one, because a pickup order is never "on the way" and a
delivery order is never "waiting at the counter". The status machine is one function.

## How the demo differs from the production system

The point of this repo is to be clickable with zero setup, so the persistence and transport
layers are stubbed — deliberately, and at a seam that already existed:

| | Production | This demo |
|---|---|---|
| Orders | Postgres, via server actions | zustand store in `sessionStorage` |
| Kitchen board | websocket subscription | same store, shared across the session |
| Order progress | staff press the button | staff press the button, **plus** a timer that advances orders so the tracker is visibly alive |
| Closures | Hebcal **web API**, cached 6h, fails closed | `@hebcal/core` computed locally — no network dependency |
| Payment | real processor | simulated; no card fields exist |
| Auth | staff sign-in for the kitchen | none — the kitchen view is open, so you can look around |

The UI components are unchanged by that swap. `lib/menu.ts` is a constant that a `fetch`
can replace without touching a single component, which is how the real one is wired.

## Running it

```bash
npm install && npm run dev
```

```bash
npm test
```

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, zustand,
`@hebcal/core`, vitest. Deployed on Vercel. No database, no environment variables, no
secrets — `npm install && npm run dev` is the whole setup.

---

*One of three demos in my portfolio — see also a
[researcher lead-intelligence tool](https://github.com/Neuralowkey/demo-leadgraph) and a
[yeshiva operating system](https://github.com/Neuralowkey/demo-yeshiva-os).*
