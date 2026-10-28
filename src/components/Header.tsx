"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { isAuthenticated } from "@/lib/auth";

// Public pages that show the section navigation; inside the platform it is hidden
const NAV_PATHS = ["/", "/terms", "/privacy"];

const NAV_ITEMS = [
  { key: "howItWorks", id: "how-it-works" },
  { key: "pricing", id: "pricing" },
  { key: "services", id: "features" },
] as const;

export default function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setMounted(true);
  }, [pathname]);

  const isLanding = pathname === "/";
  const showNav = NAV_PATHS.includes(pathname);

  // On the landing page scroll smoothly; elsewhere let the link navigate to "/#section"
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!isLanding) return;
    const element = document.getElementById(id);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background-light py-4" dir="ltr">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container with rounded corners and shadow */}
        <div className="bg-[#F5F8FFE5] rounded-[20px] shadow-card px-3 md:px-6  py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Link
                href={mounted && loggedIn ? "/dashboard" : "/"}
                aria-label="CV Bot"
                className="w-17.5! md:w-31.5! relative"
              >
                <Image
                  src={`/images/logo-en.svg`}
                  alt="CV Bot"
                  width={100}
                  height={100}
                />
              </Link>
              <div className="">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Middle Section - Navigation Links (public pages only) */}
            {showNav && (
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {NAV_ITEMS.map(({ key, id }) => (
                  <Link
                    key={key}
                    href={`/#${id}`}
                    onClick={(e) => handleNavClick(e, id)}
                    className="text-text-light hover:text-[#2E87FE] transition-colors"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                ))}
              </nav>
            )}

            {/* Authentication Section */}
            <div className="flex items-center md:gap-4">
              {!mounted ? null : loggedIn ? (
                <UserDropdown />
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[15px] font-medium text-gray-700"
                    >
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-black hover:bg-black/80 text-white shadow-button rounded-[10px]">
                      {t("register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
