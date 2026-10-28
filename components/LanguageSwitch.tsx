import { t, type Locale } from "@/lib/i18n";

/*
  NYELVVÁLASZTÓ — „HU · EN” szöveges kapcsoló (zászló nélkül: a zászló
  országot jelöl, nem nyelvet). Az aktuális oldal másik nyelvű párjára visz.
  Sima <a>: a két nyelv külön gyökér-layoutban él (eltérő <html lang>).
*/
type Variant = "nav" | "dark" | "light";

const styles: Record<Variant, { wrap: string; active: string; idle: string; sep: string }> = {
  // a fehér, lebegő menüsorban
  nav: {
    wrap: "text-[9px] sm:text-[10px] md:text-[11px]",
    active: "text-uc-deep",
    idle: "text-slate-400 hover:text-uc-deep",
    sep: "text-slate-300",
  },
  // sötét háttéren (hero, lábléc)
  dark: {
    wrap: "text-[10px] md:text-[11px]",
    active: "text-white",
    idle: "text-white/50 hover:text-white",
    sep: "text-white/30",
  },
  // világos háttéren (aloldalak fejléce)
  light: {
    wrap: "text-[10px] sm:text-[11px]",
    active: "text-ink",
    idle: "text-slate-400 hover:text-uc-deep",
    sep: "text-slate-300",
  },
};

export default function LanguageSwitch({
  locale,
  alternateHref,
  variant = "nav",
  className = "",
}: {
  locale: Locale;
  /** Az aktuális oldal másik nyelvű változatának címe. */
  alternateHref: string;
  variant?: Variant;
  className?: string;
}) {
  const s = styles[variant];
  const item = (code: Locale) => {
    const label = code.toUpperCase();
    if (code === locale) {
      return (
        <span aria-current="true" className={s.active} lang={code} title={t(code).langName}>
          {label}
        </span>
      );
    }
    return (
      <a href={alternateHref} hrefLang={code} lang={code} className={`${s.idle} transition-colors`} title={t(code).langName}>
        {label}
      </a>
    );
  };
  return (
    <span
      role="group"
      aria-label={`${t("hu").switchLabel} / ${t("en").switchLabel}`}
      className={`inline-flex items-center gap-1.5 font-extrabold tracking-[0.2em] uppercase ${s.wrap} ${className}`}
    >
      {item("hu")}
      <span aria-hidden="true" className={s.sep}>
        ·
      </span>
      {item("en")}
    </span>
  );
}
