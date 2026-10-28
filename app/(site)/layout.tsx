import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { baseMetadata } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = { metadataBase: siteUrl, ...baseMetadata("hu") };

/* A magyar főoldal gyökér-layoutja (az angol: app/(site-en)). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`scroll-smooth ${fontVariables}`}>
      <body className="bg-ink text-ink font-sans selection:bg-uc selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
