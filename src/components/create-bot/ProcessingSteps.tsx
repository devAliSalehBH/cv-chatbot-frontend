import React from "react";
import { FileSearch, Cpu, MessageSquare, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export type StepStatus = "finished" | "current" | "upcoming";

interface ProcessingStepsProps {
  currentStep: number; // 1, 2, or 3
}

export const ProcessingSteps = ({ currentStep }: ProcessingStepsProps) => {
  const t = useTranslations("createBot.processing.steps");

  const steps = [
    {
      id: 1,
      title: t("analyzing.title"),
      description: t("analyzing.description"),
      icon: FileSearch,
    },
    {
      id: 2,
      title: t("generating.title"),
      description: t("generating.description"),
      icon: Cpu,
    },
    {
      id: 3,
      title: t("building.title"),
      description: t("building.description"),
      icon: MessageSquare,
    },
  ];

  return (
    <div className="w-full max-w-[654px] bg-[#FCFCFC] rounded-[40px] border border-[#E5E7EB] p-8 md:p-12 shadow-sm">
      <div className="space-y-8">
        {steps.map((step) => {
          let status: StepStatus = "upcoming";
          if (step.id < currentStep) status = "finished";
          else if (step.id === currentStep) status = "current";

          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-start gap-6 relative">
              {/* Icon Container */}
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    status === "upcoming" ? "bg-[#E5E8ED]" : "bg-[#ECF4FF]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-colors duration-300 ${
                      status === "upcoming" ? "text-[#64748B]" : "text-[#2C85FE]"
                    }`}
                  />
                </div>
                {/* Finished Checkmark Badge */}
                {status === "finished" && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full">
                    <CheckCircle2 size={20} className="text-[#12B76A]" fill="white" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col pt-2 text-start">
                <h3
                  className={`text-[18px] font-normal transition-colors duration-300 ${
                    status === "finished"
                      ? "text-[#12B76A]"
                      : status === "current"
                      ? "text-[#2E87FE]"
                      : "text-[#818282]"
                  }`}
                >
                  {step.title}
                  {status === "current" && (
                    <span className="inline-flex ml-1 animate-pulse">...</span>
                  )}
                </h3>
                <p
                  className={`text-[14px] transition-colors duration-300 ${
                    status === "finished" ? "text-[#64748B]" : "text-[#C4C4C4]"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[14px] text-[#111827] font-medium">{t("overallProgress")}</span>
          <span className="text-[14px] text-[#2E87FE] font-medium">
            {currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%"}
          </span>
        </div>
        <div className="w-full h-2 bg-[#E5E8ED] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2E87FE] transition-all duration-700"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

