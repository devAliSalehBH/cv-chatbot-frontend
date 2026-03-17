import React from "react";
import { useTranslations } from "next-intl";
import { ProcessingSteps } from "../ProcessingSteps";

export const BuildingConversationFlowScreen = () => {
  const t = useTranslations("createBot.processing");

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <div className="flex flex-col items-center w-full max-w-4xl text-center mb-10">
        <h2 className="text-[32px] font-medium text-[#111827] mb-2 leading-tight">
          {t("steps.title")}
        </h2>
        <p className="text-[22px] text-[#64748B] max-w-[845px] mx-auto text-center font-normal">
          {t("steps.subtitle")}
        </p>
      </div>

      <ProcessingSteps currentStep={3} />
    </div>
  );
};
