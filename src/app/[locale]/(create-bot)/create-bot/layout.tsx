"use client";

import { useEffect, useState } from "react";
import { Stepper } from "@/components/create-bot/Stepper";
import { useCreateBotStore } from "@/store/create-bot-store";
import { useUserSession, QuestionSessionType } from "@/hooks/useUserSession";
import { X } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { setUserProfile } from "@/lib/auth";

export default function CreateBotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch and refresh user profile on page load
  useEffect(() => {
    const controller = new AbortController();
    // Track whether this effect's cleanup has already fired.
    // If so, we must NOT update state — the request was aborted on purpose
    // (React Strict Mode fires effects twice in development).
    let canceled = false;

    const refreshUserProfile = async () => {
      try {
        const profileResponse = await apiGet("/users/profile", {
          locale,
          signal: controller.signal,
        });

        // Bail out if cleanup already ran (aborted run)
        if (canceled) return;

        if (profileResponse.data?.data) {
          const profile = profileResponse.data.data;
          setUserProfile(profile);
          console.log("✅ User profile refreshed on create-bot entry");

          // Subscription guard: redirect to payment page if not subscribed
          if (profile.has_active_subscription === false) {
            console.log("🔒 No active subscription — redirecting to subscription page");
            router.replace(`/${locale}/subscription`);
            return;
          }
        }
      } catch (error: any) {
        // Ignore errors from aborted requests
        if (canceled) return;
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
        console.error("⚠️ Failed to refresh user profile:", error);
      } finally {
        // Only update loading state if this effect run is still active
        if (!canceled) {
          setIsLoadingProfile(false);
        }
      }
    };

    refreshUserProfile();

    return () => {
      canceled = true;      // mark this run as stale
      controller.abort();   // cancel the in-flight request
    };
  }, [locale]);

  const { currentStep, isCreatingDone, isSharePhase } = useCreateBotStore();
  const { sessionType } = useUserSession();

  const getStepId = (session: QuestionSessionType): number => {
    switch (session) {
      case "static_questions":
        return 2;
      case "generating_ai_questions":
      case "ai_generation_failed":
      case "ai_followup":
        return 3;
      case "completed":
        if (isSharePhase) return 6;
        return isCreatingDone ? 5 : 4;
      default:
        return 1;
    }
  };

  // Loading screen while fetching user profile
  if (isLoadingProfile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1e293b] animate-spin" />
          </div>
          {/* Optional subtle text */}
          <p className="text-sm text-gray-400 font-medium tracking-wide animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA] overflow-hidden">
      {/* Top Navigation Bar - Transparent, no border */}
      <div className="pt-8 pb-4 shrink-0">
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
            <Stepper currentStepId={getStepId(sessionType)} currentStepString={currentStep} />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">{children}</main>
    </div>
  );
}
