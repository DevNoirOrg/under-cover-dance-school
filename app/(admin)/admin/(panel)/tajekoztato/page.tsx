import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo, getSetting } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import PrivacyEditor from "./PrivacyEditor";

export const metadata: Metadata = { title: "Adatkezelési tájékoztató" };

async function PrivacyPageContent() {
  await requireAdmin();
  const [privacy, info] = await Promise.all([getSetting("privacy"), getEditInfo("privacy")]);
  return <PrivacyEditor initial={privacy.text} info={info} />;
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <PrivacyPageContent />
    </Suspense>
  );
}
