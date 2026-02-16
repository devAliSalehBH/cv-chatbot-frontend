"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { UploadResume } from "@/components/create-bot/steps/UploadResume";
import { UploadCertificates } from "@/components/create-bot/steps/UploadCertificates";
import { LinkedInProfile } from "@/components/create-bot/steps/LinkedInProfile";

export default function CreateBotPage() {
  const { currentStep } = useCreateBotStore();

  const renderStep = () => {
    switch (currentStep) {
      case "upload-resume":
        return <UploadResume />;
      case "upload-certificates":
        return <UploadCertificates />;
      case "linkedin-profile":
        return <LinkedInProfile />;
      default:
        return <UploadResume />;
    }
  };

  return <div className="w-full max-w-5xl mx-auto">{renderStep()}</div>;
}
