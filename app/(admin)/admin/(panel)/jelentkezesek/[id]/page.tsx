import { Suspense } from "react";
import PanelLoading from "@/components/admin/PanelLoading";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { getApplication, STATUSES } from "@/lib/applications";
import { requireAdmin } from "@/lib/auth";
import ApplicationActions from "./ApplicationActions";

export const metadata: Metadata = { title: "Jelentkezés" };

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
      <dt className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{k}</dt>
      <dd className="text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

async function ApplicationPageContent({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const a = await getApplication(id);
  if (!a) notFound();
  const created = new Date(a.createdAt).toLocaleString("hu-HU");
  const status = STATUSES.find((s) => s.id === a.status);

  return (
    <div className="pb-12">
      <Link href="/admin/jelentkezesek" className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-ink">
        ← Vissza a listához
      </Link>
      <div className="mt-4 mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-title text-3xl font-black">{a.nev}</h1>
        <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${status?.badge}`}>{status?.label}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="self-start">
          <dl className="divide-y divide-slate-100">
            <Row k="Beküldve">{created}</Row>
            <Row k="E-mail">
              <a className="text-uc-deep underline" href={`mailto:${a.email}`}>
                {a.email}
              </a>
            </Row>
            {a.telefon && (
              <Row k="Telefon">
                <a className="text-uc-deep underline" href={`tel:${a.telefon.replace(/[^\d+]/g, "")}`}>
                  {a.telefon}
                </a>
              </Row>
            )}
            <Row k="Születési dátum">{a.szuletes}</Row>
            {a.szuloNev && (
              <Row k="Szülő">
                {a.szuloNev} ·{" "}
                <a className="text-uc-deep underline" href={`mailto:${a.szuloEmail}`}>
                  {a.szuloEmail}
                </a>
              </Row>
            )}
            <Row k="Tánctapasztalat">{a.tapasztalat ?? <span className="text-slate-400">nem adta meg</span>}</Row>
            {a.kezdes && <Row k="Kezdés">{a.kezdes}</Row>}
            <Row k="Órák">
              <ul className="space-y-1">
                {a.classes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Row>
            {a.megjegyzes && <Row k="Megjegyzés">{a.megjegyzes}</Row>}
            <Row k="Adatkezelés">
              {a.privacyAckAt ? "Elfogadta a tájékoztatót és hozzájárult az adatkezeléshez" : "Hozzájárult"}
            </Row>
          </dl>
        </Card>
        <ApplicationActions
          id={a.id}
          status={a.status}
          note={a.adminNote}
          email={a.email}
          cc={a.szuloEmail}
          statusInfo={a.statusUpdatedAt ? { updatedAt: a.statusUpdatedAt, updatedBy: a.statusUpdatedBy ?? "" } : null}
        />
      </div>
    </div>
  );
}

export default function ApplicationPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PanelLoading />}>
      <ApplicationPageContent {...props} />
    </Suspense>
  );
}
