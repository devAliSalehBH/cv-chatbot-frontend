"use client";

import { useState } from "react";
import { useCreateBotStore } from "@/store/create-bot-store";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { apiPost } from "@/lib/api";
import { useAlertStore } from "@/store/useAlertStore";
import { triggerQueueWork } from "@/lib/queueWork";

export const LinkedInProfile = () => {
  const t = useTranslations("createBot");
  const locale = useLocale();
  const { linkedinUrl, setLinkedinUrl, setStep, resume, certificates } =
    useCreateBotStore();
  const { showAlert } = useAlertStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async (isSkip = false) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Attach CV file if available
      if (resume) {
        formData.append("cv", resume);
      }

      // Attach certificates
      certificates.forEach((cert) => {
        formData.append("add_certificates[]", cert);
      });

      // Attach LinkedIn URL if provided
      if (!isSkip && linkedinUrl) {
        formData.append("linkedin_url", linkedinUrl);
      }

      await apiPost("/users/profile", formData, {
        locale,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await triggerQueueWork(locale);

      // Move to processing screen
      setStep("processing");
    } catch (error: any) {
      console.error("❌ Failed to upload profile data:", error);
      const message =
        error?.response?.data?.message || "Failed to upload files. Please try again.";
      showAlert(message, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep("upload-certificates");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="font-medium text-[32px] text-[#111827] mb-2 text-center">
          {t("linkedinProfile.title")}
        </h1>
        <p className="font-normal text-[22px] text-[#64748B] mb-10 text-center max-w-[845px]">
          {t("linkedinProfile.subtitle")}
        </p>

        {/* Card */}
        <div className="w-full max-w-[654px] bg-[#FCFCFC] rounded-[40px] border-[1.6px] border-solid border-[#E5E7EB] p-8 md:p-12 flex flex-col items-center">
          {/* Large LinkedIn Icon */}
          <div className="bg-[#0A66C2] p-2.5 rounded-lg mb-6">
            <Linkedin className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
          </div>

          <h3 className="font-semibold text-[24px] text-[#333333] mb-6 text-center">
            {t("linkedinProfile.inputLabel")}
          </h3>

          <div className="w-full relative">
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
              disabled={isSubmitting}
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
          disabled={isSubmitting}
          className="flex-1 md:flex-none md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] text-[#101828] border border-[#101828] bg-transparent hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("common.back")}
        </button>

        {/* Center: Empty space after removing skip */}
        <div className="flex-1 md:hidden" />

        <div className="flex-1 md:flex-none flex items-center justify-end">
          <button
            onClick={() => handleNext(false)}
            disabled={isSubmitting}
            className="flex-1 md:flex-none md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] transition-all duration-200 bg-[#101828] text-[#FCFCFC] hover:bg-[#1E293B] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.next")}
              </>
            ) : (
              t("common.next")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
