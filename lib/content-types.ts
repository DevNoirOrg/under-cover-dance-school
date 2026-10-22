/*
  A szerkeszthető tartalom típusai. Az adatbázisban (undercover séma) élnek,
  az admin felületen szerkeszthetők.
*/

export type HeroContent = {
  badge: string;
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
  paragraph: string;
  highlight: string;
  stats: { value: string; label: string }[];
  /** "/studionk.jpg" (public mappa) vagy Storage útvonal. */
  imagePath: string;
  imageAlt: string;
};

export type FooterContent = {
  locations: string[];
  socials: { label: string; href: string | null }[];
  copyright: string;
  tagline: string;
};

export type FormOptions = {
  experience: string[];
  start: string[];
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
  /** A jelentkezésbe kerülő teljes leírás (a terem nevéből és a kártyából áll össze). */
  full: string;
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  minHeightPx: number;
  columns: { heading: string; classes: ClassItem[] }[];
};

export type NewsItem = {
  id: string;
  publishedOn: string;
  /** Pl. "2026. MÁJ 12" */
  dateLabel: string;
  title: string;
  excerpt: string;
  imagePath: string | null;
  imageAlt: string | null;
  placeholderLabel: string;
};

export type PriceItem = {
  id: string;
  name: string;
  price: string;
  note: "" | "*" | "**";
};
