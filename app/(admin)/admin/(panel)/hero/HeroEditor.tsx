"use client";

import { useState } from "react";
import { saveHero } from "@/app/actions/admin";
import MediaField from "@/components/admin/MediaField";
import { Card, Field, LangTabs, PageHeader, SaveBar, TrText, countMissing, inputCls, isSame, useSaver, type EditLang } from "@/components/admin/ui";
import { HeroLead } from "@/components/Hero";
import type { EditInfo } from "@/lib/admin-data";
import type { HeroContent, HeroText } from "@/lib/content-types";
import { t } from "@/lib/i18n";

export default function HeroEditor({ initial, info }: { initial: HeroContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const [lang, setLang] = useState<EditLang>("hu");
  const set = <K extends keyof HeroContent>(k: K, val: HeroContent[K]) => setV((p) => ({ ...p, [k]: val }));
  const setEn = (k: keyof HeroText, val: string) => setV((p) => ({ ...p, en: { ...p.en, [k]: val } }));
  const e = v.en ?? {};
  const missing = countMissing([
    [v.badge, e.badge],
    [v.leadBefore, e.leadBefore],
  ]);
  const enDefaults = t("en").hero;

  return (
    <div>
      <PageHeader title="Hero" description="Az oldal tetején lévő rész: jelvény, bemutatkozó szöveg és az álló videó.">
        <LangTabs lang={lang} onChange={setLang} missing={missing} />
      </PageHeader>
      <div className="space-y-6">
        <Card title="Szövegek">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Jelvény" htmlFor="badge" hint="A logó alatti kis lekerekített címke.">
              <TrText id="badge" lang={lang} hu={v.badge} en={e.badge} onHu={(x) => set("badge", x)} onEn={(x) => setEn("badge", x)} />
            </Field>
            <div />
            <Field label="Bemutatkozó szöveg" htmlFor="lb" className="md:col-span-2">
              <TrText
                id="lb"
                rows={3}
                lang={lang}
                hu={v.leadBefore}
                en={e.leadBefore}
                onHu={(x) => set("leadBefore", x)}
                onEn={(x) => setEn("leadBefore", x)}
              />
            </Field>
            {lang === "en" && (
              <>
                <Field label="Fő gomb felirata" htmlFor="cta1" hint={`Üresen: „${enDefaults.primaryCta}”.`}>
                  <input id="cta1" className={inputCls} value={e.primaryCtaLabel ?? ""} placeholder={enDefaults.primaryCta} onChange={(x) => setEn("primaryCtaLabel", x.target.value)} />
                </Field>
                <Field label="Második gomb felirata" htmlFor="cta2" hint={`Üresen: „${enDefaults.secondaryCta}”.`}>
                  <input id="cta2" className={inputCls} value={e.secondaryCtaLabel ?? ""} placeholder={enDefaults.secondaryCta} onChange={(x) => setEn("secondaryCtaLabel", x.target.value)} />
                </Field>
              </>
            )}
          </div>
          <div className="mt-6 rounded-2xl bg-uc-hero-dark p-6">
            <p className="max-w-lg text-xl font-semibold leading-relaxed text-white/90">
              <HeroLead hero={lang === "en" ? { leadBefore: e.leadBefore?.trim() || v.leadBefore, leadHighlight: "", leadAfter: "" } : v} />
            </p>
          </div>
        </Card>

        <Card title="Álló videó" description="Ha nincs videó, a szaggatott keretes „Álló videó” helyőrző látszik az oldalon.">
          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Videó (MP4)">
              <MediaField kind="video" value={v.videoPath} onChange={(p) => set("videoPath", p)} aspectClass="aspect-[9/16] max-w-[220px]" />
            </Field>
            <Field label="Borítókép (amíg a videó betölt)" hint="Nem kötelező.">
              <MediaField kind="image" value={v.videoPosterPath} onChange={(p) => set("videoPosterPath", p)} aspectClass="aspect-[9/16] max-w-[220px]" />
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
        onSave={() => {
          // a kiemelt rész megszűnt: a régi (adatbázisban maradt) értékeket is ürítjük
          const next = { ...v, leadHighlight: "", leadAfter: "", en: { ...v.en, leadHighlight: "", leadAfter: "" } };
          save(() => saveHero(next), undefined, () => {
            setV(next);
            setSaved(next);
          });
        }}
      />
    </div>
  );
}
