import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";
import type { NewsItem, PriceItem, Room, SettingsKey, SettingsMap } from "./content-types";
import { classFullLabel, newsDateLabel } from "./format";

/*
  A publikus oldal tartalma — gyorsítótárazva. Az oldal statikus marad; az
  admin mentéskor az updateTag(CONTENT_TAG) hívással azonnal frissíti.
*/
export const CONTENT_TAG = "site-content";

export async function readSettings(): Promise<SettingsMap> {
  const rows = await db()<{ key: SettingsKey; value: unknown }[]>`
    select key, value from undercover.settings`;
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<SettingsMap>;
  const required: SettingsKey[] = ["hero", "about", "footer", "form_options", "price_notes", "privacy"];
  for (const k of required) {
    if (!map[k]) throw new Error(`Hiányzó tartalom az adatbázisban: settings.${k} (futtasd az undercover-seed.sql-t)`);
  }
  return map as SettingsMap;
}

export async function readRooms(): Promise<Room[]> {
  const rooms = await db()<
    {
      id: string;
      slug: string;
      name: string;
      short_name: string;
      column_headings: string[];
      min_height_px: number;
      name_en: string;
      short_name_en: string;
      column_headings_en: string[];
    }[]
  >`select id, slug, name, short_name, column_headings, min_height_px, name_en, short_name_en, column_headings_en
    from undercover.rooms order by sort, name`;
  const classes = await db()<
    {
      id: string;
      room_id: string;
      col: number;
      title: string;
      subtitle: string;
      chip: string;
      title_en: string;
      subtitle_en: string;
      chip_en: string;
    }[]
  >`select id, room_id, col, title, subtitle, chip, title_en, subtitle_en, chip_en
    from undercover.classes order by col, sort`;
  return rooms.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortName: r.short_name,
    nameEn: r.name_en,
    shortNameEn: r.short_name_en,
    minHeightPx: r.min_height_px,
    columns: r.column_headings.map((heading, col) => ({
      heading,
      headingEn: r.column_headings_en[col] ?? "",
      classes: classes
        .filter((c) => c.room_id === r.id && c.col === col)
        .map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          chip: c.chip,
          titleEn: c.title_en,
          subtitleEn: c.subtitle_en,
          chipEn: c.chip_en,
          full: classFullLabel(r.name, heading, c.title, c.subtitle),
        })),
    })),
  }));
}

export async function readNews(): Promise<NewsItem[]> {
  const rows = await db()<
    {
      id: string;
      slug: string;
      published_on: string;
      title: string;
      excerpt: string;
      image_path: string | null;
      image_alt: string | null;
      placeholder_label: string;
      body_html: string;
      title_en: string;
      excerpt_en: string;
      body_html_en: string;
      image_alt_en: string;
      placeholder_label_en: string;
    }[]
  >`select id, slug, published_on, title, excerpt, image_path, image_alt, placeholder_label, body_html,
      title_en, excerpt_en, body_html_en, image_alt_en, placeholder_label_en
    from undercover.news order by published_on desc, created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    publishedOn: r.published_on,
    dateLabel: newsDateLabel(r.published_on),
    title: r.title,
    excerpt: r.excerpt,
    imagePath: r.image_path,
    imageAlt: r.image_alt,
    placeholderLabel: r.placeholder_label,
    bodyHtml: r.body_html,
    titleEn: r.title_en,
    excerptEn: r.excerpt_en,
    bodyHtmlEn: r.body_html_en,
    imageAltEn: r.image_alt_en,
    placeholderLabelEn: r.placeholder_label_en,
  }));
}

export async function readPrices(): Promise<PriceItem[]> {
  const rows = await db()<
    { id: string; name: string; price: string; note: PriceItem["note"]; name_en: string; price_en: string }[]
  >`select id, name, price, note, name_en, price_en from undercover.prices order by sort, name`;
  return rows.map((r) => ({ id: r.id, name: r.name, price: r.price, note: r.note, nameEn: r.name_en, priceEn: r.price_en }));
}

export type SiteContent = {
  settings: SettingsMap;
  rooms: Room[];
  news: NewsItem[];
  prices: PriceItem[];
};

/** A teljes publikus tartalom egy gyorsítótárazott lekérdezésben. */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  const [settings, rooms, news, prices] = await Promise.all([readSettings(), readRooms(), readNews(), readPrices()]);
  return { settings, rooms, news, prices };
}

/**
 * Egy hír a saját oldalához — hírenként külön gyorsítótár-bejegyzés. (Így egy
 * frissen létrehozott hír oldala már az első megnyitáskor is friss adatból
 * készül, nem a build közben eltett teljes listából.)
 */
export async function getNewsPage(slug: string): Promise<{ item: NewsItem | null; footer: SettingsMap["footer"] }> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  const [news, settings] = await Promise.all([readNews(), readSettings()]);
  return { item: news.find((n) => n.slug === slug) ?? null, footer: settings.footer };
}
