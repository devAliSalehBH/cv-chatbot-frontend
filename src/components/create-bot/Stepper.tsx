"use client";

import { cn } from "@/lib/utils";

import { useCreateBotStore } from "@/store/create-bot-store";
import { useTranslations } from "next-intl";


interface StepperProps {
  currentStepId: number;
  currentStepString: string;
}

export const Stepper = ({ currentStepId, currentStepString }: StepperProps) => {
  const t = useTranslations("createBot.stepper");
  const { currentQuestionIndex, questions } = useCreateBotStore();

  const steps = [
    { id: 1, label: t("uploadInfo"), widthClass: "w-[100px]" },
    { id: 2, label: t("staticQuestions"), widthClass: "w-[150px]" },
    { id: 3, label: t("aiQuestions"), widthClass: "w-[150px]" },
    { id: 4, label: t("cvAiBotCreating"), widthClass: "w-[180px]" },
    { id: 5, label: t("preview"), widthClass: "w-[100px]" },
    { id: 6, label: t("shareCvBot"), widthClass: "w-[100px]" },
  ];

  let subStep = 1;
  let totalSubSteps = 1;
  let mobileLabel = "";

  if (currentStepId === 1) {
    totalSubSteps = 3;
    mobileLabel = t("uploadInfo");
    if (currentStepString === "upload-certificates") subStep = 2;
    if (currentStepString === "linkedin-profile") subStep = 3;
  } else if (currentStepId === 2) {
    totalSubSteps = questions.length || 1;
    mobileLabel = t("staticQuestions");
    subStep = currentQuestionIndex + 1;
  } else if (currentStepId === 3) {
    totalSubSteps = questions.length || 1;
    mobileLabel = t("aiQuestions");
    subStep = currentQuestionIndex + 1;
  }

  // Local progress for the current phase
  const mobileProgressPercentage = (subStep / totalSubSteps) * 100;

  return (
    <div className="w-full">
      {/* ========================================= */}
      {/* DESKTOP Stepper (Hidden on mobile < md) */}
      {/* ========================================= */}
      <div className="hidden md:flex items-center justify-center gap-3 w-full">
        {steps.map((step) => {
          const isCompleted = step.id < currentStepId;
          const isActive = step.id === currentStepId;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Label */}
              <span
                className={cn(
                  "font-normal text-[16px] mb-1 whitespace-nowrap px-1 text-[#6F6F6F]"
                )}
              >
                {step.label}
              </span>

              {/* Small Dot */}
              <div
                className={cn(
                  "w-1 h-1 rounded-full mb-1.5",
                  isActive || isCompleted ? "bg-gray-400" : "bg-gray-200"
                )}
              />

              {/* Progress Bar Segment - Custom width per step */}
              <div
                className={cn(
                  "h-1.5 rounded-full bg-gray-100/80 overflow-hidden relative",
                  step.widthClass
                )}
              >
                <div
                  className={cn(
                    "absolute top-0 start-0 h-full bg-blue-600 transition-all duration-500 ease-in-out rounded-full",
                    isCompleted ? "w-full" : "w-0"
                  )}
                  style={
                    isActive
                      ? {
                          width: `${(subStep / totalSubSteps) * 100}%`,
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================= */}
      {/* MOBILE Stepper (Visible on mobile < md) */}
      {/* ========================================= */}
      <div className="flex md:hidden flex-col items-center w-full">
        {/* Continuous single progress bar */}
        <div className="w-full max-w-[280px] h-2.5 rounded-full bg-gray-100/80 overflow-hidden relative mb-3 mx-auto">
          <div
            className="absolute top-0 start-0 h-full bg-blue-600 transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${mobileProgressPercentage}%` }}
          />
        </div>
        
        {/* Step texts */}
        <p className="text-gray-600 text-[15px] font-semibold">{mobileLabel}</p>
        <p className="text-blue-500 text-[13px] font-semibold mt-0.5">
          {currentStepId === 2 ? t("question") : t("step")} {subStep} {t("of")} {totalSubSteps}
        </p>
      </div>
    </div>
  );
};
