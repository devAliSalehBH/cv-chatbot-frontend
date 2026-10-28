"use client";

import { useTranslations } from "next-intl";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { usePublicSettings } from "@/hooks/usePublicSettings";

export default function LegalPage({ type }: { type: "terms" | "privacy" }) {
  const t = useTranslations("legalPage");
  const { settings, loading } = usePublicSettings();
  const content = settings?.[type]?.content?.trim();

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] max-w-4xl">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">{t(`${type}.title`)}</h1>
        {loading ? (
          <p className="text-gray-500">{t("loading")}</p>
        ) : content ? (
          <div
            className="text-[#334155] leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ps-6 [&_ol]:ps-6 [&_ul]:mb-4 [&_ol]:mb-4 [&_a]:text-[#2E87FE] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-500">{t("empty")}</p>
        )}
      </main>
      <DashboardFooter />
    </>
  );
}
