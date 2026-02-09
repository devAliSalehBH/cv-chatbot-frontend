"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CallToAction() {
  const t = useTranslations("cta");
  const locale = useLocale();
  return (
    <section
      className="mt-20 lg:mt-32 pb-32 mb-4 "
      style={{
        backgroundImage:
          " linear-gradient(180deg, rgba(252, 252, 252, 0.6) -0.06%, rgba(241, 247, 255, 0.520752) 15.98%, rgba(218, 234, 255, 0.192) 83%, rgba(249, 251, 255, 0.6) 99.94%);",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-[28px] md:text-4xl lg:text-[48px] font-extrabold leading-tight bg-linear-to-r from-[#0F1420] to-[#1272EF] bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className=" text-[#64748B]  text-[16px] md:text-xl lg:text-[22px]">
            {t("description")}
          </p>
          <div className="flex justify-center ">
            <Link href={`/${locale}/auth/signup`}>
              <Button
                size="lg"
                className="bg-black hover:bg-black/80 text-white shadow-button h-11 w-full md:w-71.25 md:h-15 rounded-[10px]  md:rounded-2xl text-[16px] font-semibold"
              >
                {t("button")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
