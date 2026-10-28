"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { fetchPublicSettings, type PublicSettings } from "@/lib/publicSettings";

const cache = new Map<string, Promise<PublicSettings>>();

/** Loads the public settings once per locale and shares them between components. */
export function usePublicSettings() {
  const locale = useLocale();
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let request = cache.get(locale);
    if (!request) {
      request = fetchPublicSettings(locale);
      cache.set(locale, request);
    }
    request
      .then((data) => active && setSettings(data))
      .catch(() => cache.delete(locale))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [locale]);

  return { settings, loading };
}
