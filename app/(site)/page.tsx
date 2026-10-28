import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { paths } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = { alternates: alternates("hu", paths.hu.home, paths.en.home) };

export default function Page() {
  return <HomePage locale="hu" />;
}
