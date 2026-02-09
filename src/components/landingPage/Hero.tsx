"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  return (
    <section className=" my-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start relative ">
        {/* Right Content */}
        <div className="text-center  lg:text-start space-y-6 relative z-10 max-w-204.75">
          <div className="space-y-2">
            {/* First Line */}
            <h1 className="text-2xl md:text-4xl xl:text-[60px] font-extrabold leading-tight bg-linear-to-r from-[#0F1420] to-[#1272EF] bg-clip-text text-transparent">
              {t("titleLine1")}
            </h1>
          </div>
          <p className="text-[#64748B] text-[15px] md:text-2xl xl:text-[32px] whitespace-pre-wrap ">
            {t("description")}
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link href={`/${locale}/auth/signup`}>
              <Button
                size="lg"
                className="bg-black hover:bg-black/80 text-white shadow-button h-11 w-full md:w-71.25 md:h-15 rounded-[10px]  md:rounded-2xl text-[16px] font-semibold"
              >
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Left Chatbot Preview with overlap under the first line */}
        <div className="flex justify-center lg:justify-start relative mt-14">
          <div className="">
            <Image
              src={`/images/landingPage/hero/${locale == "ar" ? "builderPage-ar" : "builderPage"}.svg`}
              alt="Hero Chatbot"
              width={720}
              height={500}
              className=" object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
