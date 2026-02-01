"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";

export default function Header() {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-50 bg-background-light py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container with rounded corners and shadow */}
        <div className="bg-[#F5F8FFE5] rounded-lg shadow-card px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.svg"
                alt="CV Bot"
                width={100}
                height={44}
              />
              <div className="mx-8">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Middle Section - Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a
                href="#how-to-start"
                className="text-text-light hover:text-primary-DEFAULT transition-colors"
              >
                {t("nav.howToStart")}
              </a>
              <a
                href="#pricing"
                className="text-text-light hover:text-primary-DEFAULT transition-colors"
              >
                {t("nav.pricing")}
              </a>
              <a
                href="#services"
                className="text-text-light hover:text-primary-DEFAULT transition-colors"
              >
                {t("nav.services")}
              </a>
            </nav>

            {/* Authentication Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                asChild
                className="text-text-light hover:text-primary-DEFAULT hidden sm:inline-flex"
              >
                <a href="#login">{t("login")}</a>
              </Button>
              <Button className="bg-black hover:bg-black/80 text-white shadow-button">
                {t("register")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
