"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getUserProfile } from "@/lib/auth";
import { fetchProfile, UserProfile } from "@/lib/profile";

/**
 * Loads the current user's profile from the API (falls back to the cached
 * copy in localStorage while loading) and keeps the cache in sync.
 */
export function useProfile() {
  const locale = useLocale();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const fresh = await fetchProfile(locale);
      setProfile(fresh);
      setError(null);
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    const cached = getUserProfile() as UserProfile | null;
    if (cached) setProfile(cached);
    reload();
  }, [reload]);

  return { profile, setProfile, loading, error, reload };
}
