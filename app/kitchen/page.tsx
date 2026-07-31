import type { Metadata } from "next";
import { KitchenBoard } from "@/components/KitchenBoard";

export const metadata: Metadata = {
  title: "Kitchen view — Olive & Ember demo",
};

export default function KitchenPage() {
  return <KitchenBoard />;
}
