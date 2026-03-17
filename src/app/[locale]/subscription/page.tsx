"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { getUserProfile } from "@/lib/auth";
import { triggerQueueWork } from "@/lib/queueWork";

export default function SubscriptionPage() {
   const t = useTranslations("subscription");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSkip = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiGet("/skip-subscription", { locale });
    } catch (err: any) {
      console.warn("⚠️ /skip-subscription error:", err);
      setError(err?.response?.data?.message || "Something went wrong.");
      setLoading(false);
      return;
    }

    // ── 1. Initialise Firebase session for this user ──────────────────────────
    try {
      const profile = getUserProfile();
      const uid = profile?.id;
      if (uid) {
        const sessionRef = ref(db, `users/${uid}/question_session_type`);
        await set(sessionRef, "upload_file");
        console.log("✅ Firebase session initialised for user", uid);
      }
    } catch (fbErr) {
      // Non-blocking: log but don't stop navigation
      console.error("⚠️ Failed to initialise Firebase session:", fbErr);
    }

    // ── 2. Trigger queue worker (temporary — see queueWork.ts) ───────────────
    await triggerQueueWork(locale);

    // ── 3. Navigate to create-bot ────────────────────────────────────────────
    router.replace(`/${locale}/create-bot`);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#475569]" />

        <div className="p-8 flex flex-col items-center text-center gap-6">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full bg-[#1e293b]/8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[#1e293b]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Title & description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          {t("subtitle")}
            </p>
          </div>

          {/* Coming-soon badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {t("comingSoon")}
          </span>

          {/* Divider */}
          <div className="w-full border-t border-gray-100" />

          {/* Skip button */}
          <div className="w-full flex flex-col gap-3">
            <p className="text-xs text-gray-400">
              {t("testing")}
            </p>
            <button
              id="skip-subscription-btn"
              onClick={handleSkip}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1e293b] text-white text-sm font-semibold hover:bg-[#334155] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("processing")}
                </>
              ) : (
                <>
                  {/* Forward arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  {t("skip")}
                </>
              )}
            </button>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
