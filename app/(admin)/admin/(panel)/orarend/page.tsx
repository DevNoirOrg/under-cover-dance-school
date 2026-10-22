import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import { getEditInfo } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { readRooms } from "@/lib/content";
import ScheduleEditor from "./ScheduleEditor";

export const metadata: Metadata = { title: "Órarend" };

async function SchedulePageContent() {
  await requireAdmin();
  const [rooms, info] = await Promise.all([readRooms(), getEditInfo("schedule")]);
  return <ScheduleEditor initial={rooms} info={info} />;
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <SchedulePageContent />
    </Suspense>
  );
}
