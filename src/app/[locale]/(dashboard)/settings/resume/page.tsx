"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileText, FileQuestion, UploadCloud, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import SettingsCard, { LinkedInIcon } from "@/components/settings/SettingsCard";
import CvChangeWarningDialog from "@/components/settings/CvChangeWarningDialog";
import { useProfile } from "@/hooks/useProfile";
import { useUserSession } from "@/hooks/useUserSession";
import { useAlertStore } from "@/store/useAlertStore";
import { Link } from "@/i18n/navigation";
import {
  apiErrorMessage,
  CV_BUSY_STATES,
  CV_RESET_STATES,
  DocumentsPayload,
  formatFileSize,
  LINKEDIN_URL_REGEX,
  mediaFileName,
  ProfileMedia,
  updateDocuments,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const CV_ACCEPT = ".pdf,.doc,.docx";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // must match backend (max:5120 KB)

/** Session states where the bot is not live yet but the flow has started. */
const IN_PROGRESS_STATES = [
  "summarizing_files",
  "failed_summarizing_files",
  "static_questions",
  "generating_ai_questions",
  "ai_generation_failed",
  "ai_followup",
];

export default function ResumeSettingsPage() {
  const t = useTranslations("settings.resume");
  const locale = useLocale();
  const { showAlert } = useAlertStore();
  const { profile, setProfile, loading } = useProfile();
  const { sessionType: liveSessionType } = useUserSession();

  const sessionType = liveSessionType ?? profile?.question_session_type ?? null;

  const cvInputRef = useRef<HTMLInputElement>(null);

  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [pendingCv, setPendingCv] = useState<File | null>(null);

  // LinkedIn
  const [linkedin, setLinkedin] = useState("");
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  const [linkedinSaved, setLinkedinSaved] = useState(false);
  const savedLinkedin = profile?.linkedin_url ?? "";

  useEffect(() => {
    setLinkedin(savedLinkedin);
  }, [savedLinkedin]);

  const cv = profile?.cv ?? null;
  // Only the CV is managed from settings (certificates are handled in /create-bot)
  const hasFiles = !!cv;
  const cvLocked = CV_BUSY_STATES.includes(sessionType);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const submit = async (action: string, payload: DocumentsPayload, successMessage: string) => {
    setBusyAction(action);
    try {
      const updated = await updateDocuments(payload, locale);
      setProfile(updated);
      showAlert(successMessage, true);
      return true;
    } catch (error: any) {
      // Session moved to a "reset" state meanwhile → ask for confirmation
      if (error?.response?.status === 409 && payload.cv && !payload.confirmReset) {
        setPendingCv(payload.cv);
        return false;
      }
      showAlert(apiErrorMessage(error, t("errors.uploadFailed")), false);
      return false;
    } finally {
      setBusyAction(null);
    }
  };

  const validateFile = (file: File, accept: string): boolean => {
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!accept.split(",").includes(ext)) {
      showAlert(t("errors.fileType", { types: accept.replaceAll(".", " ").toUpperCase() }), false);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showAlert(t("errors.fileSize"), false);
      return false;
    }
    return true;
  };

  // ── CV ─────────────────────────────────────────────────────────────────────

  const handleCvSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !validateFile(file, CV_ACCEPT)) return;

    if (CV_RESET_STATES.includes(sessionType)) {
      setPendingCv(file); // confirmation dialog
      return;
    }
    uploadCv(file, false);
  };

  const uploadCv = async (file: File, confirmReset: boolean) => {
    const ok = await submit(
      "cv",
      { cv: file, confirmReset },
      confirmReset ? t("success.cvReplacedReset") : cv ? t("success.cvReplaced") : t("success.cvUploaded")
    );
    if (ok) setPendingCv(null);
  };

  // ── LinkedIn ───────────────────────────────────────────────────────────────

  const saveLinkedin = async () => {
    const value = linkedin.trim();
    setLinkedinSaved(false);
    if (value === savedLinkedin) return;
    if (value && !LINKEDIN_URL_REGEX.test(value)) {
      setLinkedinError(t("linkedin.invalid"));
      return;
    }
    setLinkedinError(null);
    const ok = await submit("linkedin", { linkedinUrl: value || null }, t("linkedin.saved"));
    if (ok) setLinkedinSaved(true);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const renderCvRow = (media: ProfileMedia) => (
    <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3">
      <a
        href={media.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 items-center gap-3 hover:opacity-80"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECF4FF]">
          <FileText className="h-5 w-5 text-[#2C85FE]" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] text-[#111827]" dir="ltr">
            {mediaFileName(media)}
          </span>
          <span className="text-[13px] text-[#64748B]">{formatFileSize(media.size)}</span>
        </span>
      </a>

      <button
        type="button"
        onClick={() => cvInputRef.current?.click()}
        disabled={!!busyAction || cvLocked}
        title={cvLocked ? t("files.processing") : undefined}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] border border-[#101828] px-3 text-[14px] text-[#101828] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busyAction === "cv" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#101828]" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{t("files.replace")}</span>
      </button>
    </div>
  );

  const primaryButtonClass =
    "flex h-10 w-full md:w-auto items-center justify-center gap-2.5 rounded-[10px] bg-[#101828] px-[22px] text-[16px] text-[#FCFCFC] transition-colors hover:bg-[#1F2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] disabled:opacity-60";

  return (
    <>
      <input ref={cvInputRef} type="file" accept={CV_ACCEPT} className="hidden" onChange={handleCvSelected} />

      {/* Bot offline / setup in progress banner */}
      {profile?.has_active_subscription && IN_PROGRESS_STATES.includes(sessionType ?? "") && (
        <div className="flex flex-col gap-3 rounded-[16px] border border-[#FEDF89] bg-[#FFFAEB] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC6803]" />
            <p className="text-[14px] leading-6 text-[#93370D]">{t("banner.text")}</p>
          </div>
          <Link
            href="/create-bot"
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-[#101828] px-4 text-[14px] text-white hover:bg-[#1F2937]"
          >
            {t("banner.action")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      )}

      <SettingsCard
        icon={<FileText className="h-5 w-5" strokeWidth={2} />}
        title={t("documents.title")}
        description={t("documents.description")}
        bodyClassName={hasFiles ? undefined : "py-6"}
      >
        {loading && !profile ? (
          <div className="flex justify-center py-8">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1e293b]" />
          </div>
        ) : !hasFiles ? (
          // Empty state
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <FileQuestion className="h-10 w-10 text-[#64748B]" strokeWidth={1.5} />
            <p className="text-[16px] leading-6 text-[#64748B]">{t("documents.empty")}</p>
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              disabled={!!busyAction}
              className={cn(primaryButtonClass, "mt-4")}
            >
              {busyAction === "cv" ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <UploadCloud className="h-5 w-5" />
              )}
              {t("documents.uploadNew")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {cvLocked && <p className="text-[13px] text-[#DC6803]">{t("files.processing")}</p>}

            {cv && renderCvRow(cv)}
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        icon={<LinkedInIcon />}
        title={t("linkedin.title")}
        description={t("linkedin.description")}
      >
        <div className="flex max-w-[574px] flex-col gap-1.5">
          <label htmlFor="linkedin_url" className="text-[16px] text-[#414651]">
            {t("linkedin.label")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center">
              <LinkedInIcon className="h-4 w-4 text-[10px]" />
            </span>
            <input
              id="linkedin_url"
              type="url"
              value={linkedin}
              onChange={(e) => {
                setLinkedin(e.target.value);
                setLinkedinError(null);
                setLinkedinSaved(false);
              }}
              onBlur={saveLinkedin}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder={t("linkedin.placeholder")}
              disabled={busyAction === "linkedin" || (loading && !profile)}
              aria-invalid={!!linkedinError}
              className={cn(
                "h-11 w-full rounded-[8px] border border-[#D5D7DA] bg-[#FCFCFC] ps-10 pe-3.5 text-[14px] text-[#111827] shadow-[0_1px_2px_rgba(10,13,18,0.05)] outline-none transition placeholder:font-light placeholder:text-[#818282] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15",
                linkedinError && "border-[#F04438]"
              )}
            />
          </div>
          {linkedinError ? (
            <p className="text-[13px] text-[#F04438]">{linkedinError}</p>
          ) : linkedinSaved ? (
            <p className="text-[13px] text-[#12B76A]">{t("linkedin.saved")}</p>
          ) : (
            <p className="text-[13px] text-[#64748B]">{t("linkedin.hint")}</p>
          )}
        </div>
      </SettingsCard>

      <CvChangeWarningDialog
        open={!!pendingCv}
        fileName={pendingCv?.name}
        loading={busyAction === "cv"}
        onOpenChange={(open) => !open && setPendingCv(null)}
        onConfirm={() => pendingCv && uploadCv(pendingCv, true)}
      />
    </>
  );
}
