"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background-light py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container with rounded corners and shadow */}
        <div className="bg-[#F5F8FFE5] rounded-[20px] shadow-card px-3 md:px-6  py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="w-17.5! md:w-31.5! relative">
                <Image
                  src={`/images/logo-${locale}.svg`}
                  alt="CV Bot"
                  width={100}
                  height={100}
                />
              </div>
              <div className="">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Middle Section - Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                className="text-text-light hover:text-[#2E87FE] transition-colors"
              >
                {t("nav.howItWorks")}
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleSmoothScroll(e, "#pricing")}
                className="text-text-light hover:text-[#2E87FE] transition-colors"
              >
                {t("nav.pricing")}
              </a>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, "#features")}
                className="text-text-light hover:text-[#2E87FE] transition-colors"
              >
                {t("nav.services")}
              </a>
            </nav>

            {/* Authentication Section */}
            <div className="flex items-center md:gap-4">
              <Link href={`/${locale}/auth/login`}>
                <Button variant="ghost" asChild className="text-">
                  <p>{t("login")}</p>
                </Button>
              </Link>
              <Link href={`/${locale}/auth/signup`}>
                <Button className="bg-black hover:bg-black/80 text-white shadow-button rounded-[10px]">
                  {t("register")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
