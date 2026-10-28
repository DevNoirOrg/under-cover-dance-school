import type { Metadata } from "next";
import NewsListPage from "@/components/pages/NewsListPage";
import { paths, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: t("en").meta.newsTitle,
  description: t("en").meta.newsDescription,
  alternates: alternates("en", paths.hu.news, paths.en.news),
};

export default function NewsPage() {
  return <NewsListPage locale="en" />;
}
