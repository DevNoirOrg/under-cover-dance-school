"use client";

import { useEffect, useRef } from "react";

/*
  A hero ezüst logója ("position: fixed") és a görgetés-vezérelt dokkolás.

  1:1 a design (18.html) végén lévő scriptjével:
    - a logó méretét/helyét betöltéskor és átméretezéskor EGYSZER mérjük
      ki a #logo-hero-slot dobozból ("base" állapot),
    - görgetéskor FLIP-technikával, csak CSS transformmal repítjük a
      #logo-dock-target helyére (a fejléc pill közepére),
    - a #site-nav a lap tetején rejtve van, és az első görgetésre beúszik.

  Hangolható értékek:
    DOCK_DISTANCE — hány px görgetés alatt fusson le az "utazás"
    EASE — 0..1, minél nagyobb, annál feszesebben ér célba
    NAV_REVEAL_THRESHOLD — ennyi px görgetés után jelenjen meg a nav
*/

const DOCK_DISTANCE = 240;
const NAV_REVEAL_THRESHOLD = 4;
const EASE = 0.22;
/** A logó saját aránya — egyeznie kell a két doboz aspect-[2514/1163] osztályával. */
const ASPECT = 2514 / 1163;

export default function LogoMark() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const dock = document.getElementById("logo-dock-target");
    const nav = document.getElementById("site-nav");
    const slot = document.getElementById("logo-hero-slot");
    if (!mount || !dock || !nav || !slot) return;

    let base = { top: 0, left: 0, width: 0, height: 0 };
    let dockRect = { top: 0, left: 0, width: 0 };
    let targetProgress = 0;
    let displayProgress = 0;
    let rafId: number | null = null;
    let navRevealed: boolean | null = null;
    let dockedZ: boolean | null = null;
    let atRest: boolean | null = null;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function measure() {
      const sr = slot!.getBoundingClientRect();
      const width = sr.width;
      const height = width / ASPECT;
      base = {
        top: sr.top + window.scrollY + sr.height / 2 - height / 2,
        left: sr.left,
        width,
        height,
      };
      mount!.style.top = base.top + "px";
      mount!.style.left = base.left + "px";
      mount!.style.width = base.width + "px";
      mount!.style.height = base.height + "px";
      mount!.style.transformOrigin = "0 0";

      // A navot egy pillanatra — animáció nélkül — a nyugalmi helyére tesszük,
      // hogy a dokk helyét mérhessük akkor is, ha épp rejtve van, VAGY épp
      // beúszik (pl. újratöltéskor görgetett állapotban a betűtípusok
      // betöltése utáni újramérés a nav beúszása közben futna le).
      const wasHidden = nav!.classList.contains("nav-hidden");
      nav!.style.transition = "none";
      nav!.style.transform = "none";
      nav!.classList.remove("nav-hidden");
      const r = dock!.getBoundingClientRect();
      const dockedHeight = r.width / ASPECT;
      dockRect = {
        top: r.top + r.height / 2 - dockedHeight / 2,
        left: r.left,
        width: r.width,
      };
      if (wasHidden) nav!.classList.add("nav-hidden");
      nav!.style.transform = "";
      void nav!.offsetHeight;
      nav!.style.transition = "";
    }

    function updateNavVisibility() {
      const shouldReveal = window.scrollY > NAV_REVEAL_THRESHOLD;
      if (shouldReveal !== navRevealed) {
        navRevealed = shouldReveal;
        nav!.classList.toggle("nav-hidden", !navRevealed);
      }
    }

    function applyFrame() {
      const t = displayProgress;
      const scale = dockRect.width / base.width;
      const dx = dockRect.left - base.left;
      const dy = dockRect.top - base.top;

      mount!.style.transform =
        "translate(" + dx * t + "px, " + dy * t + "px) scale(" + lerp(1, scale, t) + ")";

      // Hero-fázisban a tartalom szintjén, dokkolva a nav-pill fölött.
      const wantsDockedZ = t > 0.5;
      if (wantsDockedZ !== dockedZ) {
        dockedZ = wantsDockedZ;
        mount!.style.zIndex = dockedZ ? "60" : "12";
      }

      // Drop-shadow csak nyugalomban (mozgás közben a filter drága).
      const wantsRest = t === 0 || t === 1;
      if (wantsRest !== atRest) {
        atRest = wantsRest;
        mount!.classList.toggle("logo-at-rest", atRest);
      }
    }

    function tick() {
      targetProgress = Math.max(0, Math.min(1, window.scrollY / DOCK_DISTANCE));
      displayProgress += (targetProgress - displayProgress) * EASE;
      if (Math.abs(targetProgress - displayProgress) < 0.002) {
        displayProgress = targetProgress;
      }
      applyFrame();
      rafId = displayProgress !== targetProgress ? requestAnimationFrame(tick) : null;
    }

    function requestTick() {
      updateNavVisibility();
      if (rafId == null) rafId = requestAnimationFrame(tick);
    }

    function handleResize() {
      measure();
      requestTick();
    }

    measure();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", handleResize);
    requestTick();
    // A betűtípusok betöltése után a hero szövege más magasságú lehet,
    // ami elmozdítja a slotot — ilyenkor újramérünk.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) handleResize();
    });

    return () => {
      alive = false;
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", handleResize);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="logo-mark"
      role="img"
      aria-label="Under Cover"
      className="logo-mark-img fixed z-[12] pointer-events-none select-none"
    ></div>
  );
}
