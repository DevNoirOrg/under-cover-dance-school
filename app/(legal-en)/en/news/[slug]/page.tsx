import type { Metadata } from "next";
import NewsArticlePage, { newsMetadata, newsStaticParams } from "@/components/pages/NewsArticlePage";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => newsStaticParams("en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return newsMetadata((await params).slug, "en");
}

export default async function NewsArticle({ params }: Props) {
  return <NewsArticlePage slug={(await params).slug} locale="en" />;
}
