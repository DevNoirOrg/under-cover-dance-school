import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
};

/* Az angol aloldalak (/en/news, /en/privacy) gyökér-layoutja. */
export default function LegalEnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${fontVariables}`}>
      <body className="font-sans text-ink bg-white">{children}</body>
    </html>
  );
}
