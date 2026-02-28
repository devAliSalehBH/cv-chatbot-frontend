"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export const LinkedInProfile = () => {
  const t = useTranslations("createBot");
  const { linkedinUrl, setLinkedinUrl, setStep } = useCreateBotStore();

  const handleNext = () => {
    // Validation logic can go here
    console.log("Finished Phase 1 with:", { linkedinUrl });
    setStep("answer-questions");
  };

  const handleBack = () => {
    setStep("upload-certificates");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {t("linkedinProfile.title")}
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center max-w-lg">
          {t("linkedinProfile.subtitle")}
        </p>

        {/* Card */}
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-8 md:p-12 flex flex-col items-center">
          {/* Large LinkedIn Icon */}
          <div className="bg-[#0A66C2] p-2.5 rounded-lg mb-6">
            <Linkedin className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
            {t("linkedinProfile.inputLabel")}
          </h3>

          <div className="w-full relative max-w-md">
            {/* Input Inner Icon */}
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <div className="bg-[#0A66C2] rounded px-1 py-0.5 flex items-center justify-center">
                <span className="text-[12px] font-bold text-white tracking-tighter leading-none">in</span>
              </div>
            </div>
            {/* Input Field */}
            <Input
              type="url"
              placeholder={t("linkedinProfile.inputPlaceholder")}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="pl-[44px] h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-sm placeholder:text-gray-400 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar with Back, Skip, Next buttons */}
      <div className="flex justify-between items-center px-6 md:px-8 py-5 w-full max-w-7xl mx-auto gap-4">
        {/* Left: Back */}
        <button
          onClick={handleBack}
          className="w-24 md:w-auto px-4 md:px-7 py-3 md:py-2.5 rounded-xl text-[15px] md:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm bg-white"
        >
          {t("common.back")}
        </button>

        {/* Middle: Skip (Mobile Only - visually centered in available space) */}
        <div className="flex-1 flex justify-center md:hidden">
          <button
            onClick={handleNext}
            className="text-[15px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("common.skip")}
          </button>
        </div>

        <div className="flex-1 md:flex-none flex items-center justify-end md:gap-6">
          <button
            onClick={handleNext}
            className="hidden md:block text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("common.skip")}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 md:flex-none md:w-auto px-4 md:px-7 py-3 md:py-2.5 rounded-xl text-[15px] md:text-sm font-semibold transition-all duration-200 bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm"
          >
            {t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
};
