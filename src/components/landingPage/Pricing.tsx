"use client";

import { useLocale, useTranslations } from "next-intl";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="#2E87FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const plans = ["monthly", "annually"];

  return (
    <section id="pricing" className="py-12 lg:py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-[#2E87FE] mb-3 text-lg md:text-[24px] font-medium">
            {t("title")}
          </p>
          <h2 className="text-3xl md:text-[44px] tracking-tight font-bold text-[#111827] mb-4">
            {t("subtitle")}
          </h2>
          <p className="text-[#64748B] mx-auto text-[16px] md:text-[20px] max-w-2xl">
            {t("description")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const isMostPopular = plan === "monthly";
            // Get features directly from the mapped translations
            const features = [0, 1, 2, 3, 4, 5].map((i) =>
              t(`${plan}.features.${i}`)
            );

            return (
              <div
                key={plan}
                className="relative bg-white rounded-[36px] border border-gray-100 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col h-full overflow-visible"
              >
                {/* Ribbon for Most Popular */}
                {isMostPopular && (
                  <div className={`absolute -top-3 z-10 w-[84px] ${locale === 'ar' ? 'left-8 md:left-12' : 'right-8 md:right-12'}`}>
                    {/* The 3D fold triangle */}
                    <div 
                      className={`absolute top-0 w-2 h-3 bg-[#1e5eb3] ${locale === 'ar' ? '-right-2' : '-left-2'}`} 
                      style={{ clipPath: locale === 'ar' ? 'polygon(0 0, 100% 100%, 0 100%)' : 'polygon(100% 0, 0 100%, 100% 100%)' }} 
                    />
                    {/* The main ribbon */}
                    <div 
                      className="bg-[#2E87FE] text-white text-center pt-5 pb-7 px-2 flex items-start justify-center ribbon-shape relative z-10 min-h-[110px]"
                    >
                      <div className="font-medium text-[15px] leading-tight whitespace-pre-line drop-shadow-sm">
                        {t(`${plan}.badge`).replace(' ', '\n')}
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-[22px] font-semibold text-[#111827] mb-6">
                  {t(`${plan}.title`)}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl md:text-[54px] font-bold text-[#111827] tracking-tight">
                    {t(`${plan}.price`)}
                  </span>
                  <span className="text-[#64748B] text-lg font-medium">
                    {t(`${plan}.period`)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-10">
                  <span className="text-[#94A3B8] font-medium text-[15px] line-through">
                    {t(`${plan}.yearlyOriginalPrice`)}
                  </span>
                  <span className="text-[#2E87FE] font-medium text-[15px]">
                    {t(`${plan}.yearlyPrice`)}
                  </span>
                </div>

                <ul className="flex-1 space-y-4 mb-10">
                  {features.map((feature, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="mt-[2px] shrink-0">
                        <CheckIcon />
                      </div>
                      <span className="text-[#475569] text-[15px] leading-relaxed font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-[#111827] hover:bg-[#1f2937] text-white font-medium py-4 px-6 rounded-2xl transition-colors shadow-sm text-lg">
                  {t(`${plan}.cta`)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .ribbon-shape {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
        }
      `}} />
    </section>
  );
}
