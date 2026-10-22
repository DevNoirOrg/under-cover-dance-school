"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSetting, removeMedia, saveSetting, touch } from "@/lib/admin-data";
import { assertAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { db } from "@/lib/db";
import { MEDIA_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";

/*
  Az admin felület összes írási művelete. Mindegyik:
    1) ellenőrzi, hogy admin hívja (assertAdmin),
    2) zod-dal validálja a bemenetet,
    3) ment, naplózza ki módosított (edit_log),
    4) azonnal frissíti a publikus oldalt (updateTag).
*/

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const fail = (error: string): ActionResult => ({ ok: false, error });

async function run(fn: (email: string) => Promise<ActionResult | void>): Promise<ActionResult> {
  try {
    const admin = await assertAdmin();
    const res = await fn(admin.email);
    return res ?? { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const first = err.issues[0];
      return fail(first?.message && !first.message.startsWith("Invalid") ? first.message : "Hiányzó vagy hibás mező.");
    }
    console.error("[admin action]", err);
    return fail(err instanceof Error ? err.message : "Ismeretlen hiba történt.");
  }
}

const text = (max = 500, label = "Mező") =>
  z.string().trim().max(max, `${label}: legfeljebb ${max} karakter.`);
const required = (max = 500, label = "Mező") => text(max, label).min(1, `${label}: nem lehet üres.`);
const mediaPath = z
  .string()
  .regex(/^(\/[\w./-]+|(images|videos)\/[\w./-]+)$/, "Érvénytelen fájl.")
  .max(300);

// ---------------------------------------------------------------------
//  Feltöltés: egyszer használatos, közvetlen feltöltési link a Storage-ba
// ---------------------------------------------------------------------
const uploadSchema = z.object({
  kind: z.enum(["image", "video"]),
  contentType: z.enum(["image/webp", "image/jpeg", "image/png", "video/mp4"]),
});

export async function createUploadTarget(
  input: z.input<typeof uploadSchema>,
): Promise<{ ok: true; path: string; token: string } | { ok: false; error: string }> {
  try {
    await assertAdmin();
    const { kind, contentType } = uploadSchema.parse(input);
    if (kind === "video" && contentType !== "video/mp4") return { ok: false, error: "Csak MP4 videó tölthető fel." };
    if (kind === "image" && contentType === "video/mp4") return { ok: false, error: "Ez nem kép." };
    const ext = contentType.split("/")[1];
    const now = new Date();
    const path = `${kind}s/${now.getFullYear()}/${randomUUID()}.${ext}`;
    const { data, error } = await supabaseAdmin().storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { ok: false, error: "Nem sikerült feltöltési linket kérni: " + (error?.message ?? "") };
    return { ok: true, path: data.path, token: data.token };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Hiba a feltöltés előkészítésekor." };
  }
}

// ---------------------------------------------------------------------
//  Hero
// ---------------------------------------------------------------------
const heroSchema = z.object({
  badge: required(40, "Jelvény"),
  leadBefore: text(200, "Szöveg eleje"),
  leadHighlight: text(80, "Kiemelt szó"),
  leadAfter: text(200, "Szöveg vége"),
  primaryCtaLabel: required(40, "Fő gomb felirata"),
  secondaryCtaLabel: required(40, "Második gomb felirata"),
  videoPath: mediaPath.nullable(),
  videoPosterPath: mediaPath.nullable(),
});

export async function saveHero(input: z.input<typeof heroSchema>) {
  return run(async (email) => {
    const value = heroSchema.parse(input);
    const old = await getSetting("hero");
    await saveSetting("hero", value, email);
    await touch("hero", email);
    if (old.videoPath !== value.videoPath) await removeMedia(old.videoPath);
    if (old.videoPosterPath !== value.videoPosterPath) await removeMedia(old.videoPosterPath);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Rólunk
// ---------------------------------------------------------------------
const aboutSchema = z.object({
  titleLine1: required(80, "Cím 1. sor"),
  titleLine2: text(80, "Cím 2. sor"),
  paragraph: text(1000, "Bekezdés"),
  highlight: text(500, "Kiemelt bekezdés"),
  stats: z
    .array(z.object({ value: required(12, "Szám"), label: required(30, "Felirat") }))
    .max(4, "Legfeljebb 4 statisztika lehet."),
  imagePath: mediaPath,
  imageAlt: text(200, "Kép leírása"),
});

export async function saveAbout(input: z.input<typeof aboutSchema>) {
  return run(async (email) => {
    const value = aboutSchema.parse(input);
    const old = await getSetting("about");
    await saveSetting("about", value, email);
    await touch("about", email);
    if (old.imagePath !== value.imagePath) await removeMedia(old.imagePath);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Lábléc
// ---------------------------------------------------------------------
const footerSchema = z.object({
  locations: z.array(required(120, "Helyszín")).max(6),
  socials: z
    .array(
      z.object({
        label: required(12, "Felirat"),
        href: z
          .string()
          .trim()
          .max(300)
          .transform((v) => v || null)
          .refine((v) => v === null || /^https?:\/\//.test(v), "A link http(s)://-sel kezdődjön.")
          .nullable(),
      }),
    )
    .max(6),
  copyright: text(120, "Copyright sor"),
  tagline: text(120, "Szlogen"),
});

export async function saveFooter(input: z.input<typeof footerSchema>) {
  return run(async (email) => {
    const value = footerSchema.parse(input);
    await saveSetting("footer", value, email);
    await touch("footer", email);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Jelentkezési form opciói
// ---------------------------------------------------------------------
const formOptionsSchema = z.object({
  experience: z.array(required(80, "Opció")).min(1, "Legalább egy opció kell.").max(12),
  start: z.array(required(80, "Opció")).min(1, "Legalább egy opció kell.").max(12),
});

export async function saveFormOptions(input: z.input<typeof formOptionsSchema>) {
  return run(async (email) => {
    const value = formOptionsSchema.parse(input);
    await saveSetting("form_options", value, email);
    await touch("form_options", email);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Adatkezelési tájékoztató
// ---------------------------------------------------------------------
export async function savePrivacy(input: { text: string }) {
  return run(async (email) => {
    const value = z.object({ text: text(50000, "Szöveg") }).parse(input);
    await saveSetting("privacy", value, email);
    await touch("privacy", email);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Árak (+ megjegyzések)
// ---------------------------------------------------------------------
const pricesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        name: required(80, "Megnevezés"),
        price: required(30, "Ár"),
        note: z.enum(["", "*", "**"]),
      }),
    )
    .max(40),
  notes: z.array(z.object({ mark: z.enum(["", "*", "**"]), text: required(300, "Megjegyzés") })).max(6),
});

export async function savePrices(input: z.input<typeof pricesSchema>) {
  return run(async (email) => {
    const { items, notes } = pricesSchema.parse(input);
    await db().begin(async (tx) => {
      await tx`delete from undercover.prices`;
      for (const [i, p] of items.entries()) {
        await tx`insert into undercover.prices (id, name, price, note, sort)
                 values (${p.id ?? randomUUID()}, ${p.name}, ${p.price}, ${p.note}, ${i})`;
      }
    });
    await saveSetting("price_notes", { notes }, email);
    await touch("prices", email);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Órarend (termek + órák) — az egész órarend egyben mentődik
// ---------------------------------------------------------------------
const classSchema = z.object({
  id: z.string().uuid().optional(),
  title: required(80, "Óra címe"),
  subtitle: text(80, "Alcím"),
  chip: required(60, "Rövid felirat"),
});
const roomSchema = z.object({
  id: z.string().uuid().optional(),
  name: required(40, "Terem neve"),
  shortName: required(20, "Terem rövid neve"),
  minHeightPx: z.number().int().min(120).max(600),
  headings: z.tuple([required(40, "Oszlopcím"), required(40, "Oszlopcím"), required(40, "Oszlopcím")]),
  columns: z.tuple([z.array(classSchema).max(12), z.array(classSchema).max(12), z.array(classSchema).max(12)]),
});
const scheduleSchema = z.object({ rooms: z.array(roomSchema).min(1, "Legalább egy terem kell.").max(6) });

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "terem"
  );
}

export async function saveSchedule(input: z.input<typeof scheduleSchema>) {
  return run(async (email) => {
    const { rooms } = scheduleSchema.parse(input);
    await db().begin(async (tx) => {
      const keepIds = rooms.map((r) => r.id).filter((id): id is string => !!id);
      if (keepIds.length) await tx`delete from undercover.rooms where id <> all(${keepIds}::uuid[])`;
      else await tx`delete from undercover.rooms`;

      const usedSlugs = new Set<string>();
      for (const [sort, room] of rooms.entries()) {
        let slug = slugify(room.name);
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(room.name)}-${n}`;
        usedSlugs.add(slug);
        const id = room.id ?? randomUUID();
        // ideiglenes slug, hogy két terem cseréjekor se ütközzön az egyedi index
        await tx`
          insert into undercover.rooms (id, slug, name, short_name, column_headings, min_height_px, sort, updated_at, updated_by)
          values (${id}, ${"tmp-" + id}, ${room.name}, ${room.shortName}, ${room.headings}, ${room.minHeightPx}, ${sort}, now(), ${email})
          on conflict (id) do update set slug = excluded.slug, name = excluded.name, short_name = excluded.short_name,
            column_headings = excluded.column_headings, min_height_px = excluded.min_height_px,
            sort = excluded.sort, updated_at = now(), updated_by = excluded.updated_by`;
        await tx`delete from undercover.classes where room_id = ${id}`;
        for (const [col, classes] of room.columns.entries()) {
          for (const [i, c] of classes.entries()) {
            await tx`insert into undercover.classes (id, room_id, col, sort, title, subtitle, chip)
                     values (${c.id ?? randomUUID()}, ${id}, ${col}, ${i}, ${c.title}, ${c.subtitle}, ${c.chip})`;
          }
        }
        room.id = id;
        (room as { slug?: string }).slug = slug;
      }
      for (const room of rooms) {
        await tx`update undercover.rooms set slug = ${(room as { slug?: string }).slug!} where id = ${room.id!}`;
      }
    });
    await touch("schedule", email);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Hírek
// ---------------------------------------------------------------------
const newsSchema = z.object({
  id: z.string().uuid().optional(),
  publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Adj meg egy dátumot."),
  title: required(120, "Cím"),
  excerpt: text(400, "Rövid szöveg"),
  imagePath: mediaPath.nullable(),
  imageAlt: text(200, "Kép leírása"),
  placeholderLabel: text(30, "Helyőrző felirat"),
});

export async function saveNews(input: z.input<typeof newsSchema>) {
  return run(async (email) => {
    const n = newsSchema.parse(input);
    let oldImage: string | null = null;
    let id = n.id;
    if (id) {
      const [old] = await db()<{ image_path: string | null }[]>`select image_path from undercover.news where id = ${id}`;
      if (!old) return fail("Ez a hír időközben törölve lett.");
      oldImage = old.image_path;
      await db()`update undercover.news set published_on = ${n.publishedOn}, title = ${n.title}, excerpt = ${n.excerpt},
        image_path = ${n.imagePath}, image_alt = ${n.imageAlt || null}, placeholder_label = ${n.placeholderLabel},
        updated_at = now(), updated_by = ${email} where id = ${id}`;
    } else {
      id = randomUUID();
      await db()`insert into undercover.news (id, published_on, title, excerpt, image_path, image_alt, placeholder_label, updated_by)
        values (${id}, ${n.publishedOn}, ${n.title}, ${n.excerpt}, ${n.imagePath}, ${n.imageAlt || null}, ${n.placeholderLabel}, ${email})`;
    }
    if (oldImage && oldImage !== n.imagePath) await removeMedia(oldImage);
    await touch("news", email);
    updateTag(CONTENT_TAG);
    return { ok: true, id };
  });
}

export async function deleteNews(id: string) {
  return run(async (email) => {
    const rows = await db()<{ image_path: string | null }[]>`
      delete from undercover.news where id = ${z.string().uuid().parse(id)} returning image_path`;
    await removeMedia(rows[0]?.image_path);
    await touch("news", email);
    updateTag(CONTENT_TAG);
  });
}

// ---------------------------------------------------------------------
//  Jelentkezések
// ---------------------------------------------------------------------
const statusSchema = z.enum(["uj", "felvettuk", "elutasitva", "archivalt"]);

export async function setApplicationStatus(id: string, status: z.input<typeof statusSchema>) {
  return run(async (email) => {
    await db()`update undercover.applications
      set status = ${statusSchema.parse(status)}, status_updated_at = now(), status_updated_by = ${email}
      where id = ${z.string().uuid().parse(id)}`;
  });
}

export async function saveApplicationNote(id: string, note: string) {
  return run(async () => {
    await db()`update undercover.applications set admin_note = ${text(2000, "Megjegyzés").parse(note)}
      where id = ${z.string().uuid().parse(id)}`;
  });
}

export async function deleteApplication(id: string) {
  return run(async () => {
    await db()`delete from undercover.applications where id = ${z.string().uuid().parse(id)}`;
  });
}

// ---------------------------------------------------------------------
//  Adminok
// ---------------------------------------------------------------------
export async function addAdmin(emailInput: string) {
  return run(async () => {
    const email = z.string().trim().toLowerCase().email("Érvénytelen e-mail cím.").parse(emailInput);
    await db()`insert into undercover.admins (email) values (${email}) on conflict do nothing`;
  });
}

export async function removeAdmin(emailInput: string) {
  return run(async (me) => {
    const email = z.string().trim().toLowerCase().parse(emailInput);
    if (email === me) return fail("Saját magadat nem tudod eltávolítani.");
    const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from undercover.admins`;
    if (n <= 1) return fail("Az utolsó admint nem lehet eltávolítani.");
    await db()`delete from undercover.admins where email = ${email}`;
  });
}

// ---------------------------------------------------------------------
//  Kijelentkezés
// ---------------------------------------------------------------------
export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/belepes");
}
