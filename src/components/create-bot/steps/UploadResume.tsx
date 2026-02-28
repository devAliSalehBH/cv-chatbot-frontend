"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { FileUpload } from "@/components/create-bot/FileUpload";
import { useTranslations } from "next-intl";

export const UploadResume = () => {
  const t = useTranslations("createBot.uploadResume");
  const { setResume, setStep, resume } = useCreateBotStore();

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setResume(files[0]);
    }
  };

  const handleNext = () => {
    if (resume) {
      setStep("upload-certificates");
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center max-w-lg">
          {t("subtitle")}
        </p>

        {/* Card */}
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-6">
          <FileUpload
            onDrop={handleDrop}
            files={resume ? [resume] : []}
            onRemove={() => setResume(null)}
            dropzoneLabel={
              <>
                <span className="hidden md:inline">{t("title")}</span>
                <span className="md:hidden">{t("mobileTitle")}</span>
              </>
            }
          />
        </div>
      </div>

      {/* Bottom bar with Next button */}
      <div className="flex justify-end items-center px-6 md:px-8 py-5 w-full max-w-7xl mx-auto">
        <button
          onClick={handleNext}
          disabled={!resume}
          className="w-full md:w-auto px-7 py-3 md:py-2.5 rounded-xl text-[15px] md:text-sm font-semibold transition-all duration-200
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
            enabled:bg-[#0F172A] enabled:text-white enabled:hover:bg-[#1E293B] enabled:shadow-sm"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};
