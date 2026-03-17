"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const PreviewStep = () => {
  const t = useTranslations("createBot.preview");
  const { setIsSharePhase } = useCreateBotStore();

  return (
    <div className="flex flex-col h-full">
      {/* Centered Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-6 border-0">
        
        {/* Header Container */}
        <div className="flex flex-col items-center w-full max-w-4xl text-center mb-8">
          <h2 className="text-[28px] md:text-[32px] font-medium text-[#111827] mb-2 leading-tight">
            {t("title")}
          </h2>
          <p className="text-[18px] md:text-[22px] text-[#64748B] max-w-[700px] mx-auto text-center font-normal leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Preview Image Area */}
        <div className="w-full max-w-[1000px]">
          {/* Desktop Preview */}
          <div className="hidden md:block w-full">
            <Image
              src="/images/preview/web.png"
              alt="Chatbot Preview Web"
              width={1600}
              height={1000}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          {/* Mobile Preview */}
          <div className="block md:hidden w-full max-w-[300px] mx-auto">
            <Image
              src="/images/preview/mobile.png"
              alt="Chatbot Preview Mobile"
              width={600}
              height={1200}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex justify-end items-center px-6 md:px-8 py-5 w-full max-w-7xl mx-auto">
        <button
          onClick={() => setIsSharePhase(true)}
          className="w-full md:w-[220px] h-[60px] rounded-[16px] font-medium text-[16px] transition-all duration-300 bg-[#101828] text-[#FCFCFC] hover:bg-[#1E293B] shadow-lg hover:shadow-xl flex items-center justify-center active:scale-[0.98]"
        >
          {t("goToShare")}
        </button>
      </div>
    </div>
  );
};
