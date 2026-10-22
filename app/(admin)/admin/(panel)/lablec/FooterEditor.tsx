"use client";

import { useState } from "react";
import { saveFooter } from "@/app/actions/admin";
import { Button, Card, Field, IconButton, PageHeader, SaveBar, StringListEditor, inputCls, isSame, useSaver } from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { FooterContent } from "@/lib/content-types";

export default function FooterEditor({ initial, info }: { initial: FooterContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const set = <K extends keyof FooterContent>(k: K, val: FooterContent[K]) => setV((p) => ({ ...p, [k]: val }));

  return (
    <div>
      <PageHeader title="Lábléc" description="Helyszínek, közösségi linkek és az alsó sor szövegei." />
      <div className="space-y-6">
        <Card title="Helyszínek">
          <StringListEditor items={v.locations} onChange={(x) => set("locations", x)} placeholder="Budapest, Akácfa u. 12." addLabel="+ Új helyszín" max={6} />
        </Card>
        <Card title="Kövess minket" description="Ha a link üres, a felirat nem kattintható.">
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
              <input id="cp" className={inputCls} value={v.copyright} onChange={(e) => set("copyright", e.target.value)} />
            </Field>
            <Field label="Szlogen" htmlFor="tg">
              <input id="tg" className={inputCls} value={v.tagline} onChange={(e) => set("tagline", e.target.value)} />
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
