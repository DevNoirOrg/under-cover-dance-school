/*
  A szerkeszthető tartalom típusai. Az adatbázisban (undercover séma) élnek,
  az admin felületen szerkeszthetők.
*/

export type HeroContent = {
  badge: string;
  /** A bevezető szöveg: [leadBefore] [leadHighlight — fehérrel kiemelve] [leadAfter]. Bármelyik lehet üres. */
  leadBefore: string;
  leadHighlight: string;
  leadAfter: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  /** Feltöltött álló videó (Storage útvonal) — null esetén a helyőrző látszik. */
  videoPath: string | null;
  videoPosterPath: string | null;
};

export type AboutContent = {
  titleLine1: string;
  titleLine2: string;
  /** Bekezdések, üres sorral elválasztva. */
  paragraph: string;
  highlight: string;
  /** Üres lista esetén a számsor nem jelenik meg. */
  stats: { value: string; label: string }[];
  /** "/studionk.jpg" (public mappa) vagy Storage útvonal. */
  imagePath: string;
  imageAlt: string;
};

export type FooterContent = {
  /** „Elérhetőségek” blokk */
  email: string;
  phone: string;
  locations: { text: string; note: string }[];
  socials: { label: string; href: string | null }[];
  copyright: string;
  tagline: string;
};

export type FormOptions = {
  /** „Táncoltál már korábban?” opciói (a mező nem kötelező). */
  experience: string[];
};

export type PriceNote = { mark: "" | "*" | "**"; text: string };

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
  /** A jelentkezésbe kerülő teljes leírás (terem + oszlop címe + kártya). */
  full: string;
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  minHeightPx: number;
  /** 1–3 oszlop (pl. „Hétfő · Szerda”, „Kedd · Csütörtök”). */
  columns: { heading: string; classes: ClassItem[] }[];
};

export type NewsItem = {
  id: string;
  /** A hír oldalának címe: /hirek/<slug> */
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
};

export type PriceItem = {
  id: string;
  name: string;
  price: string;
  note: "" | "*" | "**";
};
