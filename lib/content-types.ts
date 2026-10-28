/*
  A szerkeszthető tartalom típusai. Az adatbázisban (undercover séma) élnek,
  az admin felületen szerkeszthetők.

  KÉTNYELVŰSÉG: minden szöveg mellett van egy angol változat (`en` / `…En`).
  Ha az angol üres, az angol oldalon a magyar szöveg látszik (lib/localize.ts).
*/

/** A hero fordítható szövegei. */
export type HeroText = {
  badge: string;
  /** A bevezető szöveg: [leadBefore] [leadHighlight — fehérrel kiemelve] [leadAfter]. Bármelyik lehet üres. */
  leadBefore: string;
  leadHighlight: string;
  leadAfter: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export type HeroContent = HeroText & {
  /** Feltöltött álló videó (Storage útvonal) — null esetén a helyőrző látszik. */
  videoPath: string | null;
  videoPosterPath: string | null;
  en?: Partial<HeroText>;
};

export type AboutText = {
  titleLine1: string;
  titleLine2: string;
  /** Bekezdések, üres sorral elválasztva. */
  paragraph: string;
  highlight: string;
  imageAlt: string;
};

export type AboutContent = AboutText & {
  /** Üres lista esetén a számsor nem jelenik meg. */
  stats: { value: string; label: string; en?: { value?: string; label?: string } }[];
  /** "/studionk.jpg" (public mappa) vagy Storage útvonal. */
  imagePath: string;
  en?: Partial<AboutText>;
};

export type FooterContent = {
  /** „Elérhetőségek” blokk */
  email: string;
  phone: string;
  locations: { text: string; note: string; en?: { text?: string; note?: string } }[];
  socials: { label: string; href: string | null }[];
  copyright: string;
  tagline: string;
  en?: { copyright?: string; tagline?: string };
};

export type FormOptions = {
  /** „Táncoltál már korábban?” opciói (a mező nem kötelező). A jelentkezésbe mindig a magyar kerül. */
  experience: string[];
  /** Az opciók angol felirata, ugyanabban a sorrendben (üres = a magyar látszik). */
  experienceEn?: string[];
};

export type PriceNote = { mark: "" | "*" | "**"; text: string; en?: { text?: string } };

export type PrivacyContent = { text: string };

export type SettingsMap = {
  hero: HeroContent;
  about: AboutContent;
  footer: FooterContent;
  form_options: FormOptions;
  price_notes: { notes: PriceNote[] };
  privacy: PrivacyContent;
};
export type SettingsKey = keyof SettingsMap;

export type ClassItem = {
  id: string;
  title: string;
  subtitle: string;
  chip: string;
  titleEn: string;
  subtitleEn: string;
  chipEn: string;
  /** A jelentkezésbe kerülő teljes leírás (terem + oszlop címe + kártya). */
  full: string;
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  nameEn: string;
  shortNameEn: string;
  minHeightPx: number;
  /** 1–3 oszlop (pl. „Hétfő · Szerda”, „Kedd · Csütörtök”). */
  columns: { heading: string; headingEn: string; classes: ClassItem[] }[];
};

export type NewsItem = {
  id: string;
  /** A hír oldalának címe: /hirek/<slug> (angolul: /en/news/<slug>) */
  slug: string;
  publishedOn: string;
  /** Pl. "2026. MÁJ 12" */
  dateLabel: string;
  title: string;
  excerpt: string;
  imagePath: string | null;
  imageAlt: string | null;
  placeholderLabel: string;
  /** A hír teljes szövege (szerveroldalon megtisztított HTML). */
  bodyHtml: string;
  titleEn: string;
  excerptEn: string;
  bodyHtmlEn: string;
  imageAltEn: string;
  placeholderLabelEn: string;
};

export type PriceItem = {
  id: string;
  name: string;
  price: string;
  note: "" | "*" | "**";
  nameEn: string;
  priceEn: string;
};
