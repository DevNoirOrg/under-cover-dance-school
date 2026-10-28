import type { Metadata } from "next";
import PrivacyPage from "@/components/pages/PrivacyPage";
import { paths, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: t("hu").meta.privacyTitle,
  description: t("hu").meta.privacyDescription,
  alternates: alternates("hu", paths.hu.privacy, paths.en.privacy),
};

export default function AdatkezelesPage() {
  return <PrivacyPage locale="hu" />;
}
