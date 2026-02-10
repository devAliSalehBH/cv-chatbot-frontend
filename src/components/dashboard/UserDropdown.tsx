"use client";

import { useLocale, useTranslations } from "next-intl";
import { LogOut, User, CreditCard, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeAuthToken, removeUserProfile, getUserProfile } from "@/lib/auth";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

export default function UserDropdown() {
  const t = useTranslations("dashboard.userDropdown");
  const locale = useLocale();
  const router = useRouter();
  const user = getUserProfile();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    removeAuthToken();
    removeUserProfile();
    router.push(`/${locale}/auth/login`);
  };

  const userName = user?.name || "User";
  const userInitials = user?.name ? getInitials(user.name) : "AA";
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <DropdownMenu dir={direction}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 outline-none">
            <span className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#111827_0%,#1D4ED8_100%)] text-white flex items-center justify-center text-sm font-semibold">
              {userInitials}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 p-0 rounded-[10px] bg-white border-white"
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-3 ">
            <span className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#111827_0%,#1D4ED8_100%)] text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {userInitials}
            </span>
            <div className="overflow-hidden">
              <p className="text-lg font-semibold text-[#333333]">{userName}</p>
            </div>
          </div>
          <DropdownMenuItem className="cursor-pointer px-3 border-t h-14 border-[#E5E7EB] rounded-none focus:bg-blue-50 focus:text-blue-900">
            <User className=" text-gray-500" />
            <span className="font-medium text-gray-700">{t("myAccount")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer py-2.5 px-3 border-t h-14 border-[#E5E7EB] rounded-none focus:bg-blue-50 focus:text-blue-900">
            <CreditCard className=" text-gray-500" />
            <span className="font-medium text-gray-700">
              {t("subscription")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="cursor-pointer py-2.5 px-3 border-t h-14 border-[#E5E7EB] rounded-none focus:bg-red-50 focus:text-red-700 text-gray-700"
          >
            <LogOut className="" />
            <span className="font-medium">{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={confirmLogout}
      />
    </>
  );
}
