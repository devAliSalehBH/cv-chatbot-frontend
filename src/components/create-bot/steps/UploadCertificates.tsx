"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { FileUpload } from "@/components/create-bot/FileUpload";
import { useTranslations } from "next-intl";

export const UploadCertificates = () => {
  const t = useTranslations("createBot");
  const { certificates, addCertificates, removeCertificate, setStep } =
    useCreateBotStore();

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      addCertificates(files);
    }
  };

  const handleNext = () => {
    setStep("linkedin-profile");
  };

  const handleBack = () => {
    setStep("upload-resume");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {t("uploadCertificates.title")}
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center max-w-lg">
          {t("uploadCertificates.subtitle")}
        </p>

        {/* Card */}
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-6">
          <FileUpload
            onDrop={handleDrop}
            files={certificates}
            onRemove={(index) => removeCertificate(index)}
            multiple={true}
            dropzoneLabel={t("uploadCertificates.title")}
            compactLabel={t("fileUpload.uploadAnother")}
          />
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
            disabled={certificates.length === 0}
            className="flex-1 md:flex-none md:w-auto px-4 md:px-7 py-3 md:py-2.5 rounded-xl text-[15px] md:text-sm font-semibold transition-all duration-200
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              enabled:bg-[#0F172A] enabled:text-white enabled:hover:bg-[#1E293B] enabled:shadow-sm"
          >
            {t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
};
