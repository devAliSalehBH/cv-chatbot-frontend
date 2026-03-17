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
    <div className="flex flex-col h-full">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Title */}
        <h1 className="font-medium text-[32px] text-[#111827] mb-2 text-center">
          {t("uploadCertificates.title")}
        </h1>
        <p className="font-normal text-[22px] text-[#64748B] mb-10 text-center max-w-[845px]">
          {t("uploadCertificates.subtitle")}
        </p>

        {/* Card */}
        <div className="w-full max-w-[845px] bg-[#FCFCFC] rounded-[40px] border-[1.6px] border-solid border-[#E5E7EB] p-8 md:p-12">
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
          className="flex-1 md:flex-none md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] text-[#101828] border border-[#101828] bg-transparent hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center"
        >
          {t("common.back")}
        </button>

        {/* Center: Empty space after removing skip */}
        <div className="flex-1 md:hidden" />

        <div className="flex-1 md:flex-none flex items-center justify-end">
          <button
            onClick={handleNext}
            disabled={certificates.length === 0}
            className="flex-1 md:flex-none md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] transition-all duration-200 flex flex-col items-center justify-center
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              enabled:bg-[#101828] enabled:text-[#FCFCFC] enabled:hover:bg-[#1E293B]"
          >
            {t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
};
