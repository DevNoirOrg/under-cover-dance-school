"use client";

import { useState } from "react";
import { savePrices } from "@/app/actions/admin";
import {
  Button,
  Card,
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
  const [lang, setLang] = useState<EditLang>("hu");
  const isEn = lang === "en";
  const missing = countMissing([
    ...v.items.flatMap((x) => [[x.name, x.nameEn], [x.price, x.priceEn]] as [string, string][]),
    ...v.notes.map((n) => [n.text, n.en?.text] as [string, string | undefined]),
  ]);
  const setNote = (i: number, patch: Partial<PriceNote>) =>
    setV((p) => ({ ...p, notes: p.notes.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));

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
    items: s.items.map(({ id, name, price, note, nameEn, priceEn }) => ({ id, name, price, note, nameEn, priceEn })),
    notes: s.notes,
  });
  const half = Math.ceil(v.items.length / 2);

  return (
    <div>
      <PageHeader
        title="Árak"
        description={`Az oldalon két oszlopban jelennek meg: az első ${half} tétel balra, a többi jobbra. Húzással vagy a nyilakkal rendezhetők.`}
      >
        <LangTabs lang={lang} onChange={setLang} missing={missing} />
      </PageHeader>
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
                <TrText
                  ariaLabel="Megnevezés"
                  className="min-w-[180px] flex-1"
                  lang={lang}
                  hu={item.name}
                  en={item.nameEn}
                  placeholder="Havi bérlet — 1 csoport"
                  onHu={(x) => setItem(i, { name: x })}
                  onEn={(x) => setItem(i, { nameEn: x })}
                />
                <TrText
                  ariaLabel="Ár"
                  className="!w-[130px] shrink-0"
                  lang={lang}
                  hu={item.price}
                  en={item.priceEn}
                  placeholder="20 000 Ft"
                  onHu={(x) => setItem(i, { price: x })}
                  onEn={(x) => setItem(i, { priceEn: x })}
                />
                {!isEn && <NoteSelect value={item.note} onChange={(note) => setItem(i, { note })} />}
                <div className="flex shrink-0">
                  <IconButton label="Feljebb" onClick={() => move(i, i - 1)} disabled={i === 0}>
                    ↑
                  </IconButton>
                  <IconButton label="Lejjebb" onClick={() => move(i, i + 1)} disabled={i === v.items.length - 1}>
                    ↓
                  </IconButton>
                  {!isEn && (
                    <IconButton
                      label="Törlés"
                      onClick={() => setV((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}
                      className="hover:!bg-red-50 hover:!text-red-600"
                    >
                      ✕
                    </IconButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!isEn && (
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() =>
                setV((p) => ({ ...p, items: [...p.items, { key: newKey(), name: "", price: "", note: "", nameEn: "", priceEn: "" }] }))
              }
            >
              + Új tétel
            </Button>
          )}
        </Card>

        <Card title="Megjegyzések" description="A lista alatti világosabb lila sávban jelennek meg. A *-os / **-os tételekre utalnak.">
          <div className="space-y-2">
            {v.notes.map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                {isEn ? (
                  <span className="w-[84px] shrink-0 text-center font-bold text-slate-400">{n.mark || "—"}</span>
                ) : (
                  <NoteSelect value={n.mark} onChange={(mark) => setNote(i, { mark })} />
                )}
                <TrText
                  ariaLabel="Megjegyzés"
                  lang={lang}
                  hu={n.text}
                  en={n.en?.text}
                  onHu={(x) => setNote(i, { text: x })}
                  onEn={(x) => setNote(i, { en: { ...n.en, text: x } })}
                />
                {!isEn && (
                  <IconButton label="Törlés" onClick={() => setV((p) => ({ ...p, notes: p.notes.filter((_, j) => j !== i) }))}>
                    ✕
                  </IconButton>
                )}
              </div>
            ))}
            {v.notes.length < 6 && !isEn && (
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
