"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  OrderStatus,
  PENDING_ORDER_KEY,
  fetchOrderStatus,
  formatSar,
} from "@/lib/payment";

const POLL_INTERVAL_MS = 3500;
const MAX_POLLS = 6;

type ViewState = "checking" | "completed" | "failed" | "timeout" | "missing";

function PaymentResult() {
  const t = useTranslations("payment");
  const locale = useLocale();
  const params = useSearchParams();

  const [view, setView] = useState<ViewState>("checking");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelled = useRef(false);

  const resolveOrderRef = useCallback((): string | null => {
    const fromUrl =
      params.get("order_id") ||
      params.get("order") ||
      params.get("orderId") ||
      params.get("order_number");
    if (fromUrl) return fromUrl;
    try {
      return localStorage.getItem(PENDING_ORDER_KEY);
    } catch {
      return null;
    }
  }, [params]);

  const poll = useCallback(
    async (orderRef: string, attempt: number) => {
      try {
        const data = await fetchOrderStatus(orderRef, locale);
        if (cancelled.current) return;
        setOrder(data);

        if (data.status === "completed") {
          try {
            localStorage.removeItem(PENDING_ORDER_KEY);
          } catch {}
          setView("completed");
          return;
        }
        if (data.status === "failed") {
          setView("failed");
          return;
        }
      } catch {
        if (cancelled.current) return;
        // transient error → fall through and retry
      }

      if (attempt + 1 >= MAX_POLLS) {
        setView("timeout");
        return;
      }
      timer.current = setTimeout(
        () => poll(orderRef, attempt + 1),
        POLL_INTERVAL_MS,
      );
    },
    [locale],
  );

  const start = useCallback(() => {
    const orderRef = resolveOrderRef();
    if (!orderRef) {
      setView("missing");
      return;
    }
    setView("checking");
    poll(orderRef, 0);
  }, [poll, resolveOrderRef]);

  useEffect(() => {
    cancelled.current = false;
    start();
    return () => {
      cancelled.current = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [start]);

  const card =
    "mx-auto flex w-full max-w-lg flex-col items-center gap-5 rounded-[28px] border border-[#E5E7EB] bg-white p-8 md:p-12 text-center shadow-sm";
  const primaryBtn =
    "inline-flex h-[52px] items-center justify-center rounded-[16px] bg-[#101828] px-8 text-[16px] font-medium text-white hover:bg-[#1E293B] transition-colors";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {view === "checking" && (
        <div className={card}>
          <Loader2 size={48} className="animate-spin text-[#2E87FE]" />
          <h1 className="text-[22px] font-semibold text-[#111827]">
            {t("checkingTitle")}
          </h1>
          <p className="text-[#64748B]">{t("checkingDesc")}</p>
        </div>
      )}

      {view === "completed" && (
        <div className={card}>
          <CheckCircle2 size={56} className="text-[#12B76A]" />
          <h1 className="text-[24px] font-semibold text-[#111827]">
            {t("successTitle")}
          </h1>
          <p className="text-[#64748B]">{t("successDesc")}</p>
          {order && (
            <dl className="w-full space-y-2 rounded-2xl bg-[#F9FAFB] p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#64748B]">{t("orderNumber")}</dt>
                <dd className="font-medium text-[#111827]" dir="ltr">
                  {order.order_number}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#64748B]">{t("plan")}</dt>
                <dd className="font-medium text-[#111827]">
                  {order.plan_title}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#64748B]">{t("amountPaid")}</dt>
                <dd className="font-medium text-[#111827]">
                  {formatSar(order.amount_paid ?? order.total_price, locale)}
                </dd>
              </div>
            </dl>
          )}
          <Link href="/create-bot" className={primaryBtn}>
            {t("startBuilding")}
          </Link>
          <Link href="/dashboard" className="text-sm text-[#64748B] underline">
            {t("goDashboard")}
          </Link>
        </div>
      )}

      {view === "failed" && (
        <div className={card}>
          <XCircle size={56} className="text-red-500" />
          <h1 className="text-[24px] font-semibold text-[#111827]">
            {t("failedTitle")}
          </h1>
          <p className="text-[#64748B]">
            {order?.payment_failed_reason || t("failedDesc")}
          </p>
          <Link href="/pricing" className={primaryBtn}>
            {t("tryAgain")}
          </Link>
        </div>
      )}

      {view === "timeout" && (
        <div className={card}>
          <Clock size={56} className="text-[#F79009]" />
          <h1 className="text-[24px] font-semibold text-[#111827]">
            {t("timeoutTitle")}
          </h1>
          <p className="text-[#64748B]">{t("timeoutDesc")}</p>
          <button type="button" onClick={start} className={primaryBtn}>
            {t("checkAgain")}
          </button>
          <Link href="/dashboard" className="text-sm text-[#64748B] underline">
            {t("goDashboard")}
          </Link>
        </div>
      )}

      {view === "missing" && (
        <div className={card}>
          <XCircle size={56} className="text-[#94A3B8]" />
          <h1 className="text-[24px] font-semibold text-[#111827]">
            {t("missingTitle")}
          </h1>
          <p className="text-[#64748B]">{t("missingDesc")}</p>
          <Link href="/pricing" className={primaryBtn}>
            {t("backToPricing")}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={null}>
      <PaymentResult />
    </Suspense>
  );
}
