/*
  FEJLÉC — sticky pill nav. A lap tetején rejtve indul (nav-hidden), a
  LogoMark komponens görgetés-vezérlője veszi le róla az osztályt, amint
  elkezdünk lefelé görgetni. A középső #logo-dock-target csak a HELYET
  tartja fenn: ide "repül" a hero logója.
*/

const linkClass =
  "text-[9px] sm:text-[10px] md:text-[11px] font-extrabold tracking-[0.2em] uppercase text-slate-500 hover:text-uc-deep transition-colors";

export default function SiteNav() {
  return (
    <nav id="site-nav" className="nav-hidden sticky top-6 z-50 flex justify-center px-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 shadow-[0_12px_32px_-8px_rgba(20,19,22,0.22)]">
        <a href="#rolunk" className={linkClass}>
          Rólunk
        </a>
        <a href="#orarend" className={linkClass}>
          Órarend
        </a>
        <a href="#home" className="px-2 md:px-4 flex items-center select-none">
          {/* A dokkolt logó szélességét ennek a doboznak a szélessége adja. */}
          <div
            id="logo-dock-target"
            aria-hidden="true"
            className="h-[34px] sm:h-[38px] aspect-[2514/1163] pointer-events-none select-none"
          ></div>
        </a>
        <a href="#hirek" className={linkClass}>
          Hírek
        </a>
        <a href="#jelentkezes" className={linkClass}>
          Jelentkezés
        </a>
      </div>
    </nav>
  );
}
