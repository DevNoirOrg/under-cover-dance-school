"use client";

import { useState } from "react";
import { saveHero } from "@/app/actions/admin";
import MediaField from "@/components/admin/MediaField";
import { Card, Field, PageHeader, SaveBar, inputCls, isSame, textareaCls, useSaver } from "@/components/admin/ui";
import { HeroLead } from "@/components/Hero";
import type { EditInfo } from "@/lib/admin-data";
import type { HeroContent } from "@/lib/content-types";

export default function HeroEditor({ initial, info }: { initial: HeroContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const set = <K extends keyof HeroContent>(k: K, val: HeroContent[K]) => setV((p) => ({ ...p, [k]: val }));

  return (
    <div>
      <PageHeader title="Hero" description="Az oldal tetején lévő rész: jelvény, bemutatkozó szöveg és az álló videó." />
      <div className="space-y-6">
        <Card title="Szövegek">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Jelvény" htmlFor="badge" hint="A logó alatti kis lekerekített címke.">
              <input id="badge" className={inputCls} value={v.badge} onChange={(e) => set("badge", e.target.value)} />
            </Field>
            <div />
            <Field label="Bemutatkozó szöveg" htmlFor="lb" className="md:col-span-2">
              <textarea id="lb" rows={3} className={textareaCls} value={v.leadBefore} onChange={(e) => set("leadBefore", e.target.value)} />
            </Field>
          </div>
          <div className="mt-6 rounded-2xl bg-uc-hero-dark p-6">
            <p className="max-w-lg text-xl font-semibold leading-relaxed text-white/90">
              <HeroLead hero={v} />
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
          const next = { ...v, leadHighlight: "", leadAfter: "" };
          save(() => saveHero(next), undefined, () => {
            setV(next);
            setSaved(next);
          });
        }}
      />
    </div>
  );
}
