import { ReactNode } from "react";
import Header from "@/components/Header";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-[53svh]">{children}</main>
      <DashboardFooter />
    </>
  );
}
