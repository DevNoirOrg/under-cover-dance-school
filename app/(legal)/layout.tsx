import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
};

/*
  Külön gyökér-layout, mert az aloldalak (tájékoztató, hírek) <body>-ja a
  designban fehér hátterű (a főoldalé bg-ink). Angol párja: app/(legal-en).
*/
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`scroll-smooth ${fontVariables}`}>
      <body className="font-sans text-ink bg-white">{children}</body>
    </html>
  );
}
