import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Under Cover — K-pop Dance Academy",
  description: "Fedezd fel a K-Pop világát Magyarország legdinamikusabb táncakadémiáján.",
  openGraph: {
    title: "Under Cover — K-pop Dance Academy",
    description: "Fedezd fel a K-Pop világát Magyarország legdinamikusabb táncakadémiáján.",
    locale: "hu_HU",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Under Cover" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`scroll-smooth ${fontVariables}`}>
      <body className="bg-ink text-ink font-sans selection:bg-uc selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
