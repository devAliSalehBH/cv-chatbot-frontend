"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader() {
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-background-light py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container with rounded corners and shadow */}
        <div className="bg-[#F5F8FFE5] rounded-[20px] shadow-card px-3 md:px-6 py-4">
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

            {/* Right Section - User Dropdown */}
            <div className="flex items-center">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
