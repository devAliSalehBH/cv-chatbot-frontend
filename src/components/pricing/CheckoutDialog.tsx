"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Lock, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PENDING_ORDER_KEY,
  Plan,
  formatSar,
  getErrorMessage,
  getPlanPrice,
  startCheckout,
} from "@/lib/payment";

interface CheckoutDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({
  plan,
  open,
  onOpenChange,
}: CheckoutDialogProps) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [coupon, setCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset transient state every time the dialog opens
  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // Coming back from the payment page with the browser's Back button restores
  // this page from the bfcache with the old state (spinner still running).
  // Reset it so the dialog is usable again.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setSubmitting(false);
        setError(null);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  if (!plan) return null;

  const { total, billing } = getPlanPrice(plan);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await startCheckout(
        {
          plan_id: plan.id,
          payment_method: "credit_card",
          billing_period: billing,
          ...(coupon.trim() ? { coupon_code: coupon.trim() } : {}),
        },
        locale,
      );

      if (!result?.payment_url || !/^https:\/\//i.test(result.payment_url)) {
        throw new Error("invalid payment url");
      }

      try {
        localStorage.setItem(PENDING_ORDER_KEY, result.order_id);
      } catch {}

      // Hand the user over to the AlinmaPay hosted page
      window.location.href = result.payment_url;
    } catch (err) {
      setError(getErrorMessage(err, t("checkout.genericError")));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md rounded-[28px] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-7 pt-7 pb-5">
          <DialogTitle className="text-[22px] font-semibold text-[#111827]">
            {t("checkout.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {plan.name} · {t(`billing.${billing}`)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-7 pb-7">
          {/* Order summary */}
          <div className="rounded-2xl bg-[#F8FAFC] border border-gray-100 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8] mb-3">
              {t("checkout.orderSummary")}
            </p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[17px] font-semibold text-[#111827]">
                  {plan.name}
                </p>
                <span className="mt-1 inline-block rounded-full bg-[#ECF4FF] px-3 py-0.5 text-[12px] font-medium text-[#2E87FE]">
                  {t(`billing.${billing}`)}
                </span>
              </div>
              <p className="text-[26px] font-bold tracking-tight text-[#111827]">
                {formatSar(total, locale)}
              </p>
            </div>
          </div>

          {/* Optional coupon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="coupon"
                className="text-sm font-medium text-[#111827]"
              >
                {t("checkout.coupon")}
              </label>
              <span className="text-xs text-[#94A3B8]">
                {t("checkout.optional")}
              </span>
            </div>
            <div className="relative">
              <Tag
                size={18}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 text-[#94A3B8]"
              />
              <input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder={t("checkout.couponPlaceholder")}
                dir="ltr"
                autoComplete="off"
                className="h-12 w-full rounded-2xl border border-gray-200 ps-11 pe-4 text-[15px] outline-none transition-colors focus:border-[#2E87FE] focus:ring-4 focus:ring-[#2E87FE]/10"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] py-4 text-[16px] font-medium text-white transition-colors hover:bg-[#1f2937] disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Lock size={16} />
            )}
            {submitting
              ? t("checkout.redirecting")
              : t("checkout.pay", { amount: formatSar(total, locale) })}
          </button>

          <div className="space-y-1 text-center text-xs text-[#94A3B8]">
            <p>{t("checkout.secureNote")}</p>
            <p>{t("vatNote")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
