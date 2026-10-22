/* eslint-disable @next/next/no-img-element -- a fehér logó a design szerinti egyszerű <img> */
import Link from "next/link";
import type { FooterContent } from "@/lib/content-types";

/* LÁBLÉC / elérhetőségek — itt az EREDETI, fehér Under Cover logó van. */
export default function Footer({ footer }: { footer: FooterContent }) {
  return (
    <footer className="relative -mt-12 md:-mt-16 pt-28 pb-16 md:pt-36 md:pb-20 px-6 bg-ink text-white rounded-t-[3rem] md:rounded-t-[4rem]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 border-b border-white/10 pb-16 md:pb-20">
          <img
            src="/under_cover_logo_feher.png"
            alt="Under Cover"
            className="h-20 md:h-28 w-auto select-none"
            draggable={false}
          />
          <div className="grid sm:grid-cols-[minmax(0,22rem)_auto] gap-12 sm:gap-16">
            <div className="space-y-4">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-uc">Elérhetőségek</h4>
              <ul className="text-sm font-medium text-slate-400 space-y-2">
                {footer.email && (
                  <li>
                    E-mail:{" "}
                    <a href={`mailto:${footer.email}`} className="hover:text-uc transition-colors break-all">
                      {footer.email}
                    </a>
                  </li>
                )}
                {footer.phone && (
                  <li>
                    Tel.:{" "}
                    <a href={`tel:${footer.phone.replace(/[^\d+]/g, "")}`} className="hover:text-uc transition-colors whitespace-nowrap">
                      {footer.phone}
                    </a>
                  </li>
                )}
                {footer.locations.map((l, i) => (
                  <li key={i}>
                    {l.text}
                    {l.note && <span className="block text-xs text-slate-500 mt-0.5">{l.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-uc">Kövess Minket</h4>
              <div className="flex gap-4">
                {footer.socials.map((s, i) =>
                  s.href ? (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold hover:text-uc cursor-pointer transition-colors"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span key={i} className="text-xs font-bold hover:text-uc cursor-pointer transition-colors">
                      {s.label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest gap-4">
          <p>{footer.copyright}</p>
          <Link href="/adatkezeles" className="hover:text-uc transition-colors">
            Adatkezelési tájékoztató
          </Link>
          <p>{footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
