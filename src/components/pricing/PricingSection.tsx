"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  Plan,
  clearPendingPlan,
  fetchPlans,
  formatSar,
  getPlanPrice,
  readPendingPlan,
  savePendingPlan,
} from "@/lib/payment";
import CheckoutDialog from "./CheckoutDialog";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="#2E87FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Pricing section fed by the backend (GET /support/plans).
 * Shared by the landing page and the dedicated /pricing page.
 */
export default function PricingSection() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const resumed = useRef(false);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setPlans(await fetchPlans(locale));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Coming back from login with a plan the user picked earlier → reopen checkout
  useEffect(() => {
    if (resumed.current || plans.length === 0 || !isAuthenticated()) return;
    const pending = readPendingPlan();
    if (!pending) return;
    resumed.current = true;
    clearPendingPlan();
    const plan = plans.find((p) => p.id === pending.planId);
    if (plan) {
      setSelected(plan);
      setDialogOpen(true);
    }
  }, [plans]);

  const handleSubscribe = (plan: Plan) => {
    if (!isAuthenticated()) {
      savePendingPlan({ planId: plan.id });
      const redirect = pathname === "/" ? "/#pricing" : pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    setSelected(plan);
    setDialogOpen(true);
  };

  const gridCols =
    plans.length === 1
      ? "max-w-md"
      : plans.length === 2
        ? "md:grid-cols-2 max-w-4xl"
        : "md:grid-cols-2 lg:grid-cols-3 max-w-6xl";

  return (
    <section id="pricing" className="py-12 lg:py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[#2E87FE] mb-3 text-lg md:text-[24px] font-medium">
            {t("title")}
          </p>
          <h2 className="text-3xl md:text-[44px] tracking-tight font-bold text-[#111827] mb-4">
            {t("subtitle")}
          </h2>
          <p className="text-[#64748B] mx-auto text-[16px] md:text-[20px] max-w-2xl">
            {t("description")}
          </p>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#2E87FE]" size={36} />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-[#64748B] mb-4">{t("loadError")}</p>
            <button
              type="button"
              onClick={loadPlans}
              className="rounded-2xl bg-[#111827] px-6 py-3 text-white font-medium hover:bg-[#1f2937] transition-colors"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <p className="text-center text-[#64748B] py-12">{t("noPlans")}</p>
        )}

        {/* Pricing Cards */}
        {!loading && !error && plans.length > 0 && (
          <div
            className={`grid gap-8 md:gap-10 mx-auto items-stretch ${gridCols}`}
          >
            {plans.map((plan) => {
              const { total, billing } = getPlanPrice(plan);
              const trial = Number(plan.trial_days) || 0;

              return (
                <div
                  key={plan.id}
                  className="relative bg-white rounded-[36px] border border-gray-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col h-full overflow-visible"
                >
                  {/* Ribbon for Most Popular */}
                  {plan.is_popular && (
                    <div className={`absolute -top-3 z-10 w-[84px] ${locale === "ar" ? "left-8 md:left-10" : "right-8 md:right-10"}`}>
                      <div
                        className={`absolute top-0 w-2 h-3 bg-[#1e5eb3] ${locale === "ar" ? "-right-2" : "-left-2"}`}
                        style={{ clipPath: locale === "ar" ? "polygon(0 0, 100% 100%, 0 100%)" : "polygon(100% 0, 0 100%, 100% 100%)" }}
                      />
                      <div className="bg-[#2E87FE] text-white text-center pt-5 pb-7 px-2 flex items-start justify-center ribbon-shape relative z-10 min-h-[110px]">
                        <div className="font-medium text-[15px] leading-tight whitespace-pre-line drop-shadow-sm">
                          {t("badge").replace(" ", "\n")}
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-[22px] font-semibold text-[#111827] mb-6">
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl md:text-[46px] font-bold text-[#111827] tracking-tight">
                      {formatSar(total, locale)}
                    </span>
                    <span className="text-[#64748B] text-lg font-medium">
                      {billing === "yearly" ? t("perYear") : t("perMonth")}
                    </span>
                  </div>

                  <div className="mb-8 min-h-[22px]">
                    {trial > 0 && (
                      <span className="inline-block rounded-full bg-[#ECF4FF] px-3 py-1 text-[13px] font-medium text-[#2E87FE]">
                        {t("trial", { days: trial })}
                      </span>
                    )}
                  </div>

                  <ul className="flex-1 space-y-4 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature.id} className="flex gap-4 items-start">
                        <div className="mt-[2px] shrink-0">
                          <CheckIcon />
                        </div>
                        <span className="text-[#475569] text-[15px] leading-relaxed font-medium">
                          {feature.description || feature.key}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(plan)}
                    className="w-full bg-[#111827] hover:bg-[#1f2937] text-white font-medium py-4 px-6 rounded-2xl transition-colors shadow-sm text-lg"
                  >
                    {t("subscribe")}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <p className="text-center text-sm text-[#94A3B8] mt-8">
            {t("vatNote")}
          </p>
        )}
      </div>

      <CheckoutDialog
        plan={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ribbon-shape {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
        }
      `,
        }}
      />
    </section>
  );
}
