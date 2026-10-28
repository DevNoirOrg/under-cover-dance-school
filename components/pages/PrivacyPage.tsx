import { Fragment } from "react";
import { SubpageFooter, SubpageHeader } from "@/components/Subpage";
import { getSiteContent } from "@/lib/content";
import { paths, t, type Locale } from "@/lib/i18n";
import { localizeFooter } from "@/lib/localize";
import { parsePrivacyText, type PrivacyBlock } from "@/lib/privacy-text";

/*
  Adatkezelési tájékoztató — /adatkezeles és /en/privacy.
  A tájékoztató csak magyarul van; az angol oldalon a magyar szöveg látszik
  egy angol megjegyzéssel („available in Hungarian only”).
*/

function Blocks({ blocks }: { blocks: PrivacyBlock[] }) {
  return blocks.map((b, i) =>
    b.type === "ul" ? (
      <ul key={i}>
        {b.items.map((item, j) => (
          <li key={j}>{item}</li>
        ))}
      </ul>
    ) : (
      <p key={i}>
        {b.lines.map((line, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
    ),
  );
}

export default async function PrivacyPage({ locale }: { locale: Locale }) {
  const { settings } = await getSiteContent();
  const { intro, sections } = parsePrivacyText(settings.privacy.text);
  const d = t(locale);

  return (
    <>
      <SubpageHeader locale={locale} alternateHref={paths[locale === "hu" ? "en" : "hu"].privacy} />

      <main className="px-6 pt-16 pb-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-uc-deep">{d.subpage.academy}</p>
          <h1 className="font-title font-black text-4xl md:text-6xl text-ink mt-3">{d.privacy.title}</h1>

          {d.privacy.onlyHungarian && (
            <p className="mt-8 rounded-[1.75rem] bg-uc-pale border-2 border-uc/20 px-6 py-5 text-sm font-bold text-uc-deep">
              {d.privacy.onlyHungarian}
            </p>
          )}

          {/* a tájékoztató szövege mindig magyar */}
          <div lang="hu">
            {intro.length > 0 && (
              <div className="mt-8 rounded-[1.75rem] bg-yellow-50 border-2 border-yellow-200 px-6 py-5 text-sm font-semibold text-yellow-900 space-y-2">
                {intro.map((b, i) =>
                  b.type === "ul" ? (
                    <ul key={i} className="list-disc pl-5">
                      {b.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{b.lines.join(" ")}</p>
                  ),
                )}
              </div>
            )}

            {/* Tartalomjegyzék */}
            {sections.length > 0 && (
              <nav className="mt-10 rounded-[2rem] bg-mist p-6 md:p-8">
                <p lang={locale} className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                  {d.privacy.contents}
                </p>
                <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm font-semibold text-slate-600 list-decimal pl-5 marker:text-uc-deep">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a className="hover:text-uc-deep" href={`#${s.id}`}>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <article className="doc">
              {sections.map((s, i) => (
                <section key={s.id}>
                  <h2 id={s.id}>
                    {i + 1}. {s.title}
                  </h2>
                  <Blocks blocks={s.blocks} />
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>

      <SubpageFooter copyright={localizeFooter(settings.footer, locale).copyright} locale={locale} />
    </>
  );
}
