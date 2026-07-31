import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";
import { LanguageProvider } from "@/lib/i18n";
import { DemoBanner } from "@/components/DemoBanner";
import { StoreHydration } from "@/components/StoreHydration";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

// A high-contrast serif for the display type — the "restaurant" signal.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: `${BRAND.name_en} — ordering & delivery demo`,
  description:
    "A portfolio demo of a restaurant ordering and delivery system: bilingual menu, cart, checkout, live order tracking and a kitchen board. All data is fictional.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${sans.variable} ${display.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-sans)]">
        <LanguageProvider>
          <StoreHydration />
          <DemoBanner />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
