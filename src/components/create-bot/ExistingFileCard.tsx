"use client";

import { CheckCircle2, FileText, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatFileSize, mediaFileName, ProfileMedia } from "@/lib/profile";

interface ExistingFileCardProps {
  media: ProfileMedia;
  /** Opens a file picker to replace this file. */
  onReplace?: () => void;
  /** Removes this file (it will be deleted on submit). */
  onRemove?: () => void;
}

/** A file that is already stored on the backend (e.g. uploaded from settings). */
export const ExistingFileCard = ({ media, onReplace, onRemove }: ExistingFileCardProps) => {
  const t = useTranslations("createBot.existingFiles");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="min-w-0">
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-normal text-[18px] text-[#111827] leading-tight hover:underline"
              dir="ltr"
            >
              {mediaFileName(media)}
            </a>
            <p className="font-normal text-[14px] text-[#64748B] mt-1">
              {[formatFileSize(media.size), t("existingFile")].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onReplace && (
            <button
              type="button"
              onClick={onReplace}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#101828] text-[14px] text-[#101828] hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{t("replace")}</span>
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <p className="font-normal text-[14px] text-[#12B76A] mt-3">{t("keep")}</p>
    </div>
  );
};
