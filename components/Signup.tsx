"use client";

import { useEffect, useRef, useState } from "react";
import type { FormOptions } from "@/lib/content-types";
import { PARENT_REQUIRED_UNDER_AGE } from "@/lib/form-rules";
import { submitApplication } from "@/app/actions/applications";
import { SelectionChip, useSelection } from "./selection";

/*
  JELENTKEZÉS — lebegő körvonalas cím a kártya fölött.
  Viselkedés (1:1 a designnal):
   - a kiválasztott órák az órarendből jönnek (chipek a form tetején)
   - 16 év alatt a szülő neve + e-mail címe kötelezővé válik
   - a tánctapasztalat nem kötelező; két külön kötelező jelölőnégyzet
   - magyar nyelvű, mezőnkénti validáció; egy mező csak akkor piros, ha
     a látogató már hozzányúlt, vagy megpróbálta beküldeni
   - az első sikertelen beküldés után a hibák élőben frissülnek
   - beküldés: app/actions/applications.ts (mentés + e-mail értesítés)
*/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Telefonszám: számjegyek, szóköz, +, -, /, zárójel; legalább 7 számjegy. */
const PHONE_RE = /^\+?[\d\s\-()/]+$/;

type Values = {
  nev: string;
  email: string;
  telefon: string;
  szuletes: string;
  szulo_nev: string;
  szulo_email: string;
  tapasztalat: string;
  megjegyzes: string;
};

const emptyValues: Values = {
  nev: "",
  email: "",
  telefon: "",
  szuletes: "",
  szulo_nev: "",
  szulo_email: "",
  tapasztalat: "",
  megjegyzes: "",
};

type FieldKey = keyof Values;
/** A kötelező mezők a DOM sorrendjében (az első hibásra görgetünk). */
const REQUIRED_ORDER: FieldKey[] = ["nev", "email", "telefon", "szuletes", "szulo_nev", "szulo_email"];
/** A két kötelező jelölőnégyzet: tájékoztató elfogadása + hozzájárulás az adatkezeléshez. */
const CONSENTS = ["tajekoztato", "adatkezeles"] as const;
type ConsentKey = (typeof CONSENTS)[number];
type ErrorKey = FieldKey | ConsentKey;
const CONSENT_ERRORS: Record<ConsentKey, string> = {
  tajekoztato: "A jelentkezéshez el kell fogadnod az Adatkezelési tájékoztatót.",
  adatkezeles: "A jelentkezéshez hozzá kell járulnod az adataid kezeléséhez.",
};

const fid = (k: ErrorKey) => `f-${k}`;

function ageFrom(value: string): number | null {
  if (!value) return null;
  const d = new Date(value + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

function fieldMessage(k: FieldKey, v: string): string | null {
  const value = v.trim();
  if (!value) return "Ezt a mezőt kötelező kitölteni.";
  if ((k === "email" || k === "szulo_email") && !EMAIL_RE.test(value)) {
    return "Adj meg egy érvényes e-mail címet.";
  }
  if (k === "telefon" && (!PHONE_RE.test(value) || value.replace(/\D/g, "").length < 7)) {
    return "Adj meg egy érvényes telefonszámot.";
  }
  if (k === "szuletes") {
    const a = ageFrom(value);
    if (a === null) return "Adj meg egy érvényes dátumot.";
    if (a < 0) return "A dátum a jövőben van.";
    if (a > 100) return "Ellenőrizd a megadott dátumot.";
  }
  return null;
}

function summaryText(nProblems: number) {
  return nProblems === 1
    ? "Egy mező még hiányzik vagy hibás."
    : nProblems + " mező még hiányzik vagy hibás. A pirossal jelölt helyeket javítsd!";
}

const labelClass = "text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block ml-4";
const inputClass =
  "form-input w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 focus:outline-none focus:border-uc/40 transition-all font-semibold text-ink placeholder:text-slate-300";

function Req() {
  return <span className="text-uc-deep">*</span>;
}

function FieldError({ message, className = "field-error" }: { message?: string; className?: string }) {
  return (
    <p className={className} hidden={!message}>
      {message}
    </p>
  );
}

export default function Signup({ formOptions }: { formOptions: FormOptions }) {
  const { selected, clear } = useSelection();

  const [values, setValues] = useState<Values>(emptyValues);
  const [consents, setConsents] = useState<Record<ConsentKey, boolean>>({ tajekoztato: false, adatkezeles: false });
  /** Igaz, ha a látogató már megpróbálta beküldeni a formot. */
  const [submitTried, setSubmitTried] = useState(false);
  /** Mezők, amikhez a látogató már hozzányúlt. */
  const [touched, setTouched] = useState<ReadonlySet<ErrorKey>>(() => new Set());
  /** A beküldéskor hibás mezők — ezek pirosak maradnak, amíg ki nem javítja őket. */
  const [flaggedAtSubmit, setFlaggedAtSubmit] = useState<ReadonlySet<ErrorKey>>(() => new Set());
  const [thanksRows, setThanksRows] = useState<[string, React.ReactNode][] | null>(null);
  /** A szerver által visszaadott hiba (pl. túl sok jelentkezés). */
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /** Rejtett csapdamező (spamvédelem) — ember nem látja, nem tölti ki. */
  const [website, setWebsite] = useState("");
  const thanksRef = useRef<HTMLDivElement>(null);

  const age = ageFrom(values.szuletes);
  const minor = age !== null && age >= 0 && age < PARENT_REQUIRED_UNDER_AGE;

  // ---- validáció (a jelenlegi értékekből számolva) ----
  const invalidFields: Partial<Record<ErrorKey, string>> = {};
  for (const k of REQUIRED_ORDER) {
    if ((k === "szulo_nev" || k === "szulo_email") && !minor) continue;
    const msg = fieldMessage(k, values[k]);
    if (msg) invalidFields[k] = msg;
  }
  for (const c of CONSENTS) if (!consents[c]) invalidFields[c] = CONSENT_ERRORS[c];
  const noSelection = selected.length === 0;

  // Hibát csak az első beküldési kísérlet után mutatunk; utána egy mező akkor
  // piros, ha hibás ÉS (már hozzányúlt, vagy a beküldéskor is hibás volt).
  // Ahogy javítja, a hiba élőben eltűnik.
  const errors: Partial<Record<ErrorKey, string>> = {};
  if (submitTried) {
    for (const [k, msg] of Object.entries(invalidFields) as [ErrorKey, string][]) {
      if (touched.has(k) || flaggedAtSubmit.has(k)) errors[k] = msg;
    }
  }
  const selectionError = submitTried && noSelection;
  const invalidCount = Object.keys(invalidFields).length + (noSelection ? 1 : 0);
  const shownCount = Object.keys(errors).length + (selectionError ? 1 : 0);
  const summary =
    submitTried && invalidCount > 0 ? summaryText(shownCount || invalidCount) : serverError;

  useEffect(() => {
    if (thanksRows) thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [thanksRows]);

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setTouched((prev) => new Set(prev).add(k));
    setValues((prev) => ({ ...prev, [k]: v }));
  };

  const errFor = (k: ErrorKey) => errors[k];
  const cls = (k: FieldKey, extra = "") =>
    `${inputClass}${extra ? " " + extra : ""}${errFor(k) ? " has-error" : ""}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitTried(true);
    if (invalidCount > 0) {
      setFlaggedAtSubmit(new Set(Object.keys(invalidFields) as ErrorKey[]));
      // az első hibás helyre görgetünk
      const firstField = (Object.keys(invalidFields) as ErrorKey[])[0];
      const firstBad = noSelection ? "form-selection" : firstField ? fid(firstField) : null;
      if (firstBad) document.getElementById(firstBad)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (pending) return;
    setPending(true);
    setServerError(null);
    let result;
    try {
      result = await submitApplication({
        nev: values.nev,
        email: values.email,
        telefon: values.telefon,
        szuletes: values.szuletes,
        szulo_nev: minor ? values.szulo_nev : "",
        szulo_email: minor ? values.szulo_email : "",
        tapasztalat: values.tapasztalat,
        megjegyzes: values.megjegyzes,
        tajekoztato: true,
        adatkezeles: true,
        classIds: selected.map((c) => c.id),
        website,
      });
    } catch {
      result = { ok: false as const, error: "Nem sikerült elküldeni a jelentkezést. Kérjük, próbáld újra pár perc múlva." };
    } finally {
      setPending(false);
    }
    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    const data = { ...values, valasztott_orak: selected.map((c) => c.full) };
    const rows: [string, React.ReactNode][] = [
      ["Név", data.nev],
      ["E-mail", data.email],
      ["Telefon", data.telefon],
      ["Születési dátum", data.szuletes],
    ];
    if (minor) rows.push(["Szülő", data.szulo_nev + " · " + data.szulo_email]);
    if (data.tapasztalat) rows.push(["Tánctapasztalat", data.tapasztalat]);
    rows.push([
      "Órák",
      data.valasztott_orak.map((o, i) => (
        <span key={o}>
          {i > 0 && <br />}
          {o}
        </span>
      )),
    ]);
    if (data.megjegyzes.trim()) rows.push(["Megjegyzés", data.megjegyzes]);
    setThanksRows(rows);
  }

  function restart() {
    setValues(emptyValues);
    setConsents({ tajekoztato: false, adatkezeles: false });
    setSubmitTried(false);
    setTouched(new Set());
    setFlaggedAtSubmit(new Set());
    clear();
    setThanksRows(null);
    setServerError(null);
    document.getElementById("orarend")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const n = selected.length;

  return (
    <section
      id="jelentkezes"
      className="relative py-24 md:py-32 px-6 bg-mist scroll-mt-24"
      style={{
        backgroundImage: 'url("/jelentkezes-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Sötét backdrop, hogy a kártya és a felirat olvasható maradjon */}
      <div className="absolute inset-0 bg-ink/50"></div>

      <div className="relative z-10 max-w-3xl mx-auto bg-white p-8 sm:p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-slate-100 overflow-visible mt-16 md:mt-20">
        <div className="absolute top-0 left-1/2 -mt-2 -translate-x-1/2 -translate-y-1/2 w-full px-6 pointer-events-none select-none text-center">
          <span className="outlined-title font-title font-black text-ink text-5xl md:text-7xl whitespace-nowrap">
            Jelentkezés
          </span>
        </div>

        <form id="jelentkezes-form" className="pt-6 md:pt-8 space-y-7" noValidate onSubmit={handleSubmit} hidden={!!thanksRows}>
          {/* ---- Választott óráid ---- */}
          <div
            id="form-selection"
            className={`rounded-[28px] bg-uc-pale/70 border-2 border-uc/20 p-6${selectionError ? " has-error" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-uc-deep">Választott óráid</span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-uc-deep/60">{n} óra</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {selected.map((c) => (
                <SelectionChip key={c.id} item={c} light />
              ))}
            </div>
            <FieldError
              className="field-error !ml-0 mt-3"
              message={selectionError ? "Válassz legalább egy órát az órarendből!" : undefined}
            />
            <div className="mt-3" hidden={n > 0}>
              <p className="text-sm font-semibold text-slate-500">
                Még nincs kiválasztott órád — legalább egyet válassz az órarendből.
              </p>
              <a
                href="#orarend"
                className="inline-block mt-3 bg-uc-deep text-white px-5 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-ink transition-colors"
              >
                Vissza az órarendhez
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className={labelClass} htmlFor="f-nev">
                Teljes név (Táncos) <Req />
              </label>
              <input
                type="text"
                id="f-nev"
                name="nev"
                autoComplete="name"
                placeholder="Kovács Emma"
                className={cls("nev")}
                value={values.nev}
                onChange={set("nev")}
              />
              <FieldError message={errFor("nev")} />
            </div>
            <div className="space-y-3">
              <label className={labelClass} htmlFor="f-email">
                E-mail cím (Táncos) <Req />
              </label>
              <input
                type="email"
                id="f-email"
                name="email"
                autoComplete="email"
                placeholder="hello@valami.hu"
                className={cls("email")}
                value={values.email}
                onChange={set("email")}
              />
              <FieldError message={errFor("email")} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className={labelClass} htmlFor="f-telefon">
                Telefonszám <Req />
              </label>
              <input
                type="tel"
                id="f-telefon"
                name="telefon"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+36 30 123 4567"
                className={cls("telefon")}
                value={values.telefon}
                onChange={set("telefon")}
              />
              <FieldError message={errFor("telefon")} />
            </div>

            <div className="space-y-3">
              <label className={labelClass} htmlFor="f-szuletes">
                Mikor születtél? (Táncos) <Req />
              </label>
              <input
                type="date"
                id="f-szuletes"
                name="szuletes"
                className={cls("szuletes")}
                value={values.szuletes}
                onChange={set("szuletes")}
              />
              <FieldError message={errFor("szuletes")} />
            </div>
          </div>

          {/* ---- 16 év alattiaknak: szülő adatai ---- */}
          <div id="szulo-blokk" className="parent-block space-y-6" hidden={!minor}>
            <div className="rounded-2xl bg-uc-pale/70 border-2 border-uc/20 px-6 py-5">
              <p className="text-sm font-bold text-uc-deep">
                16 év alatti vagy — kérjük, add meg a szülőd teljes nevét és e-mail címét!
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className={labelClass} htmlFor="f-szulo_nev">
                  Szülő teljes neve <Req />
                </label>
                <input
                  type="text"
                  id="f-szulo_nev"
                  name="szulo_nev"
                  placeholder="Kovács Ákos"
                  className={cls("szulo_nev")}
                  value={values.szulo_nev}
                  onChange={set("szulo_nev")}
                />
                <FieldError message={errFor("szulo_nev")} />
              </div>
              <div className="space-y-3">
                <label className={labelClass} htmlFor="f-szulo_email">
                  Szülő e-mail címe <Req />
                </label>
                <input
                  type="email"
                  id="f-szulo_email"
                  name="szulo_email"
                  placeholder="szulo@valami.hu"
                  className={cls("szulo_email")}
                  value={values.szulo_email}
                  onChange={set("szulo_email")}
                />
                <FieldError message={errFor("szulo_email")} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className={labelClass} htmlFor="f-tapasztalat">
              Táncoltál már korábban?
            </label>
            <select
              id="f-tapasztalat"
              name="tapasztalat"
              className={`${inputClass} form-select appearance-none cursor-pointer${values.tapasztalat ? "" : " is-empty"}`}
              value={values.tapasztalat}
              onChange={set("tapasztalat")}
            >
              <option value="">Válassz…</option>
              {formOptions.experience.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className={labelClass} htmlFor="f-megjegyzes">
              Megjegyzés
            </label>
            <textarea
              id="f-megjegyzes"
              name="megjegyzes"
              rows={4}
              placeholder="Bármi, amit tudnunk érdemes…"
              className={`${inputClass} resize-none`}
              value={values.megjegyzes}
              onChange={set("megjegyzes")}
            ></textarea>
          </div>

          {/* ---- Két kötelező jelölőnégyzet ---- */}
          <div className="rounded-[28px] bg-slate-50 p-6 space-y-5">
            {CONSENTS.map((c) => (
              <div key={c}>
                <label htmlFor={fid(c)} className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    id={fid(c)}
                    name={c}
                    value="elfogadva"
                    className={`consent-box mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-md accent-[#9147a1]${errors[c] ? " has-error" : ""}`}
                    checked={consents[c]}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setTouched((prev) => new Set(prev).add(c));
                      setConsents((prev) => ({ ...prev, [c]: checked }));
                    }}
                  />
                  <span className="text-sm font-semibold leading-relaxed text-slate-600">
                    {c === "tajekoztato" ? (
                      <>
                        Elolvastam és elfogadom az{" "}
                        <a
                          href="/adatkezeles"
                          target="_blank"
                          rel="noopener"
                          className="font-bold text-uc-deep underline underline-offset-2 hover:text-ink"
                        >
                          Adatkezelési tájékoztatóban
                        </a>{" "}
                        foglaltakat.
                      </>
                    ) : (
                      "Hozzájárulok a fenti adataim Adatkezelő által történő kezeléséhez."
                    )}{" "}
                    <Req />
                  </span>
                </label>
                <FieldError className="field-error !ml-10 mt-2" message={errors[c]} />
              </div>
            ))}
          </div>

          <p
            className="rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-bold px-6 py-4"
            hidden={!summary}
          >
            {summary}
          </p>

          {/* Spamvédelmi csapdamező — képernyőn kívül, emberek nem látják. */}
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
            <label htmlFor="f-website">Weboldal</label>
            <input
              type="text"
              id="f-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="w-full bg-ink text-white py-6 rounded-2xl font-extrabold uppercase tracking-[0.3em] shadow-xl hover:bg-uc-deep transition-all mt-4 disabled:opacity-60 disabled:cursor-wait"
          >
            {pending ? "Küldés…" : "Jelentkezem"}
          </button>
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Req /> kötelező mező
          </p>
        </form>

        {/* ---- Köszönő állapot ---- */}
        <div ref={thanksRef} className="pt-6 md:pt-8 text-center" hidden={!thanksRows}>
          <div className="mx-auto w-20 h-20 rounded-full bg-uc-pale flex items-center justify-center">
            <span className="thanks-tick" aria-hidden="true"></span>
          </div>
          <h3 className="font-title font-black text-3xl text-ink mt-6">Köszönjük a jelentkezést!</h3>
          <p className="text-sm font-semibold text-slate-500 mt-3">Hamarosan keresünk a megadott e-mail címen.</p>
          <div className="text-left rounded-[28px] bg-slate-50 p-6 mt-8 space-y-2">
            {thanksRows?.map(([k, v]) => (
              <div key={k} className="flex flex-col sm:flex-row sm:gap-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 sm:w-40 shrink-0 pt-1">
                  {k}
                </span>
                <span className="text-sm font-bold text-ink">{v}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={restart}
            className="mt-8 text-[10px] font-extrabold uppercase tracking-widest text-uc-deep hover:text-ink transition-colors"
          >
            Új jelentkezés indítása
          </button>
        </div>
      </div>
    </section>
  );
}
