"use client";

/* eslint-disable @next/next/no-img-element -- admin előnézet */
import { useState } from "react";
import { deleteNews, saveNews } from "@/app/actions/admin";
import MediaField from "@/components/admin/MediaField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Button, Card, EditInfoLine, Field, PageHeader, StatusText, inputCls, isSame, textareaCls, useSaver } from "@/components/admin/ui";
import type { EditInfo } from "@/lib/admin-data";
import type { NewsItem } from "@/lib/content-types";
import { mediaUrl, newsDateLabel } from "@/lib/format";

/*
  Hírek: az oldalon dátum szerint csökkenő sorrendben jelennek meg (a legújabb
  balra). Minden hírnek saját oldala van (/hirek/<webcím>) a teljes szöveggel,
  amit a Word-szerű szerkesztővel lehet megírni. Minden hír külön menthető.
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
});

const today = () => new Date().toISOString().slice(0, 10);

function NewsForm({ initial, onDone, isNew }: { initial: Draft; onDone: () => void; isNew?: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [d, setD] = useState(initial);
  const { pending, status, save } = useSaver();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const dirty = !isSame(d, saved);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <Field label="Dátum" htmlFor={`d-${d.id ?? "new"}`} hint={d.publishedOn ? newsDateLabel(d.publishedOn) : undefined}>
            <input id={`d-${d.id ?? "new"}`} type="date" className={inputCls} value={d.publishedOn} onChange={(e) => set("publishedOn", e.target.value)} />
          </Field>
          <Field label="Cím" htmlFor={`t-${d.id ?? "new"}`}>
            <input id={`t-${d.id ?? "new"}`} className={inputCls} value={d.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
        </div>
        <Field label="Rövid szöveg" htmlFor={`e-${d.id ?? "new"}`} hint="A hírkártyán és a hír oldalán a cím alatt látszik.">
          <textarea id={`e-${d.id ?? "new"}`} rows={3} className={textareaCls} value={d.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </Field>
        <Field
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
          <Field label="Kép leírása" htmlFor={`a-${d.id ?? "new"}`} hint="Képernyőolvasóknak.">
            <input id={`a-${d.id ?? "new"}`} className={inputCls} value={d.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
          </Field>
          <Field label="Felirat kép helyett" htmlFor={`p-${d.id ?? "new"}`} hint="Ha nincs kép, ez látszik a szürke dobozban.">
            <input id={`p-${d.id ?? "new"}`} className={inputCls} value={d.placeholderLabel} onChange={(e) => set("placeholderLabel", e.target.value)} />
          </Field>
        </div>
      </div>
      <Field label="Kártya kép (3:4)" hint="A hírkártyán és a hír oldalának tetején.">
        <MediaField kind="image" value={d.imagePath} onChange={(p) => set("imagePath", p)} aspectClass="aspect-[3/4] max-w-[240px]" emptyLabel={d.placeholderLabel || "Nincs kép"} />
      </Field>
      <div className="md:col-span-2">
        <Field
          label="A hír teljes szövege"
          htmlFor={`b-${d.id ?? "new"}`}
          hint="Úgy szerkeszd, mint egy Word dokumentumot. Wordből vagy weboldalról is bemásolhatod a szöveget."
        >
          <RichTextEditor id={`b-${d.id ?? "new"}`} value={d.bodyHtml} onChange={(html) => set("bodyHtml", html)} />
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
              initial={{ publishedOn: today(), slug: "", title: "", excerpt: "", bodyHtml: "", imagePath: null, imageAlt: "", placeholderLabel: "" }}
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
                  <p className="truncate font-bold">{n.title}</p>
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
