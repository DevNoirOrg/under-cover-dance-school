"use client";

import { useState } from "react";
import { saveFooter } from "@/app/actions/admin";
import {
  Button,
  Card,
  Field,
  IconButton,
  LangTabs,
  PageHeader,
  SaveBar,
  TrText,
  countMissing,
  inputCls,
  isSame,
  useSaver,
  type EditLang,
} from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { FooterContent } from "@/lib/content-types";

export default function FooterEditor({ initial, info }: { initial: FooterContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const [lang, setLang] = useState<EditLang>("hu");
  const set = <K extends keyof FooterContent>(k: K, val: FooterContent[K]) => setV((p) => ({ ...p, [k]: val }));
  const setLoc = (i: number, patch: Partial<FooterContent["locations"][number]>) =>
    set("locations", v.locations.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const isEn = lang === "en";
  const missing = countMissing([
    ...v.locations.flatMap((l) => [[l.text, l.en?.text], [l.note, l.en?.note]] as [string, string | undefined][]),
    [v.copyright, v.en?.copyright],
    [v.tagline, v.en?.tagline],
  ]);

  return (
    <div>
      <PageHeader title="Lábléc" description="Elérhetőségek, közösségi linkek és az alsó sor szövegei.">
        <LangTabs lang={lang} onChange={setLang} missing={missing} />
      </PageHeader>
      <div className="space-y-6">
        <Card
          title="Elérhetőségek"
          description={
            isEn
              ? "Angolul csak a helyszínek szövege fordítható; az e-mail cím és a telefonszám mindkét nyelven ugyanaz."
              : "Az e-mail cím és a telefonszám kattintható lesz. Ha valamelyik üres, nem jelenik meg."
          }
        >
          <div className="grid gap-5 md:grid-cols-2" hidden={isEn}>
            <Field label="E-mail" htmlFor="em">
              <input id="em" type="email" className={inputCls} value={v.email} placeholder="info@kpoptanciskola.com" onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Telefonszám" htmlFor="ph">
              <input id="ph" className={inputCls} value={v.phone} placeholder="+36 (30) 870-7306" onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </div>
          <p className="mt-6 mb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Helyszínek</p>
          <div className="space-y-3">
            {v.locations.map((l, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="grid flex-1 gap-2 md:grid-cols-2">
                  <TrText
                    ariaLabel="Helyszín"
                    lang={lang}
                    hu={l.text}
                    en={l.en?.text}
                    placeholder="MD Dance Studio – Opera: 6. kerület, Hajós utca 1."
                    onHu={(x) => setLoc(i, { text: x })}
                    onEn={(x) => setLoc(i, { en: { ...l.en, text: x } })}
                  />
                  <TrText
                    ariaLabel="Megjegyzés a helyszínhez"
                    lang={lang}
                    hu={l.note}
                    en={l.en?.note}
                    placeholder="pl. Opera metrómegállótól 2 percre (nem kötelező)"
                    onHu={(x) => setLoc(i, { note: x })}
                    onEn={(x) => setLoc(i, { en: { ...l.en, note: x } })}
                  />
                </div>
                {!isEn && (
                  <IconButton label="Törlés" onClick={() => set("locations", v.locations.filter((_, j) => j !== i))}>
                    ✕
                  </IconButton>
                )}
              </div>
            ))}
            {v.locations.length < 6 && !isEn && (
              <Button variant="ghost" onClick={() => set("locations", [...v.locations, { text: "", note: "" }])}>
                + Új helyszín
              </Button>
            )}
          </div>
        </Card>
        <Card title="Kövess minket" description="Ha a link üres, a felirat nem kattintható." className={isEn ? "hidden" : ""}>
          <div className="space-y-2">
            {v.socials.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  aria-label="Felirat"
                  className={`${inputCls} max-w-[90px] uppercase`}
                  value={s.label}
                  placeholder="IG"
                  onChange={(e) => set("socials", v.socials.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                />
                <input
                  aria-label="Link"
                  className={inputCls}
                  value={s.href ?? ""}
                  placeholder="https://instagram.com/..."
                  onChange={(e) => set("socials", v.socials.map((x, j) => (j === i ? { ...x, href: e.target.value || null } : x)))}
                />
                <IconButton label="Törlés" onClick={() => set("socials", v.socials.filter((_, j) => j !== i))}>
                  ✕
                </IconButton>
              </div>
            ))}
            {v.socials.length < 6 && (
              <Button variant="ghost" onClick={() => set("socials", [...v.socials, { label: "", href: null }])}>
                + Új link
              </Button>
            )}
          </div>
        </Card>
        <Card title="Alsó sor">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Copyright" htmlFor="cp">
              <TrText
                id="cp"
                lang={lang}
                hu={v.copyright}
                en={v.en?.copyright}
                onHu={(x) => set("copyright", x)}
                onEn={(x) => set("en", { ...v.en, copyright: x })}
              />
            </Field>
            <Field label="Szlogen" htmlFor="tg">
              <TrText
                id="tg"
                lang={lang}
                hu={v.tagline}
                en={v.en?.tagline}
                onHu={(x) => set("tagline", x)}
                onEn={(x) => set("en", { ...v.en, tagline: x })}
              />
            </Field>
          </div>
        </Card>
      </div>
      <SaveBar
        dirty={!isSame(v, saved)}
        pending={pending}
        status={status}
        info={info}
        onReset={() => setV(saved)}
        onSave={() => save(() => saveFooter(v), undefined, () => setSaved(v))}
      />
    </div>
  );
}
