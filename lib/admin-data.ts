import "server-only";
import { db } from "./db";
import type { SettingsKey, SettingsMap } from "./content-types";
import { MEDIA_BUCKET, supabaseAdmin } from "./supabase/admin";

/*
  Admin oldali adatkezelő segédfüggvények (olvasás gyorsítótár nélkül,
  írás + "ki módosította utoljára" naplózás, régi médiafájlok törlése).
*/

export type Section =
  | "hero"
  | "about"
  | "footer"
  | "form_options"
  | "privacy"
  | "prices"
  | "schedule"
  | "news";

export type EditInfo = { updatedAt: string; updatedBy: string } | null;

export async function touch(section: Section, email: string) {
  await db()`
    insert into undercover.edit_log (section, updated_at, updated_by)
    values (${section}, now(), ${email})
    on conflict (section) do update set updated_at = now(), updated_by = excluded.updated_by`;
}

export async function getEditInfo(section: Section): Promise<EditInfo> {
  const rows = await db()<{ updated_at: Date; updated_by: string }[]>`
    select updated_at, updated_by from undercover.edit_log where section = ${section}`;
  if (!rows[0]) return null;
  return { updatedAt: rows[0].updated_at.toISOString(), updatedBy: rows[0].updated_by };
}

export async function getEditLog(): Promise<Record<string, EditInfo>> {
  const rows = await db()<{ section: string; updated_at: Date; updated_by: string }[]>`
    select section, updated_at, updated_by from undercover.edit_log`;
  return Object.fromEntries(
    rows.map((r) => [r.section, { updatedAt: r.updated_at.toISOString(), updatedBy: r.updated_by }]),
  );
}

export async function getSetting<K extends SettingsKey>(key: K): Promise<SettingsMap[K]> {
  const rows = await db()<{ value: SettingsMap[K] }[]>`select value from undercover.settings where key = ${key}`;
  if (!rows[0]) throw new Error(`Hiányzó tartalom: settings.${key} (futtasd az undercover-seed.sql-t)`);
  return rows[0].value;
}

export async function saveSetting<K extends SettingsKey>(key: K, value: SettingsMap[K], email: string) {
  await db()`
    insert into undercover.settings (key, value, updated_at, updated_by)
    values (${key}, ${db().json(value as never)}, now(), ${email})
    on conflict (key) do update set value = excluded.value, updated_at = now(), updated_by = excluded.updated_by`;
}

/** Feltöltött (Storage-beli) fájl törlése — a "/..." (public mappás) fájlokhoz nem nyúl. */
export async function removeMedia(...paths: (string | null | undefined)[]) {
  const toRemove = paths.filter((p): p is string => !!p && !p.startsWith("/") && !p.startsWith("http"));
  if (toRemove.length === 0) return;
  try {
    const { error } = await supabaseAdmin().storage.from(MEDIA_BUCKET).remove(toRemove);
    if (error) console.warn("[media] törlés sikertelen:", error.message);
  } catch (err) {
    console.warn("[media] törlés sikertelen:", err);
  }
}
