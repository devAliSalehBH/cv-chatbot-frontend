"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Pricing() {
  const t = useTranslations("pricing");

  const plans = [
    {
      key: "monthly",
      image: "/images/prices/01.svg",
    },
    {
      key: "annually",
      image: "/images/prices/02.svg",
    },
  ];

  return (
    <section id="pricing" className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary-DEFAULT font-semibold mb-2">
            {t("title")}
          </p>
          <h2 className="text-h2 font-bold text-text-dark mb-4">
            {t("subtitle")}
          </h2>
          <p className="text-body text-text-light max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className="relative transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={plan.image}
                  alt={t(`${plan.key}.title`)}
                  fill
                  className="object-contain"
                />
              </div>
              {/* Invisible button overlay for accessibility/interaction if needed, or just keep it visual */}
              <button className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[10%] opacity-0 cursor-pointer">
                {t(`${plan.key}.cta`)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
