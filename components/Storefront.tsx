"use client";

import type { ServiceStatus } from "@/lib/closures";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Menu } from "./Menu";
import { About } from "./About";
import { Delivery } from "./Delivery";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

/**
 * The storefront is one client tree under a single `status` prop. The closure
 * calculation itself stays on the server (see `lib/closures.ts`) so `@hebcal`
 * never reaches the browser bundle.
 */
export function Storefront({ status }: { status: ServiceStatus }) {
  return (
    <>
      <Header open={status.open} />
      <main className="flex-1">
        <Hero status={status} />
        <Marquee />
        <Menu />
        <About />
        <Delivery />
      </main>
      <Footer status={status} />
      <CartDrawer status={status} />
    </>
  );
}
