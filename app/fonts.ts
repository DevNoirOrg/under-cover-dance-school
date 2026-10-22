import localFont from "next/font/local";

/*
  A design Google Fonts-ból tölti ugyanezeket a családokat; itt ugyanazok a
  fájlok saját domainről jönnek (app/fonts/*.woff2, latin + latin-ext).
  Csak azok a vastagságok vannak betöltve, amiket a design is betölt — így
  a böngésző ugyanazt a vastagságot választja ott is, ahol egy osztály
  (pl. font-bold a JetBrains Mono-n) nem létező vastagságot kér.

  Az Unbounded (font-display) a designban be van töltve, de sehol nincs
  használva, ezért itt nem töltjük be.
*/

export const hanken = localFont({
  src: [
    { path: "./fonts/hanken-grotesk-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/hanken-grotesk-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/hanken-grotesk-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/hanken-grotesk-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/hanken-grotesk-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-hanken",
  display: "swap",
});

export const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/montserrat-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/montserrat-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/montserrat-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/montserrat-800.woff2", weight: "800", style: "normal" },
    { path: "./fonts/montserrat-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

export const jetbrains = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jetbrains-mono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = [hanken.variable, montserrat.variable, jetbrains.variable].join(" ");
