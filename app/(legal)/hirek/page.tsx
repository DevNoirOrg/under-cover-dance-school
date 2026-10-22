import type { Metadata } from "next";
import { NewsGrid } from "@/components/News";
import { SubpageFooter, SubpageHeader } from "@/components/Subpage";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hírek — Under Cover",
  description: "Az Under Cover K-pop tánciskola hírei: új csoportok, események, tanévkezdés.",
};

export default async function HirekPage() {
  const { settings, news } = await getSiteContent();

  return (
    <>
      <SubpageHeader />
      <main className="dot-paper px-6 pt-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-uc-deep">Under Cover Dance Academy</p>
          <h1 className="font-title font-black text-4xl md:text-6xl text-ink mt-3 mb-14">Hírek</h1>
          {news.length > 0 ? (
            <NewsGrid news={news} className="grid md:grid-cols-3 gap-x-8 gap-y-16" />
          ) : (
            <p className="text-slate-500 font-semibold">Még nincs hír.</p>
          )}
        </div>
      </main>
      <SubpageFooter copyright={settings.footer.copyright} />
    </>
  );
}
