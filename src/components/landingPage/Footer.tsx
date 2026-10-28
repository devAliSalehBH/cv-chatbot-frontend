"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { usePublicSettings } from "@/hooks/usePublicSettings";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { settings } = usePublicSettings();
  // Admin-managed values, falling back to the static translations until they are set
  const email = settings?.contact.email || t("contact.email");
  const address = settings?.contact.address || t("contact.address");
  const phone = settings?.contact.phone_number || t("contact.phone");

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
    <footer className="bg-[#F8FAFC] py-8 lg:pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Logo & Description */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src={`/images/logo-${locale}.svg`}
                alt="Logo"
                width={120}
                height={40}
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[#0F172A] mb-4">
              {t("contact.title")}
            </h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[#3B82F6] transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="leading-relaxed">{address}</li>
              <li
                dir={`${locale == "ar" ? "ltr" : ""}`}
                className={`${locale == "ar" ? "text-right" : ""}`}
              >
                {phone}
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-[#0F172A] mb-4">
              {t("links.title")}
            </h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleSmoothScroll(e, "#pricing")}
                  className="hover:text-[#3B82F6] transition-colors"
                >
                  {t("links.pricing")}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                  className="hover:text-[#3B82F6] transition-colors"
                >
                  {t("links.howItWorks")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:flex lg:flex-col lg:items-start">
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/terms" className="hover:text-[#3B82F6] transition-colors">
                  {t("legal.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#3B82F6] transition-colors">
                  {t("legal.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
