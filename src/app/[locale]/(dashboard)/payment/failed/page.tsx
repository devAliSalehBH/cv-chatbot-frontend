import { XCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PaymentFailedPage() {
  const t = await getTranslations("payment");

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5 rounded-[28px] border border-[#E5E7EB] bg-white p-8 md:p-12 text-center shadow-sm">
        <XCircle size={56} className="text-red-500" />
        <h1 className="text-[24px] font-semibold text-[#111827]">
          {t("failedTitle")}
        </h1>
        <p className="text-[#64748B]">{t("failedDesc")}</p>
        <Link
          href="/pricing"
          className="inline-flex h-[52px] items-center justify-center rounded-[16px] bg-[#101828] px-8 text-[16px] font-medium text-white transition-colors hover:bg-[#1E293B]"
        >
          {t("tryAgain")}
        </Link>
        <Link href="/dashboard" className="text-sm text-[#64748B] underline">
          {t("goDashboard")}
        </Link>
      </div>
    </div>
  );
}
