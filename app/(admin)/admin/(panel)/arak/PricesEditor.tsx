"use client";

import { useState } from "react";
import { savePrices } from "@/app/actions/admin";
import { Button, Card, IconButton, PageHeader, SaveBar, inputCls, isSame, useSaver } from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { PriceItem, PriceNote } from "@/lib/content-types";

type Item = Omit<PriceItem, "id"> & { id?: string; key: string };
type State = { items: Item[]; notes: PriceNote[] };

let keySeq = 0;
const newKey = () => `k${++keySeq}`;

function NoteSelect({ value, onChange }: { value: "" | "*" | "**"; onChange: (v: "" | "*" | "**") => void }) {
  return (
    <select
      aria-label="Megjegyzés jel"
      className={`${inputCls} !w-[84px] shrink-0 !px-2`}
      value={value}
      onChange={(e) => onChange(e.target.value as "" | "*" | "**")}
    >
      <option value="">—</option>
      <option value="*">*</option>
      <option value="**">**</option>
    </select>
  );
}

export default function PricesEditor({
  initial,
  info,
}: {
  initial: { items: PriceItem[]; notes: PriceNote[] };
  info: EditInfo;
}) {
  const toState = (x: typeof initial): State => ({ items: x.items.map((i) => ({ ...i, key: i.id })), notes: x.notes });
  const [saved, setSaved] = useState<State>(() => toState(initial));
  const [v, setV] = useState<State>(() => toState(initial));
  const [dragKey, setDragKey] = useState<string | null>(null);
  const { pending, status, save } = useSaver();

  const setItem = (i: number, patch: Partial<Item>) =>
    setV((p) => ({ ...p, items: p.items.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const move = (from: number, to: number) =>
    setV((p) => {
      const items = [...p.items];
      const [x] = items.splice(from, 1);
      items.splice(to, 0, x);
      return { ...p, items };
    });
  const strip = (s: State) => ({
    items: s.items.map(({ id, name, price, note }) => ({ id, name, price, note })),
    notes: s.notes,
  });
  const half = Math.ceil(v.items.length / 2);

  return (
    <div>
      <PageHeader
        title="Árak"
        description={`Az oldalon két oszlopban jelennek meg: az első ${half} tétel balra, a többi jobbra. Húzással vagy a nyilakkal rendezhetők.`}
      />
      <div className="space-y-6">
        <Card title="Tételek">
          <div className="space-y-2">
            {v.items.map((item, i) => (
              <div
                key={item.key}
                draggable
                onDragStart={() => setDragKey(item.key)}
                onDragEnd={() => setDragKey(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const from = v.items.findIndex((x) => x.key === dragKey);
                  if (from >= 0 && from !== i) move(from, i);
                  setDragKey(null);
                }}
                className={`flex flex-wrap items-center gap-2 rounded-2xl border-2 p-2 sm:flex-nowrap ${
                  dragKey === item.key ? "border-uc bg-uc-pale/50" : "border-transparent bg-slate-50"
                } ${i === half ? "mt-5" : ""}`}
              >
                <span className="cursor-grab select-none px-1 text-slate-300" title="Húzd az átrendezéshez">
                  ⋮⋮
                </span>
                <input
                  aria-label="Megnevezés"
                  className={`${inputCls} min-w-[180px] flex-1`}
                  value={item.name}
                  placeholder="Havi bérlet — 1 csoport"
                  onChange={(e) => setItem(i, { name: e.target.value })}
                />
                <input
                  aria-label="Ár"
                  className={`${inputCls} !w-[130px] shrink-0`}
                  value={item.price}
                  placeholder="20 000 Ft"
                  onChange={(e) => setItem(i, { price: e.target.value })}
                />
                <NoteSelect value={item.note} onChange={(note) => setItem(i, { note })} />
                <div className="flex shrink-0">
                  <IconButton label="Feljebb" onClick={() => move(i, i - 1)} disabled={i === 0}>
                    ↑
                  </IconButton>
                  <IconButton label="Lejjebb" onClick={() => move(i, i + 1)} disabled={i === v.items.length - 1}>
                    ↓
                  </IconButton>
                  <IconButton
                    label="Törlés"
                    onClick={() => setV((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}
                    className="hover:!bg-red-50 hover:!text-red-600"
                  >
                    ✕
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => setV((p) => ({ ...p, items: [...p.items, { key: newKey(), name: "", price: "", note: "" }] }))}
          >
            + Új tétel
          </Button>
        </Card>

        <Card title="Megjegyzések" description="A lista alatti világosabb lila sávban jelennek meg. A *-os / **-os tételekre utalnak.">
          <div className="space-y-2">
            {v.notes.map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                <NoteSelect
                  value={n.mark}
                  onChange={(mark) => setV((p) => ({ ...p, notes: p.notes.map((x, j) => (j === i ? { ...x, mark } : x)) }))}
                />
                <input
                  aria-label="Megjegyzés"
                  className={inputCls}
                  value={n.text}
                  onChange={(e) =>
                    setV((p) => ({ ...p, notes: p.notes.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) }))
                  }
                />
                <IconButton label="Törlés" onClick={() => setV((p) => ({ ...p, notes: p.notes.filter((_, j) => j !== i) }))}>
                  ✕
                </IconButton>
              </div>
            ))}
            {v.notes.length < 6 && (
              <Button variant="ghost" onClick={() => setV((p) => ({ ...p, notes: [...p.notes, { mark: "", text: "" }] }))}>
                + Új megjegyzés
              </Button>
            )}
          </div>
        </Card>
      </div>
      <SaveBar
        dirty={!isSame(strip(v), strip(saved))}
        pending={pending}
        status={status}
        info={info}
        onReset={() => setV(saved)}
        onSave={() => save(() => savePrices(strip(v)), undefined, () => setSaved(v))}
      />
    </div>
  );
}
