import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, RefreshCw } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { ProcessingSteps } from "../ProcessingSteps";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadItemStatus = "pending" | "processing" | "completed" | "failed";

interface UploadItem {
  id: number | null;
  collection_name: string;
  status: UploadItemStatus;
  has_summary: boolean;
}

interface UploadStatusData {
  cv: UploadItem;
  certificates: UploadItem[];
}

export type ProcessingStatus = "loading" | "failed";

interface ProcessingScreenProps {
  status: ProcessingStatus;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ProcessingScreen = ({ status }: ProcessingScreenProps) => {
  const locale = useLocale();
  const t = useTranslations("createBot.processing");

  // Upload status data — fetched when status === "failed"
  const [uploadData, setUploadData] = useState<UploadStatusData | null>(null);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

  // Single retry state for all failed files
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  // ── When entering "failed" state, fetch upload status to get file IDs ───────

  const fetchUploadStatus = async (): Promise<UploadStatusData | null> => {
    setIsFetchingStatus(true);
    try {
      const response = await apiGet("/users/profile/upload-status", { locale });
      const data: UploadStatusData = response.data?.data;
      if (data) setUploadData(data);
      return data ?? null;
    } catch (err) {
      console.error("❌ Failed to fetch upload status:", err);
      return null;
    } finally {
      setIsFetchingStatus(false);
    }
  };

  useEffect(() => {
    if (status !== "failed") return;
    fetchUploadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /**
   * Files to re-summarize: everything not summarized yet. Besides "failed",
   * a file can be left "pending"/"processing" by a job that never ran or was
   * killed — the session stays failed until ALL files are summarized.
   */
  const getRetryItems = (data: UploadStatusData | null): UploadItem[] =>
    data
      ? [data.cv, ...(data.certificates ?? [])].filter(
          (item): item is UploadItem => !!item && item.id !== null && item.status !== "completed"
        )
      : [];

  // ── Retry all failed files in one request ────────────────────────────────────

  const handleRetryAll = async () => {
    setIsRetrying(true);
    setRetryError(null);

    try {
      // Status may be missing/stale (e.g. the first fetch failed) — refresh it first
      let items = failedItems;
      if (items.length === 0) {
        items = getRetryItems(await fetchUploadStatus());
      }
      if (items.length === 0) {
        setRetryError(t("failed.nothingToRetry"));
        return;
      }

      const formData = new FormData();
      items.forEach((item, index) => {
        formData.append(`uploads[${index}][id]`, String(item.id));
        formData.append(`uploads[${index}][collection_name]`, item.collection_name);
      });

      await apiPost("/users/profile/resummary", formData, {
        locale,
        headers: { "Content-Type": "multipart/form-data" },
      });


      // Firebase will update question_session_type when backend finishes —
      // the UI will react automatically via the useUserSession listener.
    } catch (err: any) {
      console.error("❌ Re-summarize failed:", err);
      setRetryError(err?.response?.data?.message || t("failed.error"));
    } finally {
      setIsRetrying(false);
    }
  };

  // ── Derive failed items from upload status data ───────────────────────────────

  const failedItems: UploadItem[] = getRetryItems(uploadData);

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
              {t("failed.title")}
            </h2>
            <p className="text-[15px] text-gray-500">
              {t("failed.subtitle")}
            </p>
          </div>

          {/* Failed files list (read-only) + single retry button */}
          {isFetchingStatus ? (
            <div className="w-6 h-6 rounded-full border-4 border-gray-200 border-t-[#1e293b] animate-spin" />
          ) : failedItems.length > 0 ? (
            <div className="w-full flex flex-col gap-4">
              {/* File list */}
              <div className="flex flex-col gap-2">
                {failedItems.map((item) => {
                  const key = `${item.collection_name}-${item.id}`;
                  const label =
                    item.collection_name === "cv"
                      ? t("failed.cvLabel")
                      : t("failed.certLabel", { id: item.id ?? 0 });
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-3"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-sm font-medium text-[#374151]">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Single re-summarize button */}
              {retryError && (
                <p className="text-xs text-red-400 text-center">{retryError}</p>
              )}
              <button
                onClick={handleRetryAll}
                disabled={isRetrying}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#101828] text-white text-sm font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? t("failed.retrying") : t("failed.retryAll")}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {retryError && (
                <p className="text-xs text-red-400 text-center">{retryError}</p>
              )}
              <button
                onClick={handleRetryAll}
                disabled={isRetrying}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#101828] text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? t("failed.retrying") : t("failed.retry")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Loading (summarizing_files) ───────────────────────────────────────────────

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

      <ProcessingSteps currentStep={1} />
    </div>
  );
};


