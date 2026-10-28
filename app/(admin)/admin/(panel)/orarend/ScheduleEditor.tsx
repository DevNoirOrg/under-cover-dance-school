"use client";

import { useState } from "react";
import { saveSchedule } from "@/app/actions/admin";
import {
  Button,
  Field,
  IconButton,
  LangTabs,
  PageHeader,
  SaveBar,
  TrText,
  countMissing,
  isSame,
  missingCls,
  useSaver,
  type EditLang,
} from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { Room } from "@/lib/content-types";

/*
  Órarend-szerkesztő: termenként 1–3 oszlop (pl. „Hétfő · Szerda”), az
  oszlopcímek átírhatók. Az órakártyák húzással (oszlopon belül és oszlopok között) vagy a
  nyilakkal rendezhetők. Mentéskor az egész órarend egyben kerül az oldalra.
*/

type EClass = {
  key: string;
  id?: string;
  title: string;
  subtitle: string;
  chip: string;
  titleEn: string;
  subtitleEn: string;
  chipEn: string;
};
type Cols = EClass[][];
const MAX_COLS = 3;
const MD_COLS: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3" };
type ERoom = {
  key: string;
  id?: string;
  name: string;
  shortName: string;
  nameEn: string;
  shortNameEn: string;
  minHeightPx: number;
  headings: string[];
  headingsEn: string[];
  columns: Cols;
};

let seq = 0;
const k = () => `n${++seq}`;

function fromRooms(rooms: Room[]): ERoom[] {
  return rooms.map((r) => ({
    key: r.id,
    id: r.id,
    name: r.name,
    shortName: r.shortName,
    nameEn: r.nameEn,
    shortNameEn: r.shortNameEn,
    minHeightPx: r.minHeightPx,
    headings: r.columns.map((c) => c.heading),
    headingsEn: r.columns.map((c) => c.headingEn),
    columns: r.columns.map((col) =>
      col.classes.map((c) => ({
        key: c.id,
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        chip: c.chip,
        titleEn: c.titleEn,
        subtitleEn: c.subtitleEn,
        chipEn: c.chipEn,
      })),
    ),
  }));
}

function toPayload(rooms: ERoom[]) {
  return {
    rooms: rooms.map((r) => ({
      id: r.id,
      name: r.name,
      shortName: r.shortName,
      nameEn: r.nameEn,
      shortNameEn: r.shortNameEn,
      minHeightPx: r.minHeightPx,
      headings: r.headings,
      headingsEn: r.headings.map((_, i) => r.headingsEn[i] ?? ""),
      columns: r.columns.map((col) =>
        col.map(({ id, title, subtitle, chip, titleEn, subtitleEn, chipEn }) => ({ id, title, subtitle, chip, titleEn, subtitleEn, chipEn })),
      ),
    })),
  };
}

type DragRef = { col: number; index: number } | null;

export default function ScheduleEditor({ initial, info }: { initial: Room[]; info: EditInfo }) {
  const [saved, setSaved] = useState<ERoom[]>(() => fromRooms(initial));
  const [rooms, setRooms] = useState<ERoom[]>(() => fromRooms(initial));
  const [activeKey, setActiveKey] = useState<string>(() => rooms[0]?.key ?? "");
  const [drag, setDrag] = useState<DragRef>(null);
  const [dropCol, setDropCol] = useState<number | null>(null);
  const { pending, status, save } = useSaver();
  const [lang, setLang] = useState<EditLang>("hu");
  const isEn = lang === "en";
  const missing = countMissing(
    rooms.flatMap((r) => [
      [r.name, r.nameEn],
      [r.shortName, r.shortNameEn],
      ...r.headings.map((h, i) => [h, r.headingsEn[i]] as [string, string]),
      ...r.columns.flat().flatMap((c) => [
        [c.title, c.titleEn],
        [c.subtitle, c.subtitleEn],
        [c.chip, c.chipEn],
      ] as [string, string][]),
    ]) as [string, string][],
  );
  /** Az órakártya egy mezőjének értéke / módosítása az aktuális nyelven. */
  const classField = (c: EClass, hu: "title" | "subtitle" | "chip") => {
    const enKey = `${hu}En` as "titleEn" | "subtitleEn" | "chipEn";
    return {
      value: isEn ? c[enKey] : c[hu],
      placeholder: isEn ? c[hu] : undefined,
      missing: isEn && !!c[hu].trim() && !c[enKey].trim(),
      patch: (v: string): Partial<EClass> => (isEn ? { [enKey]: v } : { [hu]: v }),
    };
  };

  const ri = Math.max(0, rooms.findIndex((r) => r.key === activeKey));
  const room = rooms[ri];

  const updateRoom = (patch: Partial<ERoom> | ((r: ERoom) => ERoom)) =>
    setRooms((prev) => prev.map((r, i) => (i === ri ? (typeof patch === "function" ? patch(r) : { ...r, ...patch }) : r)));

  const updateCols = (fn: (cols: Cols) => Cols) =>
    updateRoom((r) => ({ ...r, columns: fn(r.columns.map((c) => [...c])) }));

  /** Oszlopok száma (1–3). Csökkentéskor a megszűnő oszlopok órái az utolsó megmaradóba kerülnek. */
  function setColumnCount(n: number) {
    if (!room || n === room.columns.length) return;
    if (n < room.columns.length) {
      const moved = room.columns.slice(n).flat().length;
      if (moved && !window.confirm(`A megszűnő oszlop(ok) ${moved} órája átkerül a(z) ${n}. oszlopba. Folytatod?`)) return;
    }
    updateRoom((r) => {
      if (n > r.columns.length) {
        const add = n - r.columns.length;
        return {
          ...r,
          headings: [...r.headings, ...Array<string>(add).fill("")],
          headingsEn: [...r.headings.map((_, i) => r.headingsEn[i] ?? ""), ...Array<string>(add).fill("")],
          columns: [...r.columns, ...Array.from({ length: add }, (): EClass[] => [])],
        };
      }
      const columns = r.columns.slice(0, n).map((c) => [...c]);
      columns[n - 1].push(...r.columns.slice(n).flat());
      return { ...r, headings: r.headings.slice(0, n), headingsEn: r.headingsEn.slice(0, n), columns };
    });
  }

  const moveClass = (from: { col: number; index: number }, to: { col: number; index: number }) =>
    updateCols((cols) => {
      const [item] = cols[from.col].splice(from.index, 1);
      let idx = to.index;
      if (from.col === to.col && from.index < to.index) idx -= 1;
      cols[to.col].splice(Math.max(0, Math.min(idx, cols[to.col].length)), 0, item);
      return cols;
    });

  const setClass = (col: number, index: number, patch: Partial<EClass>) =>
    updateCols((cols) => {
      cols[col][index] = { ...cols[col][index], ...patch };
      return cols;
    });

  function addRoom() {
    const nr: ERoom = {
      key: k(),
      name: "Új terem",
      shortName: "Új",
      nameEn: "",
      shortNameEn: "",
      minHeightPx: 220,
      headings: [...(room?.headings ?? ["Hétfő · Szerda", "Kedd · Csütörtök"])],
      headingsEn: [...(room?.headingsEn ?? [])],
      columns: (room?.headings ?? ["", ""]).map((): EClass[] => []),
    };
    setRooms((p) => [...p, nr]);
    setActiveKey(nr.key);
  }

  function deleteRoom() {
    if (!room) return;
    const n = room.columns.flat().length;
    if (!window.confirm(`Biztosan törlöd a(z) „${room.name}” termet${n ? ` és a benne lévő ${n} órát` : ""}? (Mentéskor lesz végleges.)`)) return;
    const next = rooms.filter((_, i) => i !== ri);
    setRooms(next);
    setActiveKey(next[0]?.key ?? "");
  }

  const dirty = !isSame(toPayload(rooms), toPayload(saved));

  return (
    <div>
      <PageHeader
        title="Órarend"
        description="Termenként 1–3 oszlop (napok). Az órákat húzással vagy a nyilakkal rendezheted, oszlopok között is. A „Rövid felirat” jelenik meg a kiválasztott óra chipjén."
      >
        <LangTabs lang={lang} onChange={setLang} missing={missing} />
      </PageHeader>

      {/* Terem-fülek */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {rooms.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setActiveKey(r.key)}
            className={`rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-colors ${
              r.key === room?.key ? "bg-ink text-white" : "bg-white text-slate-500 hover:text-ink"
            }`}
          >
            {(isEn ? r.nameEn || r.name : r.name) || "Névtelen terem"}
            <span className="ml-2 rounded-full bg-uc-pale px-1.5 py-0.5 text-[10px] text-uc-deep">{r.columns.flat().length}</span>
          </button>
        ))}
        {rooms.length < 6 && !isEn && (
          <Button variant="ghost" onClick={addRoom}>
            + Új terem
          </Button>
        )}
      </div>

      {room ? (
        <>
          <div className="mb-5 grid gap-4 rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(20,19,22,0.35)] md:grid-cols-[1fr_1fr_auto_auto] md:items-end md:p-6">
            <Field label="Terem neve" htmlFor="rname" hint="A terem-váltó gombon és a jelentkezésben.">
              <TrText
                id="rname"
                lang={lang}
                hu={room.name}
                en={room.nameEn}
                onHu={(x) => updateRoom({ name: x })}
                onEn={(x) => updateRoom({ nameEn: x })}
              />
            </Field>
            <Field label="Rövid név" htmlFor="rshort" hint="Új óránál a chip elejére kerül, pl. „Nagy”.">
              <TrText
                id="rshort"
                lang={lang}
                hu={room.shortName}
                en={room.shortNameEn}
                onHu={(x) => updateRoom({ shortName: x })}
                onEn={(x) => updateRoom({ shortNameEn: x })}
              />
            </Field>
            <Field label="Oszlopok" hint="Napok száma">
              <div className="flex gap-1 rounded-full bg-slate-100 p-1">
                {Array.from({ length: MAX_COLS }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} oszlop`}
                    aria-pressed={room.columns.length === n}
                    onClick={() => setColumnCount(n)}
                    className={`h-9 w-9 rounded-full text-sm font-extrabold transition-colors ${
                      room.columns.length === n ? "bg-ink text-white" : "text-slate-500 hover:text-ink"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>
            <Button variant="danger" onClick={deleteRoom} disabled={rooms.length <= 1 || isEn}>
              Terem törlése
            </Button>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-uc via-uc-deep to-[#4a1b56] p-3 md:p-4">
            <div className={`grid gap-3 ${MD_COLS[room.columns.length] ?? MD_COLS[3]}`}>
              {room.columns.map((col, ci) => (
                <div
                  key={ci}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropCol(ci);
                  }}
                  onDragLeave={() => setDropCol((c) => (c === ci ? null : c))}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (drag) moveClass(drag, { col: ci, index: room.columns[ci].length });
                    setDrag(null);
                    setDropCol(null);
                  }}
                  className={`flex flex-col gap-3 rounded-[1.5rem] p-3 transition-colors ${
                    dropCol === ci && drag ? "bg-white/35" : "bg-white/15"
                  }`}
                >
                  <input
                    aria-label={`${ci + 1}. oszlop címe`}
                    className={`w-full rounded-xl border-2 border-white/30 bg-white/20 px-3 py-2 text-center text-xs font-extrabold uppercase tracking-widest text-white placeholder:text-white/50 focus:border-white focus:outline-none${
                      isEn && room.headings[ci]?.trim() && !room.headingsEn[ci]?.trim() ? " !border-amber-300" : ""
                    }`}
                    placeholder={isEn ? room.headings[ci] : "pl. Hétfő · Szerda"}
                    value={(isEn ? room.headingsEn[ci] : room.headings[ci]) ?? ""}
                    onChange={(e) =>
                      updateRoom((r) => {
                        const key = isEn ? "headingsEn" : "headings";
                        const list = r.headings.map((_, i) => r[key][i] ?? "");
                        list[ci] = e.target.value;
                        return { ...r, [key]: list };
                      })
                    }
                  />

                  {col.map((c, i) => (
                    <div
                      key={c.key}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        setDrag({ col: ci, index: i });
                      }}
                      onDragEnd={() => {
                        setDrag(null);
                        setDropCol(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (drag) moveClass(drag, { col: ci, index: i });
                        setDrag(null);
                        setDropCol(null);
                      }}
                      className={`rounded-2xl bg-white/80 p-3 shadow-sm transition-opacity ${
                        drag?.col === ci && drag.index === i ? "opacity-40" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="cursor-grab select-none text-slate-400" title="Húzd az átrendezéshez">
                          ⋮⋮
                        </span>
                        <div className="flex">
                          <IconButton label="Előző oszlopba" disabled={ci === 0} onClick={() => moveClass({ col: ci, index: i }, { col: ci - 1, index: room.columns[ci - 1].length })}>
                            ←
                          </IconButton>
                          <IconButton label="Feljebb" disabled={i === 0} onClick={() => moveClass({ col: ci, index: i }, { col: ci, index: i - 1 })}>
                            ↑
                          </IconButton>
                          <IconButton label="Lejjebb" disabled={i === col.length - 1} onClick={() => moveClass({ col: ci, index: i }, { col: ci, index: i + 2 })}>
                            ↓
                          </IconButton>
                          <IconButton label="Következő oszlopba" disabled={ci === room.columns.length - 1} onClick={() => moveClass({ col: ci, index: i }, { col: ci + 1, index: room.columns[ci + 1].length })}>
                            →
                          </IconButton>
                          <IconButton
                            label="Óra törlése"
                            className="hover:!bg-red-50 hover:!text-red-600"
                            onClick={() =>
                              updateCols((cols) => {
                                cols[ci].splice(i, 1);
                                return cols;
                              })
                            }
                          >
                            ✕
                          </IconButton>
                        </div>
                      </div>
                      {(() => {
                        const title = classField(c, "title");
                        const subtitle = classField(c, "subtitle");
                        const chip = classField(c, "chip");
                        return (
                          <>
                            <input
                              aria-label="Óra címe"
                              className={`w-full rounded-lg border-2 border-transparent bg-white px-2.5 py-1.5 text-[15px] font-bold text-ink placeholder:text-slate-300 focus:border-uc focus:outline-none${title.missing ? missingCls : ""}`}
                              placeholder={title.placeholder ?? "16:00–17:00 · Kezdő Tini K-pop"}
                              value={title.value}
                              onChange={(e) => setClass(ci, i, title.patch(e.target.value))}
                            />
                            <input
                              aria-label="Alcím"
                              className={`mt-1.5 w-full rounded-lg border-2 border-transparent bg-white px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-ink/70 placeholder:text-slate-300 focus:border-uc focus:outline-none${subtitle.missing ? missingCls : ""}`}
                              placeholder={subtitle.placeholder ?? "Jula · 12+"}
                              value={subtitle.value}
                              onChange={(e) => setClass(ci, i, subtitle.patch(e.target.value))}
                            />
                            <label className="mt-2 block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                              Rövid felirat (chip)
                              <input
                                className={`mt-1 w-full rounded-lg border-2 border-transparent bg-uc-pale/60 px-2.5 py-1.5 text-xs font-extrabold normal-case tracking-normal text-ink placeholder:text-slate-300 focus:border-uc focus:outline-none${chip.missing ? missingCls : ""}`}
                                placeholder={chip.placeholder ?? `${room.shortName} · H–Sz 16:00`}
                                value={chip.value}
                                onChange={(e) => setClass(ci, i, chip.patch(e.target.value))}
                              />
                            </label>
                          </>
                        );
                      })()}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      updateCols((cols) => {
                        cols[ci].push({ key: k(), title: "", subtitle: "", chip: `${room.shortName} · `, titleEn: "", subtitleEn: "", chipEn: "" });
                        return cols;
                      })
                    }
                    className="rounded-2xl border-2 border-dashed border-white/40 py-3 text-xs font-extrabold uppercase tracking-widest text-white/80 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    + Új óra
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-500">Nincs terem. Adj hozzá egyet!</p>
      )}

      <SaveBar
        dirty={dirty}
        pending={pending}
        status={status}
        info={info}
        onReset={() => {
          setRooms(saved);
          setActiveKey(saved[0]?.key ?? "");
        }}
        onSave={() => save(() => saveSchedule(toPayload(rooms)), undefined, () => setSaved(rooms))}
      />
    </div>
  );
}
