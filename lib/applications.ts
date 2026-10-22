import "server-only";
import { db } from "./db";

export const STATUSES = [
  { id: "uj", label: "Új", badge: "bg-uc text-ink" },
  { id: "felvettuk", label: "Felvettük", badge: "bg-emerald-100 text-emerald-800" },
  { id: "elutasitva", label: "Elutasítva", badge: "bg-red-100 text-red-700" },
  { id: "archivalt", label: "Archivált", badge: "bg-slate-200 text-slate-600" },
] as const;
export type StatusId = (typeof STATUSES)[number]["id"];

export type Application = {
  id: string;
  createdAt: string;
  status: StatusId;
  nev: string;
  email: string;
  telefon: string;
  szuletes: string;
  szuloNev: string | null;
  szuloEmail: string | null;
  /** null = nem válaszolt */
  tapasztalat: string | null;
  /** Csak a 2026. októberi változás előtti jelentkezéseknél van kitöltve. */
  kezdes: string | null;
  megjegyzes: string;
  classes: string[];
  consentAt: string;
  /** A tájékoztató elfogadásának ideje (a régebbi jelentkezéseknél null). */
  privacyAckAt: string | null;
  adminNote: string;
  statusUpdatedAt: string | null;
  statusUpdatedBy: string | null;
};

type Row = {
  id: string;
  created_at: Date;
  status: StatusId;
  nev: string;
  email: string;
  telefon: string;
  szuletes: string;
  szulo_nev: string | null;
  szulo_email: string | null;
  tapasztalat: string | null;
  kezdes: string | null;
  megjegyzes: string;
  classes: string[];
  consent_at: Date;
  privacy_ack_at: Date | null;
  admin_note: string;
  status_updated_at: Date | null;
  status_updated_by: string | null;
};

const map = (r: Row): Application => ({
  id: r.id,
  createdAt: r.created_at.toISOString(),
  status: r.status,
  nev: r.nev,
  email: r.email,
  telefon: r.telefon,
  szuletes: r.szuletes,
  szuloNev: r.szulo_nev,
  szuloEmail: r.szulo_email,
  tapasztalat: r.tapasztalat,
  kezdes: r.kezdes,
  megjegyzes: r.megjegyzes,
  classes: r.classes,
  consentAt: r.consent_at.toISOString(),
  privacyAckAt: r.privacy_ack_at?.toISOString() ?? null,
  adminNote: r.admin_note,
  statusUpdatedAt: r.status_updated_at?.toISOString() ?? null,
  statusUpdatedBy: r.status_updated_by,
});

export async function listApplications(status: StatusId | "osszes"): Promise<Application[]> {
  const rows =
    status === "osszes"
      ? await db()<Row[]>`select * from undercover.applications order by created_at desc limit 2000`
      : await db()<Row[]>`select * from undercover.applications where status = ${status} order by created_at desc limit 2000`;
  return rows.map(map);
}

export async function getApplication(id: string): Promise<Application | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await db()<Row[]>`select * from undercover.applications where id = ${id}`;
  return rows[0] ? map(rows[0]) : null;
}

export async function countByStatus(): Promise<Record<string, number>> {
  const rows = await db()<{ status: string; n: number }[]>`
    select status, count(*)::int as n from undercover.applications group by status`;
  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}
