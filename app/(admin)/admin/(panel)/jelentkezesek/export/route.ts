import { listApplications, STATUSES, type StatusId } from "@/lib/applications";
import { getAdmin } from "@/lib/auth";

/* CSV export (Excelben is megnyitható: UTF-8 BOM + pontosvessző). */
export async function GET(request: Request) {
  const admin = await getAdmin();
  if (!admin) return new Response("Nincs jogosultság", { status: 401 });

  const param = new URL(request.url).searchParams.get("statusz") ?? "osszes";
  const status = (STATUSES.some((s) => s.id === param) ? param : "osszes") as StatusId | "osszes";
  const apps = await listApplications(status);

  const cell = (v: string | null | undefined) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const header = ["Beküldve", "Státusz", "Név", "E-mail", "Telefon", "Születési dátum", "Szülő neve", "Szülő e-mail", "Tánctapasztalat", "Kezdés", "Órák", "Megjegyzés", "Belső megjegyzés"];
  const lines = apps.map((a) =>
    [
      new Date(a.createdAt).toLocaleString("hu-HU"),
      STATUSES.find((s) => s.id === a.status)?.label,
      a.nev,
      a.email,
      a.telefon,
      a.szuletes,
      a.szuloNev,
      a.szuloEmail,
      a.tapasztalat,
      a.kezdes,
      a.classes.join(" | "),
      a.megjegyzes,
      a.adminNote,
    ]
      .map(cell)
      .join(";"),
  );
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jelentkezesek-${status}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
