import type { Metadata } from "next";
import PrivacyPage from "@/components/pages/PrivacyPage";
import { paths, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: t("en").meta.privacyTitle,
  description: t("en").meta.privacyDescription,
  alternates: alternates("en", paths.hu.privacy, paths.en.privacy),
};

export default function Privacy() {
  return <PrivacyPage locale="en" />;
}
