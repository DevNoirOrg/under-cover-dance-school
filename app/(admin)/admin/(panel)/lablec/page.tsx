import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo, getSetting } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import FooterEditor from "./FooterEditor";

export const metadata: Metadata = { title: "Lábléc" };

async function FooterPageContent() {
  await requireAdmin();
  const [footer, info] = await Promise.all([getSetting("footer"), getEditInfo("footer")]);
  return <FooterEditor initial={footer} info={info} />;
}

export default function FooterPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <FooterPageContent />
    </Suspense>
  );
}
