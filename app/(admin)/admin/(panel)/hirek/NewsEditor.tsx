"use client";

/* eslint-disable @next/next/no-img-element -- admin előnézet */
import { useState } from "react";
import { deleteNews, saveNews } from "@/app/actions/admin";
import MediaField from "@/components/admin/MediaField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  Button,
  Card,
  EditInfoLine,
  Field,
  LangTabs,
  PageHeader,
  StatusText,
  TrText,
  countMissing,
  inputCls,
  isSame,
  useSaver,
  type EditLang,
} from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { NewsItem } from "@/lib/content-types";
import { mediaUrl, newsDateLabel } from "@/lib/format";
import { hasEnglish } from "@/lib/localize";

/*
  Hírek: az oldalon dátum szerint csökkenő sorrendben jelennek meg (a legújabb
  balra). Minden hírnek saját oldala van (/hirek/<webcím>) a teljes szöveggel,
  amit a Word-szerű szerkesztővel lehet megírni. Minden hír külön menthető.
  Angolul (English fül) is megírható: az angol oldalon (/en/news/<webcím>) csak
  azok a hírek jelennek meg, amelyeknek van angol címe és szövege.
*/

type Draft = {
  id?: string;
  publishedOn: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  imagePath: string | null;
  imageAlt: string;
  placeholderLabel: string;
  titleEn: string;
  excerptEn: string;
  bodyHtmlEn: string;
  imageAltEn: string;
  placeholderLabelEn: string;
};

const toDraft = (n: NewsItem): Draft => ({
  id: n.id,
  publishedOn: n.publishedOn,
  slug: n.slug,
  title: n.title,
  excerpt: n.excerpt,
  bodyHtml: n.bodyHtml,
  imagePath: n.imagePath,
  imageAlt: n.imageAlt ?? "",
  placeholderLabel: n.placeholderLabel,
  titleEn: n.titleEn,
  excerptEn: n.excerptEn,
  bodyHtmlEn: n.bodyHtmlEn,
  imageAltEn: n.imageAltEn,
  placeholderLabelEn: n.placeholderLabelEn,
});

const today = () => new Date().toISOString().slice(0, 10);

function NewsForm({ initial, onDone, isNew }: { initial: Draft; onDone: () => void; isNew?: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [d, setD] = useState(initial);
  const { pending, status, save } = useSaver();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const dirty = !isSame(d, saved);
  const [lang, setLang] = useState<EditLang>("hu");
  const isEn = lang === "en";
  const fid = (x: string) => `${x}-${d.id ?? "new"}`;
  const tr = (hu: "title" | "excerpt" | "imageAlt" | "placeholderLabel") => {
    const enKey = `${hu}En` as "titleEn" | "excerptEn" | "imageAltEn" | "placeholderLabelEn";
    return { lang, hu: d[hu], en: d[enKey], onHu: (x: string) => set(hu, x), onEn: (x: string) => set(enKey, x) };
  };
  const missing = countMissing([
    [d.title, d.titleEn],
    [d.excerpt, d.excerptEn],
    [d.bodyHtml.replace(/<[^>]*>/g, ""), d.bodyHtmlEn.replace(/<[^>]*>/g, "")],
  ]);
  const english = hasEnglish(d);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="flex flex-wrap items-start justify-between gap-3 md:col-span-2">
        <p className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest ${english ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {english ? "✓ Az angol oldalon is megjelenik" : "Csak a magyar oldalon (nincs angol címe és szövege)"}
        </p>
        <LangTabs lang={lang} onChange={setLang} missing={missing} />
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]" hidden={isEn}>
          <Field label="Dátum" htmlFor={`d-${d.id ?? "new"}`} hint={d.publishedOn ? newsDateLabel(d.publishedOn) : undefined}>
            <input id={`d-${d.id ?? "new"}`} type="date" className={inputCls} value={d.publishedOn} onChange={(e) => set("publishedOn", e.target.value)} />
          </Field>
        </div>
        <Field label="Cím" htmlFor={fid("t")}>
          <TrText id={fid("t")} {...tr("title")} />
        </Field>
        <Field label="Rövid szöveg" htmlFor={fid("e")} hint="A hírkártyán és a hír oldalán a cím alatt látszik.">
          <TrText id={fid("e")} rows={3} {...tr("excerpt")} />
        </Field>
        <Field
          className={isEn ? "hidden" : ""}
          label="Webcím"
          htmlFor={`s-${d.id ?? "new"}`}
          hint={
            <>
              A hír oldala: <span className="font-mono">/hirek/{d.slug || "…"}</span>. Üresen hagyva a címből készül. Csak kisbetű, szám, kötőjel.
              {!isNew && saved.slug && (
                <>
                  {" "}
                  <a href={`/hirek/${saved.slug}`} target="_blank" rel="noopener" className="font-bold text-uc-deep underline">
                    Megnyitom ↗
                  </a>
                </>
              )}
            </>
          }
        >
          <input
            id={`s-${d.id ?? "new"}`}
            className={`${inputCls} font-mono`}
            value={d.slug}
            placeholder="pl. ket-uj-k-pop-csoport"
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kép leírása" htmlFor={fid("a")} hint="Képernyőolvasóknak.">
            <TrText id={fid("a")} {...tr("imageAlt")} />
          </Field>
          <Field label="Felirat kép helyett" htmlFor={fid("p")} hint="Ha nincs kép, ez látszik a szürke dobozban.">
            <TrText id={fid("p")} {...tr("placeholderLabel")} />
          </Field>
        </div>
      </div>
      <Field label="Kártya kép (3:4)" hint="A hírkártyán és a hír oldalának tetején.">
        <MediaField kind="image" value={d.imagePath} onChange={(p) => set("imagePath", p)} aspectClass="aspect-[3/4] max-w-[240px]" emptyLabel={d.placeholderLabel || "Nincs kép"} />
      </Field>
      <div className="md:col-span-2">
        <Field
          label={isEn ? "A hír teljes szövege — angolul" : "A hír teljes szövege"}
          htmlFor={fid(isEn ? "b-en" : "b")}
          hint={
            isEn
              ? "Az angol változat. Ha üres (és az angol rövid szöveg is), a hír nem jelenik meg az angol oldalon."
              : "Úgy szerkeszd, mint egy Word dokumentumot. Wordből vagy weboldalról is bemásolhatod a szöveget."
          }
        >
          {isEn ? (
            <RichTextEditor key="en" id={fid("b-en")} value={d.bodyHtmlEn} onChange={(html) => set("bodyHtmlEn", html)} />
          ) : (
            <RichTextEditor key="hu" id={fid("b")} value={d.bodyHtml} onChange={(html) => set("bodyHtml", html)} />
          )}
        </Field>
      </div>
      <div className="md:col-span-2">
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            disabled={pending || (!dirty && !isNew)}
            onClick={() =>
              save(
                () => saveNews(d),
                isNew ? "Hír közzétéve." : undefined,
                (r) => {
                  const next = r.ok ? { ...d, id: r.id ?? d.id, slug: r.slug ?? d.slug } : d;
                  setD(next);
                  setSaved(next);
                  if (isNew) onDone();
                },
              )
            }
          >
            {pending ? "Mentés…" : isNew ? "Közzététel" : "Mentés"}
          </Button>
          {isNew ? (
            <Button variant="ghost" onClick={onDone}>
              Mégse
            </Button>
          ) : (
            <Button
              variant="danger"
              disabled={pending}
              onClick={() => {
                if (d.id && window.confirm(`Biztosan törlöd: „${saved.title}”?`)) save(() => deleteNews(d.id!), "Hír törölve.");
              }}
            >
              Törlés
            </Button>
          )}
          {dirty && !pending && !status && <span className="text-sm font-bold text-amber-600">Mentetlen változások</span>}
          <StatusText status={status} />
        </div>
      </div>
    </div>
  );
}

export default function NewsEditor({ news, info }: { news: NewsItem[]; info: EditInfo }) {
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pb-12">
      <PageHeader title="Hírek" description="A főoldalon a 3 legfrissebb dátumú hír látszik (a legújabb balra), mindegyik a saját oldalára visz; az összes hír a /hirek oldalon van. Mentéskor azonnal frissül.">
        {!creating && (
          <Button variant="primary" onClick={() => setCreating(true)}>
            + Új hír
          </Button>
        )}
      </PageHeader>
      <div className="mb-4">
        <EditInfoLine info={info} />
      </div>

      <div className="space-y-4">
        {creating && (
          <Card title="Új hír">
            <NewsForm
              isNew
              initial={{
                publishedOn: today(),
                slug: "",
                title: "",
                excerpt: "",
                bodyHtml: "",
                imagePath: null,
                imageAlt: "",
                placeholderLabel: "",
                titleEn: "",
                excerptEn: "",
                bodyHtmlEn: "",
                imageAltEn: "",
                placeholderLabelEn: "",
              }}
              onDone={() => setCreating(false)}
            />
          </Card>
        )}

        {news.map((n) => {
          const open = openId === n.id;
          return (
            <Card key={n.id} className="!p-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : n.id)}
                className="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 md:p-5"
                aria-expanded={open}
              >
                <div className="grid h-16 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
                  {n.imagePath ? (
                    <img src={mediaUrl(n.imagePath)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-1 text-center font-mono text-[8px] uppercase text-slate-300">{n.placeholderLabel}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] font-bold text-uc-deep">{n.dateLabel}</p>
                  <p className="truncate font-bold">
                    {n.title}
                    {hasEnglish(n) && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-1.5 py-0.5 align-middle text-[10px] font-extrabold text-emerald-700" title="Angolul is megjelenik">
                        EN
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-400">{n.excerpt}</p>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{open ? "Bezár" : "Szerkeszt"}</span>
              </button>
              {open && (
                <div className="border-t border-slate-100 p-4 md:p-6">
                  <NewsForm initial={toDraft(n)} onDone={() => setOpenId(null)} />
                </div>
              )}
            </Card>
          );
        })}
        {news.length === 0 && !creating && <p className="text-sm text-slate-500">Még nincs hír.</p>}
      </div>
    </div>
  );
}
