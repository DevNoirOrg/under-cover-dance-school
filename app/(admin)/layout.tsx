import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Under Cover", template: "%s — Under Cover admin" },
  robots: { index: false, follow: false, nocache: true },
};

/* Az admin felület saját gyökér-layoutja (a publikus oldaltól független). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={fontVariables}>
      <body className="bg-mist text-ink font-sans antialiased selection:bg-uc selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
