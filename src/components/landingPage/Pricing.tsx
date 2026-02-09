"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const plans = [
    {
      key: "monthly",
      image: `/images/prices/01-${locale}.svg`,
    },
    {
      key: "annually",
      image: `/images/prices/02-${locale}.svg`,
    },
  ];

  return (
    <section id="pricing" className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[#2E87FE] mb-3 text-lg md:text-[32px]">
            {t("title")}
          </p>
          <h2 className="text-3xl md:text-[54px] text-[#111827] mb-4">
            {t("subtitle")}
          </h2>
          <p className="text-[#64748B] mx-auto text-[12px] md:text-[22px]">
            {t("description")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div
              key={plan.key}
              className={`transition-transform duration-300 hover:-translate-y-1 relative  cursor-pointer ${index == 0 ? "mb-5" : ""}`}
            >
              <Image
                src={plan.image}
                alt={t(`${plan.key}.title`)}
                width={448}
                height={10}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
