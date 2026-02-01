"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  const t = useTranslations("cta");

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-h2 font-bold text-text-dark mb-4">
            {t("title")}
          </h2>
          <p className="text-body text-text-light max-w-2xl mx-auto">
            {t("description")}
          </p>
          <Button
            size="lg"
            className="bg-[#0F172A] hover:bg-slate-800 text-white shadow-lg mt-4 px-8 py-3 text-lg font-medium"
          >
            {t("button")}
          </Button>
        </div>
      </div>
    </section>
  );
}
