/* eslint-disable @next/next/no-img-element -- a kártyakép a design szerinti egyszerű <img> */
import { news } from "@/data/news";

/*
  HÍREK — elforgatott fotó-kártyák cellux-csíkkal. A forgatás / eltolás
  kártyánként a design szerint; több hír esetén ismétlődik a minta.
*/
const variants = [
  { wrapper: "group cursor-pointer", card: "group-hover:rotate-1", tape: "-rotate-3" },
  { wrapper: "group cursor-pointer translate-y-8", card: "-rotate-2 group-hover:rotate-0", tape: "rotate-2" },
  { wrapper: "group cursor-pointer", card: "rotate-1 group-hover:rotate-[-1deg]", tape: "-rotate-1" },
];

export default function News() {
  return (
    <section id="hirek" className="dot-paper py-24 px-6 md:px-10 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-title font-black text-4xl text-ink">Hírek</h2>
          <div className="h-[2px] flex-grow bg-ink/5"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item, i) => {
            const v = variants[i % variants.length];
            return (
              <div key={item.title} className={v.wrapper}>
                <div
                  className={`relative bg-white p-4 rounded-[1.5rem] shadow-lg ${v.card} transition-transform duration-300`}
                >
                  <div className={`tape-strip ${v.tape}`}></div>
                  {item.imageSrc ? (
                    <div className="aspect-[3/4] rounded-2xl bg-slate-100 mb-4 overflow-hidden">
                      <img
                        src={item.imageSrc}
                        alt={item.imageAlt ?? item.title}
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
                  <span className="font-mono text-[10px] text-uc-deep font-bold">{item.date}</span>
                  <h4 className="font-bold text-lg mt-1 mb-2 leading-tight">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-ink/60">{item.excerpt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
