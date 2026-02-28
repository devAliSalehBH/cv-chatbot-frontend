"use client";

import { Stepper } from "@/components/create-bot/Stepper";
import { useCreateBotStore } from "@/store/create-bot-store";
import { X } from "lucide-react";
import Link from "next/link";

export default function CreateBotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentStep } = useCreateBotStore();

  const getStepId = (step: string) => {
    switch (step) {
      case "upload-resume":
        return 1;
      case "upload-certificates":
        return 1;
      case "linkedin-profile":
        return 1;
      case "answer-questions":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation Bar - Transparent, no border */}
      <div className="pt-8 pb-4">
        <div className="flex items-center justify-center max-w-5xl mx-auto px-6 relative">
          
          {/* X Button - Absolute or placed close to the start of the stepper */}
          <div className="absolute start-6 md:start-12 lg:start-0 top-1 md:top-1/2 md:-translate-y-1/2">
            <Link
              href="/dashboard"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100/50 hover:text-gray-700 transition-colors bg-transparent"
            >
              <X className="w-4 h-4" />
            </Link>
          </div>

          {/* Stepper Container */}
          <div className="w-full max-w-4xl ps-12 pe-4 sm:px-0 mt-3 md:mt-0">
            <Stepper currentStepId={getStepId(currentStep)} currentStepString={currentStep} />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  );
}
