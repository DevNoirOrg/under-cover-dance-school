import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo, getSetting } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { readPrices } from "@/lib/content";
import PricesEditor from "./PricesEditor";

export const metadata: Metadata = { title: "Árak" };

async function PricesPageContent() {
  await requireAdmin();
  const [prices, notes, info] = await Promise.all([readPrices(), getSetting("price_notes"), getEditInfo("prices")]);
  return <PricesEditor initial={{ items: prices, notes: notes.notes }} info={info} />;
}

export default function PricesPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <PricesPageContent />
    </Suspense>
  );
}
