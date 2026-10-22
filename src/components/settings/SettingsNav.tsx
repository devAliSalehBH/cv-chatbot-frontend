"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ACCOUNT_ITEMS = [
  { href: "/settings/profile", key: "myProfile" },
  { href: "/settings/resume", key: "myResume" },
] as const;

const BILLING_ITEMS = [{ href: "/settings/subscription", key: "subscription" }] as const;

const ALL_ITEMS = [...ACCOUNT_ITEMS, ...BILLING_ITEMS];

/**
 * Settings navigation.
 * Desktop (lg+): vertical sidebar with grouped items and an active rail indicator.
 * Mobile/tablet: horizontal pill tabs.
 */
export default function SettingsNav() {
  const t = useTranslations("settings.nav");
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const renderGroup = (items: readonly { href: string; key: string }[]) => (
    <ul className="flex flex-col border-s border-[#E5E7EB]">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href} className="relative">
            {active && (
              <span className="absolute -start-px top-0 h-full w-[3px] rounded-full bg-[#3B82F6]" />
            )}
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block ps-2 py-2 text-[16px] leading-6 transition-colors hover:text-[#111827]",
                active ? "text-[#111827]" : "text-[#64748B]"
              )}
            >
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col gap-6 w-[260px] shrink-0" aria-label={t("label")}>
        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] leading-8 font-semibold text-[#111827]">{t("account")}</h2>
          {renderGroup(ACCOUNT_ITEMS)}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] leading-8 font-semibold text-[#111827]">{t("billing")}</h2>
          {renderGroup(BILLING_ITEMS)}
        </div>
      </nav>

      {/* Mobile tabs */}
      <nav
        className="lg:hidden -mx-4 px-4 overflow-x-auto [scrollbar-width:none]"
        aria-label={t("label")}
      >
        <ul className="flex items-center gap-1 w-max">
          {ALL_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block whitespace-nowrap rounded-[10px] px-3 py-2.5 text-[15px] transition-colors",
                    active
                      ? "bg-[#2C85FE] text-white"
                      : "text-[#111827] hover:bg-[#F1F5F9]"
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
