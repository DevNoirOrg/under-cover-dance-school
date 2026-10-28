import type { HeroContent } from "@/lib/content-types";
import { mediaUrl } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import LanguageSwitch from "./LanguageSwitch";
import LogoMark from "./LogoMark";

/** A bevezető szöveg; a kiemelt rész (ha van) fehérrel. Az üres részek kimaradnak. */
export function HeroLead({ hero }: { hero: Pick<HeroContent, "leadBefore" | "leadHighlight" | "leadAfter"> }) {
  const before = hero.leadBefore.trim();
  const highlight = hero.leadHighlight.trim();
  const after = hero.leadAfter.trim();
  return (
    <>
      {before}
      {highlight && (
        <>
          {before && " "}
          <span className="text-white">{highlight}</span>
        </>
      )}
      {after && (before || highlight ? " " : "") + after}
    </>
  );
}

/* HERO — bal oldalt logó + szöveg + gombok, jobb oldalt álló (9:16) videó. */
export default function Hero({ hero, locale, alternateHref }: { hero: HeroContent; locale: Locale; alternateHref: string }) {
  return (
    <header
      id="home"
      className="relative overflow-hidden bg-uc-hero-dark -mt-[68px] pt-28 pb-16 px-6 md:px-10 scroll-mt-24 min-h-screen flex items-center"
    >
      {/* Az egyetlen logó-példány; görgetéskor a fejlécbe úszik. */}
      <LogoMark />

      {/* Nyelvválasztó a lap tetején (a lebegő menü itt még rejtve van) — telefonon is. */}
      <div className="absolute right-5 top-6 z-20 md:right-10 md:top-8">
        <LanguageSwitch
          locale={locale}
          alternateHref={alternateHref}
          variant="dark"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
        />
      </div>

      {/* Világos fény-átmenet a jobb alsó sarokból. */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-tl from-uc-pale/55 via-uc-pale/14 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
        {/* ---------- BAL OSZLOP ---------- */}
        <div>
          {/* Helykijelölő a fixed logónak: a szélessége adja a logó méretét. */}
          <div
            id="logo-hero-slot"
            aria-hidden="true"
            className="w-full max-w-[300px] sm:max-w-[360px] aspect-[2514/1163] mb-9"
          ></div>

          <div className="inline-block bg-white/15 text-white px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase mb-6 border border-white/20">
            {hero.badge}
          </div>

          <p className="max-w-lg text-white/90 font-semibold text-xl leading-relaxed">
            <HeroLead hero={hero} />
          </p>

          <div className="flex flex-wrap gap-4 pt-10">
            <a
              href="#jelentkezes"
              className="bg-white text-ink px-11 py-5 rounded-full font-extrabold text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-ink hover:text-white transition-all hover:-translate-y-1 active:scale-95"
            >
              {hero.primaryCtaLabel}
            </a>
            <a
              href="#orarend"
              className="border border-white/40 text-white px-11 py-5 rounded-full font-extrabold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
            >
              {hero.secondaryCtaLabel}
            </a>
          </div>
        </div>

        {/* ---------- JOBB OSZLOP: álló videó ---------- */}
        <div className="justify-self-center lg:justify-self-end">
          {hero.videoPath ? (
            <div className="relative w-[min(72vw,300px)] sm:w-[min(60vw,330px)] lg:w-[min(32vw,360px)] aspect-[9/16] rounded-[2rem] overflow-hidden bg-ink/40">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={mediaUrl(hero.videoPath)}
                poster={hero.videoPosterPath ? mediaUrl(hero.videoPosterPath) : undefined}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ) : (
            <div className="relative w-[min(72vw,300px)] sm:w-[min(60vw,330px)] lg:w-[min(32vw,360px)] aspect-[9/16] rounded-[2rem] overflow-hidden bg-ink/40 border border-dashed border-white/25 grid place-items-center">
              <span className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase">{t(locale).hero.videoPlaceholder}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
