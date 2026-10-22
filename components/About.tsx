/* eslint-disable @next/next/no-img-element -- a design sima <img>-et használ (object-position miatt) */
import { Fragment } from "react";
import type { AboutContent } from "@/lib/content-types";
import { mediaUrl } from "@/lib/format";

/* KIK VAGYUNK — pöttyös háttér, kép balra (lg), szöveg + statok jobbra. */
export default function About({ about }: { about: AboutContent }) {
  return (
    <section id="rolunk" className="dot-paper bg-white relative pt-24 pb-24 px-6 md:px-10 scroll-mt-24">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 lg:order-2">
            <h2 className="font-title font-black text-4xl md:text-5xl text-ink tracking-tight leading-tight">
              {about.titleLine1} <br />
              <span className="text-uc-deep">{about.titleLine2}</span>
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>{about.paragraph}</p>
              <p className="font-medium text-ink">{about.highlight}</p>
            </div>
            <div className="flex gap-8 pt-4">
              {about.stats.map((s, i) => (
                <Fragment key={i}>
                  {i > 0 && <div className="w-px h-10 bg-slate-200"></div>}
                  <div>
                    <div className="text-3xl font-extrabold text-ink">{s.value}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {s.label}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="relative lg:order-1">
            <div className="w-full aspect-[4/5] bg-slate-100 rounded-[3rem] outline-1 -outline-offset-1 outline-black/5 shadow-2xl relative z-10 overflow-hidden">
              <img
                src={mediaUrl(about.imagePath)}
                alt={about.imageAlt}
                className="absolute inset-0 w-full h-full object-cover object-[44%_50%]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 size-48 bg-uc/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
