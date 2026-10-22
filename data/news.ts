/*
  Hírek — három kártya (a design szerinti forgatással / eltolással).
  Amíg nincs `imageSrc`, a design szerinti szürke helyőrző jelenik meg
  a `placeholderLabel` felirattal.
*/

export type NewsItem = {
  date: string;
  title: string;
  excerpt: string;
  placeholderLabel: string;
  /** Pl. "/hirek/fellepes.jpg" (a public/ mappából). */
  imageSrc?: string;
  imageAlt?: string;
};

export const news: NewsItem[] = [
  {
    date: "2026. MÁJ 12",
    title: "Fellépés a Budapest Parkban!",
    excerpt: "Hatalmasat ment a csapat a legutóbbi K-Pop Night eseményen…",
    placeholderLabel: "Fellépés",
  },
  {
    date: "2026. ÁPR 28",
    title: "Új kurzusok indulnak májustól",
    excerpt: "Kezdő és haladó csoportjaink is feltöltődtek, nézd meg az extra időpontokat…",
    placeholderLabel: "Kurzus",
  },
  {
    date: "2026. MÁR 15",
    title: "Merch Drop: Hamarosan!",
    excerpt: "Készülnek az egyedi Under Cover pulcsik és pólók, limitált kiadásban…",
    placeholderLabel: "Merch",
  },
];
