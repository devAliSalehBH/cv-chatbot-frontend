import { AuthRightPanel } from "@/components/AuthRightPanel";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Auth Forms */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 md:p-8 lg:p-12 bg-white">
        {children}
      </div>

      {/* Right Panel - Shared Component */}
      <AuthRightPanel />
    </div>
  );
}
