"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { FileUpload } from "@/components/create-bot/FileUpload";
import { ExistingFileCard } from "@/components/create-bot/ExistingFileCard";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const RESUME_ACCEPT = ".pdf,.doc,.docx";

export const UploadResume = () => {
  const t = useTranslations("createBot.uploadResume");
  const { setResume, setStep, resume, existingCv } = useCreateBotStore();
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // A CV uploaded earlier (e.g. from settings) can be kept or replaced
  const showExisting = !resume && !!existingCv;

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setResume(files[0]);
    }
  };

  const handleNext = () => {
    if (resume || existingCv) {
      setStep("upload-certificates");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Title */}
        <h1 className="font-medium text-[32px] text-[#111827] mb-2 text-center">
          {t("title")}
        </h1>
        <p className="font-normal text-[22px] text-[#64748B] mb-10 text-center max-w-[845px]">
          {t("subtitle")}
        </p>

        {/* Card */}
        <div className="w-full max-w-[845px] bg-[#FCFCFC] rounded-[40px] border-[1.6px] border-solid border-[#E5E7EB] p-8 md:p-12">
          {showExisting && existingCv ? (
            <>
              <ExistingFileCard
                media={existingCv}
                onReplace={() => replaceInputRef.current?.click()}
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept={RESUME_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) setResume(file);
                }}
              />
            </>
          ) : (
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
          )}
        </div>
      </div>

      {/* Bottom bar with Next button */}
      <div className="flex justify-end items-center px-6 md:px-8 py-5 w-full max-w-7xl mx-auto">
        <button
          onClick={handleNext}
          disabled={!resume && !existingCv}
          className="w-full md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] transition-all duration-200 flex flex-col items-center justify-center
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
            enabled:bg-[#101828] enabled:text-[#FCFCFC] enabled:hover:bg-[#1E293B]"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};
