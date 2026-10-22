/* eslint-disable @next/next/no-img-element -- a hír képe egyszerű <img> (Storage-ból) */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubpageFooter, SubpageHeader } from "@/components/Subpage";
import { getNewsPage, getSiteContent } from "@/lib/content";
import { mediaUrl } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

/** Buildkor a meglévő hírek oldalai előre elkészülnek; az újak az első megnyitáskor. */
export async function generateStaticParams() {
  const { news } = await getSiteContent();
  // legalább egy paraméter kell a build ellenőrzéséhez (üres lista esetén 404 lesz)
  return news.length > 0 ? news.map((n) => ({ slug: n.slug })) : [{ slug: "nincs-hir" }];
}

const findNews = (slug: string) => getNewsPage(decodeURIComponent(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = await findNews((await params).slug);
  if (!item) return { title: "Hír nem található — Under Cover" };
  return {
    title: `${item.title} — Under Cover`,
    description: item.excerpt,
    openGraph: item.imagePath ? { images: [{ url: mediaUrl(item.imagePath) }] } : undefined,
  };
}

export default async function HirPage({ params }: Props) {
  const { item, copyright } = await findNews((await params).slug);
  if (!item) notFound();

  return (
    <>
      <SubpageHeader backHref="/hirek" backLabel="← Összes hír" />
      <main className="px-6 pt-16 pb-28">
        <article className="max-w-3xl mx-auto">
          <p className="font-mono text-[11px] text-uc-deep font-bold">{item.dateLabel}</p>
          <h1 className="font-title font-black text-3xl md:text-5xl text-ink mt-3 leading-tight">{item.title}</h1>
          {item.excerpt && <p className="mt-6 text-lg font-semibold text-slate-500 leading-relaxed">{item.excerpt}</p>}

          {item.imagePath && (
            <img
              src={mediaUrl(item.imagePath)}
              alt={item.imageAlt || item.title}
              className="mt-10 w-full rounded-[2rem] shadow-lg"
            />
          )}

          {/* A szöveget az admin WYSIWYG szerkesztője írja; mentéskor szerveroldalon megtisztítjuk. */}
          <div className="doc news-body mt-10" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/#orarend"
              className="bg-ink text-white px-8 py-5 rounded-2xl font-extrabold uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-uc-deep transition-colors"
            >
              Órarend és jelentkezés
            </Link>
            <Link
              href="/hirek"
              className="border-2 border-ink/10 text-ink px-8 py-5 rounded-2xl font-extrabold uppercase tracking-[0.2em] text-xs hover:border-uc-deep hover:text-uc-deep transition-colors"
            >
              Összes hír
            </Link>
          </div>
        </article>
      </main>
      <SubpageFooter copyright={copyright} />
    </>
  );
}
