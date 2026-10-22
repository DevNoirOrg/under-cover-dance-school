import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo, getSetting } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import FormOptionsEditor from "./FormOptionsEditor";

export const metadata: Metadata = { title: "Form opciók" };

async function FormOptionsPageContent() {
  await requireAdmin();
  const [options, info] = await Promise.all([getSetting("form_options"), getEditInfo("form_options")]);
  return <FormOptionsEditor initial={options} info={info} />;
}

export default function FormOptionsPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <FormOptionsPageContent />
    </Suspense>
  );
}
