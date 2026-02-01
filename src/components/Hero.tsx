"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="py-section mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start relative">
          {/* Right Content */}
          <div className="text-center lg:text-right space-y-6 relative z-10">
            <div className="space-y-2">
              {/* First Line */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-[#0F1420] to-[#3B82F6] bg-clip-text text-transparent">
                {t("titleLine1")}
              </h1>
              {/* Second Line with a leading space */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-[#0F1420] to-[#3B82F6] bg-clip-text text-transparent">
                {t("titleLine2")}
              </h1>
            </div>
            <p className="text-body text-text-light max-w-xl mx-auto lg:mx-0">
              {t("description")}
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-black hover:bg-black/80 text-white shadow-button px-8 py-4 text-lg font-semibold"
              >
                {t("cta")}
              </Button>
            </div>
          </div>

          {/* Left Chatbot Preview with overlap under the first line */}
          <div className="flex justify-center lg:justify-start relative">
            <div className="w-full max-w-md bg-background-white rounded-card shadow-card-lg p-6 space-y-4 lg:-mt-20 lg:relative lg:z-0">
              <Image
                src="/images/BuilderPage.svg"
                alt="Hero Chatbot"
                width={500}
                height={500}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
