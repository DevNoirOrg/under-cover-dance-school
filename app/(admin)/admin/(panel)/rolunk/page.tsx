import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo, getSetting } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import AboutEditor from "./AboutEditor";

export const metadata: Metadata = { title: "Rólunk" };

async function AboutPageContent() {
  await requireAdmin();
  const [about, info] = await Promise.all([getSetting("about"), getEditInfo("about")]);
  return <AboutEditor initial={about} info={info} />;
}

export default function AboutPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <AboutPageContent />
    </Suspense>
  );
}
