/* eslint-disable @next/next/no-img-element -- a hír képe egyszerű <img> (Storage-ból) */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubpageFooter, SubpageHeader } from "@/components/Subpage";
import { getNewsPage, getSiteContent } from "@/lib/content";
import { mediaUrl } from "@/lib/format";
import { paths, t, type Locale } from "@/lib/i18n";
import { hasEnglish, localizeFooter, localizeNewsItem } from "@/lib/localize";
import { alternates } from "@/lib/seo";

/*
  Egy hír saját oldala — /hirek/<cím> és /en/news/<cím> (ugyanaz a cím).
  Angolul csak akkor létezik, ha a hírnek van angol címe és szövege.
*/

async function findNews(slugParam: string, locale: Locale) {
  const { item, footer } = await getNewsPage(decodeURIComponent(slugParam));
  if (!item || (locale === "en" && !hasEnglish(item))) return { item: null, raw: item, footer };
  return { item: localizeNewsItem(item, locale), raw: item, footer };
}

/** Buildkor a meglévő hírek oldalai előre elkészülnek; az újak az első megnyitáskor. */
export async function newsStaticParams(locale: Locale) {
  const { news } = await getSiteContent();
  const list = locale === "en" ? news.filter(hasEnglish) : news;
  // legalább egy paraméter kell a build ellenőrzéséhez (üres lista esetén 404 lesz)
  return list.length > 0 ? list.map((n) => ({ slug: n.slug })) : [{ slug: "nincs-hir" }];
}

export async function newsMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const { item, raw } = await findNews(slug, locale);
  if (!item || !raw) return { title: t(locale).meta.newsNotFound };
  return {
    title: `${item.title} — Under Cover`,
    description: item.excerpt,
    alternates: alternates(locale, paths.hu.newsItem(raw.slug), hasEnglish(raw) ? paths.en.newsItem(raw.slug) : null),
    openGraph: item.imagePath ? { images: [{ url: mediaUrl(item.imagePath) }] } : undefined,
  };
}

export default async function NewsArticlePage({ slug, locale }: { slug: string; locale: Locale }) {
  const { item, raw, footer } = await findNews(slug, locale);
  if (!item || !raw) notFound();
  const d = t(locale).news;
  const p = paths[locale];
  // a másik nyelvű pár: ha a hír nincs lefordítva, az angol hírlista
  const alternateHref = locale === "hu" ? (hasEnglish(raw) ? paths.en.newsItem(raw.slug) : paths.en.news) : paths.hu.newsItem(raw.slug);

  return (
    <>
      <SubpageHeader locale={locale} alternateHref={alternateHref} backHref={p.news} backLabel={d.backToAll} />
      <main className="px-6 pt-16 pb-28">
        <article className="max-w-3xl mx-auto">
          <p className="font-mono text-[11px] text-uc-deep font-bold">{item.dateLabel}</p>
          <h1 className="font-title font-black text-3xl md:text-5xl text-ink mt-3 leading-tight">{item.title}</h1>
          {item.excerpt && <p className="mt-6 text-lg font-semibold text-slate-500 leading-relaxed">{item.excerpt}</p>}

          {item.imagePath && (
            <img src={mediaUrl(item.imagePath)} alt={item.imageAlt || item.title} className="mt-10 w-full rounded-[2rem] shadow-lg" />
          )}

          {/* A szöveget az admin WYSIWYG szerkesztője írja; mentéskor szerveroldalon megtisztítjuk. */}
          <div className="doc news-body mt-10" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href={p.schedule}
              className="bg-ink text-white px-8 py-5 rounded-2xl font-extrabold uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-uc-deep transition-colors"
            >
              {d.cta}
            </Link>
            <Link
              href={p.news}
              className="border-2 border-ink/10 text-ink px-8 py-5 rounded-2xl font-extrabold uppercase tracking-[0.2em] text-xs hover:border-uc-deep hover:text-uc-deep transition-colors"
            >
              {d.allShort}
            </Link>
          </div>
        </article>
      </main>
      <SubpageFooter copyright={localizeFooter(footer, locale).copyright} locale={locale} />
    </>
  );
}
