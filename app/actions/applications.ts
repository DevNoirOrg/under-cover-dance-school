"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { readRooms, readSettings } from "@/lib/content";
import { db } from "@/lib/db";
import { renderEmail, sendEmail } from "@/lib/email";
import { classFullLabel } from "@/lib/format";
import { PARENT_REQUIRED_UNDER_AGE } from "@/lib/form-rules";
import { adminBaseUrl } from "@/lib/urls";

/*
  Jelentkezés beküldése (a publikus jelentkezési formról).
   - szerveroldali validáció (a böngészős validáció csak kényelmi funkció)
   - spamvédelem: rejtett csapdamező + IP-nkénti korlát (5 / óra)
   - mentés az adatbázisba, majd a válasz UTÁN e-mail értesítés (after)
*/

const RATE_LIMIT_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputSchema = z.object({
  vezeteknev: z.string().trim().min(1).max(100),
  keresztnev: z.string().trim().min(1).max(100),
  email: z.string().trim().max(200).regex(EMAIL_RE),
  szuletes: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  szulo_nev: z.string().trim().max(200).optional().default(""),
  szulo_email: z.string().trim().max(200).optional().default(""),
  tapasztalat: z.string().trim().min(1).max(100),
  kezdes: z.string().trim().min(1).max(100),
  megjegyzes: z.string().trim().max(2000).optional().default(""),
  adatkezeles: z.literal(true),
  classIds: z.array(z.string().uuid()).min(1).max(30),
  /** Rejtett csapdamező — ember nem tölti ki. */
  website: z.string().optional().default(""),
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
    return { ok: false, error: "Valamelyik mező hibás. Ellenőrizd az adatokat, és próbáld újra." };
  }
  const input = parsed.data;

  // Csapdamező kitöltve → bot. Úgy teszünk, mintha sikerült volna.
  if (input.website) return { ok: true };

  const age = ageFrom(input.szuletes);
  if (age === null || age < 0 || age > 100) {
    return { ok: false, error: "Ellenőrizd a születési dátumot." };
  }
  const minor = age < PARENT_REQUIRED_UNDER_AGE;
  if (minor && (!input.szulo_nev || !EMAIL_RE.test(input.szulo_email))) {
    return { ok: false, error: "16 év alatt add meg a szülőd nevét és e-mail címét." };
  }

  const [settings, rooms] = await Promise.all([readSettings(), readRooms()]);
  if (!settings.form_options.experience.includes(input.tapasztalat) || !settings.form_options.start.includes(input.kezdes)) {
    return { ok: false, error: "Valamelyik választott lehetőség már nem érvényes. Töltsd újra az oldalt." };
  }

  // Az órák leírását a szerver állítja össze az adatbázisból (nem bízunk a böngészőben).
  const classLabels: string[] = [];
  for (const room of rooms) {
    for (const col of room.columns) {
      for (const c of col.classes) {
        if (input.classIds.includes(c.id)) classLabels.push(classFullLabel(room.name, c.title, c.subtitle));
      }
    }
  }
  if (classLabels.length === 0) {
    return { ok: false, error: "A kiválasztott órák időközben megváltoztak. Töltsd újra az oldalt, és válassz újra." };
  }

  const ipHash = await clientIpHash();
  const sql = db();
  if (ipHash) {
    const [{ n }] = await sql<{ n: number }[]>`
      select count(*)::int as n from undercover.applications
      where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
    if (n >= RATE_LIMIT_PER_HOUR) {
      return { ok: false, error: "Túl sok jelentkezés érkezett innen rövid időn belül. Kérjük, próbáld újra később." };
    }
  }

  const [row] = await sql<{ id: string }[]>`
    insert into undercover.applications
      (vezeteknev, keresztnev, email, szuletes, szulo_nev, szulo_email,
       tapasztalat, kezdes, megjegyzes, classes, consent_at, ip_hash)
    values
      (${input.vezeteknev}, ${input.keresztnev}, ${input.email.toLowerCase()}, ${input.szuletes},
       ${minor ? input.szulo_nev : null}, ${minor ? input.szulo_email.toLowerCase() : null},
       ${input.tapasztalat}, ${input.kezdes}, ${input.megjegyzes}, ${classLabels}, now(), ${ipHash})
    returning id`;

  // E-mailek a válasz elküldése UTÁN — a látogatónak nem kell rájuk várnia.
  after(async () => {
    const name = `${input.vezeteknev} ${input.keresztnev}`;
    const rows: [string, string][] = [
      ["Név", name],
      ["E-mail", input.email],
      ["Születési dátum", input.szuletes],
    ];
    if (minor) rows.push(["Szülő", `${input.szulo_nev} · ${input.szulo_email}`]);
    rows.push(["Tánctapasztalat", input.tapasztalat], ["Kezdés", input.kezdes], ["Órák", classLabels.join("\n")]);
    if (input.megjegyzes) rows.push(["Megjegyzés", input.megjegyzes]);

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
      const mail = renderEmail({
        title: "Köszönjük a jelentkezést!",
        intro: `Kedves ${input.keresztnev}! Megkaptuk a jelentkezésedet, hamarosan keresünk a megadott e-mail címen.`,
        rows,
        outro: "Ha valamit módosítanál, egyszerűen válaszolj erre az e-mailre.",
      });
      await sendEmail({
        to: input.email,
        cc: minor && input.szulo_email ? [input.szulo_email] : undefined,
        replyTo: notifyTo?.split(",")[0]?.trim() || undefined,
        subject: "Megkaptuk a jelentkezésedet — Under Cover",
        ...mail,
      });
    }
  });

  return { ok: true };
}
