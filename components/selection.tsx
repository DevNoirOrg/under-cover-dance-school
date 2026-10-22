"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { allClasses, type ClassItem, type Room } from "@/data/schedule";

/*
  A kiválasztott órák közös állapota: az órarend, az összegző sáv, a
  jelentkezési form chipjei és a mobil lebegő sáv mind ebből olvas.
*/

type SelectedClass = ClassItem & { roomId: Room["id"] };

type SelectionValue = {
  selected: SelectedClass[];
  isSelected: (id: string) => boolean;
  setChecked: (id: string, checked: boolean) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());

  const setChecked = useCallback((id: string, checked: boolean) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setIds(new Set()), []);

  const value = useMemo<SelectionValue>(
    () => ({
      // mindig az órarend sorrendjében (mint a designban)
      selected: allClasses.filter((c) => ids.has(c.id)),
      isSelected: (id) => ids.has(id),
      setChecked,
      clear,
    }),
    [ids, setChecked, clear],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection: hiányzó SelectionProvider");
  return ctx;
}

/** Kiválasztott óra chipje, "x" gombbal. */
export function SelectionChip({ item, light }: { item: SelectedClass; light?: boolean }) {
  const { setChecked } = useSelection();
  return (
    <span className={light ? "sel-chip on-light" : "sel-chip"} title={item.full}>
      {item.chip}
      <button
        type="button"
        className="chip-x"
        aria-label={item.chip.replace(/·/g, "-") + " eltávolítása"}
        onClick={(e) => {
          e.preventDefault();
          setChecked(item.id, false);
        }}
      >
        ×
      </button>
    </span>
  );
}
