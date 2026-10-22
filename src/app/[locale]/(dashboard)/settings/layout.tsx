import { ReactNode } from "react";
import SettingsNav from "@/components/settings/SettingsNav";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-14 max-w-[1300px]">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-[72px]">
        <SettingsNav />
        <div className="flex-1 min-w-0 flex flex-col gap-5 lg:gap-10 lg:max-w-[954px]">{children}</div>
      </div>
    </div>
  );
}
