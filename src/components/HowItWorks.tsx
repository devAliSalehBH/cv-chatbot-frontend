"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      number: 1,
      key: "step1",
      image: "/images/howToStart/01.svg",
      imageOnLeft: false,
    },
    {
      number: 2,
      key: "step2",
      image: "/images/howToStart/02.svg",
      imageOnLeft: true,
    },
    {
      number: 3,
      key: "step3",
      image: "/images/howToStart/03.svg",
      imageOnLeft: false,
    },
    {
      number: 4,
      key: "step4",
      image: "/images/howToStart/04.svg",
      imageOnLeft: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24">
          <p className="text-[#3B82F6] font-semibold mb-3 text-lg">
            {t("title")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
            {t("subtitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20 lg:space-y-32">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                step.imageOnLeft ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6 text-center lg:text-start">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0F172A] text-white font-bold text-xl mb-2">
                  {step.number}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                  {t(`${step.key}.title`)}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t(`${step.key}.description`)}
                </p>
                <ul className="space-y-3 inline-block text-center lg:text-start">
                  {(t.raw(`${step.key}.features`) as string[]).map(
                    (feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ),
                  )}
                </ul>

                {/* Step 4 Extra Content (Link/Copy) */}
                {step.number === 4 && (
                  <div
                    className={`mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 inline-block w-full max-w-md ${step.imageOnLeft ? "mr-auto" : "ml-auto"}`}
                  >
                    <p
                      className={`text-sm font-semibold text-gray-900 mb-2 ${step.imageOnLeft ? "text-right" : "text-left"}`}
                    >
                      {t(`${step.key}.readyText`)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white text-gray-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </Button>
                      <div className="flex-1 bg-white px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 text-left overflow-hidden text-ellipsis whitespace-nowrap dir-ltr">
                        {t(`${step.key}.shareText`)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Side */}
              <div className="flex-1 w-full max-w-xl">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={step.image}
                    alt={t(`${step.key}.title`)}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
