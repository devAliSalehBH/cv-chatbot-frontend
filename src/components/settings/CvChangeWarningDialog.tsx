"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CvChangeWarningDialogProps {
  open: boolean;
  fileName?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * Shown before replacing the CV once the user has answered the questions:
 * the AI questions must be answered again and the bot goes offline meanwhile.
 */
export default function CvChangeWarningDialog({
  open,
  fileName,
  loading,
  onOpenChange,
  onConfirm,
}: CvChangeWarningDialogProps) {
  const t = useTranslations("settings.resume.warning");

  return (
    <Dialog open={open} onOpenChange={(value) => !loading && onOpenChange(value)}>
      <DialogContent className="sm:max-w-[480px] rounded-[20px] bg-white p-6">
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF3F2]">
            <AlertTriangle className="h-6 w-6 text-[#F04438]" />
          </div>
          <DialogTitle className="text-[20px] font-semibold text-[#111827]">{t("title")}</DialogTitle>
          <DialogDescription className="text-[15px] leading-6 text-[#64748B]">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {fileName && (
          <p className="truncate rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-center text-[14px] text-[#111827]">
            {fileName}
          </p>
        )}

        <DialogFooter className="mt-2 flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-[10px] border border-[#101828] px-6 text-[15px] text-[#101828] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#101828] px-6 text-[15px] text-[#FCFCFC] transition-colors hover:bg-[#1F2937] disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {t("confirm")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
