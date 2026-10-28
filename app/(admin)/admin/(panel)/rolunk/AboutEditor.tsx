"use client";

import { useState } from "react";
import { saveAbout } from "@/app/actions/admin";
import MediaField from "@/components/admin/MediaField";
import { Card, Field, LangTabs, PageHeader, SaveBar, TrText, countMissing, isSame, useSaver, type EditLang } from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { AboutContent, AboutText } from "@/lib/content-types";

export default function AboutEditor({ initial, info }: { initial: AboutContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const [lang, setLang] = useState<EditLang>("hu");
  const set = <K extends keyof AboutContent>(k: K, val: AboutContent[K]) => setV((p) => ({ ...p, [k]: val }));
  const setEn = (k: keyof AboutText, val: string) => setV((p) => ({ ...p, en: { ...p.en, [k]: val } }));
  const e = v.en ?? {};
  const tr = (k: keyof AboutText) => ({ lang, hu: v[k], en: e[k], onHu: (x: string) => set(k, x), onEn: (x: string) => setEn(k, x) });
  const missing = countMissing((["titleLine1", "titleLine2", "paragraph", "highlight", "imageAlt"] as const).map((k) => [v[k], e[k]]));

  return (
    <div>
      <PageHeader title="Rólunk" description="A „Több mint tánc.” szekció szövegei és képe.">
        <LangTabs lang={lang} onChange={setLang} missing={missing} />
      </PageHeader>
      <div className="space-y-6">
        <Card title="Szövegek">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Cím — 1. sor" htmlFor="t1">
              <TrText id="t1" {...tr("titleLine1")} />
            </Field>
            <Field label="Cím — 2. sor (lila)" htmlFor="t2">
              <TrText id="t2" {...tr("titleLine2")} />
            </Field>
            <Field label="Bekezdések" htmlFor="pa" className="md:col-span-2" hint="Új bekezdés: hagyj egy üres sort a bekezdések között.">
              <TrText id="pa" rows={12} {...tr("paragraph")} />
            </Field>
            <Field label="Kiemelt bekezdés (sötétebb) — a végén" htmlFor="hi" className="md:col-span-2">
              <TrText id="hi" rows={2} {...tr("highlight")} />
            </Field>
          </div>
        </Card>

        <Card title="Kép">
          <div className="grid gap-6 md:grid-cols-2">
            <MediaField kind="image" value={v.imagePath} onChange={(p) => p && set("imagePath", p)} allowRemove={false} aspectClass="aspect-[4/5] max-w-[260px]" />
            <Field label="A kép rövid leírása" htmlFor="alt" hint="Képernyőolvasóknak és a keresőknek.">
              <TrText id="alt" {...tr("imageAlt")} />
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
        onSave={() => save(() => saveAbout(v), undefined, () => setSaved(v))}
      />
    </div>
  );
}
