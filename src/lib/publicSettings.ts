import { apiGet } from "./api";
import type { ApiEnvelope } from "./payment";

export interface PublicSettings {
  contact: { email: string; address: string; phone_number: string };
  privacy: { content: string };
  terms: { content: string };
}

/** Admin-managed contact info, privacy policy and terms (GET /support/settings). */
export async function fetchPublicSettings(locale: string): Promise<PublicSettings> {
  const res = await apiGet<ApiEnvelope<PublicSettings>>("/support/settings", {
    locale,
    headers: { "Accept-Language": locale },
  });
  return res.data.data;
}
