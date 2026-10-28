import type { Metadata } from "next";
import { t, type Locale } from "./i18n";

/**
 * Kanonikus cím + a másik nyelvű pár (hreflang) a keresőknek.
 * `en` null, ha az oldalnak nincs angol változata (pl. le nem fordított hír).
 */
export function alternates(locale: Locale, hu: string, en: string | null): Metadata["alternates"] {
  return {
    canonical: locale === "en" && en ? en : hu,
    languages: en ? { hu, en, "x-default": hu } : { hu, "x-default": hu },
  };
}

/** A nyelvhez tartozó alap metaadatok (cím, leírás, Open Graph). */
export function baseMetadata(locale: Locale): Metadata {
  const d = t(locale).meta;
  return {
    title: d.title,
    description: d.description,
    openGraph: {
      title: d.title,
      description: d.description,
      locale: d.ogLocale,
      alternateLocale: locale === "en" ? ["hu_HU"] : ["en_GB"],
      type: "website",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Under Cover" }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/opengraph-image.png"],
    },
  };
}
