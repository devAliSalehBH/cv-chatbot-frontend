"use client";

import { Stepper } from "@/components/create-bot/Stepper";
import { useCreateBotStore } from "@/store/create-bot-store";
import { X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CreateBotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentStep } = useCreateBotStore();
  const t = useTranslations("dashboard"); // Assuming translations are in dashboard namespace for now

  // Map step to ID for stepper
  const getStepId = (step: string) => {
    switch (step) {
      case "upload-resume":
        return 1;
      case "upload-certificates":
        return 1; // Still part of step 1 visual
      case "linkedin-profile":
        return 1; // Still part of step 1 visual
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </Link>
          <div className="flex-1 max-w-3xl mx-auto">
            <Stepper currentStep={getStepId(currentStep)} />
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
