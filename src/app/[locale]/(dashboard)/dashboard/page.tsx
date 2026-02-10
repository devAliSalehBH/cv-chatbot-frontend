"use client";

import { useTranslations } from "next-intl";
import { getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const user = getUserProfile();

  const userName = user?.name || "User";

  // State 1: Empty State (No Bot Created)
  const hasBot = false; // TODO: Check if user has created a bot

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-[20px] md:text-[32px] text-[#111827] mb-2">
          {t("welcome", { name: userName })}
        </h1>
        <p className="text-[16px] md:text-[18px] text-[#6B7280]">
          {t("subtitle")}
        </p>
      </div>

      {/* Content Area */}
      {!hasBot ? (
        // Empty State: Horizontal Layout
        <div className="rounded-3xl bg-[#F9FAFB] border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-[20px] md:text-[22px] text-[#111827]">
                {t("emptyState.title")}
              </h2>
              <p className="text-[#64748B] text-[14px] md:text-[16px]">
                {t("emptyState.description")}
              </p>
            </div>

            <div className="shrink-0">
              <Button className="bg-[#0F172A] hover:bg-[#1E293B] px-6 h-10 rounded-[10px] shadow-sm">
                <p className="text-[#FCFCFC] text-[16px]">
                  {t("emptyState.button")}
                </p>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // TODO: Bot Created State
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Bot Created State - To be implemented</p>
        </div>
      )}
    </div>
  );
}
