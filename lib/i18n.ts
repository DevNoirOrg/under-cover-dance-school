/*
  KÉTNYELVŰSÉG — a nyelvek, a címek és a fix (kódban lévő) felületi szövegek.
   - magyar: a megszokott címeken (/, /hirek, /hirek/<cím>, /adatkezeles)
   - angol:  /en, /en/news, /en/news/<ugyanaz a cím>, /en/privacy
  Nincs automatikus nyelvváltás; a látogató a nyelvválasztóval vált.
  Az adminban szerkeszthető tartalom angol változata: lib/localize.ts.
*/

export const LOCALES = ["hu", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const paths = {
  hu: {
    home: "/",
    schedule: "/#orarend",
    news: "/hirek",
    newsItem: (slug: string) => `/hirek/${slug}`,
    privacy: "/adatkezeles",
  },
  en: {
    home: "/en",
    schedule: "/en#orarend",
    news: "/en/news",
    newsItem: (slug: string) => `/en/news/${slug}`,
    privacy: "/en/privacy",
  },
} as const;

const MONTHS: Record<Locale, string[]> = {
  hu: ["JAN", "FEB", "MÁR", "ÁPR", "MÁJ", "JÚN", "JÚL", "AUG", "SZEP", "OKT", "NOV", "DEC"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
};

/** "2026-05-12" → "2026. MÁJ 12" / "12 MAY 2026" (a hírkártyák dátumformátuma). */
export function dateLabel(isoDate: string, locale: Locale): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return locale === "en" ? `${d} ${MONTHS.en[m - 1]} ${y}` : `${y}. ${MONTHS.hu[m - 1]} ${d}`;
}

const hu = {
  langName: "Magyar",
  switchLabel: "Nyelv",
  meta: {
    title: "Under Cover — K-pop Dance School",
    description: "Fedezd fel a K-Pop világát Magyarország legdinamikusabb táncakadémiáján.",
    ogLocale: "hu_HU",
    newsTitle: "Hírek — Under Cover",
    newsDescription: "Az Under Cover K-pop tánciskola hírei: új csoportok, események, tanévkezdés.",
    newsNotFound: "Hír nem található — Under Cover",
    privacyTitle: "Adatkezelési tájékoztató — Under Cover",
    privacyDescription: "Az Under Cover Dance School adatkezelési tájékoztatója.",
  },
  nav: { about: "Rólunk", schedule: "Órarend", news: "Hírek", signup: "Jelentkezés" },
  hero: { videoPlaceholder: "Álló videó", primaryCta: "Csatlakozz most", secondaryCta: "Órarendünk" },
  schedule: {
    title: "Órarend",
    lead: "Válaszd ki az órákat — akár többet is",
    swipe: "← Csúsztasd oldalra a többi napért →",
    noneTitle: "Még nem választottál órát",
    selected: (n: number) => `${n} óra kiválasztva`,
    noneHint: "Koppints egy órára az órarendben",
    moreHint: "Többet is választhatsz, vagy távolítsd el a kijelölést",
    toSignup: "Tovább a jelentkezéshez",
  },
  chip: { remove: (label: string) => `${label} eltávolítása` },
  dock: { signup: "Jelentkezem" },
  news: { title: "Hírek", all: "Összes hír →", readMore: "Tovább olvasom →", empty: "Még nincs hír.", allShort: "Összes hír", backToAll: "← Összes hír", cta: "Órarend és jelentkezés" },
  prices: { title: "Áraink" },
  footer: { contact: "Elérhetőségek", email: "E-mail:", phone: "Tel.:", follow: "Kövess Minket", privacy: "Adatkezelési tájékoztató" },
  subpage: { back: "← Vissza a főoldalra", backAria: "Vissza a főoldalra", academy: "Under Cover Dance School" },
  privacy: { title: "Adatkezelési tájékoztató", contents: "Tartalom", onlyHungarian: "" },
  signup: {
    title: "Jelentkezés",
    required: "Ezt a mezőt kötelező kitölteni.",
    invalidEmail: "Adj meg egy érvényes e-mail címet.",
    invalidPhone: "Adj meg egy érvényes telefonszámot.",
    invalidDate: "Adj meg egy érvényes dátumot.",
    futureDate: "A dátum a jövőben van.",
    checkDate: "Ellenőrizd a megadott dátumot.",
    summaryOne: "Egy mező még hiányzik vagy hibás.",
    summaryMany: (n: number) => `${n} mező még hiányzik vagy hibás. A pirossal jelölt helyeket javítsd!`,
    consentPrivacyError: "A jelentkezéshez el kell fogadnod az Adatkezelési tájékoztatót.",
    consentDataError: "A jelentkezéshez hozzá kell járulnod az adataid kezeléséhez.",
    networkError: "Nem sikerült elküldeni a jelentkezést. Kérjük, próbáld újra pár perc múlva.",
    selectedClasses: "Választott óráid",
    classCount: (n: number) => `${n} óra`,
    pickOne: "Válassz legalább egy órát az órarendből!",
    noneYet: "Még nincs kiválasztott órád — legalább egyet válassz az órarendből.",
    backToSchedule: "Vissza az órarendhez",
    name: "Teljes név (Táncos)",
    namePlaceholder: "Kovács Emma",
    email: "E-mail cím (Táncos)",
    emailPlaceholder: "hello@valami.hu",
    phone: "Telefonszám",
    birth: "Mikor születtél? (Táncos)",
    parentNotice: (age: number) => `${age} év alatti vagy — kérjük, add meg a szülőd teljes nevét és e-mail címét!`,
    parentName: "Szülő teljes neve",
    parentNamePlaceholder: "Kovács Ákos",
    parentEmail: "Szülő e-mail címe",
    parentEmailPlaceholder: "szulo@valami.hu",
    experience: "Táncoltál már korábban?",
    choose: "Válassz…",
    comments: "Megjegyzés",
    commentsPlaceholder: "Bármi, amit tudnunk érdemes…",
    consentPrivacyBefore: "Elolvastam és elfogadom az",
    consentPrivacyLink: "Adatkezelési tájékoztatóban",
    consentPrivacyAfter: "foglaltakat.",
    consentData: "Hozzájárulok a fenti adataim Adatkezelő által történő kezeléséhez.",
    honeypot: "Weboldal",
    sending: "Küldés…",
    submit: "Jelentkezem",
    requiredNote: "kötelező mező",
    thanksTitle: "Köszönjük a jelentkezést!",
    thanksText: "Hamarosan keresünk a megadott e-mail címen.",
    restart: "Új jelentkezés indítása",
  },
  /** Sorfeliratok (köszönő oldal és visszaigazoló e-mail). */
  rows: {
    name: "Név",
    email: "E-mail",
    phone: "Telefon",
    birth: "Születési dátum",
    parent: "Szülő",
    experience: "Tánctapasztalat",
    classes: "Órák",
    comments: "Megjegyzés",
  },
  /** A szerver (jelentkezés beküldése) hibaüzenetei. */
  server: {
    invalid: "Valamelyik mező hibás. Ellenőrizd az adatokat, és próbáld újra.",
    birth: "Ellenőrizd a születési dátumot.",
    parent: (age: number) => `${age} év alatt add meg a szülőd nevét és e-mail címét.`,
    option: "Valamelyik választott lehetőség már nem érvényes. Töltsd újra az oldalt.",
    classesChanged: "A kiválasztott órák időközben megváltoztak. Töltsd újra az oldalt, és válassz újra.",
    rateLimit: "Túl sok jelentkezés érkezett innen rövid időn belül. Kérjük, próbáld újra később.",
  },
  /** A jelentkezőnek küldött visszaigazoló e-mail. */
  mail: {
    subject: "Megkaptuk a jelentkezésedet — Under Cover",
    title: "Köszönjük a jelentkezést!",
    intro: (name: string) => `Kedves ${name}! Megkaptuk a jelentkezésedet, hamarosan keresünk a megadott e-mail címen.`,
    outro: "Ha valamit módosítanál, egyszerűen válaszolj erre az e-mailre.",
  },
};

export type Dictionary = typeof hu;

const en: Dictionary = {
  langName: "English",
  switchLabel: "Language",
  meta: {
    title: "Under Cover — K-pop Dance School",
    description: "Discover the world of K-pop at Hungary's most dynamic dance school.",
    ogLocale: "en_GB",
    newsTitle: "News — Under Cover",
    newsDescription: "News from the Under Cover K-pop dance school: new groups, events and the start of the season.",
    newsNotFound: "News not found — Under Cover",
    privacyTitle: "Privacy policy — Under Cover",
    privacyDescription: "Privacy policy of Under Cover Dance School.",
  },
  nav: { about: "About", schedule: "Schedule", news: "News", signup: "Sign up" },
  hero: { videoPlaceholder: "Vertical video", primaryCta: "Join now", secondaryCta: "Our schedule" },
  schedule: {
    title: "Schedule",
    lead: "Pick your classes — as many as you like",
    swipe: "← Swipe for more days →",
    noneTitle: "No class selected yet",
    selected: (n: number) => `${n} ${n === 1 ? "class" : "classes"} selected`,
    noneHint: "Tap a class in the schedule",
    moreHint: "You can pick more, or remove a selection",
    toSignup: "Continue to sign-up",
  },
  chip: { remove: (label: string) => `Remove ${label}` },
  dock: { signup: "Sign me up" },
  news: { title: "News", all: "All news →", readMore: "Read more →", empty: "No news yet.", allShort: "All news", backToAll: "← All news", cta: "Schedule & sign-up" },
  prices: { title: "Prices" },
  footer: { contact: "Contact", email: "Email:", phone: "Phone:", follow: "Follow us", privacy: "Privacy policy" },
  subpage: { back: "← Back to home", backAria: "Back to home", academy: "Under Cover Dance School" },
  privacy: {
    title: "Privacy policy",
    contents: "Contents",
    onlyHungarian: "This privacy policy is available in Hungarian only.",
  },
  signup: {
    title: "Sign up",
    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
    invalidPhone: "Please enter a valid phone number.",
    invalidDate: "Please enter a valid date.",
    futureDate: "The date is in the future.",
    checkDate: "Please check the date.",
    summaryOne: "One field is missing or invalid.",
    summaryMany: (n: number) => `${n} fields are missing or invalid. Please fix the ones marked in red!`,
    consentPrivacyError: "To sign up, you need to accept the Privacy Policy.",
    consentDataError: "To sign up, you need to consent to the processing of your data.",
    networkError: "We couldn't send your sign-up. Please try again in a few minutes.",
    selectedClasses: "Your classes",
    classCount: (n: number) => `${n} ${n === 1 ? "class" : "classes"}`,
    pickOne: "Please select at least one class from the schedule!",
    noneYet: "You haven't selected a class yet — pick at least one from the schedule.",
    backToSchedule: "Back to the schedule",
    name: "Full name (dancer)",
    namePlaceholder: "Emma Smith",
    email: "Email address (dancer)",
    emailPlaceholder: "hello@example.com",
    phone: "Phone number",
    birth: "Date of birth (dancer)",
    parentNotice: (age: number) => `You're under ${age} — please give us your parent's full name and email address!`,
    parentName: "Parent's full name",
    parentNamePlaceholder: "John Smith",
    parentEmail: "Parent's email address",
    parentEmailPlaceholder: "parent@example.com",
    experience: "Have you danced before?",
    choose: "Choose…",
    comments: "Comments",
    commentsPlaceholder: "Anything we should know…",
    consentPrivacyBefore: "I have read and accept the",
    consentPrivacyLink: "Privacy Policy",
    consentPrivacyAfter: "",
    consentData: "I consent to the Data Controller processing the personal data I have provided above.",
    honeypot: "Website",
    sending: "Sending…",
    submit: "Sign me up",
    requiredNote: "required field",
    thanksTitle: "Thank you for signing up!",
    thanksText: "We'll be in touch soon at the email address you gave us.",
    restart: "Start a new sign-up",
  },
  rows: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    birth: "Date of birth",
    parent: "Parent",
    experience: "Dance experience",
    classes: "Classes",
    comments: "Comments",
  },
  server: {
    invalid: "Some fields are invalid. Please check your details and try again.",
    birth: "Please check the date of birth.",
    parent: (age: number) => `Under ${age}, please give us your parent's name and email address.`,
    option: "One of the selected options is no longer available. Please reload the page.",
    classesChanged: "The selected classes have changed in the meantime. Please reload the page and choose again.",
    rateLimit: "Too many sign-ups from here in a short time. Please try again later.",
  },
  mail: {
    subject: "We've received your sign-up — Under Cover",
    title: "Thank you for signing up!",
    intro: (name: string) => `Dear ${name}, we've received your sign-up and will be in touch soon at the email address you gave us.`,
    outro: "If you'd like to change anything, just reply to this email.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { hu, en };

export const t = (locale: Locale): Dictionary => dictionaries[locale];

export const isLocale = (v: unknown): v is Locale => v === "hu" || v === "en";
