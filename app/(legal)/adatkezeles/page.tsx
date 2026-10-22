/* eslint-disable @next/next/no-img-element -- a logók a design szerinti egyszerű <img>-ek */
import type { Metadata } from "next";
import Link from "next/link";
import { privacyIntro, privacySections } from "@/data/privacy";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató — Under Cover",
  description: "Az Under Cover Dance Academy adatkezelési tájékoztatója.",
};

export default function AdatkezelesPage() {
  return (
    <>
      {/* Fejléc */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          <Link href="/" aria-label="Vissza a főoldalra">
            <img src="/under_cover_logo_chrome.png" alt="Under Cover" className="h-11 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 hover:text-uc-deep transition-colors"
          >
            ← Vissza a főoldalra
          </Link>
        </div>
      </header>

      <main className="px-6 pt-16 pb-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-uc-deep">{privacyIntro.eyebrow}</p>
          <h1 className="font-title font-black text-4xl md:text-6xl text-ink mt-3">{privacyIntro.title}</h1>

          <div className="mt-8 rounded-[1.75rem] bg-yellow-50 border-2 border-yellow-200 px-6 py-5 text-sm font-semibold text-yellow-900">
            {privacyIntro.notice}
          </div>

          {/* Tartalomjegyzék */}
          <nav className="mt-10 rounded-[2rem] bg-mist p-6 md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">Tartalom</p>
            <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm font-semibold text-slate-600 list-decimal pl-5 marker:text-uc-deep">
              {privacySections.map((s) => (
                <li key={s.id}>
                  <a className="hover:text-uc-deep" href={`#${s.id}`}>
                    {s.tocTitle}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="doc">
            {privacySections.map((s, i) => (
              <section key={s.id}>
                <h2 id={s.id}>
                  {i + 1}. {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="px-6 py-10 bg-ink text-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <img src="/under_cover_logo_feher.png" alt="Under Cover" className="h-14 w-auto" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            © 2026 Under Cover Dance Academy
          </p>
        </div>
      </footer>
    </>
  );
}
