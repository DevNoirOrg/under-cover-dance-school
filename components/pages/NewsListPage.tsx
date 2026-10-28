import { NewsGrid } from "@/components/News";
import { SubpageFooter, SubpageHeader } from "@/components/Subpage";
import { getSiteContent } from "@/lib/content";
import { paths, t, type Locale } from "@/lib/i18n";
import { localizeFooter, localizeNews } from "@/lib/localize";

/** Az összes hír — /hirek és /en/news (angolul csak a lefordított hírek). */
export default async function NewsListPage({ locale }: { locale: Locale }) {
  const { settings, news } = await getSiteContent();
  const list = localizeNews(news, locale);
  const d = t(locale);

  return (
    <>
      <SubpageHeader locale={locale} alternateHref={paths[locale === "hu" ? "en" : "hu"].news} />
      <main className="dot-paper px-6 pt-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-uc-deep">{d.subpage.academy}</p>
          <h1 className="font-title font-black text-4xl md:text-6xl text-ink mt-3 mb-14">{d.news.title}</h1>
          {list.length > 0 ? (
            <NewsGrid news={list} locale={locale} className="grid md:grid-cols-3 gap-x-8 gap-y-16" />
          ) : (
            <p className="text-slate-500 font-semibold">{d.news.empty}</p>
          )}
        </div>
      </main>
      <SubpageFooter copyright={localizeFooter(settings.footer, locale).copyright} locale={locale} />
    </>
  );
}
