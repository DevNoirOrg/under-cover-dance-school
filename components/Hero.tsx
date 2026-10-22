import { hero } from "@/data/site";
import LogoMark from "./LogoMark";

/* HERO — bal oldalt logó + szöveg + gombok, jobb oldalt álló (9:16) videó. */
export default function Hero() {
  return (
    <header
      id="home"
      className="relative overflow-hidden bg-uc-hero-dark -mt-[68px] pt-28 pb-16 px-6 md:px-10 scroll-mt-24 min-h-screen flex items-center"
    >
      {/* Az egyetlen logó-példány; görgetéskor a fejlécbe úszik. */}
      <LogoMark />

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
            {hero.lead.before} <span className="text-white">{hero.lead.highlight}</span>{" "}
            {hero.lead.after}
          </p>

          <div className="flex flex-wrap gap-4 pt-10">
            <a
              href={hero.primaryCta.href}
              className="bg-white text-ink px-11 py-5 rounded-full font-extrabold text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-ink hover:text-white transition-all hover:-translate-y-1 active:scale-95"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="border border-white/40 text-white px-11 py-5 rounded-full font-extrabold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* ---------- JOBB OSZLOP: álló videó ---------- */}
        <div className="justify-self-center lg:justify-self-end">
          {hero.heroVideoSrc ? (
            <div className="relative w-[min(72vw,300px)] sm:w-[min(60vw,330px)] lg:w-[min(32vw,360px)] aspect-[9/16] rounded-[2rem] overflow-hidden bg-ink/40">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={hero.heroVideoSrc}
                poster={hero.heroVideoPoster ?? undefined}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ) : (
            <div className="relative w-[min(72vw,300px)] sm:w-[min(60vw,330px)] lg:w-[min(32vw,360px)] aspect-[9/16] rounded-[2rem] overflow-hidden bg-ink/40 border border-dashed border-white/25 grid place-items-center">
              <span className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase">
                {hero.videoPlaceholderLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
