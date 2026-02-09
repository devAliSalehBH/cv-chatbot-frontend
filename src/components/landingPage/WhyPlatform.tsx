"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function WhyPlatform() {
  const t = useTranslations("whyPlatform");
  const features = t.raw("features") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section id="features" className="py-section bg-background-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-[54px] text-[#111827] mb-4">
            {t("title")}
          </h2>
          <p className="text-[#64748B] mx-auto text-[12px] md:text-[22px]">
            {t("description")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="border-[#E5E7EB] rounded-4xl hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="mb-6">
                  <Image
                    src={`/icons/whyPlatform/0${idx + 1}.svg`}
                    alt={feature.title}
                    width={56}
                    height={56}
                    className="w-14 h-14"
                  />
                </div>
                <h3 className="text-[18px] font-bold text-[#333333] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] text-[16px] whitespace-pre-wrap">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
