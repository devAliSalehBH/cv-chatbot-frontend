"use client";
import { LANGUAGES } from "@/lib/const";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "./ui/button";
export default function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const selectedLanguage = LANGUAGES.find((lang) => lang.locale === locale);
  const switchLocale = (newLocale: string) => {
    router.replace({ pathname }, { locale: newLocale });
  };
  return (
    <div>
      <div>{selectedLanguage?.name}</div>
      <Button onClick={() => switchLocale("ar")}>ar</Button>
      <Button onClick={() => switchLocale("en")}>en</Button>
    </div>
  );
}
