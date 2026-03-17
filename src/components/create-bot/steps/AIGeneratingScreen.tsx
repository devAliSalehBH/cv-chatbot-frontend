import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, RefreshCw } from "lucide-react";
import { apiPost } from "@/lib/api";
import { triggerQueueWork } from "@/lib/queueWork";
import { ProcessingSteps } from "../ProcessingSteps";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AIGeneratingStatus = "loading" | "failed";

interface AIGeneratingScreenProps {
  status: AIGeneratingStatus;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AIGeneratingScreen = ({ status }: AIGeneratingScreenProps) => {
  const locale = useLocale();
  const t = useTranslations("createBot.processing");

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState(false);

  /**
   * Calls the AI questions regeneration endpoint.
   * Firebase will update question_session_type once the backend finishes —
   * the UI reacts automatically via the useUserSession listener.
   */
  const handleRegenerate = async () => {
    setIsRetrying(true);
    setRetryError(false);
    try {
      await apiPost("/users/questions/ai/regenerate", null, { locale });
      await triggerQueueWork(locale);
    } catch (err) {
      console.error("❌ AI regenerate failed:", err);
      setRetryError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  // ── Failed UI ─────────────────────────────────────────────────────────────────

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12">
        <div className="flex flex-col items-center gap-6 max-w-md w-full">
          {/* Error icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          <div className="text-center">
            <h2 className="text-[22px] font-semibold text-[#111827] mb-2">
              {t("aiFailed.title")}
            </h2>
            <p className="text-[15px] text-gray-500">
              {t("aiFailed.subtitle")}
            </p>
          </div>

          {retryError && (
            <p className="text-sm text-red-400 text-center">
              {t("common.error")}
            </p>
          )}

          <button
            onClick={handleRegenerate}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#101828] text-white text-sm font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? t("aiFailed.regenerating") : t("aiFailed.regenerate")}
          </button>
        </div>
      </div>
    );
  }

  // ── Loading (generating_ai_questions) ─────────────────────────────────────────

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

      <ProcessingSteps currentStep={2} />
    </div>
  );
};

