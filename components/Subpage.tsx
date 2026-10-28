/* eslint-disable @next/next/no-img-element -- a logók a design szerinti egyszerű <img>-ek */
import Link from "next/link";
import { paths, t, type Locale } from "@/lib/i18n";
import LanguageSwitch from "./LanguageSwitch";

/*
  Aloldalak (adatkezelési tájékoztató, hírek) közös fejléce és lábléce —
  fehér háttér, krómos logó; a lábléc az eredeti fehér logóval.
*/

export function SubpageHeader({
  locale,
  alternateHref,
  backHref,
  backLabel,
}: {
  locale: Locale;
  alternateHref: string;
  backHref?: string;
  backLabel?: string;
}) {
  const d = t(locale).subpage;
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <Link href={paths[locale].home} aria-label={d.backAria}>
          <img src="/under_cover_logo_chrome.png" alt="Under Cover" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href={backHref ?? paths[locale].home}
            className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 hover:text-uc-deep transition-colors"
          >
            {backLabel ?? d.back}
          </Link>
          <LanguageSwitch locale={locale} alternateHref={alternateHref} variant="light" />
        </div>
      </div>
    </header>
  );
}

export function SubpageFooter({ copyright, locale }: { copyright: string; locale: Locale }) {
  return (
    <footer className="px-6 py-10 bg-ink text-white">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <img src="/under_cover_logo_feher.png" alt="Under Cover" className="h-14 w-auto" />
        <div className="flex flex-col sm:items-end items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <Link href={paths[locale].privacy} className="hover:text-uc transition-colors">
            {t(locale).footer.privacy}
          </Link>
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
