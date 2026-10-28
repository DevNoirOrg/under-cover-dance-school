"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { readRooms, readSettings } from "@/lib/content";
import { db } from "@/lib/db";
import { renderEmail, sendEmail } from "@/lib/email";
import { PARENT_REQUIRED_UNDER_AGE } from "@/lib/form-rules";
import { t } from "@/lib/i18n";
import { experienceOptions, localizeRooms } from "@/lib/localize";
import { adminBaseUrl } from "@/lib/urls";

/*
  Jelentkezés beküldése (a publikus jelentkezési formról).
   - szerveroldali validáció (a böngészős validáció csak kényelmi funkció)
   - spamvédelem: rejtett csapdamező + IP-nkénti korlát (5 / óra)
   - mentés az adatbázisba, majd a válasz UTÁN e-mail értesítés (after)
   - kétnyelvű: a hibaüzenetek és a jelentkezőnek küldött e-mail az oldal
     nyelvén (lang); az adatbázisba és az adminnak minden magyarul kerül
*/

const RATE_LIMIT_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-()/]+$/;

const inputSchema = z.object({
  nev: z.string().trim().min(1).max(200),
  email: z.string().trim().max(200).regex(EMAIL_RE),
  telefon: z
    .string()
    .trim()
    .max(40)
    .regex(PHONE_RE)
    .refine((v) => v.replace(/\D/g, "").length >= 7),
  szuletes: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  szulo_nev: z.string().trim().max(200).optional().default(""),
  szulo_email: z.string().trim().max(200).optional().default(""),
  /** Nem kötelező („” = nem válaszolt). */
  tapasztalat: z.string().trim().max(100).optional().default(""),
  megjegyzes: z.string().trim().max(2000).optional().default(""),
  /** „Elolvastam és elfogadom az Adatkezelési tájékoztatóban foglaltakat.” */
  tajekoztato: z.literal(true),
  /** „Hozzájárulok a fenti adataim Adatkezelő által történő kezeléséhez.” */
  adatkezeles: z.literal(true),
  classIds: z.array(z.string().uuid()).min(1).max(30),
  /** Rejtett csapdamező — ember nem tölti ki. */
  website: z.string().optional().default(""),
  /** Melyik nyelvű oldalon jelentkezett. */
  lang: z.enum(["hu", "en"]).optional().default("hu"),
});

export type ApplicationInput = z.input<typeof inputSchema>;
export type ApplicationResult = { ok: true } | { ok: false; error: string };

function ageFrom(value: string): number | null {
  const d = new Date(value + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

async function clientIpHash(): Promise<string | null> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "undercover";
  return createHash("sha256").update(salt + ":" + ip).digest("hex");
}

export async function submitApplication(raw: ApplicationInput): Promise<ApplicationResult> {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    const lang = (raw as { lang?: unknown } | null)?.lang === "en" ? "en" : "hu";
    return { ok: false, error: t(lang).server.invalid };
  }
  const input = parsed.data;
  const msg = t(input.lang).server;

  // Csapdamező kitöltve → bot. Úgy teszünk, mintha sikerült volna.
  if (input.website) return { ok: true };

  const age = ageFrom(input.szuletes);
  if (age === null || age < 0 || age > 100) {
    return { ok: false, error: msg.birth };
  }
  const minor = age < PARENT_REQUIRED_UNDER_AGE;
  if (minor && (!input.szulo_nev || !EMAIL_RE.test(input.szulo_email))) {
    return { ok: false, error: msg.parent(PARENT_REQUIRED_UNDER_AGE) };
  }

  const [settings, rooms] = await Promise.all([readSettings(), readRooms()]);
  if (input.tapasztalat && !settings.form_options.experience.includes(input.tapasztalat)) {
    return { ok: false, error: msg.option };
  }

  // Az órák leírását a szerver állítja össze az adatbázisból (nem bízunk a böngészőben).
  // Az adatbázisba (és az adminnak) magyarul, a jelentkezőnek az oldal nyelvén.
  const labelsOf = (list: typeof rooms) =>
    list.flatMap((room) => room.columns.flatMap((col) => col.classes.filter((c) => input.classIds.includes(c.id)).map((c) => c.full)));
  const classLabels = labelsOf(rooms);
  const applicantClassLabels = labelsOf(localizeRooms(rooms, input.lang));
  if (classLabels.length === 0) {
    return { ok: false, error: msg.classesChanged };
  }

  const ipHash = await clientIpHash();
  const sql = db();
  if (ipHash) {
    const [{ n }] = await sql<{ n: number }[]>`
      select count(*)::int as n from undercover.applications
      where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
    if (n >= RATE_LIMIT_PER_HOUR) {
      return { ok: false, error: msg.rateLimit };
    }
  }

  const [row] = await sql<{ id: string }[]>`
    insert into undercover.applications
      (nev, email, telefon, szuletes, szulo_nev, szulo_email,
       tapasztalat, megjegyzes, classes, consent_at, privacy_ack_at, ip_hash, lang)
    values
      (${input.nev}, ${input.email.toLowerCase()}, ${input.telefon}, ${input.szuletes},
       ${minor ? input.szulo_nev : null}, ${minor ? input.szulo_email.toLowerCase() : null},
       ${input.tapasztalat || null}, ${input.megjegyzes}, ${classLabels}, now(), now(), ${ipHash}, ${input.lang})
    returning id`;

  // E-mailek a válasz elküldése UTÁN — a látogatónak nem kell rájuk várnia.
  after(async () => {
    const name = input.nev;
    const rows: [string, string][] = [
      ["Név", name],
      ["E-mail", input.email],
      ["Telefon", input.telefon],
      ["Születési dátum", input.szuletes],
    ];
    if (minor) rows.push(["Szülő", `${input.szulo_nev} · ${input.szulo_email}`]);
    if (input.tapasztalat) rows.push(["Tánctapasztalat", input.tapasztalat]);
    rows.push(["Órák", classLabels.join("\n")]);
    if (input.megjegyzes) rows.push(["Megjegyzés", input.megjegyzes]);
    if (input.lang === "en") rows.push(["Nyelv", "angol (az angol oldalon jelentkezett — angolul válaszolj neki)"]);

    const notifyTo = process.env.APPLICATION_NOTIFY_EMAIL;
    if (notifyTo) {
      const mail = renderEmail({
        title: `Új jelentkezés: ${name}`,
        rows,
        button: { label: "Megnyitom az adminban", href: `${adminBaseUrl()}/jelentkezesek/${row.id}` },
      });
      await sendEmail({
        to: notifyTo.split(",").map((s) => s.trim()).filter(Boolean),
        replyTo: input.email,
        subject: `Új jelentkezés: ${name}`,
        ...mail,
      });
    }

    if (process.env.APPLICANT_CONFIRMATION_ENABLED === "true") {
      // a jelentkező a saját nyelvén kapja (sorfeliratok, órák, tánctapasztalat is)
      const d = t(input.lang);
      const r = d.rows;
      const experienceLabel = experienceOptions(settings.form_options, input.lang).find((o) => o.value === input.tapasztalat)?.label;
      const applicantRows: [string, string][] = [
        [r.name, name],
        [r.email, input.email],
        [r.phone, input.telefon],
        [r.birth, input.szuletes],
      ];
      if (minor) applicantRows.push([r.parent, `${input.szulo_nev} · ${input.szulo_email}`]);
      if (input.tapasztalat) applicantRows.push([r.experience, experienceLabel ?? input.tapasztalat]);
      applicantRows.push([r.classes, applicantClassLabels.join("\n")]);
      if (input.megjegyzes) applicantRows.push([r.comments, input.megjegyzes]);
      const mail = renderEmail({
        title: d.mail.title,
        intro: d.mail.intro(input.nev),
        rows: applicantRows,
        outro: d.mail.outro,
      });
      await sendEmail({
        to: input.email,
        cc: minor && input.szulo_email ? [input.szulo_email] : undefined,
        replyTo: notifyTo?.split(",")[0]?.trim() || undefined,
        subject: d.mail.subject,
        ...mail,
      });
    }
  });

  return { ok: true };
}
