"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  open,
  onOpenChange,
  onConfirm,
}: LogoutModalProps) {
  const t = useTranslations("dashboard.logoutModal");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-white rounded-[40px] p-8 border-white"
      >
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold text-center text-[#111827] ">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-4 mt-6 sm:justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-[16px] border-gray-200 hover:bg-gray-50 text-gray-900 font-medium"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full h-12 rounded-[16px] bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium"
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
