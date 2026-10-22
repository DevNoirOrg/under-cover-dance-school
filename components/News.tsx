/* eslint-disable @next/next/no-img-element -- a kártyakép a design szerinti egyszerű <img> */
import Link from "next/link";
import type { NewsItem } from "@/lib/content-types";
import { mediaUrl } from "@/lib/format";

/*
  HÍREK — elforgatott fotó-kártyák cellux-csíkkal. A forgatás / eltolás
  kártyánként a design szerint; több hír esetén ismétlődik a minta.
*/
const variants = [
  { wrapper: "group cursor-pointer", card: "group-hover:rotate-1", tape: "-rotate-3" },
  { wrapper: "group cursor-pointer translate-y-8", card: "-rotate-2 group-hover:rotate-0", tape: "rotate-2" },
  { wrapper: "group cursor-pointer", card: "rotate-1 group-hover:rotate-[-1deg]", tape: "-rotate-1" },
];

/** Hírkártyák rácsa (főoldal és a /hirek oldal). */
export function NewsGrid({ news, className = "grid md:grid-cols-3 gap-8" }: { news: NewsItem[]; className?: string }) {
  return (
    <div className={className}>
      {news.map((item, i) => {
        const v = variants[i % variants.length];
        return (
          <Link key={item.id} href={`/hirek/${item.slug}`} className={`block ${v.wrapper}`}>
            <div
              className={`relative bg-white p-4 rounded-[1.5rem] shadow-lg ${v.card} transition-transform duration-300`}
            >
              <div className={`tape-strip ${v.tape}`}></div>
              {item.imagePath ? (
                <div className="aspect-[3/4] rounded-2xl bg-slate-100 mb-4 overflow-hidden">
                  <img
                    src={mediaUrl(item.imagePath)}
                    alt={item.imageAlt || item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-2xl bg-slate-100 mb-4 flex items-center justify-center overflow-hidden">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">
                    {item.placeholderLabel}
                  </span>
                </div>
              )}
              <span className="font-mono text-[10px] text-uc-deep font-bold">{item.dateLabel}</span>
              <h3 className="font-bold text-lg mt-1 mb-2 leading-tight">{item.title}</h3>
              <p className="text-xs leading-relaxed text-ink/60">{item.excerpt}</p>
              <span className="inline-block mt-3 text-[10px] font-extrabold uppercase tracking-widest text-uc-deep group-hover:text-ink transition-colors">
                Tovább olvasom →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function News({ news }: { news: NewsItem[] }) {
  // a design 3 kártyára készült: a főoldalon a legfrissebb 3 hír látszik
  return (
    <section id="hirek" className="dot-paper py-24 px-6 md:px-10 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-title font-black text-4xl text-ink">Hírek</h2>
          <div className="h-[2px] flex-grow bg-ink/5"></div>
          <Link
            href="/hirek"
            className="shrink-0 text-[11px] font-extrabold uppercase tracking-widest text-uc-deep hover:text-ink transition-colors"
          >
            Összes hír →
          </Link>
        </div>

        <NewsGrid news={news} />
      </div>
    </section>
  );
}
