import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import Link from "next/link";
import { getEditLog } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminNav } from "@/lib/admin-nav";

export const metadata: Metadata = { title: "Áttekintés" };

const sectionOf: Record<string, string> = {
  "/admin/orarend": "schedule",
  "/admin/arak": "prices",
  "/admin/hirek": "news",
  "/admin/hero": "hero",
  "/admin/rolunk": "about",
  "/admin/lablec": "footer",
  "/admin/form": "form_options",
  "/admin/tajekoztato": "privacy",
};

async function DashboardPageContent() {
  const admin = await requireAdmin();
  const [counts, log] = await Promise.all([
    db()<{ status: string; n: number }[]>`select status, count(*)::int as n from undercover.applications group by status`,
    getEditLog(),
  ]);
  const newCount = counts.find((c) => c.status === "uj")?.n ?? 0;
  const total = counts.reduce((s, c) => s + c.n, 0);

  return (
    <div className="pb-12">
      <h1 className="font-title text-3xl font-black md:text-4xl">Szia!</h1>
      <p className="mt-2 text-sm text-slate-500">Bejelentkezve: {admin.email}</p>

      <Link
        href="/admin/jelentkezesek"
        className="mt-8 flex items-center justify-between gap-6 rounded-[1.75rem] bg-uc p-6 text-ink shadow-[0_20px_40px_-24px_rgba(20,19,22,0.5)] transition-transform hover:-translate-y-0.5 md:p-8"
      >
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink/60">Új jelentkezések</p>
          <p className="mt-1 font-title text-5xl font-black">{newCount}</p>
          <p className="mt-1 text-sm font-semibold text-ink/70">Összesen {total} jelentkezés az adatbázisban</p>
        </div>
        <span className="rounded-xl bg-ink px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-white">
          Megnézem →
        </span>
      </Link>

      <h2 className="mt-10 mb-4 font-title text-lg font-extrabold">Tartalom szerkesztése</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {adminNav
          .filter((n) => sectionOf[n.href])
          .map((n) => {
            const info = log[sectionOf[n.href]];
            return (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_-20px_rgba(20,19,22,0.35)] transition-colors hover:bg-uc-pale"
              >
                <p className="font-title font-extrabold">{n.label}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {info
                    ? `Módosítva: ${new Date(info.updatedAt).toLocaleDateString("hu-HU")} · ${info.updatedBy}`
                    : "Még nem módosították"}
                </p>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
