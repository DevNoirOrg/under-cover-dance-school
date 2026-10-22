/*
  Általános oldal-tartalom: hero, "Kik vagyunk?", lábléc.
  Itt szerkeszthető, a komponensekhez nem kell nyúlni.
*/

export const hero = {
  badge: "Budapest",
  /** A hero-szöveg; a `highlight` rész fehérebb színt kap. */
  lead: {
    before: "Fedezd fel a K-Pop világát Magyarország",
    highlight: "legdinamikusabb",
    after: "táncakadémiáján.",
  },
  primaryCta: { label: "Csatlakozz Most", href: "#jelentkezes" },
  secondaryCta: { label: "Órarendünk", href: "#orarend" },
  /**
   * Álló (9:16) videó a hero jobb oldalán. Amíg `null`, a design szerinti
   * szaggatott keretes helyőrző látszik. Pl.: "/hero.mp4" (a public/ mappából).
   */
  heroVideoSrc: null as string | null,
  /** Opcionális állókép a videóhoz (poster), pl. "/hero-poster.jpg". */
  heroVideoPoster: null as string | null,
  videoPlaceholderLabel: "Álló videó",
};

export const about = {
  titleLine1: "Több mint tánc.",
  titleLine2: "Ez egy életérzés.",
  paragraph:
    "Az Under Cover stúdióiban nem csak lépéseket tanulsz. Egy olyan közösség tagja leszel, ahol a precizitás és a szenvedély kéz a kézben jár.",
  highlight:
    "Budapest szívében és Mosonmagyaróváron várunk modern felszereltségű termeinkben.",
  stats: [
    { value: "12+", label: "Oktató" },
    { value: "500+", label: "Tanítvány" },
  ],
  image: {
    src: "/studionk.jpg",
    alt: "Under Cover stúdió — fellépés a színpadon",
  },
};

export const footer = {
  locations: ["Budapest, Akácfa u. 12.", "Mosonmagyaróvár, Fő út 45."],
  /** `href: null` esetén a design szerinti, kattinthatatlan felirat jelenik meg. */
  socials: [
    { label: "IG", href: null as string | null },
    { label: "TK", href: null as string | null },
    { label: "YT", href: null as string | null },
  ],
  copyright: "© 2026 Under Cover Dance Academy",
  tagline: "Built for the New Generation",
};
