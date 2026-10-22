"use client";

import { useState } from "react";
import { saveAbout } from "@/app/actions/admin";
import MediaField from "@/components/admin/MediaField";
import { Button, Card, Field, IconButton, PageHeader, SaveBar, inputCls, isSame, textareaCls, useSaver } from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { AboutContent } from "@/lib/content-types";

export default function AboutEditor({ initial, info }: { initial: AboutContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const set = <K extends keyof AboutContent>(k: K, val: AboutContent[K]) => setV((p) => ({ ...p, [k]: val }));

  return (
    <div>
      <PageHeader title="Rólunk" description="A „Több mint tánc.” szekció szövegei, számai és képe." />
      <div className="space-y-6">
        <Card title="Szövegek">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Cím — 1. sor" htmlFor="t1">
              <input id="t1" className={inputCls} value={v.titleLine1} onChange={(e) => set("titleLine1", e.target.value)} />
            </Field>
            <Field label="Cím — 2. sor (lila)" htmlFor="t2">
              <input id="t2" className={inputCls} value={v.titleLine2} onChange={(e) => set("titleLine2", e.target.value)} />
            </Field>
            <Field label="Bekezdés" htmlFor="pa" className="md:col-span-2">
              <textarea id="pa" rows={3} className={textareaCls} value={v.paragraph} onChange={(e) => set("paragraph", e.target.value)} />
            </Field>
            <Field label="Kiemelt bekezdés (sötétebb)" htmlFor="hi" className="md:col-span-2">
              <textarea id="hi" rows={2} className={textareaCls} value={v.highlight} onChange={(e) => set("highlight", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Számok" description="Pl. „12+ Oktató”. Legfeljebb 4.">
          <div className="space-y-2">
            {v.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  aria-label="Szám"
                  className={`${inputCls} max-w-[120px]`}
                  value={s.value}
                  placeholder="12+"
                  onChange={(e) => set("stats", v.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                />
                <input
                  aria-label="Felirat"
                  className={inputCls}
                  value={s.label}
                  placeholder="Oktató"
                  onChange={(e) => set("stats", v.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                />
                <IconButton label="Törlés" onClick={() => set("stats", v.stats.filter((_, j) => j !== i))}>
                  ✕
                </IconButton>
              </div>
            ))}
            {v.stats.length < 4 && (
              <Button variant="ghost" onClick={() => set("stats", [...v.stats, { value: "", label: "" }])}>
                + Új szám
              </Button>
            )}
          </div>
        </Card>

        <Card title="Kép">
          <div className="grid gap-6 md:grid-cols-2">
            <MediaField kind="image" value={v.imagePath} onChange={(p) => p && set("imagePath", p)} allowRemove={false} aspectClass="aspect-[4/5] max-w-[260px]" />
            <Field label="A kép rövid leírása" htmlFor="alt" hint="Képernyőolvasóknak és a keresőknek.">
              <input id="alt" className={inputCls} value={v.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
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
