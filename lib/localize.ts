import type {
  AboutContent,
  FooterContent,
  FormOptions,
  HeroContent,
  NewsItem,
  PriceItem,
  PriceNote,
  Room,
  SettingsMap,
} from "./content-types";
import { classFullLabel } from "./format";
import { dateLabel, dictionaries, type Locale } from "./i18n";

/*
  Az adminban szerkesztett tartalom kiválasztása a nyelvhez.
  Szabály: ha az angol szöveg üres, a magyar látszik (így semmi nem tűnik el
  az angol oldalról attól, hogy még nincs lefordítva). Kivétel: a hírek — az
  angol oldalon csak az angol címmel és szöveggel rendelkezők jelennek meg.
*/

/** Az angol szöveg, ha ki van töltve, különben a magyar. */
export function pick(hu: string, en: string | null | undefined, locale: Locale): string {
  return locale === "en" && en && en.trim() ? en : hu;
}

export function localizeHero(h: HeroContent, locale: Locale): HeroContent {
  if (locale === "hu") return h;
  const d = dictionaries.en.hero;
  const e = h.en ?? {};
  return {
    ...h,
    badge: pick(h.badge, e.badge, locale),
    leadBefore: pick(h.leadBefore, e.leadBefore, locale),
    leadHighlight: pick(h.leadHighlight, e.leadHighlight, locale),
    leadAfter: pick(h.leadAfter, e.leadAfter, locale),
    // a gombfeliratok az adminban nem szerkeszthetők — angolul a beépített felirat
    primaryCtaLabel: e.primaryCtaLabel?.trim() || d.primaryCta,
    secondaryCtaLabel: e.secondaryCtaLabel?.trim() || d.secondaryCta,
  };
}

export function localizeAbout(a: AboutContent, locale: Locale): AboutContent {
  if (locale === "hu") return a;
  const e = a.en ?? {};
  return {
    ...a,
    titleLine1: pick(a.titleLine1, e.titleLine1, locale),
    titleLine2: pick(a.titleLine2, e.titleLine2, locale),
    paragraph: pick(a.paragraph, e.paragraph, locale),
    highlight: pick(a.highlight, e.highlight, locale),
    imageAlt: pick(a.imageAlt, e.imageAlt, locale),
    stats: a.stats.map((s) => ({ ...s, value: pick(s.value, s.en?.value, locale), label: pick(s.label, s.en?.label, locale) })),
  };
}

export function localizeFooter(f: FooterContent, locale: Locale): FooterContent {
  if (locale === "hu") return f;
  return {
    ...f,
    locations: f.locations.map((l) => ({ ...l, text: pick(l.text, l.en?.text, locale), note: pick(l.note, l.en?.note, locale) })),
    copyright: pick(f.copyright, f.en?.copyright, locale),
    tagline: pick(f.tagline, f.en?.tagline, locale),
  };
}

/** Az űrlap opciói: a beküldött érték mindig a magyar (egységes az adminban), a felirat a nyelvé. */
export function experienceOptions(o: FormOptions, locale: Locale): { value: string; label: string }[] {
  return o.experience.map((value, i) => ({ value, label: pick(value, o.experienceEn?.[i], locale) }));
}

export function localizePriceNotes(notes: PriceNote[], locale: Locale): PriceNote[] {
  if (locale === "hu") return notes;
  return notes.map((n) => ({ ...n, text: pick(n.text, n.en?.text, locale) }));
}

export function localizePrices(items: PriceItem[], locale: Locale): PriceItem[] {
  if (locale === "hu") return items;
  return items.map((p) => ({ ...p, name: pick(p.name, p.nameEn, locale), price: pick(p.price, p.priceEn, locale) }));
}

export function localizeRooms(rooms: Room[], locale: Locale): Room[] {
  if (locale === "hu") return rooms;
  return rooms.map((r) => {
    const name = pick(r.name, r.nameEn, locale);
    return {
      ...r,
      name,
      shortName: pick(r.shortName, r.shortNameEn, locale),
      columns: r.columns.map((col) => {
        const heading = pick(col.heading, col.headingEn, locale);
        return {
          ...col,
          heading,
          classes: col.classes.map((c) => {
            const title = pick(c.title, c.titleEn, locale);
            const subtitle = pick(c.subtitle, c.subtitleEn, locale);
            return { ...c, title, subtitle, chip: pick(c.chip, c.chipEn, locale), full: classFullLabel(name, heading, title, subtitle) };
          }),
        };
      }),
    };
  });
}

const plainText = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

/** Van-e a hírnek angol változata (angol cím + angol szöveg vagy rövid szöveg). */
export function hasEnglish(n: Pick<NewsItem, "titleEn" | "bodyHtmlEn" | "excerptEn">): boolean {
  return !!n.titleEn.trim() && (!!plainText(n.bodyHtmlEn) || !!n.excerptEn.trim());
}

export function localizeNewsItem(n: NewsItem, locale: Locale): NewsItem {
  if (locale === "hu") return n;
  return {
    ...n,
    dateLabel: dateLabel(n.publishedOn, "en"),
    title: n.titleEn,
    excerpt: n.excerptEn,
    bodyHtml: n.bodyHtmlEn,
    imageAlt: n.imageAltEn || n.imageAlt,
    placeholderLabel: pick(n.placeholderLabel, n.placeholderLabelEn, locale),
  };
}

/** Az adott nyelvű oldalon megjelenő hírek (angolul csak a lefordítottak). */
export function localizeNews(news: NewsItem[], locale: Locale): NewsItem[] {
  if (locale === "hu") return news;
  return news.filter(hasEnglish).map((n) => localizeNewsItem(n, locale));
}

export function localizeSettings(s: SettingsMap, locale: Locale): SettingsMap {
  if (locale === "hu") return s;
  return {
    ...s,
    hero: localizeHero(s.hero, locale),
    about: localizeAbout(s.about, locale),
    footer: localizeFooter(s.footer, locale),
    price_notes: { notes: localizePriceNotes(s.price_notes.notes, locale) },
  };
}
