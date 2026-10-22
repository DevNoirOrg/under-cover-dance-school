"use client";

import { useState } from "react";
import { saveFooter } from "@/app/actions/admin";
import { Button, Card, Field, IconButton, PageHeader, SaveBar, inputCls, isSame, useSaver } from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { FooterContent } from "@/lib/content-types";

export default function FooterEditor({ initial, info }: { initial: FooterContent; info: EditInfo }) {
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const { pending, status, save } = useSaver();
  const set = <K extends keyof FooterContent>(k: K, val: FooterContent[K]) => setV((p) => ({ ...p, [k]: val }));

  return (
    <div>
      <PageHeader title="Lábléc" description="Elérhetőségek, közösségi linkek és az alsó sor szövegei." />
      <div className="space-y-6">
        <Card title="Elérhetőségek" description="Az e-mail cím és a telefonszám kattintható lesz. Ha valamelyik üres, nem jelenik meg.">
          <div className="grid gap-5 md:grid-cols-2">
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
                  <input
                    aria-label="Helyszín"
                    className={inputCls}
                    value={l.text}
                    placeholder="MD Dance Studio – Opera: 6. kerület, Hajós utca 1."
                    onChange={(e) => set("locations", v.locations.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                  />
                  <input
                    aria-label="Megjegyzés a helyszínhez"
                    className={inputCls}
                    value={l.note}
                    placeholder="pl. Opera metrómegállótól 2 percre (nem kötelező)"
                    onChange={(e) => set("locations", v.locations.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))}
                  />
                </div>
                <IconButton label="Törlés" onClick={() => set("locations", v.locations.filter((_, j) => j !== i))}>
                  ✕
                </IconButton>
              </div>
            ))}
            {v.locations.length < 6 && (
              <Button variant="ghost" onClick={() => set("locations", [...v.locations, { text: "", note: "" }])}>
                + Új helyszín
              </Button>
            )}
          </div>
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
