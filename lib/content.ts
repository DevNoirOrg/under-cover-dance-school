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
    { id: string; slug: string; name: string; short_name: string; column_headings: string[]; min_height_px: number }[]
  >`select id, slug, name, short_name, column_headings, min_height_px
    from undercover.rooms order by sort, name`;
  const classes = await db()<
    { id: string; room_id: string; col: number; title: string; subtitle: string; chip: string }[]
  >`select id, room_id, col, title, subtitle, chip from undercover.classes order by col, sort`;
  return rooms.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortName: r.short_name,
    minHeightPx: r.min_height_px,
    columns: r.column_headings.map((heading, col) => ({
      heading,
      classes: classes
        .filter((c) => c.room_id === r.id && c.col === col)
        .map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          chip: c.chip,
          full: classFullLabel(r.name, c.title, c.subtitle),
        })),
    })),
  }));
}

export async function readNews(): Promise<NewsItem[]> {
  const rows = await db()<
    {
      id: string;
      published_on: string;
      title: string;
      excerpt: string;
      image_path: string | null;
      image_alt: string | null;
      placeholder_label: string;
    }[]
  >`select id, published_on, title, excerpt, image_path, image_alt, placeholder_label
    from undercover.news order by published_on desc, created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    publishedOn: r.published_on,
    dateLabel: newsDateLabel(r.published_on),
    title: r.title,
    excerpt: r.excerpt,
    imagePath: r.image_path,
    imageAlt: r.image_alt,
    placeholderLabel: r.placeholder_label,
  }));
}

export async function readPrices(): Promise<PriceItem[]> {
  const rows = await db()<PriceItem[]>`select id, name, price, note from undercover.prices order by sort, name`;
  return rows.map((r) => ({ id: r.id, name: r.name, price: r.price, note: r.note }));
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
