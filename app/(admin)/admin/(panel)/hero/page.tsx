import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo, getSetting } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import HeroEditor from "./HeroEditor";

export const metadata: Metadata = { title: "Hero" };

async function HeroPageContent() {
  await requireAdmin();
  const [hero, info] = await Promise.all([getSetting("hero"), getEditInfo("hero")]);
  return <HeroEditor initial={hero} info={info} />;
}

export default function HeroPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <HeroPageContent />
    </Suspense>
  );
}
