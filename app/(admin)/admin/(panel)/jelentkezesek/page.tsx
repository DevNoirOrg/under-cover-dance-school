import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { countByStatus, listApplications, STATUSES, type StatusId } from "@/lib/applications";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Jelentkezések" };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("hu-HU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

async function ApplicationsPageContent({ searchParams }: { searchParams: Promise<{ statusz?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = (STATUSES.some((s) => s.id === sp.statusz) ? sp.statusz : sp.statusz === "osszes" ? "osszes" : "uj") as
    | StatusId
    | "osszes";
  const [apps, counts] = await Promise.all([listApplications(status), countByStatus()]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [...STATUSES.map((s) => ({ id: s.id as string, label: s.label, n: counts[s.id] ?? 0 })), { id: "osszes", label: "Összes", n: total }];
  const badge = (id: string) => STATUSES.find((s) => s.id === id);

  return (
    <div className="pb-12">
      <PageHeader
        title="Jelentkezések"
        description="A weboldalon beküldött jelentkezések. Az 1 évnél régebbieket a rendszer automatikusan törli (adatkezelési tájékoztató)."
      >
        <a
          href={`/admin/jelentkezesek/export?statusz=${status}`}
          className="inline-flex items-center rounded-xl bg-uc-pale px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest text-uc-deep hover:bg-uc hover:text-white"
        >
          CSV letöltése
        </a>
      </PageHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/jelentkezesek?statusz=${t.id}`}
            className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition-colors ${
              t.id === status ? "bg-ink text-white" : "bg-white text-slate-500 hover:text-ink"
            }`}
          >
            {t.label} <span className="opacity-60">{t.n}</span>
          </Link>
        ))}
      </div>

      {apps.length === 0 ? (
        <p className="rounded-[1.75rem] bg-white p-8 text-center text-sm text-slate-500">Nincs jelentkezés ebben a nézetben.</p>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_30px_-18px_rgba(20,19,22,0.35)]">
          <ul className="divide-y divide-slate-100">
            {apps.map((a) => {
              const b = badge(a.status);
              return (
                <li key={a.id}>
                  <Link href={`/admin/jelentkezesek/${a.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-uc-pale/40">
                    <span className="w-28 shrink-0 text-xs font-semibold text-slate-400">{fmt(a.createdAt)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">
                        {a.nev}
                        {a.szuloNev && <span className="ml-2 text-[10px] font-extrabold uppercase tracking-widest text-uc-deep">16 év alatti</span>}
                      </span>
                      <span className="block truncate text-xs text-slate-500">{a.classes.join(" · ")}</span>
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${b?.badge}`}>{b?.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage(props: { searchParams: Promise<{ statusz?: string }> }) {
  return (
    <Suspense fallback={<PanelLoading />}>
      <ApplicationsPageContent {...props} />
    </Suspense>
  );
}
