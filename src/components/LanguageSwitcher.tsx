"use client";

import { useTransition } from "react";
import { LANGUAGES } from "@/lib/const";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors outline-none"
      >
        <Image
          src="/images/landingPage/header/language.svg"
          alt="Language"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 bg-white border-white rounded-[10px] m-0!"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.locale}
            onClick={() => switchLocale(lang.locale)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
              locale === lang.locale
                ? "bg-[#A1C7FF4D]"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="font-bold text-sm">
              {lang.locale.toUpperCase()}
            </span>
            <span className=" text-[#64748B] text-[16px]">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
