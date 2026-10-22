"use client";

import { useEffect, useState } from "react";
import { useSelection } from "./selection";

/*
  MOBIL KIVÁLASZTÁS-SÁV — csak telefonon, csak ha van kiválasztott óra,
  és csak amíg sem az összegző sáv, sem a jelentkezés nem látszik.
*/
export default function MobileDock() {
  const { selected } = useSelection();
  const [blockersInView, setBlockersInView] = useState(0);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const inView = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) inView.add(en.target);
          else inView.delete(en.target);
        });
        setBlockersInView(inView.size);
      },
      { threshold: 0.12 },
    );
    ["jelentkezes", "selection-bar"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const n = selected.length;
  const visible = n > 0 && blockersInView === 0;

  return (
    <div
      id="mobile-dock"
      className={`font-title md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3${visible ? " dock-visible" : ""}`}
    >
      <div className="rounded-[24px] bg-ink/95 backdrop-blur px-5 py-4 flex items-center gap-4 shadow-2xl">
        <span className="text-white font-bold text-sm">{n} óra kiválasztva</span>
        <a
          href="#jelentkezes"
          className="ml-auto shrink-0 bg-uc text-ink px-5 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest"
        >
          Jelentkezem
        </a>
      </div>
    </div>
  );
}
