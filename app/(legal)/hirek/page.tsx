import type { Metadata } from "next";
import NewsListPage from "@/components/pages/NewsListPage";
import { paths, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: t("hu").meta.newsTitle,
  description: t("hu").meta.newsDescription,
  alternates: alternates("hu", paths.hu.news, paths.en.news),
};

export default function HirekPage() {
  return <NewsListPage locale="hu" />;
}
