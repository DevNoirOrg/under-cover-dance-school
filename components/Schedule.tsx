"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Room } from "@/lib/content-types";
import { SelectionChip, useSelection } from "./selection";

/*
  ÓRAREND — terem-váltó, választható órakártyák (több is), és alatta a
  kiválasztás-összegző sáv. A kiválasztás tabváltáskor megmarad.
*/

const tabBase =
  "tab-btn flex-1 md:flex-none whitespace-nowrap px-5 md:px-8 py-3 rounded-full text-[11px] md:text-sm font-bold uppercase tracking-wider md:tracking-widest";
const tabActive = "bg-white text-ink shadow-lg";
const tabInactive = "text-white/70 hover:text-white transition-colors";

function SchedulePanel({
  room,
  active,
  onScrollRef,
}: {
  room: Room;
  active: boolean;
  onScrollRef: (el: HTMLDivElement | null) => void;
}) {
  const { isSelected, setChecked } = useSelection();

  return (
    <div
      id={`schedule-${room.slug}`}
      className="schedule-panel relative glass-card rounded-[48px] overflow-hidden"
      hidden={!active}
    >
      {/* Mobilon vízszintesen görgethető; md-től teljes szélességű rács. */}
      <div ref={onScrollRef} className="schedule-scroll overflow-x-auto snap-x snap-proximity">
        <div className="min-w-[690px] md:min-w-0">
          <div className="grid grid-cols-3 bg-white/20">
            {room.columns.map((col, i) => (
              <div
                key={i}
                className={`${i < 2 ? "border-r border-white/20 " : ""}p-5 md:p-8 text-center font-bold text-[11px] md:text-sm uppercase tracking-widest text-white`}
              >
                {col.heading}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3" style={{ minHeight: room.minHeightPx }}>
            {room.columns.map((col, i) => (
              <div
                key={i}
                className={`p-4 md:p-6 ${i < 2 ? "border-r border-white/20 " : ""}border-t border-white/20 flex flex-col gap-4 snap-start`}
              >
                {col.classes.map((c) => (
                  <label key={c.id} className="class-option block">
                    <input
                      type="checkbox"
                      className="class-check sr-only"
                      id={`ora-${c.id}`}
                      checked={isSelected(c.id)}
                      onChange={(e) => setChecked(c.id, e.target.checked)}
                    />
                    <span className="class-card relative block p-5 bg-white/50 rounded-3xl transition-all cursor-pointer">
                      <span className="block font-bold text-base mb-1 text-ink pr-8">{c.title}</span>
                      <span className="text-xs opacity-70 uppercase tracking-wider font-bold text-ink">
                        {c.subtitle}
                      </span>
                      <span className="class-tick" aria-hidden="true"></span>
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Jobb szélen elhalványodó sáv: jelzi, hogy van még oldalra. */}
      <div className="scroll-fade md:hidden" aria-hidden="true"></div>
    </div>
  );
}

export default function Schedule({ rooms }: { rooms: Room[] }) {
  const { selected } = useSelection();
  const [activeRoom, setActiveRoom] = useState<Room["id"]>(rooms[0]?.id ?? "");
  const scrollEls = useRef<Record<string, HTMLDivElement | null>>({});

  // "Van még oldalra" jelzés: a panel .at-end osztályt kap, ha a végére ért
  // (közvetlenül a DOM-on, mint a designban — görgetésenként nincs újrarenderelés).
  const updateScrollFades = useCallback(() => {
    for (const room of rooms) {
      const sc = scrollEls.current[room.id];
      if (!sc) continue;
      const atEnd = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2;
      sc.parentElement?.classList.toggle("at-end", atEnd);
    }
  }, [rooms]);

  useEffect(() => {
    const els = Object.values(scrollEls.current).filter(Boolean) as HTMLDivElement[];
    els.forEach((el) => el.addEventListener("scroll", updateScrollFades, { passive: true }));
    window.addEventListener("resize", updateScrollFades);
    return () => {
      els.forEach((el) => el.removeEventListener("scroll", updateScrollFades));
      window.removeEventListener("resize", updateScrollFades);
    };
  }, [rooms, updateScrollFades]);

  // első mérés, és tabváltás után az új panel méreteivel újra
  useEffect(() => {
    updateScrollFades();
  }, [activeRoom, updateScrollFades]);

  const n = selected.length;

  return (
    <section
      id="orarend"
      className="font-title relative bg-gradient-to-br from-uc via-uc-deep to-[#4a1b56] py-24 md:py-32 px-6 md:px-10 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="text-center">
            <h2 className="font-title font-black text-5xl md:text-6xl text-white">Órarend</h2>
            <p className="text-white/60 mt-2 font-medium uppercase tracking-widest text-sm">
              Válaszd ki az órákat — akár többet is
            </p>
          </div>
          {/* Terem-váltó */}
          <div className="flex w-full md:w-auto p-1.5 glass-card rounded-full shrink-0">
            {rooms.map((room) => {
              const active = room.id === activeRoom;
              const k = selected.filter((c) => c.roomId === room.id).length;
              return (
                <button
                  key={room.id}
                  type="button"
                  className={`${tabBase} ${active ? tabActive : tabInactive}`}
                  onClick={() => setActiveRoom(room.id)}
                >
                  {room.name}
                  <span className="tab-badge" hidden={k === 0}>
                    {k}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {rooms.map((room) => (
          <SchedulePanel
            key={room.id}
            room={room}
            active={room.id === activeRoom}
            onScrollRef={(el) => {
              scrollEls.current[room.id] = el;
            }}
          />
        ))}

        <p className="md:hidden text-center text-white/50 text-[10px] font-extrabold uppercase tracking-widest mt-4">
          ← Csúsztasd oldalra a többi napért →
        </p>

        {/* ---- Kiválasztás-összegző ---- */}
        <div
          id="selection-bar"
          className="glass-card rounded-[32px] p-6 md:p-8 mt-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8"
        >
          <div className="flex-1 min-w-0">
            <p className="font-title font-black text-white text-xl md:text-2xl">
              {n === 0 ? "Még nem választottál órát" : `${n} óra kiválasztva`}
            </p>
            <p className="text-white/60 text-[11px] font-extrabold uppercase tracking-widest mt-2">
              {n === 0 ? "Koppints egy órára az órarendben" : "Többet is választhatsz, vagy vedd le a chipről"}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {selected.map((c) => (
                <SelectionChip key={c.id} item={c} />
              ))}
            </div>
          </div>
          <a
            href="#jelentkezes"
            className="shrink-0 text-center bg-white text-ink px-8 py-5 rounded-2xl font-extrabold uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-uc-pale transition-colors"
          >
            Tovább a jelentkezéshez
          </a>
        </div>
      </div>
    </section>
  );
}
