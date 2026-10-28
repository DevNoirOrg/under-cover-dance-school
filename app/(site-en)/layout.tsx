import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { baseMetadata } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = { metadataBase: siteUrl, ...baseMetadata("en") };

/* Az angol főoldal (/en) gyökér-layoutja — külön, mert a <html lang> angol. */
export default function SiteEnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${fontVariables}`}>
      <body className="bg-ink text-ink font-sans selection:bg-uc selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
