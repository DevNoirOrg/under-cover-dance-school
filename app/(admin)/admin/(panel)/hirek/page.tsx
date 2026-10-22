import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { readNews } from "@/lib/content";
import NewsEditor from "./NewsEditor";

export const metadata: Metadata = { title: "Hírek" };

async function NewsPageContent() {
  await requireAdmin();
  const [news, info] = await Promise.all([readNews(), getEditInfo("news")]);
  return <NewsEditor news={news} info={info} />;
}

export default function NewsPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <NewsPageContent />
    </Suspense>
  );
}
