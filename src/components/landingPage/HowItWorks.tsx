"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();

  const steps = [
    {
      number: 1,
      key: "step1",
      image: `/images/landingPage/howToStart/01-${locale}.svg`,
    },
    {
      number: 2,
      key: "step2",
      image: `/images/landingPage/howToStart/02-${locale}.svg`,
    },
    {
      number: 3,
      key: "step3",
      image: `/images/landingPage/howToStart/03-${locale}.svg`,
    },
    {
      number: 4,
      key: "step4",
      image: `/images/landingPage/howToStart/04-${locale}.svg`,
    },
  ];

  // ---------------------------
  // Hooks at the top level
  // ---------------------------
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSteps, setActiveSteps] = useState(() => steps.map(() => false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    lineRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSteps((prev) => {
              const newActive = [...prev];
              newActive[index] = true;
              return newActive;
            });
          }
        },
        { threshold: 1 },
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
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

        {/* Steps */}
        <div className="mx-auto space-y-10 md:space-y-24">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="relative grid grid-cols-1 md:grid-cols-2 md:gap-12 items-start"
            >
              {/* Image (Desktop) */}
              <div
                className={`hidden md:block ${
                  index % 2 === 0 ? "md:order-1" : "md:order-2"
                }`}
              >
                <div className="relative aspect-4/3 w-full max-w-172">
                  <Image
                    src={step.image}
                    alt={t(`${step.key}.title`)}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Mobile Icon */}
              <div className="flex justify-center md:hidden">
                <Image
                  src={`/images/landingPage/howToStart/mobile/0${
                    index + 1
                  }.svg`}
                  alt={t(`${step.key}.title`)}
                  width={48}
                  height={48}
                />
              </div>

              {/* Vertical Animated Line */}
              <div
                ref={(el) => (lineRefs.current[index] = el)}
                className={`hidden md:block absolute ${
                  locale === "ar" ? "left-[51%]" : "right-[51%]"
                } top-0 w-1 -translate-x-1/2 h-full  `}
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, #8B8B8B 20%, #8B8B8B 80%, transparent)",
                }}
              >
                <div
                  style={{
                    height: activeSteps[index] ? "100%" : "0%",
                    background:
                      "linear-gradient(to bottom, transparent, #2E87FE 30%)",
                  }}
                  className="w-1 bg-[#2E87FE] transition-[height] duration-700 ease-out"
                />
              </div>

              {/* Text */}
              <div
                className={`${
                  index % 2 === 0 ? "md:order-2" : "md:order-1"
                } space-y-4 md:mt-8`}
              >
                <div className="hidden md:flex items-center justify-start gap-3">
                  <div
                    className={`w-18 h-18 rounded-full flex items-center justify-center text-[32px] text-white transition-colors duration-500  bg-black`}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="text-center md:text-start text-lg md:text-[32px] text-[#333333]">
                  {t(`${step.key}.title`)}
                </h3>

                <p className="text-[#64748B] text-sm md:text-lg text-center md:text-start">
                  {t(`${step.key}.description`)}
                </p>

                <ul className="space-y-2 hidden md:block">
                  {(t.raw(`${step.key}.features`) as string[]).map(
                    (point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-[#3B82F6] shrink-0 mt-0.5"
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
                        <p>{point}</p>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
