"use client";

import { useTransition } from "react";
import { LANGUAGES } from "@/lib/const";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const selectedLanguage = LANGUAGES.find((lang) => lang.locale === locale)!;
  const nextLanguage = LANGUAGES.find((lang) => lang.locale !== locale)!;

  const switchLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      // Force a full page refresh to update the dir attribute
      router.refresh();
    });
  };

  return (
    <Button
      onClick={switchLocale}
      disabled={isPending}
      variant="ghost"
      className="flex items-center gap-2 hover:bg-gray-100"
      title={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <div className="flex items-center gap-2">
        <nextLanguage.flag className="size-4" />
        <span className="text-sm font-medium text-gray-700">
          {nextLanguage.name}
        </span>
      </div>
    </Button>
  );
}
