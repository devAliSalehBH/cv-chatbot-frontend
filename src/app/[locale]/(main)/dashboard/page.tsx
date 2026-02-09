"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile, clearAuth } from "@/lib/auth";

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user profile
    const profile = getUserProfile();
    if (profile) {
      setUser(profile);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.replace(`/${locale}/auth/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Dashboard!
          </h1>
          <p className="text-gray-600 mb-6">
            Hello, {user?.first_name} {user?.last_name}!
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            {user?.phone && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
